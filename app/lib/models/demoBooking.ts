import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export type DemoBookingStatus = 'new' | 'contacted' | 'completed' | 'archived';

export interface DemoBooking {
  _id?: ObjectId;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  preferredDate?: string;
  status: DemoBookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllDemoBookings(): Promise<DemoBooking[]> {
  const client = await clientPromise;
  const collection = client.db().collection<DemoBooking>('demoBookings');
  
  return collection.find().sort({ createdAt: -1 }).toArray();
}

export async function getDemoBookingById(id: string): Promise<DemoBooking | null> {
  const client = await clientPromise;
  const collection = client.db().collection<DemoBooking>('demoBookings');
  
  try {
    return collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error fetching demo booking by ID:', error);
    return null;
  }
}

export async function createDemoBooking(bookingData: Omit<DemoBooking, '_id' | 'createdAt' | 'updatedAt'>): Promise<DemoBooking> {
  const client = await clientPromise;
  const collection = client.db().collection<DemoBooking>('demoBookings');
  
  const now = new Date();
  const newBooking = {
    ...bookingData,
    status: bookingData.status || 'new',
    createdAt: now,
    updatedAt: now
  };
  
  const result = await collection.insertOne(newBooking);
  return {
    ...newBooking,
    _id: result.insertedId
  };
}

export async function updateDemoBookingStatus(id: string, status: DemoBookingStatus): Promise<boolean> {
  const client = await clientPromise;
  const collection = client.db().collection<DemoBooking>('demoBookings');
  
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
    console.error('Error updating demo booking status:', error);
    return false;
  }
}

export async function getDemoBookingsStatistics() {
  const client = await clientPromise;
  const collection = client.db().collection<DemoBooking>('demoBookings');
  
  try {
    const total = await collection.countDocuments();
    const newCount = await collection.countDocuments({ status: 'new' });
    const contactedCount = await collection.countDocuments({ status: 'contacted' });
    const completedCount = await collection.countDocuments({ status: 'completed' });
    const archivedCount = await collection.countDocuments({ status: 'archived' });
    
    // Get counts by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await collection.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]).toArray();
    
    return {
      total,
      byStatus: {
        new: newCount,
        contacted: contactedCount,
        completed: completedCount,
        archived: archivedCount
      },
      byDate: dailyStats
    };
  } catch (error) {
    console.error('Error getting demo booking statistics:', error);
    return {
      total: 0,
      byStatus: { new: 0, contacted: 0, completed: 0, archived: 0 },
      byDate: []
    };
  }
} 