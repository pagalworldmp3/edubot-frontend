import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { aiService } from '@/lib/ai-service';
import { db } from '@/lib/database';
import { courses, users } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for course generation request
const generateCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  level: z.enum(['beginner', 'intermediate', 'expert']),
  language: z.string().min(2, 'Language is required'),
  aiModel: z.enum(['gpt-4', 'gpt-3.5-turbo', 'gemini-pro', 'claude-3-sonnet']),
  includeQuizzes: z.boolean().optional(),
  includeAssignments: z.boolean().optional(),
  customInstructions: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
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

    // Check user's generation limits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayGenerations = await db.query.courses.findMany({
      where: eq(courses.userId, user.id),
      where: eq(courses.createdAt, today)
    });

    const maxGenerations = user.role === 'free' ? 3 : 
                          user.role === 'pro' ? 50 : 
                          -1; // unlimited for enterprise

    if (maxGenerations !== -1 && todayGenerations.length >= maxGenerations) {
      return NextResponse.json(
        { error: 'Daily generation limit reached. Upgrade your plan for more generations.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = generateCourseSchema.parse(body);

    // Generate course using AI service
    const course = await aiService.generateCourse({
      ...validatedData,
      userId: user.id
    });

    // Save course to database
    const savedCourse = await db.insert(courses).values({
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      language: course.language,
      modules: JSON.stringify(course.modules),
      learningOutcomes: JSON.stringify(course.learningOutcomes),
      status: 'draft',
      userId: user.id,
      tags: JSON.stringify(course.tags || []),
      estimatedDuration: course.estimatedDuration,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    return NextResponse.json({
      success: true,
      course: {
        ...course,
        modules: course.modules,
        learningOutcomes: course.learningOutcomes,
        tags: course.tags
      },
      message: 'Course generated successfully'
    });

  } catch (error) {
    console.error('Error generating course:', error);
    
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