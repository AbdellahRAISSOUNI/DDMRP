import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { createDemoBooking, getAllDemoBookings } from '@/app/lib/models/demoBooking';

// GET /api/demo-bookings
export async function GET(request: NextRequest) {
  try {
    // Check authentication for listing all bookings
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const bookings = await getAllDemoBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching demo bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/demo-bookings
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.fullName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }
    
    // Create new booking with status 'new'
    const newBooking = await createDemoBooking({
      ...data,
      status: 'new'
    });
    
    return NextResponse.json(newBooking);
  } catch (error) {
    console.error('Error creating demo booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 