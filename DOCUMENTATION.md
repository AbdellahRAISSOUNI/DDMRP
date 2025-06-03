# DDMRP Course Management Application

## Project Overview

This is a Next.js application for managing educational courses and events. The application consists of a public-facing website where users can view available courses and events, submit inquiries, and register for events, and an admin area where authorized users can create, edit, archive, and delete courses and events, as well as manage course inquiries and event registrations.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Content Editing**: Simple custom editor component
- **Image Uploads**: Custom implementation with local storage

## Project Structure

```
ddmrp/
├── app/                     # Main application code
│   ├── admin/               # Admin area components and pages
│   │   ├── archived/        # Archived courses management
│   │   ├── courses/         # Course management (list, edit, create)
│   │   ├── events/          # Event management (list, edit, create)
│   │   └── layout.tsx       # Admin layout with collapsible sidebar
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── courses/         # Course CRUD operations
│   │   ├── events/          # Event CRUD operations
│   │   ├── event-registrations/ # Event registration operations
│   │   ├── inquiries/       # Inquiry CRUD operations
│   │   ├── mongodb-status/  # Database connection status
│   │   └── upload/          # Image upload endpoint
│   ├── components/          # Reusable components
│   │   └── ui/              # UI components
│   ├── courses/             # Public course pages
│   ├── events/              # Public event pages
│   ├── lib/                 # Utility functions and models
│   │   ├── auth.ts          # Authentication configuration
│   │   ├── models/          # Data models
│   │   └── mongodb.ts       # Database connection
│   ├── login/               # Login page
│   ├── public/              # Static assets
│   └── uploads/             # Uploaded images storage
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Core Features

### Public Area

1. **Home Page**: Displays featured courses, upcoming events, and MongoDB connection status
2. **Courses Page**: Lists all active (non-archived) courses
3. **Course Detail Page**: Shows detailed information about a specific course
4. **Course Inquiry Form**: Allows users to express interest in a course by submitting their contact information
5. **Events Page**: Lists all upcoming events
6. **Event Detail Page**: Shows detailed information about a specific event
7. **Event Registration Form**: Allows users to register for events

### Admin Area

1. **Dashboard**: Overview of active and archived courses, new inquiries, and event registrations with modern KPI cards and status indicators
2. **Course Management**: 
   - List all active courses
   - Create new courses
   - Edit existing courses
   - Archive courses
3. **Archived Courses**: 
   - View archived courses
   - Restore archived courses
   - Permanently delete courses
4. **Inquiry Management**:
   - View all course inquiries
   - Update inquiry status (new, contacted, completed, archived)
   - Filter inquiries by status
5. **Event Management**:
   - List all events
   - Create new events
   - Edit existing events
   - Archive events
   - Delete events
6. **Event Registration Management**:
   - View registrations for specific events
   - Update registration status (new, contacted, confirmed, attended, cancelled)
   - Filter registrations by status
7. **Statistics**:
   - View inquiry statistics
   - Track inquiry status distribution
   - View inquiries by course
   - Monitor inquiry trends
   - View event registration statistics

## Data Models

### Course

```typescript
interface Course {
  _id?: ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Inquiry

```typescript
interface Inquiry {
  _id?: ObjectId;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  courseId: ObjectId;
  courseTitle: string;
  status: 'new' | 'contacted' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

### Event

```typescript
interface Event {
  _id?: ObjectId;
  title: string;
  description: string;
  imageUrl?: string;
  eventDate: string; // Date as string for flexibility
  location: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### EventRegistration

```typescript
type EventRegistrationStatus = 'new' | 'contacted' | 'confirmed' | 'attended' | 'cancelled';

interface EventRegistration {
  _id?: ObjectId;
  eventId: ObjectId | string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  message?: string;
  status: EventRegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentication

The application uses NextAuth.js for authentication with a simple credentials provider. Only authenticated users can access the admin area and perform CRUD operations.

User roles:
- **Admin**: Can access all admin features

## API Routes

### Courses

- `GET /api/courses`: Get all courses
- `POST /api/courses`: Create a new course
- `GET /api/courses/:id`: Get a specific course
- `PATCH /api/courses/:id`: Update a course
- `DELETE /api/courses/:id`: Delete a course
- `PUT /api/courses/:id/archive`: Archive a course
- `PUT /api/courses/:id/unarchive`: Unarchive a course
- `GET /api/courses/statistics`: Get course statistics for dashboard

### Inquiries

- `GET /api/inquiries`: Get all inquiries (admin only)
- `POST /api/inquiries`: Create a new inquiry
- `GET /api/inquiries/:id`: Get a specific inquiry
- `PATCH /api/inquiries/:id`: Update an inquiry status
- `GET /api/inquiries/statistics`: Get inquiry statistics
- `GET /api/inquiries/course/:id`: Get inquiries for a specific course

### Events

- `GET /api/events`: Get all events (with optional includeArchived parameter)
- `POST /api/events`: Create a new event
- `GET /api/events/:id`: Get a specific event
- `PATCH /api/events/:id`: Update an event
- `DELETE /api/events/:id`: Delete an event
- `GET /api/events/statistics`: Get event statistics for dashboard

### Event Registrations

- `GET /api/event-registrations`: Get all event registrations (admin only)
- `POST /api/event-registrations`: Create a new event registration
- `GET /api/event-registrations/:id`: Get a specific registration
- `PATCH /api/event-registrations/:id`: Update a registration status
- `GET /api/event-registrations/statistics`: Get registration statistics
- `GET /api/events/:id/registrations`: Get registrations for a specific event

### Authentication

- `POST /api/auth/[...nextauth]`: NextAuth.js authentication endpoints

### Uploads

- `POST /api/upload`: Upload an image file

### Status

- `GET /api/mongodb-status`: Check MongoDB connection status

## Components

### UI Components

1. **SimpleEditor**: A basic WYSIWYG editor for course and event descriptions
2. **ImageUpload**: Component for uploading and previewing images
3. **InquiryForm**: Form for users to submit course inquiries
4. **EventsList**: Component to display upcoming events
5. **EventRegistrationForm**: Form for users to register for events

### Layout Components

1. **AdminLayout**: Layout for admin pages with advanced features:
   - Collapsible sidebar with toggle button
   - Mobile-responsive design with off-canvas menu
   - Fixed position sidebar that doesn't scroll with content
   - Dedicated logout button at the bottom of sidebar
   - Visual indicators for active sections
   - Organized navigation with logical grouping
2. **RootLayout**: Main layout for the entire application

## Key Implementation Details

### Admin Interface

The admin interface features a modern, professional design inspired by SAP Fiori design language:

1. **Collapsible Sidebar**:
   - Can be toggled between expanded (224px) and collapsed (64px) states
   - Keeps icons visible in collapsed state for quick navigation
   - Includes a visible expand/collapse toggle button
   - Fixed position that doesn't scroll with content
   - Dedicated logout button at the bottom
   - Responsive design that adapts to mobile devices

2. **Dashboard**:
   - Modern KPI cards with clear visual hierarchy
   - Color-coded status indicators
   - Quick action buttons for common tasks
   - Registration status overview with visual indicators
   - Responsive grid layout that adapts to all screen sizes

3. **Mobile Responsiveness**:
   - Off-canvas sidebar menu on mobile devices
   - Hamburger menu toggle
   - Optimized spacing and typography for small screens
   - Touch-friendly UI elements

### Image Uploads

Images are uploaded to the server's local filesystem in the `/uploads` directory. The application includes middleware to ensure this directory exists. The `next.config.js` file is configured to serve these images.

### Content Editing

Course and event descriptions are stored as HTML and rendered using React's `dangerouslySetInnerHTML`. The SimpleEditor component provides basic formatting capabilities.

### Responsive Design

The application is fully responsive using TailwindCSS, with different layouts for mobile, tablet, and desktop views. The admin interface includes specialized components for optimal usability across all device sizes.

### Status Tracking

The application includes comprehensive status tracking for:
- Course inquiries (new, contacted, completed, archived)
- Event registrations (new, contacted, confirmed, attended, cancelled)

### Error Handling

API routes include proper error handling with appropriate HTTP status codes. Frontend components display loading states and error messages when necessary.

## Development Workflow

1. **Local Development**: Run `npm run dev` to start the development server
2. **Linting**: Run `npm run lint` to check for code quality issues
3. **Building**: Run `npm run build` to create a production build
4. **Production**: Run `npm start` to start the production server

## Environment Variables

The application requires the following environment variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Future Enhancements

1. **User Management**: Add the ability to create and manage multiple admin users
2. **Rich Text Editor**: Upgrade the simple editor to a more feature-rich alternative
3. **Cloud Storage**: Move image uploads to a cloud storage solution
4. **Analytics**: Enhance analytics for course views, event attendance, and engagement
5. **Categories**: Implement course and event categorization
6. **Search**: Add search functionality for courses and events
7. **Email Notifications**: Send automated emails when inquiries or registrations are received
8. **CRM Integration**: Connect with external CRM systems for inquiry and registration management
9. **Calendar Integration**: Add calendar export for events
10. **Online Events**: Support for virtual events with video conferencing integration
11. **Theme Customization**: Add light/dark mode toggle and custom theme options
12. **Keyboard Navigation**: Enhance accessibility with keyboard shortcuts for admin interface

## Known Issues

1. Some linter warnings about using `<img>` elements instead of Next.js `<Image>` component
2. The application uses client-side rendering for most pages, which could be optimized for better SEO

## Troubleshooting

1. **MongoDB Connection Issues**: Ensure the MongoDB connection string is correct and the database is accessible
2. **Image Upload Problems**: Check that the `/uploads` directory exists and has proper write permissions
3. **Authentication Errors**: Verify the NextAuth configuration and environment variables 
4. **Mobile Sidebar Issues**: If the sidebar doesn't respond correctly on mobile, try clearing browser cache or refreshing the page 