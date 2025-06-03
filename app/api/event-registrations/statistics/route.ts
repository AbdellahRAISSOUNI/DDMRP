import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getEventRegistrationStatistics } from '@/app/lib/models/eventRegistration';

// GET /api/event-registrations/statistics
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
    
    // Get optional eventId from query params
    const eventId = request.nextUrl.searchParams.get('eventId') || undefined;
    
    // Get statistics
    const statistics = await getEventRegistrationStatistics(eventId);
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching event registration statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 