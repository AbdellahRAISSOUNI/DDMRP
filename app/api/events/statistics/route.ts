import { NextRequest, NextResponse } from 'next/server';
import { getEventStatistics } from '@/app/lib/models/event';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// GET event statistics (admin only)
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
    
    const statistics = await getEventStatistics();
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching event statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event statistics' },
      { status: 500 }
    );
  }
} 