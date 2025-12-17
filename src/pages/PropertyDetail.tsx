import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/contexts/CurrencyContext";

// Sample property data - In production, this would come from CMS
const propertiesData: Record<string, PropertyData> = {
  "1": {
    id: "1",
    title: "Modern Luxury Apartment in Westlands",
    description: "Experience luxury living in this stunning 3-bedroom apartment located in the heart of Westlands. This beautifully designed space features floor-to-ceiling windows offering panoramic city views, a fully equipped modern kitchen with premium appliances, and spacious bedrooms with en-suite bathrooms. The apartment comes fully furnished with high-end furniture and includes access to building amenities such as a rooftop pool, gym, and 24/7 security.",
    location: "Westlands, Nairobi",
    address: "123 Westlands Road, Nairobi, Kenya",
    price: 150000,
    duration: "month",
    type: "long-term",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80",
    ],
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    isAvailable: true,
    amenities: ["wifi", "parking", "gym", "pool", "security", "ac", "tv", "kitchen"],
    coordinates: { lat: -1.2641, lng: 36.8032 },
  },
  "2": {
    id: "2",
    title: "Beachfront Villa with Ocean Views",
    description: "Wake up to breathtaking ocean views in this stunning beachfront villa. Perfect for a tropical getaway, this 4-bedroom property offers direct beach access, a private infinity pool, and outdoor dining areas. The interior features a blend of modern comfort and coastal charm with locally sourced furnishings and artwork.",
    location: "Diani Beach, Mombasa",
    address: "Diani Beach Road, Kwale County, Kenya",
    price: 25000,
    duration: "night",
    type: "short-stay",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    isAvailable: true,
    amenities: ["wifi", "parking", "pool", "security", "ac", "tv", "kitchen", "garden"],
    coordinates: { lat: -4.3167, lng: 39.5833 },
  },
};

interface PropertyData {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  price: number;
  duration: string;
  type: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  isAvailable: boolean;
  amenities: string[];
  coordinates: { lat: number; lng: number };
}

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
  const property = propertiesData[id || "1"];
  const { formatPrice } = useCurrency();
  
  const [currentImage, setCurrentImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!property) {
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

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to={property.type === "short-stay" ? "/airbnb" : "/rentals"}
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
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>

          {/* Thumbnail Grid */}
          {property.images.slice(1, 5).map((image, idx) => (
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
              {idx === 3 && property.images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{property.images.length - 5} more</span>
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
                        property.type === "short-stay"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary text-primary-foreground"
                      }
                    >
                      {property.type === "short-stay" ? "Short Stay" : "Long-Term Rental"}
                    </Badge>
                    {property.isAvailable ? (
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
                <span>{property.address}</span>
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
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5" />
                  <span>{property.sqft} sqft</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.amenities.map((amenity) => {
                  const amenityData = amenityIcons[amenity];
                  if (!amenityData) return null;
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
                  {formatPrice(property.price)}
                </span>
                <span className="text-muted-foreground">/{property.duration}</span>
              </div>

              {property.type === "short-stay" && (
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
                {property.type === "short-stay" ? "Book Now" : "Apply to Rent"}
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
                    {formatPrice(property.price)} × 1 {property.duration}
                  </span>
                  <span className="text-foreground">{formatPrice(property.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="text-foreground">{formatPrice(Math.round(property.price * 0.05))}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{formatPrice(Math.round(property.price * 1.05))}</span>
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
            src={property.images[currentImage]}
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
            {property.images.map((image, idx) => (
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
            {currentImage + 1} / {property.images.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetail;
