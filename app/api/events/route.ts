import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { createEvent, getAllEvents } from '@/app/lib/models/event';
import { getRegistrationCountByEventId } from '@/app/lib/models/eventRegistration';

// GET /api/events
export async function GET(request: NextRequest) {
  try {
    const includeArchived = request.nextUrl.searchParams.get('includeArchived') === 'true';
    const events = await getAllEvents(includeArchived);
    
    // Add registration counts to events
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        if (event._id) {
          const registrationCount = await getRegistrationCountByEventId(event._id.toString());
          return {
            ...event,
            registrationCount
          };
        }
        return event;
      })
    );
    
    return NextResponse.json(eventsWithCounts);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/events
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.eventDate || !data.location) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }
    
    // Create new event
    const newEvent = await createEvent({
      ...data,
      isArchived: data.isArchived || false
    });
    
    return NextResponse.json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 