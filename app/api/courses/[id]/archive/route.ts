import { NextRequest, NextResponse } from 'next/server';
import { archiveCourse } from '@/app/lib/models/course';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// PUT archive a course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Destructure params to avoid sync access
    const { id } = params;
    const success = await archiveCourse(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to archive course' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error archiving course:', error);
    return NextResponse.json(
      { error: 'Failed to archive course' },
      { status: 500 }
    );
  }
} 