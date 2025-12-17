import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Building, Palmtree } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Prime<span className="text-secondary">Estates</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/rentals"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Building className="w-4 h-4" />
              Long-Term Rentals
            </Link>
            <Link
              to="/airbnb"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Palmtree className="w-4 h-4" />
              Short Stays
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm">
              List Property
            </Button>
            <Button size="sm" className="bg-primary hover:bg-purple-dark">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                to="/rentals"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                <Building className="w-4 h-4" />
                Long-Term Rentals
              </Link>
              <Link
                to="/airbnb"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                <Palmtree className="w-4 h-4" />
                Short Stays
              </Link>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  List Property
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-purple-dark">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
