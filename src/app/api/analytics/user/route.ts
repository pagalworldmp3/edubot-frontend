import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/database';
import { courses, users, exports } from '@/lib/database/schema';
import { eq, and, gte, count, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // month, week, year

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get total statistics
    const totalCourses = await db.select({ count: count() })
      .from(courses)
      .where(eq(courses.userId, user.id));

    const totalExports = await db.select({ count: count() })
      .from(exports)
      .where(eq(exports.userId, user.id));

    // Get period statistics
    const periodCourses = await db.select({ count: count() })
      .from(courses)
      .where(and(
        eq(courses.userId, user.id),
        gte(courses.createdAt, startDate)
      ));

    const periodExports = await db.select({ count: count() })
      .from(exports)
      .where(and(
        eq(exports.userId, user.id),
        gte(exports.createdAt, startDate)
      ));

    // Get popular topics (most used tags)
    const userCourses = await db.query.courses.findMany({
      where: eq(courses.userId, user.id),
      columns: { tags: true }
    });

    const tagCounts: { [key: string]: number } = {};
    userCourses.forEach(course => {
      if (course.tags) {
        const tags = JSON.parse(course.tags);
        tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    const popularTopics = Object.entries(tagCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get recent activity
    const recentCourses = await db.query.courses.findMany({
      where: eq(courses.userId, user.id),
      orderBy: desc(courses.updatedAt),
      limit: 5
    });

    const recentExports = await db.query.exports.findMany({
      where: eq(exports.userId, user.id),
      orderBy: desc(exports.createdAt),
      limit: 5
    });

    // Calculate generation success rate (courses created vs attempted)
    // For now, we'll assume all courses were successful
    const successRate = 100; // This would be calculated based on actual data

    return NextResponse.json({
      success: true,
      analytics: {
        totalCourses: totalCourses[0].count,
        totalExports: totalExports[0].count,
        thisPeriod: {
          courses: periodCourses[0].count,
          exports: periodExports[0].count,
          period
        },
        popularTopics,
        recentActivity: {
          courses: recentCourses.map(course => ({
            id: course.id,
            title: course.title,
            status: course.status,
            updatedAt: course.updatedAt
          })),
          exports: recentExports.map(exp => ({
            id: exp.id,
            fileName: exp.fileName,
            format: exp.format,
            createdAt: exp.createdAt
          }))
        },
        successRate,
        userRole: user.role,
        subscriptionStatus: user.subscriptionStatus
      }
    });

  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 