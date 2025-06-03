import { NextRequest, NextResponse } from 'next/server';
import { getCourseStatistics } from '@/app/lib/models/course';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// GET course statistics (admin only)
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
    
    const statistics = await getCourseStatistics();
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching course statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course statistics' },
      { status: 500 }
    );
  }
} 