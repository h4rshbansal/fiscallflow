"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { categories as initialCategories } from "@/lib/data";
import type { Category } from "@/lib/types";
import { GraduationCap, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories.filter(c => c.name !== 'Salary'));
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Category name cannot be empty." });
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
        toast({ variant: "destructive", title: "Error", description: "Category already exists." });
        return;
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      icon: GraduationCap, // Default icon
      color: `hsl(${Math.random() * 360}, 90%, 70%)`, // Random color
    };

    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName("");
    toast({ title: "Success", description: "Category added." });
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast({ title: "Success", description: "Category removed." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your transaction categories. This will affect budgeting and reporting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input 
              placeholder="New category name" 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={handleAddCategory}>Add Category</Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Your Categories</h3>
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
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is how others will see you on the site.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Profile settings will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
