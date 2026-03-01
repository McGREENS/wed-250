"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarLinksProps {
  session: any;
}

export default function NavbarLinks({ session }: NavbarLinksProps) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Venues', href: '/venues' },
    { name: 'Vendors', href: '/vendors' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

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
