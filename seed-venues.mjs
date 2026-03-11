/**
 * Seed Sample Venues to Database
 * Run: node seed-venues.mjs
 */

import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const DB_URL = 'libsql://database-rose-book-vercel-icfg-yewewbmsmdg5mps5mmjpurdl.aws-us-east-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzMxNDEzODksImlkIjoiMDE5Y2Q3NzYtNmYwMS03NzBjLWFjZDMtYjdlYjNmZjZhMTkzIiwicmlkIjoiYTJkMTJiM2QtNTVlMC00Y2QwLWIzZTItOTIzZmYwM2E4ZGNhIn0.7rHCGU4lAQmljCucx38dZc50ZEVP1HVLC7ZhOcbylil-e1jXRshkT8cPF0aTFuPBFmVJl6FojnUtMMSY7ScZCA';

console.log('\n🌱 Seeding Sample Venues...\n');

const client = createClient({ url: DB_URL, authToken: DB_TOKEN });

const venues = [
  {
    businessName: 'Kigali Serena Hotel',
    email: 'serena@venues.rw',
    phone: '+250788123456',
    category: 'Venues',
    description: 'Luxury 5-star hotel with elegant ballrooms and stunning city views. Perfect for grand weddings with world-class service.',
    location: 'Kigali City Center',
    priceRange: 'RWF 5,000,000 - 10,000,000',
    portfolio: JSON.stringify([
      { type: 'image', url: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?w=800', title: 'Grand Ballroom' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', title: 'Garden Setup' }
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'
    ]),
    featured: true,
    verified: true,
    rating: 4.8
  },
  {
    businessName: 'Lemigo Hotel',
    email: 'lemigo@venues.rw',
    phone: '+250788234567',
    category: 'Venues',
    description: 'Modern hotel with spacious conference halls and rooftop terrace. Ideal for contemporary weddings.',
    location: 'Nyarutarama, Kigali',
    priceRange: 'RWF 3,000,000 - 6,000,000',
    portfolio: JSON.stringify([
      { type: 'image', url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', title: 'Conference Hall' }
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800'
    ]),
    featured: true,
    verified: true,
    rating: 4.6
  },
  {
    businessName: 'Heaven Restaurant',
    email: 'heaven@venues.rw',
    phone: '+250788345678',
    category: 'Venues',
    description: 'Boutique restaurant with panoramic views of Kigali. Perfect for intimate weddings and receptions.',
    location: 'Kiyovu, Kigali',
    priceRange: 'RWF 2,000,000 - 4,000,000',
    portfolio: JSON.stringify([
      { type: 'image', url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800', title: 'Terrace View' }
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800'
    ]),
    featured: false,
    verified: true,
    rating: 4.7
  },
  {
    businessName: 'Kigali Convention Centre',
    email: 'kcc@venues.rw',
    phone: '+250788456789',
    category: 'Venues',
    description: 'State-of-the-art convention center with multiple halls. Perfect for large-scale weddings and events.',
    location: 'Kimihurura, Kigali',
    priceRange: 'RWF 8,000,000 - 15,000,000',
    portfolio: JSON.stringify([
      { type: 'image', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', title: 'Main Hall' }
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
    ]),
    featured: true,
    verified: true,
    rating: 4.9
  },
  {
    businessName: 'Lake Kivu Serena Hotel',
    email: 'lakekivu@venues.rw',
    phone: '+250788567890',
    category: 'Venues',
    description: 'Lakeside resort with stunning views and beach access. Perfect for destination weddings.',
    location: 'Rubavu (Gisenyi)',
    priceRange: 'RWF 4,000,000 - 8,000,000',
    portfolio: JSON.stringify([
      { type: 'image', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', title: 'Lakeside Setup' }
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'
    ]),
    featured: true,
    verified: true,
    rating: 4.8
  },
  {
    businessName: 'Volcanoes Safaris Lodge',
    email: 'volcanoes@venues.rw',
    phone: '+250788678901',
    category: 'Venues',
    description: 'Luxury lodge with mountain views near Volcanoes National Park. Unique setting for adventurous couples.',
    location: 'Musanze',
    priceRange: 'RWF 6,000,000 - 12,000,000',
    portfolio: JSON.stringify([
      { type: 'image', url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', title: 'Mountain View' }
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'
    ]),
    featured: false,
    verified: true,
    rating: 4.9
  }
];

try {
  const password = await bcrypt.hash('password123', 10);

  for (const venue of venues) {
    // Create user account for venue
    const userId = crypto.randomUUID();
    await client.execute({
      sql: `INSERT INTO users (id, name, email, password, role, phone, created_at, updated_at) 
            VALUES (?, ?, ?, ?, 'VENDOR', ?, ?, ?)`,
      args: [userId, venue.businessName, venue.email, password, venue.phone, Date.now(), Date.now()]
    });

    // Create vendor profile
    const vendorId = crypto.randomUUID();
    await client.execute({
      sql: `INSERT INTO vendors (id, user_id, business_name, category, description, location, price_range, 
            rating, review_count, featured, verified, images, portfolio, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`,
      args: [
        vendorId, userId, venue.businessName, venue.category, venue.description, venue.location,
        venue.priceRange, venue.rating, venue.featured ? 1 : 0, venue.verified ? 1 : 0,
        venue.images, venue.portfolio, Date.now(), Date.now()
      ]
    });

    console.log(`✅ Created: ${venue.businessName}`);
  }

  console.log('\n🎉 Successfully seeded', venues.length, 'venues!\n');
  console.log('📧 Login credentials for all venues:');
  console.log('   Email: [venue-email]@venues.rw');
  console.log('   Password: password123\n');
  console.log('💡 Vendors can now login and manage their venues!\n');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
