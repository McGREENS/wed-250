"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { X } from 'lucide-react';

interface NavbarLinksProps {
  session: any;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function NavbarLinks({ session, isMobile = false, onClose }: NavbarLinksProps) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Venues', href: '/venues' },
    { name: 'Vendors', href: '/vendors' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleLinkClick}
            className={`text-base font-medium transition-colors py-2 ${
              isActive(link.href)
                ? 'text-burgundy'
                : 'text-charcoal hover:text-burgundy'
            }`}
          >
            {link.name}
          </Link>
        ))}

        <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
          {session ? (
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className="block w-full bg-burgundy text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-burgundy-light transition-colors text-center"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="block w-full text-center text-sm font-medium text-charcoal hover:text-burgundy transition-colors py-2"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={handleLinkClick}
                className="block w-full bg-burgundy text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-burgundy-light transition-colors text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-medium transition-colors ${
            isActive(link.href)
              ? 'text-burgundy border-b-2 border-burgundy pb-1'
              : 'text-charcoal hover:text-burgundy'
          }`}
        >
          {link.name}
        </Link>
      ))}

      {session ? (
        <Link
          href="/dashboard"
          className="bg-burgundy text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy-light transition-colors"
        >
          Dashboard
        </Link>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-charcoal hover:text-burgundy transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-burgundy text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy-light transition-colors shadow-md hover:shadow-lg"
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  );
}
