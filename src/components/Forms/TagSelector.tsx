
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TagSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const popularTags = [
  'react', 'javascript', 'typescript', 'python', 'java', 'node.js', 
  'css', 'html', 'angular', 'vue', 'php', 'sql', 'mongodb', 'postgresql',
  'express', 'nextjs', 'graphql', 'firebase', 'aws', 'docker'
];

export function TagSelector({ value, onChange, placeholder, maxTags = 5 }: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = popularTags.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(tag)
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, value]);

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !value.includes(normalizedTag) && value.length < maxTags) {
      onChange([...value, normalizedTag]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="min-h-[40px] border rounded-md p-2 bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-2 items-center">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="pl-2 pr-1">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {value.length < maxTags && (
            <div className="flex-1 min-w-[120px]">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : ''}
                className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 max-h-48 overflow-y-auto">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-accent transition-colors text-sm"
              onClick={() => addTag(tag)}
            >
              <Plus className="h-3 w-3 inline mr-2 text-muted-foreground" />
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-1">
        {value.length}/{maxTags} tags • Press Enter or comma to add
      </div>
    </div>
  );
}
