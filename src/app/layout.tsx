import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseGenie AI - Premium AI Course Generator",
  description: "Generate professional courses with AI. Create comprehensive learning materials, quizzes, and assignments automatically.",
  keywords: "AI course generator, online learning, course creation, educational technology, e-learning",
  authors: [{ name: "CourseGenie AI" }],
  openGraph: {
    title: "CourseGenie AI - Premium AI Course Generator",
    description: "Generate professional courses with AI. Create comprehensive learning materials, quizzes, and assignments automatically.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
