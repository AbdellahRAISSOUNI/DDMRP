# DDMRP Project Quick Start Guide

This guide will help you get up and running with the DDMRP Course Management application quickly.

## 1. Initial Setup

### Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd ddmrp

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the project root with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret
```

To generate a secure NEXTAUTH_SECRET, you can use:

```bash
openssl rand -base64 32
```

## 2. Development Workflow

### Start Development Server

```bash
npm run dev
```

This will start the Next.js development server at http://localhost:3000.

### Project Structure Overview

- **Public Pages**:
  - Home: `/app/page.tsx`
  - Courses List: `/app/courses/page.tsx`
  - Course Detail: `/app/courses/[id]/page.tsx`

- **Admin Pages**:
  - Dashboard: `/app/admin/page.tsx`
  - Courses List: `/app/admin/courses/page.tsx`
  - Course Edit: `/app/admin/courses/[id]/page.tsx`
  - New Course: `/app/admin/courses/new/page.tsx`
  - Archived Courses: `/app/admin/archived/page.tsx`
  - Inquiries: `/app/admin/inquiries/page.tsx`
  - Statistics: `/app/admin/statistics/page.tsx`

- **API Routes**:
  - Courses: `/app/api/courses/route.ts`
  - Course by ID: `/app/api/courses/[id]/route.ts`
  - Archive/Unarchive: `/app/api/courses/[id]/archive/route.ts` and `/app/api/courses/[id]/unarchive/route.ts`
  - Inquiries: `/app/api/inquiries/route.ts`
  - Inquiry by ID: `/app/api/inquiries/[id]/route.ts`
  - Inquiry Statistics: `/app/api/inquiries/statistics/route.ts`
  - Inquiries by Course: `/app/api/inquiries/course/[id]/route.ts`
  - Image Upload: `/app/api/upload/route.ts`

### Key Components

- **SimpleEditor**: A basic WYSIWYG editor for course descriptions
- **ImageUpload**: Component for uploading and previewing course images
- **InquiryForm**: Form for users to submit course inquiries
- **AdminLayout**: Layout for admin pages with sidebar navigation

## 3. Common Tasks

### Creating a New Course

1. Log in to the admin area at `/login`
2. Navigate to "Courses" in the sidebar
3. Click "Create New Course"
4. Fill in the course details and save

### Editing a Course

1. Navigate to "Courses" in the admin sidebar
2. Find the course you want to edit
3. Click "Edit" on that course
4. Make your changes and save

### Archiving/Unarchiving Courses

1. To archive: In the courses list, click "Archive" on the course
2. To unarchive: Go to "Archived Courses" and click "Restore"

### Managing Inquiries

1. View all inquiries in the "Inquiries" section of the admin area
2. Update inquiry status (new, contacted, completed, archived) as needed
3. Filter inquiries by status using the filter buttons
4. View inquiry statistics in the "Statistics" section

### Uploading Images

When creating or editing a course, use the image upload component:
1. Click "Upload Image"
2. Select an image file
3. The image will be uploaded and displayed in the preview

## 4. Database Schema

### Course Collection

```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  imageUrl: string,
  isArchived: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Inquiry Collection

```typescript
{
  _id: ObjectId,
  fullName: string,
  email: string,
  phone: string,
  message?: string,
  courseId: ObjectId,
  courseTitle: string,
  status: 'new' | 'contacted' | 'completed' | 'archived',
  createdAt: Date,
  updatedAt: Date
}
```

## 5. Authentication

The application uses NextAuth.js with a credentials provider. To log in:

- Email: admin@example.com
- Password: password

## 6. Troubleshooting

### MongoDB Connection Issues

If you see MongoDB connection errors:
1. Check that your MongoDB connection string is correct in `.env.local`
2. Ensure your IP address is whitelisted in MongoDB Atlas (if using Atlas)
3. Check the MongoDB status on the home page

### Image Upload Problems

If image uploads fail:
1. Ensure the `/uploads` directory exists and is writable
2. Check the server logs for specific errors
3. Verify that the image file size is not too large

### Authentication Issues

If you can't log in:
1. Check that you're using the correct credentials
2. Ensure NEXTAUTH_SECRET and NEXTAUTH_URL are set correctly
3. Clear browser cookies and try again

## 7. Code Style and Conventions

- Use TypeScript for type safety
- Follow the Next.js App Router conventions
- Use TailwindCSS for styling
- Use React hooks for state management
- Follow the existing project structure

For more detailed information, refer to the [DOCUMENTATION.md](./DOCUMENTATION.md) file. 