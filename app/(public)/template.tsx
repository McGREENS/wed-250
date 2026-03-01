import { Heart, Menu } from 'lucide-react';
import Link from 'next/link';
import { auth } from "@/auth";
import NavbarLinks from '@/app/components/layout/NavbarLinks';

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-burgundy to-gold p-2 rounded-full">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold text-charcoal">Andiza</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <NavbarLinks session={session} />
            </div>
            <button className="md:hidden p-2 text-charcoal">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="min-h-screen">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 mt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-burgundy to-gold p-1.5 rounded-full">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-xl font-bold text-charcoal">Andiza</span>
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
