import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/database';
import { courses, users } from '@/lib/database/schema';
import { eq, desc, asc, like, and, gte } from 'drizzle-orm';

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const level = searchParams.get('level') || '';
    const language = searchParams.get('language') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where conditions
    const whereConditions = [eq(courses.userId, user.id)];

    if (search) {
      whereConditions.push(like(courses.title, `%${search}%`));
    }

    if (status) {
      whereConditions.push(eq(courses.status, status as any));
    }

    if (level) {
      whereConditions.push(eq(courses.level, level as any));
    }

    if (language) {
      whereConditions.push(eq(courses.language, language));
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get courses with pagination
    const userCourses = await db.query.courses.findMany({
      where: and(...whereConditions),
      orderBy: sortOrder === 'desc' ? desc(courses[sortBy as keyof typeof courses]) : asc(courses[sortBy as keyof typeof courses]),
      limit,
      offset
    });

    // Get total count for pagination
    const totalCount = await db.select({ count: db.fn.count() })
      .from(courses)
      .where(and(...whereConditions));

    // Transform courses to include parsed JSON
    const transformedCourses = userCourses.map(course => ({
      ...course,
      modules: JSON.parse(course.modules || '[]'),
      learningOutcomes: JSON.parse(course.learningOutcomes || '[]'),
      tags: JSON.parse(course.tags || '[]')
    }));

    return NextResponse.json({
      success: true,
      courses: transformedCourses,
      pagination: {
        page,
        limit,
        total: totalCount[0].count as number,
        totalPages: Math.ceil((totalCount[0].count as number) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 