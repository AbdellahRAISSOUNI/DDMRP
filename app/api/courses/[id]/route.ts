import { NextRequest, NextResponse } from 'next/server';
import { getCourseById, updateCourse, deleteCourse, archiveCourse, unarchiveCourse } from '@/app/lib/models/course';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// GET a single course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Properly destructure params to avoid sync access
    const id = params.id;
    const course = await getCourseById(id);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // If course is archived, only allow admin to view it
    if (course.isArchived) {
      const session = await getServerSession(authOptions);
      if (!session || session.user?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PATCH update a course
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the ID first to avoid sync access
    const id = params.id;
    
    // Verify admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const success = await updateCourse(id, data);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Course not found or could not be updated' },
        { status: 404 }
      );
    }
    
    const updatedCourse = await getCourseById(id);
    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the ID first to avoid sync access
    const id = params.id;
    
    // Verify admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const success = await deleteCourse(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Course not found or could not be deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
} 