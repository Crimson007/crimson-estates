import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';

const AMENITIES_OPTIONS = [
  'WiFi', 'Air Conditioning', 'Parking', 'Pool', 'Gym', 'Security',
  'Laundry', 'Kitchen', 'Balcony', 'Garden', 'Pet Friendly', 'Furnished',
  'Water Tank', 'Generator', 'CCTV', 'Elevator'
];

interface PropertyFormData {
  title: string;
  description: string;
  property_type: 'long-term' | 'short-stay';
  price: string;
  price_period: string;
  bedrooms: string;
  bathrooms: string;
  location: string;
  address: string;
  latitude: string;
  longitude: string;
  amenities: string[];
  is_available: boolean;
  featured: boolean;
}

interface PropertyImage {
  id?: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  file?: File;
}

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    property_type: 'long-term',
    price: '',
    price_period: 'month',
    bedrooms: '1',
    bathrooms: '1',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
    amenities: [],
    is_available: true,
    featured: false,
  });

  useEffect(() => {
    if (isEditing) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Failed to load property');
      navigate('/admin/properties');
      return;
    }

    setFormData({
      title: property.title,
      description: property.description || '',
      property_type: property.property_type,
      price: property.price.toString(),
      price_period: property.price_period,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      location: property.location,
      address: property.address || '',
      latitude: property.latitude?.toString() || '',
      longitude: property.longitude?.toString() || '',
      amenities: property.amenities || [],
      is_available: property.is_available,
      featured: property.featured,
    });

    // Fetch images
    const { data: propertyImages } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', id)
      .order('sort_order');

    if (propertyImages) {
      setImages(propertyImages);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const newImage: PropertyImage = {
        image_url: URL.createObjectURL(file),
        is_primary: images.length === 0,
        sort_order: images.length,
        file
      };
      setImages(prev => [...prev, newImage]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Ensure at least one primary
      if (updated.length > 0 && !updated.some(img => img.is_primary)) {
        updated[0].is_primary = true;
      }
      return updated;
    });
  };

  const setPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      is_primary: i === index
    })));
  };

  const uploadImages = async (propertyId: string) => {
    const uploadedImages: { image_url: string; is_primary: boolean; sort_order: number }[] = [];

    for (const image of images) {
      if (image.file) {
        const fileName = `${propertyId}/${Date.now()}-${image.file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, image.file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        uploadedImages.push({
          image_url: publicUrl,
          is_primary: image.is_primary,
          sort_order: image.sort_order
        });
      } else if (image.id) {
        // Existing image
        uploadedImages.push({
          image_url: image.image_url,
          is_primary: image.is_primary,
          sort_order: image.sort_order
        });
      }
    }

    // Delete existing images and insert new ones
    if (isEditing) {
      await supabase.from('property_images').delete().eq('property_id', propertyId);
    }

    if (uploadedImages.length > 0) {
      await supabase.from('property_images').insert(
        uploadedImages.map(img => ({ ...img, property_id: propertyId }))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const propertyData = {
      title: formData.title,
      description: formData.description,
      property_type: formData.property_type,
      price: parseFloat(formData.price),
      price_period: formData.price_period,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      location: formData.location,
      address: formData.address,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      amenities: formData.amenities,
      is_available: formData.is_available,
      featured: formData.featured,
      created_by: user?.id
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);

        if (error) throw error;
        await uploadImages(id!);
        toast.success('Property updated');
      } else {
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();

        if (error) throw error;
        await uploadImages(data.id);
        toast.success('Property created');
      }

      navigate('/admin/properties');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin/properties')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Property' : 'New Property'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Modern 2BR Apartment in Westlands"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type *</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value: 'long-term' | 'short-stay') => 
                      setFormData({ ...formData, property_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long-term">Long-term Rental</SelectItem>
                      <SelectItem value="short-stay">Short Stay / Airbnb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the property..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (KES) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="50000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_period">Per</Label>
                  <Select
                    value={formData.price_period}
                    onValueChange={(value) => setFormData({ ...formData, price_period: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Westlands, Nairobi"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="-1.2921"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="36.8219"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Westlands Road, Nairobi"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={formData.amenities.includes(amenity) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleAmenityToggle(amenity)}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.image_url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={image.is_primary ? 'default' : 'secondary'}
                        onClick={() => setPrimaryImage(index)}
                      >
                        {image.is_primary ? 'Primary' : 'Set Primary'}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <label className="border-2 border-dashed border-border rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Add Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Available</Label>
                  <p className="text-sm text-muted-foreground">Property is available for rent</p>
                </div>
                <Switch
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">Show on homepage</p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : isEditing ? 'Update Property' : 'Create Property'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/properties')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
