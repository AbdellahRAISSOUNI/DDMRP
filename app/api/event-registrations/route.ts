import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { createEventRegistration, getAllEventRegistrations } from '@/app/lib/models/eventRegistration';

// GET /api/event-registrations
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
    
    const registrations = await getAllEventRegistrations();
    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/event-registrations
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.eventId || !data.fullName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }
    
    // Create new registration with status 'new'
    const newRegistration = await createEventRegistration({
      ...data,
      status: 'new'
    });
    
    return NextResponse.json(newRegistration);
  } catch (error) {
    console.error('Error creating event registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 