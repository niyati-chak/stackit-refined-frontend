
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Calendar, Award, MessageCircle, ThumbsUp, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/Layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const mockUserProfile = {
  id: '1',
  username: 'john_doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  reputation: 1250,
  location: 'San Francisco, CA',
  joinedAt: '2023-06-15T10:00:00Z',
  bio: 'Full-stack developer passionate about React, TypeScript, and building great user experiences. Always learning and sharing knowledge with the community.',
  stats: {
    questionsAsked: 23,
    answersGiven: 45,
    helpfulVotes: 189,
    profileViews: 1432
  },
  badges: [
    { name: 'Good Question', count: 5, color: 'bg-green-500' },
    { name: 'Nice Answer', count: 12, color: 'bg-blue-500' },
    { name: 'Popular Question', count: 3, color: 'bg-yellow-500' },
    { name: 'Helpful', count: 8, color: 'bg-purple-500' }
  ]
};

const mockUserQuestions = [
  {
    id: '1',
    title: 'How to implement JWT authentication in React with TypeScript?',
    votes: 15,
    answers: 3,
    views: 234,
    createdAt: '2024-01-15T10:30:00Z',
    status: 'answered'
  },
  {
    id: '2',
    title: 'Best practices for state management in large React applications?',
    votes: 8,
    answers: 2,
    views: 156,
    createdAt: '2024-01-10T14:20:00Z',
    status: 'open'
  }
];

const mockUserAnswers = [
  {
    id: '1',
    questionTitle: 'How to optimize React performance?',
    votes: 22,
    accepted: true,
    createdAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '2',
    questionTitle: 'Understanding TypeScript generics',
    votes: 14,
    accepted: false,
    createdAt: '2024-01-08T11:30:00Z'
  }
];

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const isOwnProfile = user?.id === mockUserProfile.id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24 mx-auto md:mx-0">
                  <AvatarImage src={mockUserProfile.avatar} />
                  <AvatarFallback className="text-2xl">
                    {mockUserProfile.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold">{mockUserProfile.username}</h1>
                    {isOwnProfile && (
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center justify-center md:justify-start gap-1">
                      <MapPin className="h-4 w-4" />
                      {mockUserProfile.location}
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDistanceToNow(new Date(mockUserProfile.joinedAt), { addSuffix: true })}
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-1">
                      <Award className="h-4 w-4" />
                      {mockUserProfile.reputation} reputation
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">{mockUserProfile.bio}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {mockUserProfile.stats.questionsAsked}
                </div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {mockUserProfile.stats.answersGiven}
                </div>
                <div className="text-sm text-muted-foreground">Answers</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {mockUserProfile.stats.helpfulVotes}
                </div>
                <div className="text-sm text-muted-foreground">Helpful Votes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {mockUserProfile.stats.profileViews}
                </div>
                <div className="text-sm text-muted-foreground">Profile Views</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="answers">Answers</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Recent Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUserQuestions.slice(0, 3).map((question) => (
                        <div key={question.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                          <Link 
                            to={`/question/${question.id}`}
                            className="font-medium hover:text-primary transition-colors line-clamp-2"
                          >
                            {question.title}
                          </Link>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {question.votes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {question.answers}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {question.views}
                            </span>
                            <Badge variant={question.status === 'answered' ? 'default' : 'secondary'} className="text-xs">
                              {question.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Answers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Recent Answers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUserAnswers.slice(0, 3).map((answer) => (
                        <div key={answer.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                          <Link 
                            to="#"
                            className="font-medium hover:text-primary transition-colors line-clamp-2"
                          >
                            {answer.questionTitle}
                          </Link>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {answer.votes}
                            </span>
                            {answer.accepted && (
                              <Badge variant="default" className="text-xs bg-green-500">
                                Accepted
                              </Badge>
                            )}
                            <span>{formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Questions ({mockUserQuestions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockUserQuestions.map((question) => (
                      <div key={question.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                        <Link 
                          to={`/question/${question.id}`}
                          className="text-lg font-semibold hover:text-primary transition-colors"
                        >
                          {question.title}
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {question.votes} votes
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {question.answers} answers
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {question.views} views
                          </span>
                          <Badge variant={question.status === 'answered' ? 'default' : 'secondary'}>
                            {question.status}
                          </Badge>
                          <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="answers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Answers ({mockUserAnswers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockUserAnswers.map((answer) => (
                      <div key={answer.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                        <Link 
                          to="#"
                          className="text-lg font-semibold hover:text-primary transition-colors"
                        >
                          {answer.questionTitle}
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {answer.votes} votes
                          </span>
                          {answer.accepted && (
                            <Badge variant="default" className="bg-green-500">
                              Accepted Answer
                            </Badge>
                          )}
                          <span>{formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Badges & Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockUserProfile.badges.map((badge) => (
                      <div key={badge.name} className="flex items-center gap-3 p-4 border rounded-lg">
                        <div className={`h-10 w-10 rounded-full ${badge.color} flex items-center justify-center`}>
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">{badge.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Earned {badge.count} {badge.count === 1 ? 'time' : 'times'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
