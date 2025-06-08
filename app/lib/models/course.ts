import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { deleteImage } from './image';

export interface Course {
  _id?: ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  isArchived: boolean;
  program?: string;
  instructor?: string;
  dates?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllCourses(includeArchived: boolean = false): Promise<Course[]> {
  const client = await clientPromise;
  const collection = client.db().collection<Course>('courses');
  
  const query = includeArchived ? {} : { isArchived: { $ne: true } };
  return collection.find(query).sort({ createdAt: -1 }).toArray();
}

export async function getCourseById(id: string): Promise<Course | null> {
  const client = await clientPromise;
  const collection = client.db().collection<Course>('courses');
  
  try {
    // Validate id format before creating ObjectId
    if (!ObjectId.isValid(id)) {
      console.error('Invalid ObjectId format:', id);
      return null;
    }
    
    return collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return null;
  }
}

export async function createCourse(courseData: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
  const client = await clientPromise;
  const collection = client.db().collection<Course>('courses');
  
  const now = new Date();
  const newCourse = {
    ...courseData,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await collection.insertOne(newCourse);
  return {
    ...newCourse,
    _id: result.insertedId
  };
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<boolean> {
  const client = await clientPromise;
  const collection = client.db().collection<Course>('courses');
  
  try {
    // If imageUrl is being updated and the old one is a MongoDB image, delete it
    if (updates.imageUrl !== undefined) {
      const existingCourse = await getCourseById(id);
      if (existingCourse && existingCourse.imageUrl && existingCourse.imageUrl.startsWith('/api/images/')) {
        // Extract image ID from URL
        const oldImageId = existingCourse.imageUrl.split('/').pop();
        if (oldImageId && updates.imageUrl !== existingCourse.imageUrl) {
          // Only delete if the image is being changed
          await deleteImage(oldImageId).catch(err => 
            console.error(`Failed to delete old image ${oldImageId}:`, err)
          );
        }
      }
    }

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
    console.error('Error updating course:', error);
    return false;
  }
}

export async function archiveCourse(id: string): Promise<boolean> {
  return updateCourse(id, { isArchived: true });
}

export async function unarchiveCourse(id: string): Promise<boolean> {
  return updateCourse(id, { isArchived: false });
}

export async function deleteCourse(id: string): Promise<boolean> {
  const client = await clientPromise;
  const collection = client.db().collection<Course>('courses');
  
  try {
    // Get the course to check if it has an image to delete
    const course = await getCourseById(id);
    if (course && course.imageUrl && course.imageUrl.startsWith('/api/images/')) {
      // Extract image ID from URL
      const imageId = course.imageUrl.split('/').pop();
      if (imageId) {
        // Delete the image from MongoDB
        await deleteImage(imageId).catch(err => 
          console.error(`Failed to delete image ${imageId} when deleting course:`, err)
        );
      }
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting course:', error);
    return false;
  }
}

export async function getCourseStatistics() {
  const client = await clientPromise;
  const collection = client.db().collection<Course>('courses');
  
  try {
    const total = await collection.countDocuments();
    const active = await collection.countDocuments({ isArchived: { $ne: true } });
    const archived = await collection.countDocuments({ isArchived: true });
    
    return {
      total,
      active,
      archived
    };
  } catch (error) {
    console.error('Error getting course statistics:', error);
    return {
      total: 0,
      active: 0,
      archived: 0
    };
  }
} 