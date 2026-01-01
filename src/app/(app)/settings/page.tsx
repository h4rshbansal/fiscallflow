
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { categories as initialCategories } from "@/lib/data";
import type { Category } from "@/lib/types";
import { GraduationCap, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/language-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      // De-serialize the categories, converting icon strings back to components
      const parsedCategories = JSON.parse(savedCategories).map((cat: any) => ({...cat, icon: GraduationCap}));
      setCategories(parsedCategories);
    } else {
      setCategories(initialCategories.filter(c => c.name !== 'Salary'));
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      // We need to serialize the icon component to a string
      const categoriesToSave = categories.map(({ icon, ...rest }) => ({...rest, icon: 'GraduationCap' }));
      localStorage.setItem('categories', JSON.stringify(categoriesToSave));
    }
  }, [categories]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ variant: "destructive", title: t('settings.errors.category_empty.title'), description: t('settings.errors.category_empty.description') });
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
        toast({ variant: "destructive", title: t('settings.errors.category_exists.title'), description: t('settings.errors.category_exists.description') });
        return;
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      icon: GraduationCap, // Default icon
      color: `hsl(${Math.random() * 360}, 90%, 70%)`, // Random color
      type: 'expense'
    };

    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName("");
    toast({ title: t('settings.success.category_added.title'), description: t('settings.success.category_added.description') });
  };

  const handleRemoveCategory = (id: string) => {
    // Prevent deleting categories that are in use
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions);
      const categoryToDelete = categories.find(c => c.id === id);
      if (transactions.some((t: any) => t.category === categoryToDelete?.name)) {
        toast({
          variant: "destructive",
          title: "Cannot delete category",
          description: "This category is being used by one or more transactions.",
        });
        return;
      }
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    toast({ title: t('settings.success.category_removed.title'), description: t('settings.success.category_removed.description') });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.description')}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.categories.title')}</CardTitle>
          <CardDescription>{t('settings.categories.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input 
              placeholder={t('settings.categories.new_category_placeholder')}
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={handleAddCategory}>{t('settings.categories.add_category_button')}</Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t('settings.categories.your_categories_label')}</h3>
            <ul className="rounded-md border">
              {categories.map(category => (
                <li key={category.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <category.icon className="h-5 w-5" style={{ color: category.color }} />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveCategory(category.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.preferences.title')}</CardTitle>
          <CardDescription>{t('settings.preferences.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.preferences.language_label')}</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
