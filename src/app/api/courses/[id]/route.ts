import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/database';
import { courses, users } from '@/lib/database/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for course updates
const updateCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long').optional(),
  level: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  language: z.string().min(2, 'Language is required').optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  tags: z.array(z.string()).optional(),
  modules: z.array(z.any()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  estimatedDuration: z.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get course by ID
    const course = await db.query.courses.findFirst({
      where: and(
        eq(courses.id, params.id),
        eq(courses.userId, user.id)
      )
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Transform course to include parsed JSON
    const transformedCourse = {
      ...course,
      modules: JSON.parse(course.modules || '[]'),
      learningOutcomes: JSON.parse(course.learningOutcomes || '[]'),
      tags: JSON.parse(course.tags || '[]')
    };

    return NextResponse.json({
      success: true,
      course: transformedCourse
    });

  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if course exists and belongs to user
    const existingCourse = await db.query.courses.findFirst({
      where: and(
        eq(courses.id, params.id),
        eq(courses.userId, user.id)
      )
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateCourseSchema.parse(body);

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };

    if (validatedData.title) updateData.title = validatedData.title;
    if (validatedData.description) updateData.description = validatedData.description;
    if (validatedData.level) updateData.level = validatedData.level;
    if (validatedData.language) updateData.language = validatedData.language;
    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.tags) updateData.tags = JSON.stringify(validatedData.tags);
    if (validatedData.modules) updateData.modules = JSON.stringify(validatedData.modules);
    if (validatedData.learningOutcomes) updateData.learningOutcomes = JSON.stringify(validatedData.learningOutcomes);
    if (validatedData.estimatedDuration) updateData.estimatedDuration = validatedData.estimatedDuration;

    // Update course
    const updatedCourse = await db.update(courses)
      .set(updateData)
      .where(eq(courses.id, params.id))
      .returning();

    return NextResponse.json({
      success: true,
      course: {
        ...updatedCourse[0],
        modules: JSON.parse(updatedCourse[0].modules || '[]'),
        learningOutcomes: JSON.parse(updatedCourse[0].learningOutcomes || '[]'),
        tags: JSON.parse(updatedCourse[0].tags || '[]')
      },
      message: 'Course updated successfully'
    });

  } catch (error) {
    console.error('Error updating course:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if course exists and belongs to user
    const existingCourse = await db.query.courses.findFirst({
      where: and(
        eq(courses.id, params.id),
        eq(courses.userId, user.id)
      )
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Delete course
    await db.delete(courses)
      .where(eq(courses.id, params.id));

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 