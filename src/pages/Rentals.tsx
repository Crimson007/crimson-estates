import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, X, MapPin, Bed, Bath, Square, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";

interface RentalProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  isAvailable: boolean;
}

const RentalsPage = () => {
  const [properties, setProperties] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedBedrooms, setSelectedBedrooms] = useState("any");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('property_type', 'long-term')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch images for each property
      const propertiesWithImages = await Promise.all(
        (propertiesData || []).map(async (property) => {
          const { data: images } = await supabase
            .from('property_images')
            .select('image_url')
            .eq('property_id', property.id)
            .order('sort_order');

          return {
            id: property.id,
            title: property.title,
            location: property.location,
            price: property.price,
            images: images?.map(img => img.image_url) || ['/placeholder.svg'],
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            isAvailable: property.is_available,
          };
        })
      );

      setProperties(propertiesWithImages);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique locations from properties
  const locations = ["All Locations", ...new Set(properties.map(p => p.location.split(',')[0].trim()))];

  // Filter properties based on criteria
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "All Locations" || 
      property.location.includes(selectedLocation);
    const matchesBedrooms = selectedBedrooms === "any" || 
      property.bedrooms === parseInt(selectedBedrooms);
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];

    return matchesSearch && matchesLocation && matchesBedrooms && matchesPrice;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("All Locations");
    setSelectedBedrooms("any");
    setPriceRange([0, 500000]);
  };

  const activeFiltersCount = [
    selectedLocation !== "All Locations",
    selectedBedrooms !== "any",
    priceRange[0] > 0 || priceRange[1] < 500000,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Long-Term Rentals
          </h1>
          <p className="text-muted-foreground">
            Find your perfect home with monthly rental options
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-card rounded-xl border border-border">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 bg-background"
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-3">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[180px] h-11 bg-background">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
              <SelectTrigger className="w-[140px] h-11 bg-background">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="any">Any Beds</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4 Bedrooms</SelectItem>
                <SelectItem value="5">5+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-11 gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Price Range
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-background">
                <SheetHeader>
                  <SheetTitle>Price Range</SheetTitle>
                </SheetHeader>
                <div className="py-8">
                  <div className="mb-6">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500000}
                      step={5000}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      KES {priceRange[0].toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      KES {priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-1" />
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" className="h-11 gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1 bg-primary text-primary-foreground">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] bg-background">
              <SheetHeader>
                <SheetTitle>Filter Properties</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full h-11 bg-background">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                  <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
                    <SelectTrigger className="w-full h-11 bg-background">
                      <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="any">Any Beds</SelectItem>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4 Bedrooms</SelectItem>
                      <SelectItem value="5">5+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-4 block">
                    Price Range: KES {priceRange[0].toLocaleString()} - KES {priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500000}
                    step={5000}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button className="flex-1 bg-primary" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties
          </p>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden border border-border">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <RentalPropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const RentalPropertyCard = ({ property }: { property: RentalProperty }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { formatPrice } = useCurrency();

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <Link to={`/property/${property.id}`} className="block">
      <div className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Carousel */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[currentImage]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {property.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImage(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImage ? "bg-white w-4" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-primary text-primary-foreground">
              Long-Term
            </Badge>
            {!property.isAvailable && (
              <Badge variant="destructive">Unavailable</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-1 mb-2">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(property.price)}
              </span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RentalsPage;
