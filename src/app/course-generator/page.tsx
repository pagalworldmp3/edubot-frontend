'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Brain, 
  Globe, 
  Target, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  Loader2,
  Eye,
  Download,
  Share2,
  Settings,
  Zap,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { GenerationRequest, Course } from '@/types';
import { aiService } from '@/lib/ai-service';

export default function CourseGeneratorPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<Course | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<GenerationRequest>({
    title: '',
    description: '',
    level: 'beginner',
    language: 'English',
    aiModel: 'gpt-4',
    includeQuizzes: true,
    includeAssignments: true,
    customInstructions: ''
  });

  const aiModels = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'Most advanced model for complex courses' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and cost-effective' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Excellent for technical content' },
    { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', description: 'Great for educational content' }
  ];

  const levels = [
    { id: 'beginner', name: 'Beginner', description: 'No prior knowledge required' },
    { id: 'intermediate', name: 'Intermediate', description: 'Basic knowledge assumed' },
    { id: 'expert', name: 'Expert', description: 'Advanced concepts and techniques' }
  ];

  const languages = [
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Portuguese'
  ];

  const handleInputChange = (field: keyof GenerationRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateCourse = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a course title');
      return;
    }

    setIsGenerating(true);
    try {
      const course = await aiService.generateCourse(formData);
      setGeneratedCourse(course);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating course:', error);
      alert('Failed to generate course. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!generatedCourse) return;

    try {
      // Here you would save the course to your database
      console.log('Saving course:', generatedCourse);
      alert('Course saved successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    }
  };

  const handleExportCourse = (format: 'pdf' | 'ppt') => {
    if (!generatedCourse) return;
    
    // Here you would implement export functionality
    console.log(`Exporting course as ${format.toUpperCase()}`);
    alert(`${format.toUpperCase()} export started!`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Course Generator
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Create professional courses with AI in minutes
                </p>
              </div>
            </div>
            {generatedCourse && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn-secondary flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                <button
                  onClick={handleSaveCourse}
                  className="btn-primary flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Course Generation Form */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Course Details
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Provide basic information about your course
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Introduction to React Development"
                    className="input-field"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of what the course will cover..."
                    rows={3}
                    className="input-field"
                    disabled={isGenerating}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="input-field"
                      disabled={isGenerating}
                    >
                      {levels.map(level => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="input-field"
                      disabled={isGenerating}
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI Configuration
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Choose your AI model and generation options
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI Model
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {aiModels.map(model => (
                      <label key={model.id} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="radio"
                          name="aiModel"
                          value={model.id}
                          checked={formData.aiModel === model.id}
                          onChange={(e) => handleInputChange('aiModel', e.target.value)}
                          className="mr-3"
                          disabled={isGenerating}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {model.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {model.provider}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {model.description}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.includeQuizzes}
                      onChange={(e) => handleInputChange('includeQuizzes', e.target.checked)}
                      className="mr-3"
                      disabled={isGenerating}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Include quizzes for each module
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.includeAssignments}
                      onChange={(e) => handleInputChange('includeAssignments', e.target.checked)}
                      className="mr-3"
                      disabled={isGenerating}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Include practical assignments
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Instructions (Optional)
                  </label>
                  <textarea
                    value={formData.customInstructions}
                    onChange={(e) => handleInputChange('customInstructions', e.target.value)}
                    placeholder="Any specific requirements or preferences for the course content..."
                    rows={3}
                    className="input-field"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateCourse}
              disabled={isGenerating || !formData.title.trim()}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Course...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Generate Course with AI
                </>
              )}
            </button>
          </div>

          {/* Course Preview */}
          <div className="space-y-6">
            {showPreview && generatedCourse ? (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Course Preview
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Review your generated course
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleExportCourse('pdf')}
                      className="btn-secondary flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleExportCourse('ppt')}
                      className="btn-secondary flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PPT
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {generatedCourse.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {generatedCourse.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {generatedCourse.level}
                      </span>
                      <span className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        {generatedCourse.language}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {Math.round(generatedCourse.estimatedDuration / 60)}h
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Learning Outcomes
                    </h4>
                    <ul className="space-y-2">
                      {generatedCourse.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Course Modules ({generatedCourse.modules.length})
                    </h4>
                    <div className="space-y-3">
                      {generatedCourse.modules.map((module, index) => (
                        <div key={module.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            Module {index + 1}: {module.title}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {module.description}
                          </p>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {module.lessons.length} lessons • {module.quiz.questions.length} quiz questions
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {generatedCourse.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedCourse.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Course Preview
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Generate a course to see the preview here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 