'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IngredientSelectorProps {
  value: string; // Comma-separated string
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function IngredientSelector({
  value,
  onChange,
  label = "Ingredients",
  placeholder = "Type to search ingredients...",
  className
}: IngredientSelectorProps) {
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  // Fetch all unique ingredients from database
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('ingredients')
          .not('ingredients', 'is', null);

        if (error) throw error;

        // Parse and deduplicate ingredients
        const allIngredientsSet = new Set<string>();
        
        data?.forEach((item) => {
          if (item.ingredients) {
            // Split by comma and clean up each ingredient
            const ingredients = item.ingredients
              .split(',')
              .map(ingredient => ingredient.trim())
              .filter(ingredient => ingredient.length > 0);
            
            ingredients.forEach(ingredient => allIngredientsSet.add(ingredient));
          }
        });

        setAllIngredients(Array.from(allIngredientsSet).sort());
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchIngredients();
  }, [supabase]);

  // Convert comma-separated string to array when value changes
  useEffect(() => {
    if (value) {
      const ingredients = value
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0);
      setSelectedIngredients(ingredients);
    } else {
      setSelectedIngredients([]);
    }
  }, [value]);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allIngredients.filter(ingredient =>
        ingredient.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedIngredients.includes(ingredient)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue, allIngredients, selectedIngredients]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addIngredient = (ingredient: string) => {
    if (!ingredient.trim()) return;
    
    const trimmed = ingredient.trim();
    if (selectedIngredients.includes(trimmed)) return;

    const newIngredients = [...selectedIngredients, trimmed];
    setSelectedIngredients(newIngredients);
    onChange(newIngredients.join(', '));
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeIngredient = (ingredientToRemove: string) => {
    const newIngredients = selectedIngredients.filter(
      ingredient => ingredient !== ingredientToRemove
    );
    setSelectedIngredients(newIngredients);
    onChange(newIngredients.join(', '));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addIngredient(inputValue);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setInputValue('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      
      {/* Selected ingredients as tags */}
      {selectedIngredients.length > 0 && (
        <div className="flex flex-wrap gap-1 p-2 min-h-[40px] bg-muted/50 rounded-md border">
          {selectedIngredients.map((ingredient, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {ingredient}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeIngredient(ingredient)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input with autocomplete */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (inputValue.trim()) {
                addIngredient(inputValue);
              }
            }}
            disabled={!inputValue.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.slice(0, 10).map((ingredient, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-muted focus:bg-muted focus:outline-none text-sm"
                onClick={() => addIngredient(ingredient)}
              >
                {ingredient}
              </button>
            ))}
            {filteredSuggestions.length > 10 && (
              <div className="px-3 py-2 text-xs text-muted-foreground border-t">
                Showing first 10 results...
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Type ingredient names and press Enter or click + to add. Click on existing ingredients to select them.
      </p>
    </div>
  );
}
