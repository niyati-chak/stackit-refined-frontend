
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MessageCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/Layout/Navbar';
import { formatDistanceToNow } from 'date-fns';

// Mock data (same as Index page)
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
  stats: {
    votes: number;
    answers: number;
    views: number;
  };
  createdAt: string;
  hasAcceptedAnswer: boolean;
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
    stats: { votes: 15, answers: 3, views: 234 },
    createdAt: '2024-01-15T10:30:00Z',
    hasAcceptedAnswer: true
  },
  {
    id: '2',
    title: 'Best practices for React component optimization',
    description: 'What are the most effective ways to optimize React components for better performance? Should I use memo, useMemo, or useCallback?',
    tags: ['react', 'performance', 'optimization'],
    author: {
      username: 'jane_smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b85b4b49?w=150&h=150&fit=crop&crop=face',
      reputation: 890
    },
    stats: { votes: 8, answers: 5, views: 156 },
    createdAt: '2024-01-14T16:45:00Z',
    hasAcceptedAnswer: false
  },
  {
    id: '3',
    title: 'TypeScript interface vs type alias - when to use which?',
    description: 'I\'m confused about when to use interfaces vs type aliases in TypeScript. Can someone explain the differences and provide examples?',
    tags: ['typescript', 'interfaces', 'types'],
    author: {
      username: 'mike_wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      reputation: 2100
    },
    stats: { votes: 22, answers: 7, views: 445 },
    createdAt: '2024-01-13T12:15:00Z',
    hasAcceptedAnswer: true
  }
];

export default function Questions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');

  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = mockQuestions;

    // Filter by tab
    switch (activeTab) {
      case 'unanswered':
        filtered = mockQuestions.filter(q => q.stats.answers === 0);
        break;
      case 'answered':
        filtered = mockQuestions.filter(q => q.stats.answers > 0);
        break;
      case 'accepted':
        filtered = mockQuestions.filter(q => q.hasAcceptedAnswer);
        break;
      default:
        filtered = mockQuestions;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(question =>
        question.title.toLowerCase().includes(query) ||
        question.description.toLowerCase().includes(query) ||
        question.tags.some(tag => tag.toLowerCase().includes(query)) ||
        question.author.username.toLowerCase().includes(query)
      );
    }

    // Sort questions
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          return b.stats.votes - a.stats.votes;
        case 'answers':
          return b.stats.answers - a.stats.answers;
        case 'views':
          return b.stats.views - a.stats.views;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [searchQuery, sortBy, activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Questions</h1>
            <p className="text-muted-foreground">
              {mockQuestions.length} questions
            </p>
          </div>
          <Button asChild>
            <Link to="/ask">Ask Question</Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                <SelectItem value="votes">Most Votes</SelectItem>
                <SelectItem value="answers">Most Answers</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs for question filtering */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              <TabsTrigger value="answered">Answered</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredAndSortedQuestions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery.trim() 
                  ? "Try adjusting your search terms or filters."
                  : "Be the first to ask a question!"
                }
              </p>
              <Button asChild>
                <Link to="/ask">Ask a Question</Link>
              </Button>
            </div>
          ) : (
            filteredAndSortedQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link 
                        to={`/question/${question.id}`}
                        className="text-lg font-semibold hover:text-primary transition-colors mb-2 block"
                      >
                        {question.title}
                      </Link>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {question.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-medium text-foreground">{question.stats.votes}</div>
                          <div className="text-xs">votes</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-medium flex items-center gap-1 ${question.hasAcceptedAnswer ? 'text-green-600' : 'text-foreground'}`}>
                            {question.stats.answers}
                            {question.hasAcceptedAnswer && <CheckCircle className="h-3 w-3" />}
                          </div>
                          <div className="text-xs">answers</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-foreground">{question.stats.views}</div>
                          <div className="text-xs">views</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={question.author.avatar} />
                        <AvatarFallback className="text-xs">
                          {question.author.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{question.author.username}</span>
                      <Badge variant="outline" className="text-xs">
                        {question.author.reputation}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredAndSortedQuestions.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Questions
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
