# DDMRP Code Patterns Guide

This document outlines the common code patterns used throughout the DDMRP application to maintain consistency and help new developers understand the codebase.

## React Component Structure

### Client Components

```tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Component that uses client-side features
function ComponentContent() {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data
        setData(result);
      } catch (err) {
        setError('Error message');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Loading state
  if (loading) {
    return <LoadingComponent />;
  }
  
  // Error state
  if (error || !data) {
    return <ErrorComponent message={error} />;
  }
  
  // Render component
  return (
    <div>
      {/* Component content */}
    </div>
  );
}

// Page component that uses the client component
export default function PageComponent() {
  return <ComponentContent />;
}
```

### Dynamic Route Parameters

For components that need to access route parameters:

```tsx
// In page components
function ContentComponent() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Use id safely here
}
```

## API Route Patterns

### GET Request Handler

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract ID first to avoid sync access
    const id = params.id;
    
    // Optional authentication check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Process the request
    const data = await getData(id);
    
    if (!data) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### POST Request Handler

```tsx
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    
    // Validate data
    if (!data.requiredField) {
      return NextResponse.json(
        { error: 'Required field missing' },
        { status: 400 }
      );
    }
    
    // Process the request
    const result = await createData(data);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## MongoDB Interaction

### Fetching Data

```tsx
import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';

export async function getData(id: string) {
  const client = await clientPromise;
  const collection = client.db().collection('collectionName');
  
  try {
    return collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
```

### Creating Data

```tsx
export async function createData(data: DataType) {
  const client = await clientPromise;
  const collection = client.db().collection('collectionName');
  
  const now = new Date();
  const newData = {
    ...data,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await collection.insertOne(newData);
  return {
    ...newData,
    _id: result.insertedId
  };
}
```

### Updating Data

```tsx
export async function updateData(id: string, updates: Partial<DataType>) {
  const client = await clientPromise;
  const collection = client.db().collection('collectionName');
  
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );
    return result.matchedCount > 0;
  } catch (error) {
    console.error('Error updating data:', error);
    return false;
  }
}
```

## UI Component Patterns

### Loading States

```tsx
{loading ? (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
) : null}
```

### Error States

```tsx
{error ? (
  <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
    {error}
  </div>
) : null}
```

### Empty States

```tsx
{items.length === 0 ? (
  <div className="text-center py-8">
    <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-50 rounded-full mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </div>
    <p className="text-slate-600 font-medium">No items yet</p>
    <p className="text-slate-500 text-sm mt-1">Create your first item to get started</p>
  </div>
) : null}
```

## Form Handling

```tsx
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.field1) {
    setError('Field1 is required');
    return;
  }
  
  setIsSubmitting(true);
  setError(null);
  
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Something went wrong');
    }
    
    // Handle success
  } catch (err: any) {
    setError(err.message || 'An error occurred');
  } finally {
    setIsSubmitting(false);
  }
};
```

## Authentication Check

```tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function ProtectedComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === 'loading') {
    return <LoadingComponent />;
  }
  
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }
  
  // Protected content
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## Styling Patterns

### Button Variants

```tsx
// Primary button
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
  Primary Button
</button>

// Secondary button
<button className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300 px-4 py-2 rounded-lg transition-colors">
  Secondary Button
</button>

// Danger button
<button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
  Danger Button
</button>
```

### Card Pattern

```tsx
<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
  <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
    <h2 className="text-lg font-medium text-blue-800">Card Title</h2>
  </div>
  <div className="p-6">
    {/* Card content */}
  </div>
</div>
```

## Best Practices

1. Always handle loading, error, and empty states
2. Use TypeScript interfaces for data models
3. Extract reusable logic into custom hooks
4. Follow the existing folder structure and naming conventions
5. Use consistent error handling patterns
6. Properly handle route parameters to avoid synchronous access errors
7. Use TailwindCSS utility classes for styling
8. Keep components focused on a single responsibility 