"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import SimpleEditor from '@/app/components/ui/SimpleEditor';
import ImageUpload from '@/app/components/ui/ImageUpload';
import { Course } from '@/app/lib/models/course';
import { useSession } from 'next-auth/react';

// Create a wrapper component to handle the course editing logic
function CourseEditor({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [program, setProgram] = useState('');
  const [instructor, setInstructor] = useState('');
  const [dates, setDates] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data = await response.json();
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setImageUrl(data.imageUrl || '');
        setProgram(data.program || '');
        setInstructor(data.instructor || '');
        setDates(data.dates || '');
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          program,
          instructor,
          dates
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update course');
      }
      
      router.push('/admin/courses');
    } catch (err: any) {
      console.error('Error updating course:', err);
      setError(err.message || 'Failed to update course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if not authenticated
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Edit Course</h1>
        <div className="flex space-x-3">
          <Link 
            href={`/courses/${id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
            target="_blank"
          >
            View Course
          </Link>
          <Link 
            href="/admin/courses" 
            className="text-slate-600 hover:text-slate-800 font-medium"
          >
            Back to Courses
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <h2 className="text-lg font-medium text-blue-800">Course Details</h2>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course title"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="program" className="block text-sm font-medium text-slate-700 mb-1">
                  Program
                </label>
                <input
                  id="program"
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. DDP, DDL, Green belt"
                />
              </div>
              
              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-slate-700 mb-1">
                  Instructor
                </label>
                <input
                  id="instructor"
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. SARIR Hicham"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="dates" className="block text-sm font-medium text-slate-700 mb-1">
                Dates
              </label>
              <textarea
                id="dates"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter dates, one per line (e.g. 14 et 15 Juin 2024)"
                rows={4}
              />
              <p className="mt-1 text-sm text-slate-500">
                Enter dates for the course, one entry per line. Example:<br />
                14 et 15 Juin 2024<br />
                13 et 14 Septembre 2024
              </p>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <SimpleEditor
                value={description}
                onChange={setDescription}
                placeholder="Enter course description"
              />
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Cover Image
              </label>
              <ImageUpload 
                value={imageUrl}
                onChange={setImageUrl}
              />
            </div>
            
            <div className="pt-6 border-t border-slate-200 flex justify-end space-x-3">
              <Link
                href="/admin/courses"
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main page component that doesn't directly use params.id in the component body
export default function EditCoursePage() {
  const params = useParams();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id as string;
  return <CourseEditor id={courseId} />;
} 