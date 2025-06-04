import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export interface Event {
  _id?: ObjectId;
  title: string;
  description: string;
  imageUrl?: string;
  eventDate: string; // Date as string for flexibility
  location: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  registrationCount?: number; // Number of registrations for this event
}

export async function getAllEvents(includeArchived: boolean = false): Promise<Event[]> {
  const client = await clientPromise;
  const collection = client.db().collection<Event>('events');
  
  const query = includeArchived ? {} : { isArchived: { $ne: true } };
  return collection.find(query).sort({ eventDate: 1 }).toArray();
}

export async function getEventById(id: string): Promise<Event | null> {
  const client = await clientPromise;
  const collection = client.db().collection<Event>('events');
  
  try {
    // Validate id format before creating ObjectId
    if (!ObjectId.isValid(id)) {
      console.error('Invalid ObjectId format:', id);
      return null;
    }
    
    return collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return null;
  }
}

export async function createEvent(eventData: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
  const client = await clientPromise;
  const collection = client.db().collection<Event>('events');
  
  const now = new Date();
  const newEvent = {
    ...eventData,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await collection.insertOne(newEvent);
  return {
    ...newEvent,
    _id: result.insertedId
  };
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<boolean> {
  const client = await clientPromise;
  const collection = client.db().collection<Event>('events');
  
  try {
    // Validate id format before creating ObjectId
    if (!ObjectId.isValid(id)) {
      console.error('Invalid ObjectId format:', id);
      return false;
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
    console.error('Error updating event:', error);
    return false;
  }
}

export async function archiveEvent(id: string): Promise<boolean> {
  return updateEvent(id, { isArchived: true });
}

export async function unarchiveEvent(id: string): Promise<boolean> {
  return updateEvent(id, { isArchived: false });
}

export async function deleteEvent(id: string): Promise<boolean> {
  const client = await clientPromise;
  const collection = client.db().collection<Event>('events');
  
  try {
    // Validate id format before creating ObjectId
    if (!ObjectId.isValid(id)) {
      console.error('Invalid ObjectId format:', id);
      return false;
    }
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
}

export async function getEventStatistics() {
  const client = await clientPromise;
  const collection = client.db().collection<Event>('events');
  
  try {
    const total = await collection.countDocuments();
    const active = await collection.countDocuments({ isArchived: { $ne: true } });
    const archived = await collection.countDocuments({ isArchived: true });
    const upcoming = await collection.countDocuments({ 
      isArchived: { $ne: true },
      eventDate: { $gte: new Date().toISOString().split('T')[0] }
    });
    
    return {
      total,
      active,
      archived,
      upcoming
    };
  } catch (error) {
    console.error('Error getting event statistics:', error);
    return {
      total: 0,
      active: 0,
      archived: 0,
      upcoming: 0
    };
  }
} 