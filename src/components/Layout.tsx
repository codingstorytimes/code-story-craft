import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, PenTool, Users, Home } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={logoIcon} alt="CodingStorytime" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                CodingStorytime
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Link to="/">
                <Button 
                  variant={isActive("/") ? "default" : "ghost"} 
                  size="sm"
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              <Link to="/stories">
                <Button 
                  variant={isActive("/stories") ? "default" : "ghost"} 
                  size="sm"
                  className="gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Stories
                </Button>
              </Link>
              <Link to="/create">
                <Button 
                  variant={isActive("/create") ? "default" : "ghost"} 
                  size="sm"
                  className="gap-2"
                >
                  <PenTool className="w-4 h-4" />
                  Write
                </Button>
              </Link>
              <Link to="/community">
                <Button 
                  variant={isActive("/community") ? "default" : "ghost"} 
                  size="sm"
                  className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  Community
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/create">
                <Button variant="hero" size="sm">
                  Share Your Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-muted/30 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src={logoIcon} alt="CodingStorytime" className="w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  CodingStorytime
                </span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Where developers share real-life anecdotes, clever mnemonics, and fictional stories 
                to explain and remember programming concepts. Learn through the power of storytelling.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <div className="space-y-2">
                <Link to="/stories" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Browse Stories
                </Link>
                <Link to="/create" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Write a Story
                </Link>
                <Link to="/community" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Join Community
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <div className="text-muted-foreground">Algorithms</div>
                <div className="text-muted-foreground">Data Structures</div>
                <div className="text-muted-foreground">Design Patterns</div>
                <div className="text-muted-foreground">Best Practices</div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 CodingStorytime</p>
          </div>
        </div>
      </footer>
    </div>
  );
}