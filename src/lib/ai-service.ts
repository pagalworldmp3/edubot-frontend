import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { GenerationRequest, Course, Module, Lesson, Quiz, Question } from '@/types';

class AIService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;
  private anthropic: Anthropic | null = null;

  constructor() {
    // Initialize AI clients based on environment variables
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (process.env.GOOGLE_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async generateCourse(request: GenerationRequest): Promise<Course> {
    const startTime = Date.now();
    let tokensUsed = 0;
    let cost = 0;

    try {
      // Generate course structure based on AI model
      let courseData: any;
      
      switch (request.aiModel) {
        case 'gpt-4':
        case 'gpt-3.5-turbo':
          courseData = await this.generateWithOpenAI(request);
          break;
        case 'gemini-pro':
          courseData = await this.generateWithGemini(request);
          break;
        case 'claude-3':
        case 'claude-3-sonnet':
          courseData = await this.generateWithClaude(request);
          break;
        default:
          throw new Error(`Unsupported AI model: ${request.aiModel}`);
      }

      const generationTime = Date.now() - startTime;

      // Create course object
      const course: Course = {
        id: this.generateId(),
        title: request.title,
        description: courseData.description,
        level: request.level,
        language: request.language,
        modules: courseData.modules,
        learningOutcomes: courseData.learningOutcomes,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '', // Will be set by the calling function
        tags: courseData.tags || [],
        estimatedDuration: courseData.estimatedDuration || 0,
      };

      return course;
    } catch (error) {
      console.error('Error generating course:', error);
      throw new Error(`Failed to generate course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateWithOpenAI(request: GenerationRequest): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    const prompt = this.buildCourseGenerationPrompt(request);
    
    const response = await this.openai.chat.completions.create({
      model: request.aiModel,
      messages: [
        {
          role: 'system',
          content: 'You are an expert course designer and educator. Create comprehensive, engaging courses with proper structure, learning objectives, and assessments.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return this.parseAIResponse(content);
  }

  private async generateWithGemini(request: GenerationRequest): Promise<any> {
    if (!this.gemini) {
      throw new Error('Gemini client not initialized');
    }

    const prompt = this.buildCourseGenerationPrompt(request);
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    if (!content) {
      throw new Error('No response from Gemini');
    }

    return this.parseAIResponse(content);
  }

  private async generateWithClaude(request: GenerationRequest): Promise<any> {
    if (!this.anthropic) {
      throw new Error('Anthropic client not initialized');
    }

    const prompt = this.buildCourseGenerationPrompt(request);
    
    const response = await this.anthropic.messages.create({
      model: request.aiModel,
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
    });

    const content = response.content[0]?.text;
    if (!content) {
      throw new Error('No response from Claude');
    }

    return this.parseAIResponse(content);
  }

  private buildCourseGenerationPrompt(request: GenerationRequest): string {
    const levelDescriptions = {
      beginner: 'suitable for people with no prior knowledge',
      intermediate: 'suitable for people with basic knowledge',
      expert: 'suitable for advanced learners and professionals'
    };

    const languageInstructions = request.language !== 'English' 
      ? `Generate the course content in ${request.language}.` 
      : '';

    return `
Create a comprehensive course on "${request.title}"${request.description ? ` about: ${request.description}` : ''}.

Course Requirements:
- Level: ${levelDescriptions[request.level]}
- Language: ${request.language}
- Include ${request.includeQuizzes ? 'quizzes for each module' : 'no quizzes'}
- Include ${request.includeAssignments ? 'practical assignments' : 'no assignments'}
${request.customInstructions ? `- Additional instructions: ${request.customInstructions}` : ''}

${languageInstructions}

Please provide the response in the following JSON format:
{
  "description": "A comprehensive description of the course",
  "learningOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
  "estimatedDuration": 120,
  "tags": ["tag1", "tag2", "tag3"],
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description",
      "order": 1,
      "lessons": [
        {
          "title": "Lesson Title",
          "content": "Detailed lesson content with examples and explanations",
          "duration": 15,
          "order": 1
        }
      ],
      "quiz": {
        "title": "Module Quiz",
        "questions": [
          {
            "question": "Question text?",
            "type": "multiple-choice",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A",
            "explanation": "Explanation of why this is correct"
          }
        ],
        "passingScore": 70
      }
    }
  ]
}

Make sure the content is engaging, practical, and follows educational best practices. Include real-world examples and practical applications where appropriate.
    `.trim();
  }

  private parseAIResponse(content: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and structure the response
      return {
        description: parsed.description || '',
        learningOutcomes: parsed.learningOutcomes || [],
        estimatedDuration: parsed.estimatedDuration || 0,
        tags: parsed.tags || [],
        modules: this.validateAndStructureModules(parsed.modules || [])
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  private validateAndStructureModules(modules: any[]): Module[] {
    return modules.map((module, index) => ({
      id: this.generateId(),
      title: module.title || `Module ${index + 1}`,
      description: module.description || '',
      order: module.order || index + 1,
      lessons: this.validateAndStructureLessons(module.lessons || []),
      quiz: this.validateAndStructureQuiz(module.quiz || {})
    }));
  }

  private validateAndStructureLessons(lessons: any[]): Lesson[] {
    return lessons.map((lesson, index) => ({
      id: this.generateId(),
      title: lesson.title || `Lesson ${index + 1}`,
      content: lesson.content || '',
      duration: lesson.duration || 15,
      order: lesson.order || index + 1,
      resources: lesson.resources || []
    }));
  }

  private validateAndStructureQuiz(quiz: any): Quiz {
    return {
      id: this.generateId(),
      title: quiz.title || 'Module Quiz',
      questions: this.validateAndStructureQuestions(quiz.questions || []),
      passingScore: quiz.passingScore || 70,
      timeLimit: quiz.timeLimit || 30
    };
  }

  private validateAndStructureQuestions(questions: any[]): Question[] {
    return questions.map((question, index) => ({
      id: this.generateId(),
      question: question.question || `Question ${index + 1}`,
      type: question.type || 'multiple-choice',
      options: question.options || [],
      correctAnswer: question.correctAnswer || '',
      explanation: question.explanation || ''
    }));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Method to generate course thumbnail using AI
  async generateThumbnail(courseTitle: string): Promise<string> {
    // This would integrate with an image generation service like DALL-E
    // For now, return a placeholder
    return `https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=${encodeURIComponent(courseTitle)}`;
  }

  // Method to generate YouTube video recommendations
  async generateVideoRecommendations(topic: string): Promise<string[]> {
    // This would integrate with YouTube API
    // For now, return placeholder recommendations
    return [
      `https://www.youtube.com/watch?v=example1&q=${encodeURIComponent(topic)}`,
      `https://www.youtube.com/watch?v=example2&q=${encodeURIComponent(topic)}`,
      `https://www.youtube.com/watch?v=example3&q=${encodeURIComponent(topic)}`
    ];
  }

  // Method to generate certificate content
  async generateCertificate(courseTitle: string, studentName: string): Promise<string> {
    const prompt = `
Generate a professional certificate text for:
Course: ${courseTitle}
Student: ${studentName}

The certificate should be formal, professional, and include:
- Recognition of completion
- Course title
- Student name
- Date
- Signature line for instructor
    `;

    // This would use the same AI service as course generation
    return `This is to certify that ${studentName} has successfully completed the course "${courseTitle}" on ${new Date().toLocaleDateString()}.`;
  }
}

export const aiService = new AIService(); 