# Messaging System Documentation

## Overview
A real-time messaging system that enables direct communication between couples and vendors.

## Database Schema

### Tables Added:

#### 1. **conversations**
- `id` - Unique conversation ID
- `vendorId` - Reference to vendor
- `coupleId` - Reference to couple (user)
- `bookingId` - Optional reference to related booking
- `lastMessageAt` - Timestamp of last message
- `createdAt` - Conversation creation time
- `updatedAt` - Last update time

#### 2. **messages**
- `id` - Unique message ID
- `conversationId` - Reference to conversation
- `senderId` - User who sent the message
- `content` - Message text content
- `read` - Boolean flag for read status
- `createdAt` - Message timestamp

## API Endpoints

### GET `/api/messages`
**Purpose**: Fetch conversations or messages

**Query Parameters**:
- `conversationId` (optional) - If provided, returns messages for that conversation

**Returns**:
- Without `conversationId`: List of all conversations for the logged-in user
- With `conversationId`: List of messages in that conversation

**Authentication**: Required

### POST `/api/messages`
**Purpose**: Send a new message or create a conversation

**Body**:
```json
{
  "vendorId": "vendor-uuid",
  "coupleId": "couple-uuid", // Optional, auto-detected for couples
  "content": "Message text",
  "bookingId": "booking-uuid" // Optional
}
```

**Returns**:
```json
{
  "success": true,
  "message": { /* message object */ },
  "conversationId": "conversation-uuid"
}
```

**Authentication**: Required

## Features

### For Vendors (`/vendor/messages`):
- ✅ View all conversations with couples
- ✅ See unread message counts
- ✅ Real-time message list
- ✅ Send and receive messages
- ✅ Search conversations
- ✅ Auto-scroll to latest message
- ✅ Mark messages as read automatically

### For Couples:
- ✅ Contact vendor button on service pages
- ✅ Send initial message to vendor
- ✅ View conversation history
- ✅ Receive vendor responses

## User Flow

### Couple Initiates Contact:
1. Couple views a service on `/vendors/{vendorId}/services/{serviceId}`
2. Clicks "Contact Vendor" button
3. Writes message in modal
4. Message is sent, conversation is created
5. Vendor receives message in their messages inbox

### Vendor Responds:
1. Vendor sees new conversation in `/vendor/messages`
2. Unread count badge shows new messages
3. Clicks on conversation to view
4. Types response and sends
5. Couple receives response

### Ongoing Conversation:
1. Both parties can send messages back and forth
2. Messages are marked as read when viewed
3. Conversations are sorted by last message time
4. Auto-scroll keeps latest messages visible

## UI Components

### Vendor Messages Page
**Location**: `/app/vendor/messages/`
- `page.tsx` - Server component with auth check
- `MessagesClient.tsx` - Client component with messaging UI

**Features**:
- Split-pane layout (conversations list + chat view)
- Search functionality
- Unread badges
- Real-time updates
- Keyboard shortcuts (Enter to send)

### Contact Vendor Modal
**Location**: Service detail page
- Modal triggered by "Contact Vendor" button
- Simple textarea for message
- Sends message and creates conversation
- Success feedback

## Technical Details

### State Management:
- React useState for local state
- useEffect for data fetching
- Auto-refresh on conversation selection

### Real-time Updates:
- Currently: Manual refresh on actions
- Future: WebSocket/polling for real-time updates

### Message Read Status:
- Messages marked as read when conversation is viewed
- Unread count calculated per conversation
- Visual indicators for unread messages

## Security

- ✅ Authentication required for all endpoints
- ✅ Users can only see their own conversations
- ✅ Vendors can only message their clients
- ✅ Couples can only message vendors
- ✅ Content validation and sanitization

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for instant message delivery
2. **File Attachments**: Support for images and documents
3. **Message Notifications**: Email/push notifications for new messages
4. **Typing Indicators**: Show when other party is typing
5. **Message Search**: Search within conversation history
6. **Archive/Delete**: Conversation management features
7. **Read Receipts**: Show when messages are read
8. **Emoji Support**: Rich text and emoji picker

## Testing

### Manual Testing Steps:

1. **As Couple**:
   - Login as couple
   - Browse vendors
   - Click "Contact Vendor" on a service
   - Send a message
   - Verify success toast

2. **As Vendor**:
   - Login as vendor
   - Go to `/vendor/messages`
   - See new conversation
   - Click to view messages
   - Reply to couple
   - Verify message is sent

3. **Conversation Flow**:
   - Send multiple messages back and forth
   - Verify chronological order
   - Check unread counts
   - Test search functionality

## Database Migration

To add the messaging tables to existing database:

```bash
# The schema has been updated in lib/db/schema.ts
# Push the schema changes to database
npm run db:push
```

## Notes

- Conversations are automatically created on first message
- One conversation per vendor-couple pair
- Messages are stored indefinitely (no auto-deletion)
- Timestamps use local timezone for display
- Empty messages are rejected
- Login required to access messaging features
