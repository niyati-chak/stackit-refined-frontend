import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Hash, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Layout/Navbar';

interface Tag {
  name: string;
  description: string;
  questionCount: number;
  todayCount: number;
  weekCount: number;
}

const mockTags: Tag[] = [
  {
    name: 'react',
    description: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM.',
    questionCount: 1250,
    todayCount: 12,
    weekCount: 89
  },
  {
    name: 'typescript',
    description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
    questionCount: 890,
    todayCount: 8,
    weekCount: 67
  },
  {
    name: 'javascript',
    description: 'JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification.',
    questionCount: 2100,
    todayCount: 25,
    weekCount: 145
  },
  {
    name: 'node.js',
    description: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine for server-side development.',
    questionCount: 756,
    todayCount: 6,
    weekCount: 52
  },
  {
    name: 'python',
    description: 'Python is a high-level, interpreted programming language with dynamic semantics.',
    questionCount: 1456,
    todayCount: 18,
    weekCount: 98
  },
  {
    name: 'css',
    description: 'Cascading Style Sheets (CSS) is a stylesheet language used to describe the presentation of a document.',
    questionCount: 634,
    todayCount: 9,
    weekCount: 43
  },
  {
    name: 'html',
    description: 'HyperText Markup Language (HTML) is the standard markup language for documents designed to be displayed in a web browser.',
    questionCount: 523,
    todayCount: 5,
    weekCount: 34
  },
  {
    name: 'jwt',
    description: 'JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties.',
    questionCount: 234,
    todayCount: 3,
    weekCount: 21
  },
  {
    name: 'authentication',
    description: 'Authentication is the process of verifying the identity of a user, device, or other entity.',
    questionCount: 445,
    todayCount: 7,
    weekCount: 29
  },
  {
    name: 'performance',
    description: 'Performance optimization techniques and best practices for web applications.',
    questionCount: 356,
    todayCount: 4,
    weekCount: 25
  }
];

export default function Tags() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const handleTagClick = (tagName: string) => {
    navigate(`/questions?tag=${encodeURIComponent(tagName)}`);
  };

  const filteredAndSortedTags = useMemo(() => {
    let filtered = mockTags;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = mockTags.filter(tag =>
        tag.name.toLowerCase().includes(query) ||
        tag.description.toLowerCase().includes(query)
      );
    }

    // Sort tags
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'new':
          return b.todayCount - a.todayCount;
        case 'popular':
        default:
          return b.questionCount - a.questionCount;
      }
    });

    return sorted;
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tags</h1>
            <p className="text-muted-foreground">
              A tag is a keyword or label that categorizes your question with other, similar questions.
            </p>
          </div>
          <Button asChild>
            <Link to="/ask">Ask Question</Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by tag name..."
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
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedTags.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tags found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms.
              </p>
            </div>
          ) : (
            filteredAndSortedTags.map((tag) => (
              <Card 
                key={tag.name} 
                className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => handleTagClick(tag.name)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {tag.name}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      +{tag.todayCount}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {tag.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{tag.questionCount} questions</span>
                    <span>{tag.weekCount} asked this week</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Popular Tags Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Popular Tags</h2>
          <div className="flex flex-wrap gap-2">
            {mockTags
              .sort((a, b) => b.questionCount - a.questionCount)
              .slice(0, 20)
              .map((tag) => (
                <Badge 
                  key={tag.name} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleTagClick(tag.name)}
                >
                  {tag.name} ({tag.questionCount})
                </Badge>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
