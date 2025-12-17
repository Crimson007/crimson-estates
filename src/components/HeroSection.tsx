import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground mb-6">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-sm font-medium">Over 1,000+ Premium Properties</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Find Your Perfect
          <span className="block text-primary">Dream Home</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Discover exceptional properties for long-term rentals or short stays. 
          Your next home is just a search away.
        </p>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-xl border border-border p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground mb-2 block text-left">
                Location
              </label>
              <Input
                placeholder="Search by city or neighborhood..."
                className="h-12 bg-background"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block text-left">
                Property Type
              </label>
              <Select>
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block text-left">
                Rental Type
              </label>
              <Select>
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="long-term">Long-Term</SelectItem>
                  <SelectItem value="short-stay">Short Stay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button 
              size="lg" 
              className="flex-1 h-12 bg-primary hover:bg-purple-dark text-primary-foreground"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Properties
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">1,200+</p>
            <p className="text-muted-foreground">Properties</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-secondary">500+</p>
            <p className="text-muted-foreground">Happy Clients</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">50+</p>
            <p className="text-muted-foreground">Locations</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
