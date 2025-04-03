import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, BellRing, ChevronDown, Sparkles } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links with animations - memoized to prevent unnecessary re-renders
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/submit", label: "Submit" },
    { href: "/admin", label: "Admin" },
    { 
      href: "#", 
      label: "Categories", 
      icon: <ChevronDown className="h-4 w-4 ml-1 transition-transform group-hover:rotate-180" /> 
    }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`sticky top-0 z-50 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-md" 
          : "bg-white"
      } transition-all duration-300 border-b border-neutral`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[var(--header-height)]">
          {/* Logo Area with Animation */}
          <div className="flex items-center">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/" className="flex items-center">
                <motion.span 
                  className="text-primary font-bold text-2xl mr-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  AI
                </motion.span>
                <motion.span 
                  className="gradient-text font-bold text-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Hunt
                </motion.span>
                <motion.div 
                  className="ml-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </motion.div>
              </Link>
            </motion.div>

            {/* Nav Links for larger screens with animations */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <Link 
                    href={link.href} 
                    className={`group px-3 py-2 text-sm font-medium flex items-center ${
                      location === link.href 
                        ? "text-primary" 
                        : "text-textColor hover:text-primary"
                    }`}
                  >
                    {link.label}
                    {link.icon}
                    {location === link.href && (
                      <motion.div 
                        className="absolute bottom-0 left-0 h-0.5 bg-primary w-full rounded-full"
                        layoutId="navIndicator"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>
          
          {/* Search Bar with animation */}
          <motion.div 
            className="hidden sm:flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="max-w-lg w-full lg:max-w-xs relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-neutral/30 focus:border-primary/50 rounded-full leading-5 bg-gray-50 focus:bg-white placeholder-gray-500 focus:ring-primary/20 transition-all"
                placeholder="Search AI products..."
                type="search"
              />
            </div>
          </motion.div>
          
          {/* Right side actions with animations */}
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/submit">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white font-medium rounded-full px-4 py-2 text-sm hidden sm:flex items-center"
                  variant="default"
                >
                  <motion.span
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                    className="mr-2 text-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </motion.span>
                  <span>Submit Product</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              className="ml-4 flex items-center md:ml-6"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Notification Bell with animation */}
              <motion.button 
                className="p-2 rounded-full text-gray-400 hover:text-primary focus:outline-none relative"
                whileTap={{ scale: 0.9 }}
              >
                <BellRing className="h-5 w-5" />
                {/* Notification indicator */}
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </motion.button>

              {/* Admin Button */}
              <motion.div 
                className="ml-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/admin">
                  <Button variant="outline" className="rounded-full border-neutral/40 text-sm">
                    Admin
                  </Button>
                </Link>
              </motion.div>
              
              {/* Profile avatar with animation */}
              <motion.div 
                className="ml-3 relative cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="rounded-full border-2 border-primary/20 p-0.5">
                  <img 
                    className="h-8 w-8 rounded-full object-cover shadow-sm" 
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                    alt="User" 
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Mobile menu button with animation */}
            <motion.button 
              type="button" 
              className="ml-4 md:hidden inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-primary focus:outline-none bg-gray-50 hover:bg-gray-100 transition-colors" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu with animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 py-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={link.href} 
                    className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-textColor hover:bg-gray-100 hover:text-primary"
                  >
                    {link.label}
                    {link.icon}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="pt-4 pb-3 border-t border-neutral"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img 
                    className="h-10 w-10 rounded-full" 
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                    alt="User" 
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-textColor">Demo User</div>
                  <div className="text-sm font-medium text-gray-500">user@example.com</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link href="/submit" className="block px-3 py-2 rounded-lg text-base font-medium text-textColor hover:bg-gray-100 hover:text-primary">
                  Submit Product
                </Link>
                <Link href="/admin" className="block px-3 py-2 rounded-lg text-base font-medium text-textColor hover:bg-gray-100 hover:text-primary">
                  Admin Dashboard
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
