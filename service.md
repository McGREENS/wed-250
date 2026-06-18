I'll examine the vendor services implementation and provide a technical summary.

















# Vendor Services Implementation Summary

## Architecture Overview

The vendor services system follows a **Next.js App Router pattern** with a clean separation between server and client components, using a **wizard-based UI** for service creation and a **RESTful API** for backend operations.

## Key Components

### 1. **Server Component** ([page.tsx](cci:7://file:///d:/Wed-250/app/page.tsx:0:0-0:0))
- **Authentication check**: Validates user session and VENDOR role
- **Data fetching**: Queries database for vendor profile and existing services using Drizzle ORM
- **Props passing**: Sends initial data to client component for hydration

### 2. **Client Component** ([ServicesClient.tsx](cci:7://file:///d:/Wed-250/app/vendor/services/ServicesClient.tsx:0:0-0:0))
- **State management**: Uses React hooks for services list, wizard visibility, editing state
- **CRUD operations**: Handles service creation, editing, deletion, and activation toggling
- **File uploads**: Manages venue portfolio image/video uploads via FileReader API
- **UI rendering**: Displays service cards with metadata, pricing, and features

### 3. **Wizard Component** ([ServiceCreationWizard.tsx](cci:7://file:///d:/Wed-250/app/vendor/services/ServiceCreationWizard.tsx:0:0-0:0))
- **Multi-step form**: Progressive disclosure pattern for complex data entry
- **Service type selection**: Predefined service types (Photography, Catering, Venue, etc.) with custom styling
- **Form state management**: Centralized formData state with field-specific update handlers
- **Validation**: Client-side validation before API submission

### 4. **API Routes** ([route.ts](cci:7://file:///d:/Wed-250/app/api/vendor/services/route.ts:0:0-0:0))
- **GET**: Fetches services for authenticated vendor
- **POST**: Creates new service with validation and metadata processing
- **PUT**: Updates existing service or toggles active status
- **DELETE**: Removes service from database

## Data Structure

### Service Package Schema
```typescript
{
  vendorId: string,           // Foreign key to vendors table
  serviceType: string,        // Photography, Venue, Catering, etc.
  name: string,              // Service name
  description: string,       // Detailed description
  price: number,             // Pricing in RWF
  image: string | null,      // Base64 image data
  features: JSON,            // { duration: string, items: string[] }
  metadata: JSON,            // Type-specific fields (capacity, amenities, etc.)
  active: boolean,           // Visibility status
  updatedAt: timestamp
}
```

## Key Implementation Patterns

### 1. **Role-Based Access Control**
```typescript
if (session.user.role !== 'VENDOR') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### 2. **Flexible Metadata Storage**
- Uses JSON columns for type-specific data (venue capacity, amenities, etc.)
- Allows different service types to have custom fields without schema changes
- Client-side parsing: `JSON.parse(service.features)` for display

### 3. **Wizard State Management**
```typescript
const [formData, setFormData] = useState({
  serviceType: selectedType,
  name: '',
  description: '',
  price: '',
  // ... other fields
});
```

### 4. **File Upload Handling**
- Client-side: FileReader converts images to Base64
- Server-side: Stored as string in database
- Size validation: 5MB for images, 50MB for videos

### 5. **Optimistic UI Updates**
```typescript
setServices(services.map(s => 
  s.id === id ? { ...s, active: !s.active } : s
));
```

## API Endpoints

| Method | Endpoint | Purpose | Body |
|--------|----------|---------|------|
| GET | [/api/vendor/services](cci:9://file:///d:/Wed-250/app/api/vendor/services:0:0-0:0) | Fetch vendor services | None |
| POST | [/api/vendor/services](cci:9://file:///d:/Wed-250/app/api/vendor/services:0:0-0:0) | Create service | Service data |
| PUT | [/api/vendor/services](cci:9://file:///d:/Wed-250/app/api/vendor/services:0:0-0:0) | Update/toggle service | `{ id, action, data }` |
| DELETE | `/api/vendor/services?id={id}` | Delete service | None |

## Security Considerations

- **Authentication**: Required for all operations
- **Authorization**: VENDOR role enforcement
- **Input validation**: Required fields, price validation
- **SQL injection prevention**: Drizzle ORM parameterized queries
- **File size limits**: Prevents large file uploads

## Developer Notes

1. **Service types are extensible** - Add to `SERVICE_TYPES` array for new categories
2. **Venue services have special handling** - Additional metadata fields (capacity, amenities)
3. **Image storage uses Base64** - Consider cloud storage for production
4. **Error handling is centralized** - Try-catch with meaningful error messages
5. **State updates are optimistic** - UI updates immediately, API calls in background

This implementation provides a solid foundation for a multi-service vendor management system with type-specific customization and a user-friendly creation workflow.