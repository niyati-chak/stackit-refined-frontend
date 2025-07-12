
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingUp, Users, MessageCircle, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Layout/Navbar';
import { formatDistanceToNow } from 'date-fns';

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

const stats = [
  { label: 'Questions', value: '12.5K', icon: MessageCircle, color: 'text-blue-500' },
  { label: 'Answers', value: '45.2K', icon: Award, color: 'text-green-500' },
  { label: 'Users', value: '8.7K', icon: Users, color: 'text-purple-500' },
  { label: 'Daily Active', value: '2.1K', icon: TrendingUp, color: 'text-orange-500' }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-accent/20">
        <div className="container py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Find answers to your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}coding questions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers sharing knowledge, solving problems, and building the future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/ask">
                  Ask Your Question
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse Questions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-accent/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="votes">Most Votes</SelectItem>
                  <SelectItem value="answers">Most Answers</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {mockQuestions.map((question) => (
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
                        <div className={`font-medium ${question.hasAcceptedAnswer ? 'text-green-600' : 'text-foreground'}`}>
                          {question.stats.answers}
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
                  
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Questions
          </Button>
        </div>
      </main>
    </div>
  );
}
