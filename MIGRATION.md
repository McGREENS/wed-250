# Migration from Prisma to Drizzle ORM

## Changes Made

### 1. Package.json Updates
- Removed: `@prisma/client`, `@prisma/adapter-pg`, `@auth/prisma-adapter`, `prisma`
- Added: `drizzle-orm`, `drizzle-kit`, `@auth/drizzle-adapter`, `postgres`
- Added scripts: `db:generate`, `db:migrate`, `db:push`, `db:studio`

### 2. New Files Created
- `drizzle.config.ts` - Drizzle configuration
- `lib/db/schema.ts` - Database schema (equivalent to prisma/schema.prisma)
- `lib/db/index.ts` - Database client connection

### 3. Updated Files
- `auth.ts` - Now uses DrizzleAdapter instead of PrismaAdapter
- `actions/auth.ts` - Uses Drizzle queries instead of Prisma

## Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Migration
```bash
npm run db:generate
```

### 3. Push Schema to Database
```bash
npm run db:push
```

### 4. Optional: Use Drizzle Studio
```bash
npm run db:studio
```

## Migration Notes

### Old Prisma Files (Can be removed after migration)
- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/prisma.ts`
- `prisma.config.ts`

### Schema Comparison

**Prisma:**
```prisma
model User {
  id    String @id @default(cuid())
  email String @unique
}
```

**Drizzle:**
```typescript
export const users = pgTable("User", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique(),
});
```

### Query Comparison

**Prisma:**
```typescript
const user = await prisma.user.findUnique({ where: { email } });
```

**Drizzle:**
```typescript
const [user] = await db.select().from(users).where(eq(users.email, email));
```

## Benefits of Drizzle

1. **Type Safety** - Better TypeScript inference
2. **Performance** - Lighter and faster than Prisma
3. **SQL-like** - More control over queries
4. **No Code Generation** - Direct TypeScript schemas
5. **Smaller Bundle** - Reduced application size

## TODO: Update Other Files

The following files still need to be updated to use Drizzle:
- Any other server actions that use Prisma
- Any API routes that use Prisma
- Dashboard queries
- Vendor/Venue queries (when implemented)
