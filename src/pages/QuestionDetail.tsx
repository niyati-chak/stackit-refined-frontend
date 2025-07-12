
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, Share, Flag, Check, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/Layout/Navbar';
import { RichTextEditor } from '@/components/Editor/RichTextEditor';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Answer {
  id: string;
  content: string;
  author: {
    username: string;
    avatar?: string;
    reputation: number;
  };
  votes: number;
  createdAt: string;
  isAccepted: boolean;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  author: {
    username: string;
    avatar?: string;
  };
  createdAt: string;
}

const mockQuestion = {
  id: '1',
  title: 'How to implement JWT authentication in React with TypeScript?',
  content: `I'm trying to set up JWT authentication in my React app using TypeScript. I need to handle token storage, refresh tokens, and protect routes. What's the best approach for this?

Here's what I've tried so far:

\`\`\`typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
};
\`\`\`

But I'm not sure if this is the best way to handle token storage and refresh logic.`,
  tags: ['react', 'typescript', 'jwt', 'authentication'],
  author: {
    username: 'john_doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    reputation: 1250
  },
  votes: 15,
  views: 234,
  createdAt: '2024-01-15T10:30:00Z'
};

const mockAnswers: Answer[] = [
  {
    id: '1',
    content: `Here's a comprehensive approach to JWT authentication in React with TypeScript:

## 1. Create an Auth Context

\`\`\`typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
\`\`\`

## 2. Handle Token Storage Securely

Instead of \`localStorage\`, consider using \`httpOnly\` cookies for better security:

\`\`\`typescript
// Server sets httpOnly cookie
res.cookie('token', jwt.sign(payload, secret), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
\`\`\`

## 3. Implement Automatic Token Refresh

\`\`\`typescript
const useTokenRefresh = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('/api/refresh', { credentials: 'include' });
      } catch (error) {
        // Handle refresh failure
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(interval);
  }, []);
};
\`\`\`

This approach is more secure and handles token refresh automatically.`,
    author: {
      username: 'jane_smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b85b4b49?w=150&h=150&fit=crop&crop=face',
      reputation: 890
    },
    votes: 12,
    createdAt: '2024-01-15T14:30:00Z',
    isAccepted: true,
    comments: [
      {
        id: '1',
        content: 'Great explanation! The httpOnly cookie approach is definitely more secure.',
        author: {
          username: 'mike_wilson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        createdAt: '2024-01-15T15:45:00Z'
      }
    ]
  },
  {
    id: '2',
    content: `You can also use libraries like \`react-query\` with \`axios\` interceptors for handling token refresh:

\`\`\`typescript
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refreshToken();
        return axios.request(error.config);
      } catch (refreshError) {
        // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);
\`\`\`

This automatically retries failed requests after refreshing the token.`,
    author: {
      username: 'sarah_jones',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      reputation: 2100
    },
    votes: 8,
    createdAt: '2024-01-15T16:15:00Z',
    isAccepted: false,
    comments: []
  }
];

export default function QuestionDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    if (!isAuthenticated) {
      toast.error('Please log in to vote');
      return;
    }
    
    setUserVote(prev => prev === type ? null : type);
    toast.success(`${type === 'up' ? 'Upvoted' : 'Downvoted'} successfully`);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to answer');
      return;
    }

    if (!newAnswer.trim()) {
      toast.error('Please write your answer');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Answer posted successfully!');
      setNewAnswer('');
    } catch (error) {
      toast.error('Failed to post answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Link>
          </Button>

          {/* Question */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start gap-4">
                {/* Voting */}
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    variant={userVote === 'up' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote('up')}
                    className="h-8 w-8 p-0"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-lg">{mockQuestion.votes + (userVote === 'up' ? 1 : userVote === 'down' ? -1 : 0)}</span>
                  <Button
                    variant={userVote === 'down' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote('down')}
                    className="h-8 w-8 p-0"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-4">{mockQuestion.title}</h1>
                  
                  <div className="prose prose-sm max-w-none dark:prose-invert mb-4">
                    <div dangerouslySetInnerHTML={{ __html: mockQuestion.content.replace(/\n/g, '<br>') }} />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mockQuestion.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {mockQuestion.views} views
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {mockAnswers.length} answers
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4 mr-2" />
                        Flag
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mockQuestion.author.avatar} />
                    <AvatarFallback>
                      {mockQuestion.author.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{mockQuestion.author.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {mockQuestion.author.reputation} reputation
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  asked {formatDistanceToNow(new Date(mockQuestion.createdAt), { addSuffix: true })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card className="mb-8 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">AI Summary</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This question asks about implementing JWT authentication in React with TypeScript. 
                The main concerns are secure token storage, automatic refresh, and route protection. 
                The community suggests using httpOnly cookies for security and implementing automatic token refresh mechanisms.
              </p>
            </CardContent>
          </Card>

          {/* Answers */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold">{mockAnswers.length} Answers</h2>
            
            {mockAnswers.map((answer) => (
              <Card key={answer.id} className={answer.isAccepted ? 'border-green-200 dark:border-green-800' : ''}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {/* Voting */}
                    <div className="flex flex-col items-center space-y-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="font-medium">{answer.votes}</span>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      {answer.isAccepted && (
                        <div className="mt-2">
                          <Check className="h-6 w-6 text-green-600 bg-green-100 dark:bg-green-900 rounded-full p-1" />
                        </div>
                      )}
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1">
                      <div className="prose prose-sm max-w-none dark:prose-invert mb-4">
                        <div dangerouslySetInnerHTML={{ __html: answer.content.replace(/\n/g, '<br>') }} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={answer.author.avatar} />
                            <AvatarFallback className="text-xs">
                              {answer.author.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{answer.author.username}</span>
                          <Badge variant="outline" className="text-xs">
                            {answer.author.reputation}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                        </div>
                      </div>

                      {/* Comments */}
                      {answer.comments.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="space-y-2">
                            {answer.comments.map((comment) => (
                              <div key={comment.id} className="flex items-start gap-2 text-sm">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={comment.author.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {comment.author.username[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <span className="text-muted-foreground">{comment.content}</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    - {comment.author.username} {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button variant="ghost" size="sm" className="mt-2 text-xs">
                            Add comment
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Add Answer */}
          {isAuthenticated ? (
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Your Answer</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <RichTextEditor
                    value={newAnswer}
                    onChange={setNewAnswer}
                    placeholder="Write your answer here..."
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Post Your Answer'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="mb-4">You must be logged in to post an answer.</p>
                <Button asChild>
                  <Link to="/login">Log In</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
