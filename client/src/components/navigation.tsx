import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Mic, Menu, X, Home, Mail, Settings, Phone, CheckCircle } from "lucide-react";

interface NavigationProps {
  currentPage?: string;
}

export function Navigation({ currentPage }: NavigationProps) {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Email Scan", path: "/email-scan", icon: Mail },
    { label: "Personalization", path: "/personalization", icon: Settings },
    { label: "Call Config", path: "/call-config", icon: Phone },
    { label: "Setup Complete", path: "/final-setup", icon: CheckCircle }
  ];

  const footerLinks = [
    { label: "Privacy", path: "/privacy" },
    { label: "Security", path: "/security" },
    { label: "Support", path: "/support" }
  ];

  return (
    <nav className="relative z-10 p-4 md:p-6 bg-black/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-3 cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => setLocation("/")}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Mic className="text-white text-sm" />
          </div>
          <span className="text-xl font-semibold text-white">PookAi</span>
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
                  onClick={() => setLocation(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:block">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Footer Links */}
          <div className="flex items-center space-x-4 border-l border-gray-700 pl-6">
            {footerLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => setLocation(link.path)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="lg:hidden bg-gray-900 border-t border-gray-700 mt-4 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="p-6 space-y-4">
            {/* Main Navigation */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</h3>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.path || (currentPage === "/" && item.path === "/");
                
                return (
                  <button
                    key={item.path}
                    onClick={() => { 
                      setLocation(item.path); 
                      setMobileMenuOpen(false); 
                    }}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer Links */}
            <div className="border-t border-gray-700 pt-4 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Info</h3>
              {footerLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => { 
                    setLocation(link.path); 
                    setMobileMenuOpen(false); 
                  }}
                  className="block text-gray-400 hover:text-white transition-colors text-left"
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