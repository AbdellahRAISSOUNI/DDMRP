import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export type EventRegistrationStatus = 'new' | 'contacted' | 'confirmed' | 'attended' | 'cancelled';

export interface EventRegistration {
  _id?: ObjectId;
  eventId: ObjectId | string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  message?: string;
  status: EventRegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllEventRegistrations(): Promise<EventRegistration[]> {
  const client = await clientPromise;
  const collection = client.db().collection<EventRegistration>('eventRegistrations');
  
  return collection.find().sort({ createdAt: -1 }).toArray();
}

export async function getRegistrationsByEventId(eventId: string): Promise<EventRegistration[]> {
  const client = await clientPromise;
  const collection = client.db().collection<EventRegistration>('eventRegistrations');
  
  try {
    if (!ObjectId.isValid(eventId)) {
      console.error('Invalid ObjectId format:', eventId);
      return [];
    }
    
    return collection.find({ eventId: new ObjectId(eventId) }).sort({ createdAt: -1 }).toArray();
  } catch (error) {
    console.error('Error fetching registrations by event ID:', error);
    return [];
  }
}

export async function getRegistrationById(id: string): Promise<EventRegistration | null> {
  const client = await clientPromise;
  const collection = client.db().collection<EventRegistration>('eventRegistrations');
  
  try {
    return collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error fetching registration by ID:', error);
    return null;
  }
}

export async function createEventRegistration(
  registrationData: Omit<EventRegistration, '_id' | 'createdAt' | 'updatedAt'>
): Promise<EventRegistration> {
  const client = await clientPromise;
  const collection = client.db().collection<EventRegistration>('eventRegistrations');
  
  const now = new Date();
  const newRegistration = {
    ...registrationData,
    eventId: typeof registrationData.eventId === 'string' 
      ? new ObjectId(registrationData.eventId) 
      : registrationData.eventId,
    status: registrationData.status || 'new',
    createdAt: now,
    updatedAt: now
  };
  
  const result = await collection.insertOne(newRegistration);
  return {
    ...newRegistration,
    _id: result.insertedId
  };
}

export async function updateRegistrationStatus(id: string, status: EventRegistrationStatus): Promise<boolean> {
  const client = await clientPromise;
  const collection = client.db().collection<EventRegistration>('eventRegistrations');
  
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          status,
          updatedAt: new Date()
        }
      }
    );
    return result.matchedCount > 0;
  } catch (error) {
    console.error('Error updating registration status:', error);
    return false;
  }
}

export async function getEventRegistrationStatistics(eventId?: string) {
  const client = await clientPromise;
  const collection = client.db().collection<EventRegistration>('eventRegistrations');
  
  try {
    const query = eventId ? { eventId: new ObjectId(eventId) } : {};
    
    const total = await collection.countDocuments(query);
    const newCount = await collection.countDocuments({ ...query, status: 'new' });
    const contactedCount = await collection.countDocuments({ ...query, status: 'contacted' });
    const confirmedCount = await collection.countDocuments({ ...query, status: 'confirmed' });
    const attendedCount = await collection.countDocuments({ ...query, status: 'attended' });
    const cancelledCount = await collection.countDocuments({ ...query, status: 'cancelled' });
    
    return {
      total,
      byStatus: {
        new: newCount,
        contacted: contactedCount,
        confirmed: confirmedCount,
        attended: attendedCount,
        cancelled: cancelledCount
      }
    };
  } catch (error) {
    console.error('Error getting event registration statistics:', error);
    return {
      total: 0,
      byStatus: { 
        new: 0, 
        contacted: 0, 
        confirmed: 0, 
        attended: 0, 
        cancelled: 0 
      }
    };
  }
}

export async function getRegistrationCountByEventId(eventId: string): Promise<number> {
  const client = await clientPromise;
  const collection = client.db().collection<EventRegistration>('eventRegistrations');
  
  try {
    if (!ObjectId.isValid(eventId)) {
      console.error('Invalid ObjectId format:', eventId);
      return 0;
    }
    
    return collection.countDocuments({ eventId: new ObjectId(eventId) });
  } catch (error) {
    console.error('Error counting registrations by event ID:', error);
    return 0;
  }
} 