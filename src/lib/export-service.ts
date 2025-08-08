import jsPDF from 'jspdf';
import { Course, Module, Lesson, Quiz, Question } from '@/types';

class ExportService {
  async exportToPDF(course: Course, options: {
    includeQuizzes?: boolean;
    includeCertificates?: boolean;
    branding?: {
      logo?: string;
      colors?: {
        primary: string;
        secondary: string;
      };
    };
  } = {}): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    let yPosition = margin;

    // Add title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(course.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Add description
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const descriptionLines = doc.splitTextToSize(course.description, contentWidth);
    doc.text(descriptionLines, margin, yPosition);
    yPosition += (descriptionLines.length * 7) + 15;

    // Add course info
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Course Information', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Level: ${course.level}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Language: ${course.language}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Duration: ${Math.round(course.estimatedDuration / 60)} hours`, margin, yPosition);
    yPosition += 15;

    // Add learning outcomes
    if (course.learningOutcomes.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Learning Outcomes', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      course.learningOutcomes.forEach((outcome, index) => {
        const outcomeLines = doc.splitTextToSize(`• ${outcome}`, contentWidth);
        doc.text(outcomeLines, margin, yPosition);
        yPosition += (outcomeLines.length * 7);
        
        // Check if we need a new page
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = margin;
        }
      });
      yPosition += 10;
    }

    // Add modules and lessons
    course.modules.forEach((module, moduleIndex) => {
      // Check if we need a new page for module
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Module ${module.order}: ${module.title}`, margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const moduleDescLines = doc.splitTextToSize(module.description, contentWidth);
      doc.text(moduleDescLines, margin, yPosition);
      yPosition += (moduleDescLines.length * 7) + 10;

      // Add lessons
      module.lessons.forEach((lesson, lessonIndex) => {
        // Check if we need a new page for lesson
        if (yPosition > pageHeight - 150) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Lesson ${lesson.order}: ${lesson.title}`, margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const lessonLines = doc.splitTextToSize(lesson.content, contentWidth);
        doc.text(lessonLines, margin, yPosition);
        yPosition += (lessonLines.length * 7) + 10;
      });

      // Add quiz if requested
      if (options.includeQuizzes && module.quiz) {
        if (yPosition > pageHeight - 100) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Quiz: ${module.quiz.title}`, margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        module.quiz.questions.forEach((question, qIndex) => {
          const questionLines = doc.splitTextToSize(`${qIndex + 1}. ${question.question}`, contentWidth);
          doc.text(questionLines, margin, yPosition);
          yPosition += (questionLines.length * 7);

          if (question.options && question.options.length > 0) {
            question.options.forEach((option, oIndex) => {
              const optionText = `   ${String.fromCharCode(65 + oIndex)}. ${option}`;
              doc.text(optionText, margin, yPosition);
              yPosition += 7;
            });
          }
          yPosition += 5;
        });
      }

      yPosition += 10;
    });

    // Add certificate template if requested
    if (options.includeCertificates) {
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Certificate of Completion', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('This is to certify that', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('[Student Name]', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('has successfully completed the course', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(course.title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    }

    return doc.output('blob');
  }

  async exportToPowerPoint(course: Course, options: {
    includeQuizzes?: boolean;
    branding?: {
      logo?: string;
      colors?: {
        primary: string;
        secondary: string;
      };
    };
  } = {}): Promise<Blob> {
    // This would use a library like PptxGenJS for PowerPoint generation
    // For now, we'll return a mock blob
    const pptxContent = this.generatePowerPointContent(course, options);
    
    // In a real implementation, you would use PptxGenJS:
    // const pptx = new PptxGenJS();
    // ... add slides and content
    // return pptx.write('blob');

    // Mock implementation
    const blob = new Blob([pptxContent], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    return blob;
  }

  private generatePowerPointContent(course: Course, options: any): string {
    // Mock PowerPoint content generation
    return `PowerPoint content for ${course.title}`;
  }

  async exportToSCORM(course: Course): Promise<Blob> {
    // SCORM export would generate a zip file with SCORM-compliant content
    // This is a complex implementation that would require SCORM packaging
    
    const scormContent = this.generateSCORMContent(course);
    const blob = new Blob([scormContent], { type: 'application/zip' });
    return blob;
  }

  private generateSCORMContent(course: Course): string {
    // Mock SCORM content generation
    return `SCORM package for ${course.title}`;
  }

  async generateCertificate(course: Course, studentName: string, completionDate: Date): Promise<Blob> {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add border
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Add title
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('Certificate of Completion', pageWidth / 2, 60, { align: 'center' });

    // Add decorative line
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 50, 80, pageWidth / 2 + 50, 80);

    // Add student name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', pageWidth / 2, 120, { align: 'center' });

    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(studentName, pageWidth / 2, 150, { align: 'center' });

    // Add course completion text
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed the course', pageWidth / 2, 180, { align: 'center' });

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(course.title, pageWidth / 2, 210, { align: 'center' });

    // Add date
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(`Completed on: ${completionDate.toLocaleDateString()}`, pageWidth / 2, 250, { align: 'center' });

    // Add signature line
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 60, 280, pageWidth / 2 + 60, 280);
    doc.setFontSize(12);
    doc.text('Instructor Signature', pageWidth / 2, 290, { align: 'center' });

    return doc.output('blob');
  }
}

export const exportService = new ExportService(); 