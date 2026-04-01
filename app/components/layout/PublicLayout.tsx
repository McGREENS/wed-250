"use client";

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import NavbarLinks from '@/app/components/layout/NavbarLinks';

export default function PublicLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Andiza Logo" width={120} height={120} className="object-contain" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <NavbarLinks session={session} />
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-charcoal hover:text-burgundy transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6">
              <NavbarLinks session={session} isMobile onClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}
      </nav>

      <main className="min-h-screen">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 mt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Link href="/" className="flex items-center mb-6">
                <Image src="/logo.png" alt="Andiza Logo" width={120} height={120} className="object-contain" />
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed">
                Making wedding planning simple, stress-free, and magical for couples in Rwanda.
              </p>
            </div>

            <div>
              <h4 className="font-serif text-lg text-charcoal mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="/venues" className="hover:text-burgundy">Browse Venues</Link></li>
                <li><Link href="/vendors" className="hover:text-burgundy">Find Vendors</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg text-charcoal mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="/about" className="hover:text-burgundy">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-burgundy">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-burgundy">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg text-charcoal mb-6">Contact</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>support@andiza.rw</li>
                <li>+250 788 123 456</li>
                <li>Kigali, Rwanda</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Andiza. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
