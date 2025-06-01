import { Link, useLocation } from "wouter";
import { Home, Search, Settings, BarChart3, Phone, Mail, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function NavigationFooter() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const mainNavItems = [
    { path: "/", icon: Home, label: "Home", description: "Email Discovery" },
    { path: "/categorize", icon: Mail, label: "Categorize", description: "Sort Emails" },
    { path: "/dashboard", icon: BarChart3, label: "Dashboard", description: "Overview" },
    { path: "/preferences", icon: Settings, label: "Settings", description: "Preferences" },
  ];

  const secondaryNavItems = [
    { path: "/call-config", icon: Phone, label: "Voice", description: "Call Setup" },
    { path: "/personalization", icon: User, label: "Profile", description: "Personal" },
    { path: "/final-setup", icon: Shield, label: "Security", description: "Privacy" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      {/* Main Navigation */}
      <div className="px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {mainNavItems.map(({ path, icon: Icon, label, description }) => (
            <Link key={path} href={path}>
              <Button
                variant={isActive(path) ? "default" : "ghost"}
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  isActive(path) 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="px-4 py-1 border-t border-border/50">
        <div className="flex justify-center items-center gap-4 max-w-sm mx-auto">
          {secondaryNavItems.map(({ path, icon: Icon, label }) => (
            <Link key={path} href={path}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 h-8 px-3 text-xs ${
                  isActive(path) 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-muted/30">
        <div className="flex justify-between items-center max-w-lg mx-auto text-xs text-muted-foreground">
          <Link href="/support">
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
              Support
            </Button>
          </Link>
          <span className="text-xs">PookAi v1.0</span>
          <Link href="/privacy">
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
              Privacy
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}