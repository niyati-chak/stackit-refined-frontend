
import React from 'react';
import { Bell, Check, MessageCircle, ThumbsUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'vote' | 'accept';
  title: string;
  description: string;
  user: {
    username: string;
    avatar?: string;
  };
  createdAt: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'answer',
    title: 'New answer on your question',
    description: 'How to implement JWT authentication in React?',
    user: {
      username: 'jane_smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b85b4b49?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: '2024-01-15T14:30:00Z',
    read: false
  },
  {
    id: '2',
    type: 'vote',
    title: 'Your answer was upvoted',
    description: 'Best practices for React component optimization',
    user: {
      username: 'mike_wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: '2024-01-15T12:15:00Z',
    read: false
  },
  {
    id: '3',
    type: 'accept',
    title: 'Your answer was accepted',
    description: 'TypeScript interface vs type alias',
    user: {
      username: 'sarah_jones',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: '2024-01-14T16:45:00Z',
    read: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'answer':
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case 'vote':
      return <ThumbsUp className="h-4 w-4 text-green-500" />;
    case 'accept':
      return <Award className="h-4 w-4 text-yellow-500" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

export function NotificationPanel() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
        <div className="max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <Button variant="ghost" size="sm" className="text-xs">
                Mark all read
              </Button>
            </div>
          </div>

          <div className="divide-y">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-accent/50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={notification.user.avatar} />
                    <AvatarFallback>
                      {notification.user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.type)}
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {notification.description}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                      <span>by {notification.user.username}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full text-sm">
              View all notifications
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
