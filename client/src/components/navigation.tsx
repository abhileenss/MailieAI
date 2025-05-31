import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Mic, Menu, X, Home, Mail, Settings, Phone, CheckCircle, User, LogOut, ChevronDown } from "lucide-react";

interface NavigationProps {
  currentPage?: string;
}

export function Navigation({ currentPage }: NavigationProps) {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Check authentication status
  useEffect(() => {
    fetch('/api/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setIsAuthenticated(true);
          setUserInfo(data.user);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const navigationItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Dashboard", path: "/dashboard", icon: Mail },
    { label: "Scan", path: "/scanning", icon: Settings },
    { label: "Configure", path: "/call-config", icon: Phone },
    { label: "Setup", path: "/final-setup", icon: CheckCircle }
  ];

  const footerLinks = [
    { label: "Privacy", path: "/privacy" },
    { label: "Security", path: "/security" },
    { label: "Support", path: "/support" }
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="relative z-10 p-6 bg-background border-b border-border font-primary">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-3 cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => {
            try {
              setLocation("/");
              setMobileMenuOpen(false);
            } catch (error) {
              console.error('Navigation error:', error);
              setMobileMenuOpen(false);
            }
          }}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center neopop-button">
            <Mic className="text-primary-foreground text-lg" />
          </div>
          <span className="text-2xl font-semibold text-foreground tracking-tight">PookAi</span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {/* Main Flow Navigation */}
          <div className="flex items-center space-x-6">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.path || (currentPage === "/" && item.path === "/");
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    try {
                      setLocation(item.path);
                      setMobileMenuOpen(false);
                    } catch (error) {
                      console.error('Navigation error:', error);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'neopop-button-primary' 
                      : 'neopop-button-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:block">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Footer Links */}
          <div className="flex items-center space-x-4 border-l border-border pl-6">
            {footerLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  try {
                    setLocation(link.path);
                    setMobileMenuOpen(false);
                  } catch (error) {
                    console.error('Navigation error:', error);
                    setMobileMenuOpen(false);
                  }
                }}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div 
          ref={mobileMenuRef}
          className="lg:hidden neopop-card mt-4 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="p-6 space-y-4">
            {/* Main Navigation */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</h3>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.path || (currentPage === "/" && item.path === "/");
                
                return (
                  <button
                    key={item.path}
                    onClick={() => { 
                      try {
                        setLocation(item.path); 
                        setMobileMenuOpen(false); 
                      } catch (error) {
                        console.error('Navigation error:', error);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg text-left transition-all duration-200 neopop-button ${
                      isActive 
                        ? 'neopop-button-primary' 
                        : 'neopop-button-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer Links */}
            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Info</h3>
              {footerLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => { 
                    try {
                      setLocation(link.path); 
                      setMobileMenuOpen(false); 
                    } catch (error) {
                      console.error('Navigation error:', error);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="block text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}