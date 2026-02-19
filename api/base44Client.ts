// Stub for base44Client API with static data
const staticVenues = [
  {
    id: 1,
    name: "Kigali Serena Hotel",
    category: "Venues",
    location: "Kigali City Center",
    price_range: "$$$$",
    venue_type: "Hotel",
    capacity: 500,
    description: "Luxury hotel with elegant ballrooms and stunning city views",
    features: ["Parking", "Catering Kitchen", "Bridal Suite", "Bar Service", "Tables & Chairs", "Audio/Visual Equipment"],
    images: ["https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=800&h=600&fit=crop"],
    featured: true
  },
  {
    id: 2,
    name: "Kigali Convention Centre",
    category: "Venues",
    location: "Kimihurura",
    price_range: "$$$$",
    venue_type: "Modern",
    capacity: 1000,
    description: "State-of-the-art convention center perfect for grand celebrations",
    features: ["Parking", "Stage", "Audio/Visual Equipment", "Tables & Chairs", "Wheelchair Accessible"],
    images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop"],
    featured: true
  },
  {
    id: 3,
    name: "Heaven Restaurant",
    category: "Venues",
    location: "Kiyovu",
    price_range: "$$$",
    venue_type: "Restaurant",
    capacity: 150,
    description: "Boutique restaurant with panoramic views and intimate atmosphere",
    features: ["Parking", "Outdoor Space", "Bar Service", "Catering Kitchen"],
    images: ["https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop"],
    featured: false
  },
  {
    id: 4,
    name: "Lemigo Hotel",
    category: "Venues",
    location: "Nyarutarama",
    price_range: "$$$",
    venue_type: "Hotel",
    capacity: 300,
    description: "Modern hotel with beautiful gardens and lakeside views",
    features: ["Parking", "Garden/Lawn", "Outdoor Space", "Accommodation", "Bar Service"],
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop"],
    featured: false
  },
  {
    id: 5,
    name: "Ubumwe Grande Hotel",
    category: "Venues",
    location: "Kigali City Center",
    price_range: "$$$$",
    venue_type: "Ballroom",
    capacity: 400,
    description: "Elegant ballroom with crystal chandeliers and premium service",
    features: ["Parking", "Bridal Suite", "Dance Floor", "Tables & Chairs", "Audio/Visual Equipment"],
    images: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop"],
    featured: true
  },
  {
    id: 6,
    name: "Inzora Rooftop Café",
    category: "Venues",
    location: "Remera",
    price_range: "$$",
    venue_type: "Outdoor",
    capacity: 100,
    description: "Trendy rooftop venue with city skyline views",
    features: ["Outdoor Space", "Bar Service", "Parking"],
    images: ["https://images.unsplash.com/photo-1505963507340-e554b3d8753d?w=800&h=600&fit=crop"],
    featured: false
  }
];

const staticVendors = [
  {
    id: 1,
    name: "Pixel Perfect Photography",
    category: "Photographers",
    location: "Kigali",
    price_range: "$$$",
    description: "Award-winning wedding photography capturing your special moments",
    images: ["https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop"],
    featured: true
  },
  {
    id: 2,
    name: "Bloom & Bliss Decor",
    category: "Decor",
    location: "Kigali",
    price_range: "$$",
    description: "Exquisite floral arrangements and complete wedding decor services",
    images: ["https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop"],
    featured: true
  },
  {
    id: 3,
    name: "Gourmet Celebrations Catering",
    category: "Food & Beverages",
    location: "Kigali",
    price_range: "$$$",
    description: "Premium catering with customizable menus for your special day",
    images: ["https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop"],
    featured: false
  }
];

export const base44 = {
  entities: {
    Vendor: {
      list: async (sort?: string, limit?: number) => staticVendors,
      filter: async (query?: any, sort?: string, limit?: number) => {
        if (query?.category === 'Venues') {
          return staticVenues;
        }
        return staticVendors;
      },
      create: async (data?: any) => ({}),
    },
    WeddingPlan: {
      list: async (sort?: string, limit?: number) => [{
        id: 1,
        couple_names: "Sarah & John",
        wedding_date: "2024-06-15",
        guest_count: 150,
        budget: 25000,
        venue_preference: "Kigali Serena Hotel",
        services_needed: ["Photography", "Catering", "Decor", "Music"],
        status: "in_progress",
        created_date: "2024-01-15"
      }],
      filter: async (query?: any, sort?: string, limit?: number) => [],
      create: async (data?: any) => ({}),
    },
    Booking: {
      list: async (sort?: string, limit?: number) => [],
      filter: async (query?: any, sort?: string, limit?: number) => [],
      create: async (data?: any) => ({}),
    },
    ContactMessage: {
      list: async (sort?: string, limit?: number) => [],
      filter: async (query?: any, sort?: string, limit?: number) => [],
      create: async (data?: any) => ({}),
    },
  },
};
