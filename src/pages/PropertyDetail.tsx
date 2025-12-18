import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Shield,
  Wind,
  Tv,
  UtensilsCrossed,
  Trees,
  X,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";

const amenityIcons: Record<string, { icon: React.ElementType; label: string }> = {
  wifi: { icon: Wifi, label: "High-Speed WiFi" },
  parking: { icon: Car, label: "Parking Space" },
  gym: { icon: Dumbbell, label: "Fitness Center" },
  pool: { icon: Waves, label: "Swimming Pool" },
  security: { icon: Shield, label: "24/7 Security" },
  ac: { icon: Wind, label: "Air Conditioning" },
  tv: { icon: Tv, label: "Smart TV" },
  kitchen: { icon: UtensilsCrossed, label: "Fully Equipped Kitchen" },
  garden: { icon: Trees, label: "Private Garden" },
};

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { formatPrice } = useCurrency();
  
  const [currentImage, setCurrentImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch property data from Supabase
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (propertyError) throw propertyError;
      if (!propertyData) return null;

      // Fetch images for this property
      const { data: images, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', id)
        .order('sort_order', { ascending: true });

      if (imagesError) throw imagesError;

      return {
        ...propertyData,
        images: images?.map(img => img.image_url) || [],
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
            <Skeleton className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto h-[400px] rounded-2xl" />
            <Skeleton className="hidden md:block aspect-video rounded-lg" />
            <Skeleton className="hidden md:block aspect-video rounded-lg" />
            <Skeleton className="hidden md:block aspect-video rounded-lg" />
            <Skeleton className="hidden md:block aspect-video rounded-lg" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80'];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const duration = property.price_period === 'month' ? 'month' : 
                   property.price_period === 'week' ? 'week' : 'night';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to={property.property_type === "short-stay" ? "/airbnb" : "/rentals"}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to listings
        </Link>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-2xl overflow-hidden">
          {/* Main Image */}
          <div
            className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto cursor-pointer group"
            onClick={() => setIsGalleryOpen(true)}
          >
            <img
              src={images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>

          {/* Thumbnail Grid */}
          {images.slice(1, 5).map((image, idx) => (
            <div
              key={idx}
              className="hidden md:block relative aspect-video cursor-pointer group"
              onClick={() => {
                setCurrentImage(idx + 1);
                setIsGalleryOpen(true);
              }}
            >
              <img
                src={image}
                alt={`${property.title} ${idx + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {idx === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{images.length - 5} more</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={
                        property.property_type === "short-stay"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary text-primary-foreground"
                      }
                    >
                      {property.property_type === "short-stay" ? "Short Stay" : "Long-Term Rental"}
                    </Badge>
                    {property.is_available ? (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Unavailable</Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {property.title}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>{property.address || property.location}</span>
              </div>

              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description || "No description available."}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.amenities.map((amenity) => {
                      const amenityData = amenityIcons[amenity.toLowerCase()];
                      if (!amenityData) {
                        return (
                          <div
                            key={amenity}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Square className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-sm text-foreground">{amenity}</span>
                          </div>
                        );
                      }
                      const Icon = amenityData.icon;
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm text-foreground">{amenityData.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Map */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Location</h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                  <div className="text-center p-6">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                    <p className="text-foreground font-medium">{property.location}</p>
                    <p className="text-muted-foreground text-sm mt-1">{property.address}</p>
                    <Button variant="outline" className="mt-4" size="sm">
                      View on Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-lg">
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(Number(property.price))}
                </span>
                <span className="text-muted-foreground">/{duration}</span>
              </div>

              {property.property_type === "short-stay" && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="border border-border rounded-lg p-3">
                    <label className="text-xs text-muted-foreground block mb-1">CHECK-IN</label>
                    <span className="text-sm font-medium">Select date</span>
                  </div>
                  <div className="border border-border rounded-lg p-3">
                    <label className="text-xs text-muted-foreground block mb-1">CHECK-OUT</label>
                    <span className="text-sm font-medium">Select date</span>
                  </div>
                </div>
              )}

              <Button className="w-full h-12 bg-primary hover:bg-purple-dark text-primary-foreground mb-3">
                {property.property_type === "short-stay" ? "Book Now" : "Apply to Rent"}
              </Button>
              
              <Button variant="outline" className="w-full h-12 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                Send Inquiry
              </Button>

              <p className="text-center text-muted-foreground text-sm mt-4">
                You won't be charged yet
              </p>

              <Separator className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {formatPrice(Number(property.price))} × 1 {duration}
                  </span>
                  <span className="text-foreground">{formatPrice(Number(property.price))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="text-foreground">{formatPrice(Math.round(Number(property.price) * 0.05))}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{formatPrice(Math.round(Number(property.price) * 1.05))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={images[currentImage]}
            alt={`${property.title} ${currentImage + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
          />

          <button
            onClick={nextImage}
            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentImage ? "border-white" : "border-transparent opacity-50"
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white">
            {currentImage + 1} / {images.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetail;
