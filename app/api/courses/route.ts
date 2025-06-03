import { NextRequest, NextResponse } from 'next/server';
import { getAllCourses, createCourse } from '@/app/lib/models/course';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// GET all courses
export async function GET(request: NextRequest) {
  try {
    // Check if request is coming from admin (include archived courses)
    const session = await getServerSession(authOptions);
    const includeArchived = session?.user?.role === 'admin';
    
    const courses = await getAllCourses(includeArchived);
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST create a new course
export async function POST(request: NextRequest) {
  try {
    // Verify admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Set default values if not provided
    const courseData = {
      title: data.title,
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      isArchived: data.isArchived || false,
    };

    const newCourse = await createCourse(courseData);
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
} 