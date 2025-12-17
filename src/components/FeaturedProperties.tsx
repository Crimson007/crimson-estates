import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";

// Sample data - In production, this would come from CMS
const featuredProperties = [
  {
    id: "1",
    title: "Modern Luxury Apartment in Westlands",
    location: "Westlands, Nairobi",
    price: 150000,
    duration: "month",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    ],
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    type: "long-term" as const,
    isAvailable: true,
  },
  {
    id: "2",
    title: "Beachfront Villa with Ocean Views",
    location: "Diani Beach, Mombasa",
    price: 25000,
    duration: "night",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    type: "short-stay" as const,
    isAvailable: true,
  },
  {
    id: "3",
    title: "Cozy Studio in Karen",
    location: "Karen, Nairobi",
    price: 45000,
    duration: "month",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
    ],
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    type: "long-term" as const,
    isAvailable: true,
  },
  {
    id: "4",
    title: "Safari Lodge Experience",
    location: "Maasai Mara",
    price: 35000,
    duration: "night",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    ],
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: "short-stay" as const,
    isAvailable: true,
  },
  {
    id: "5",
    title: "Penthouse with City Skyline",
    location: "Kilimani, Nairobi",
    price: 280000,
    duration: "month",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
    bedrooms: 4,
    bathrooms: 4,
    sqft: 4000,
    type: "long-term" as const,
    isAvailable: false,
  },
  {
    id: "6",
    title: "Lakeside Cottage Retreat",
    location: "Naivasha",
    price: 18000,
    duration: "night",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    ],
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    type: "short-stay" as const,
    isAvailable: true,
  },
];

const FeaturedProperties = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Discover
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Featured Properties
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Handpicked properties that offer the best value, locations, and amenities for your needs.
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View All Properties
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
