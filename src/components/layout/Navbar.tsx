'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG, NAVIGATION_ITEMS, ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link href={ROUTES.HOME} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">JC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</h1>
              <p className="text-xs text-gray-600">{APP_CONFIG.tagline}</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors relative',
                  isActive(item.href)
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary-600"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link href={`tel:${APP_CONFIG.phone}`}>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                {APP_CONFIG.phone}
              </Button>
            </Link>
            <Link href={ROUTES.BOOK_APPOINTMENT}>
              <Button size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 bg-white"
          >
            <div className="container py-4 space-y-4">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link href={ROUTES.BOOK_APPOINTMENT} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
