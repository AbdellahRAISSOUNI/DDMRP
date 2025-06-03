import { NextRequest, NextResponse } from 'next/server';
import { getInquiriesStatistics } from '@/app/lib/models/inquiry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// GET inquiry statistics (admin only)
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
    
    const statistics = await getInquiriesStatistics();
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching inquiry statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiry statistics' },
      { status: 500 }
    );
  }
} 