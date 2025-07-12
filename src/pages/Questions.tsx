import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, ThumbsUp, ThumbsDown, MessageCircle, Eye, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    username: string;
    avatar?: string;
    reputation: number;
  };
  votes: number;
  answers: number;
  views: number;
  createdAt: string;
}

const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to implement JWT authentication in React with TypeScript?',
    description: 'I\'m trying to set up JWT authentication in my React app using TypeScript. I need to handle token storage, refresh tokens, and protect routes. What\'s the best approach for this?',
    tags: ['react', 'typescript', 'jwt', 'authentication'],
    author: {
      username: 'john_doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      reputation: 1250
    },
    votes: 15,
    answers: 3,
    views: 234,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Best practices for state management in large React applications?',
    description: 'I\'m working on a large React application and struggling with state management. Should I use Redux, Zustand, or Context API? What are the pros and cons of each approach?',
    tags: ['react', 'state-management', 'redux', 'context-api'],
    author: {
      username: 'jane_smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b85b4b49?w=150&h=150&fit=crop&crop=face',
      reputation: 890
    },
    votes: 8,
    answers: 2,
    views: 156,
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    title: 'How to optimize database queries in Node.js with PostgreSQL?',
    description: 'My Node.js application is experiencing slow database queries with PostgreSQL. I\'m using Prisma as an ORM. What are some optimization techniques I can apply?',
    tags: ['node.js', 'postgresql', 'prisma', 'performance'],
    author: {
      username: 'mike_wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      reputation: 2100
    },
    votes: 12,
    answers: 5,
    views: 342,
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Understanding CSS Grid vs Flexbox - When to use which?',
    description: 'I\'m confused about when to use CSS Grid versus Flexbox for layouts. Can someone explain the key differences and provide examples of when each is most appropriate?',
    tags: ['css', 'flexbox', 'grid', 'layout'],
    author: {
      username: 'sarah_jones',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      reputation: 756
    },
    votes: 6,
    answers: 4,
    views: 189,
    createdAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    title: 'Python async/await best practices for web scraping',
    description: 'I\'m building a web scraper in Python and want to use async/await for better performance. What are the best practices and common pitfalls to avoid?',
    tags: ['python', 'async', 'web-scraping', 'performance'],
    author: {
      username: 'alex_dev',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      reputation: 1456
    },
    votes: 9,
    answers: 1,
    views: 278,
    createdAt: '2024-01-11T11:30:00Z'
  }
];

export default function Questions() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  
  const tagFilter = searchParams.get('tag');

  useEffect(() => {
    if (tagFilter) {
      setSearchQuery(''); // Clear search when filtering by tag
    }
  }, [tagFilter]);

  const handleVote = (questionId: string, type: 'up' | 'down') => {
    if (!isAuthenticated) {
      toast.error('Please log in to vote');
      return;
    }
    
    setUserVotes(prev => ({
      ...prev,
      [questionId]: prev[questionId] === type ? null : type
    }));
    
    toast.success(`${type === 'up' ? 'Upvoted' : 'Downvoted'} successfully`);
  };

  const clearTagFilter = () => {
    setSearchParams({});
  };

  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = mockQuestions;

    // Filter by tag if specified
    if (tagFilter) {
      filtered = mockQuestions.filter(q => 
        q.tags.some(tag => tag.toLowerCase() === tagFilter.toLowerCase())
      );
    }
    // Otherwise filter by search query
    else if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = mockQuestions.filter(q =>
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort questions
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'votes':
          return b.votes - a.votes;
        case 'views':
          return b.views - a.views;
        case 'answers':
          return b.answers - a.answers;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [searchQuery, sortBy, tagFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {tagFilter ? `Questions tagged with "${tagFilter}"` : 'All Questions'}
            </h1>
            <p className="text-muted-foreground">
              {tagFilter 
                ? `Browse questions related to ${tagFilter}`
                : 'Browse and discover questions from the community'
              }
            </p>
          </div>
          <Button asChild>
            <Link to="/ask">Ask Question</Link>
          </Button>
        </div>

        {/* Tag Filter Display */}
        {tagFilter && (
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtered by tag:</span>
              <Badge variant="secondary" className="flex items-center gap-2">
                {tagFilter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={clearTagFilter}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        {!tagFilter && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="votes">Most Voted</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="answers">Most Answered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {filteredAndSortedQuestions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No questions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            filteredAndSortedQuestions.map((question) => {
              const userVote = userVotes[question.id];
              const adjustedVotes = question.votes + (userVote === 'up' ? 1 : userVote === 'down' ? -1 : 0);
              
              return (
                <Card key={question.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex gap-4">
                      {/* Voting */}
                      <div className="flex flex-col items-center space-y-2">
                        <Button
                          variant={userVote === 'up' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVote(question.id, 'up')}
                          className="h-8 w-8 p-0"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-lg">{adjustedVotes}</span>
                        <Button
                          variant={userVote === 'down' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVote(question.id, 'down')}
                          className="h-8 w-8 p-0"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <Link 
                          to={`/question/${question.id}`}
                          className="text-xl font-semibold hover:text-primary transition-colors mb-2 block"
                        >
                          {question.title}
                        </Link>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {question.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {question.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {question.answers}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={question.author.avatar} />
                              <AvatarFallback className="text-xs">
                                {question.author.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-medium">{question.author.username}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
