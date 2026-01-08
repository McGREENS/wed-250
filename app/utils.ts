// Utility function to create page URLs
export function createPageUrl(pageName: string): string {
  const pageRoutes: Record<string, string> = {
    Home: '/',
    Dashboard: '/dashboard',
    VenueMarketplace: '/venues',
    VenueDetail: '/venues/detail',
    Vendors: '/vendors',
    VendorDetail: '/vendors/detail',
    PlanBuilder: '/plan-builder',
    About: '/about',
    Pricing: '/pricing',
    Contact: '/contact',
    AdminDashboard: '/admin'
  };

  return pageRoutes[pageName] || `/${pageName.toLowerCase()}`;
}
