
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Tag, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/Layout/Navbar';
import { RichTextEditor } from '@/components/Editor/RichTextEditor';
import { TagSelector } from '@/components/Forms/TagSelector';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const tips = [
  {
    icon: HelpCircle,
    title: 'Write a clear title',
    description: 'Summarize your problem in a one-line question.'
  },
  {
    icon: Lightbulb,
    title: 'Include details',
    description: 'What did you try? What exactly is the problem?'
  },
  {
    icon: Tag,
    title: 'Add relevant tags',
    description: 'Help others find your question by adding appropriate tags.'
  }
];

export default function AskQuestion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to ask a question');
      navigate('/login');
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (tags.length === 0) {
      toast.error('Please add at least one tag');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Question posted successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to post question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You need to be logged in to ask a question.</p>
              <Button asChild>
                <a href="/login">Log In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Button>
            <h1 className="text-3xl font-bold mb-2">Ask a Question</h1>
            <p className="text-muted-foreground">
              Share your knowledge and help the community grow
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Question Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="title"
                        placeholder="e.g., How to implement JWT authentication in React?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg"
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Be specific and imagine you're asking a question to another person
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Provide details about your question. What did you try? What exactly is the problem?"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Include code snippets, error messages, and any relevant context
                      </p>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tags <span className="text-red-500">*</span>
                      </label>
                      <TagSelector
                        value={tags}
                        onChange={setTags}
                        placeholder="Add tags (e.g., react, javascript, typescript)"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Add up to 5 tags to describe what your question is about
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="min-w-32"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Question'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Writing Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <tip.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['react', 'javascript', 'typescript', 'python', 'node.js', 'css', 'html', 'api'].map((tag) => (
                      <Badge 
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => {
                          if (!tags.includes(tag) && tags.length < 5) {
                            setTags([...tags, tag]);
                          }
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
