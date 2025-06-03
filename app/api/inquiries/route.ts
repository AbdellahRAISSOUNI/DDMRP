import { NextRequest, NextResponse } from 'next/server';
import { createInquiry, getAllInquiries } from '@/app/lib/models/inquiry';
import { getCourseById } from '@/app/lib/models/course';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { ObjectId } from 'mongodb';

// GET all inquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const inquiries = await getAllInquiries();
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

// POST a new inquiry
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.fullName || !data.email || !data.phone || !data.courseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate phone format (simple validation)
    const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
    if (!phoneRegex.test(data.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }
    
    // Check if the course exists
    const course = await getCourseById(data.courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Create the inquiry
    const inquiry = await createInquiry({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      message: data.message || '',
      courseId: new ObjectId(data.courseId),
      courseTitle: course.title,
      status: 'new'
    });
    
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
} 