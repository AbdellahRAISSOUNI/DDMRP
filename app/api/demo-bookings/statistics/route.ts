import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getDemoBookingsStatistics } from '@/app/lib/models/demoBooking';

// GET /api/demo-bookings/statistics
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
    
    // Get statistics
    const statistics = await getDemoBookingsStatistics();
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching demo booking statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 