"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Product', href: '#product' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Customers', href: '#customers' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-gray-900">
              Job<span className="gradient-text">Optimizer</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL || 'http://localhost:3006';
                window.location.href = `${platformUrl}/login`;
              }}
            >
              Iniciar Sesión
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => {
                window.location.href = '/signup';
              }}
            >
              Empezar Ahora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden border-t border-gray-200 ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            height: isMobileMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="px-4 pt-4 border-t border-gray-200 space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full" 
                onClick={() => {
                  const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL || 'http://localhost:3006';
                  window.location.href = `${platformUrl}/login`;
                }}
              >
                Iniciar Sesión
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full" 
                onClick={() => {
                  window.location.href = '/signup';
                }}
              >
                Empezar Ahora
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
