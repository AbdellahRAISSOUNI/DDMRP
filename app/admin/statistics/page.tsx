"use client";

import { useEffect, useState } from 'react';

interface InquiryStatistics {
  total: number;
  byStatus: {
    new: number;
    contacted: number;
    completed: number;
    archived: number;
  };
  byCourse: Array<{
    _id: {
      courseId: string;
      courseTitle: string;
    };
    count: number;
  }>;
  byDate: Array<{
    _id: {
      year: number;
      month: number;
      day: number;
    };
    count: number;
  }>;
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<InquiryStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/inquiries/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStatistics(data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, []);
  
  // Format date for display
  const formatDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Calculate percentage for status
  const calculatePercentage = (count: number) => {
    if (!statistics || statistics.total === 0) return 0;
    return Math.round((count / statistics.total) * 100);
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Inquiry Statistics</h1>
        <p className="text-slate-600">Overview of course inquiry data and trends.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      ) : statistics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Inquiries */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-medium text-blue-800">Total Inquiries</h2>
            </div>
            <div className="p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{statistics.total}</div>
                <p className="text-slate-500">Total course inquiries received</p>
              </div>
            </div>
          </div>
          
          {/* Status Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-medium text-blue-800">Status Breakdown</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* New */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">New</span>
                    <span className="text-sm text-slate-600">{statistics.byStatus.new} ({calculatePercentage(statistics.byStatus.new)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${calculatePercentage(statistics.byStatus.new)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Contacted */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Contacted</span>
                    <span className="text-sm text-slate-600">{statistics.byStatus.contacted} ({calculatePercentage(statistics.byStatus.contacted)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${calculatePercentage(statistics.byStatus.contacted)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Completed */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Completed</span>
                    <span className="text-sm text-slate-600">{statistics.byStatus.completed} ({calculatePercentage(statistics.byStatus.completed)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${calculatePercentage(statistics.byStatus.completed)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Archived */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Archived</span>
                    <span className="text-sm text-slate-600">{statistics.byStatus.archived} ({calculatePercentage(statistics.byStatus.archived)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-slate-500 h-2 rounded-full" 
                      style={{ width: `${calculatePercentage(statistics.byStatus.archived)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Inquiries by Course */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-medium text-blue-800">Inquiries by Course</h2>
            </div>
            <div className="p-6">
              {statistics.byCourse.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No course data available
                </div>
              ) : (
                <div className="space-y-4">
                  {statistics.byCourse.map((course) => (
                    <div key={course._id.courseId}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[70%]" title={course._id.courseTitle}>
                          {course._id.courseTitle}
                        </span>
                        <span className="text-sm text-slate-600">{course.count} ({Math.round((course.count / statistics.total) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.round((course.count / statistics.total) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Trend (Last 7 Days) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-medium text-blue-800">Recent Trend (Last 7 Days)</h2>
            </div>
            <div className="p-6">
              {statistics.byDate.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No recent data available
                </div>
              ) : (
                <div className="h-60 flex items-end justify-between">
                  {statistics.byDate.map((day) => {
                    const maxCount = Math.max(...statistics.byDate.map(d => d.count));
                    const heightPercentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    
                    return (
                      <div 
                        key={`${day._id.year}-${day._id.month}-${day._id.day}`}
                        className="flex flex-col items-center"
                        style={{ width: `${100 / Math.max(statistics.byDate.length, 1)}%` }}
                      >
                        <div className="text-xs text-slate-600 mb-1">{day.count}</div>
                        <div 
                          className="w-4/5 bg-blue-500 rounded-t"
                          style={{ height: `${heightPercentage}%`, minHeight: day.count > 0 ? '10%' : '0' }}
                        ></div>
                        <div className="text-xs text-slate-500 mt-2">
                          {formatDate(day._id.year, day._id.month, day._id.day)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
} 