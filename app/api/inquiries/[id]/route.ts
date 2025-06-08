import { NextRequest, NextResponse } from 'next/server';
import { getInquiryById, updateInquiryStatus, InquiryStatus } from '@/app/lib/models/inquiry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// GET a single inquiry by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
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
    
    // Properly destructure params to avoid sync access
    const { id } = context.params;
    const inquiry = await getInquiryById(id);
    
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

// PATCH update an inquiry status
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
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
    
    // Properly destructure params to avoid sync access
    const { id } = context.params;
    const data = await request.json();
    
    // Validate status
    if (!data.status || !['new', 'contacted', 'completed', 'archived'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    const success = await updateInquiryStatus(id, data.status as InquiryStatus);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Inquiry not found or could not be updated' },
        { status: 404 }
      );
    }
    
    const updatedInquiry = await getInquiryById(id);
    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry status' },
      { status: 500 }
    );
  }
} 