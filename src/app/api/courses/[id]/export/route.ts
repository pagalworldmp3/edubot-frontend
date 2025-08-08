import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/database';
import { courses, users, exports } from '@/lib/database/schema';
import { eq, and } from 'drizzle-orm';
import { exportService } from '@/lib/export-service';
import { z } from 'zod';

// Validation schema for export request
const exportSchema = z.object({
  format: z.enum(['pdf', 'powerpoint', 'scorm']),
  includeQuizzes: z.boolean().optional(),
  includeCertificates: z.boolean().optional(),
  branding: z.object({
    logo: z.string().optional(),
    colors: z.object({
      primary: z.string().optional(),
      secondary: z.string().optional()
    }).optional()
  }).optional()
});

export async function POST(
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

    // Check user's export limits
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyExports = await db.query.exports.findMany({
      where: and(
        eq(exports.userId, user.id),
        eq(exports.createdAt, thisMonth)
      )
    });

    const maxExports = user.role === 'free' ? 2 : 
                      user.role === 'pro' ? 100 : 
                      -1; // unlimited for enterprise

    if (maxExports !== -1 && monthlyExports.length >= maxExports) {
      return NextResponse.json(
        { error: 'Monthly export limit reached. Upgrade your plan for more exports.' },
        { status: 429 }
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = exportSchema.parse(body);

    // Transform course data
    const courseData = {
      ...course,
      modules: JSON.parse(course.modules || '[]'),
      learningOutcomes: JSON.parse(course.learningOutcomes || '[]'),
      tags: JSON.parse(course.tags || '[]')
    };

    // Generate export based on format
    let exportBlob: Blob;
    let fileName: string;
    let mimeType: string;

    switch (validatedData.format) {
      case 'pdf':
        exportBlob = await exportService.exportToPDF(courseData, {
          includeQuizzes: validatedData.includeQuizzes,
          includeCertificates: validatedData.includeCertificates,
          branding: validatedData.branding
        });
        fileName = `${course.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        mimeType = 'application/pdf';
        break;

      case 'powerpoint':
        exportBlob = await exportService.exportToPowerPoint(courseData, {
          includeQuizzes: validatedData.includeQuizzes,
          branding: validatedData.branding
        });
        fileName = `${course.title.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;

      case 'scorm':
        exportBlob = await exportService.exportToSCORM(courseData);
        fileName = `${course.title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
        mimeType = 'application/zip';
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported export format' },
          { status: 400 }
        );
    }

    // Save export record to database
    await db.insert(exports).values({
      id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      courseId: course.id,
      format: validatedData.format,
      fileName,
      fileSize: exportBlob.size,
      createdAt: new Date()
    });

    // Create response with file download
    const response = new NextResponse(exportBlob, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': exportBlob.size.toString()
      }
    });

    return response;

  } catch (error) {
    console.error('Error exporting course:', error);
    
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