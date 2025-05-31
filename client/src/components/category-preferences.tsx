import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save } from "lucide-react";

interface CategoryRule {
  id: string;
  domain: string;
  category: string;
  reason: string;
}

interface CategoryPreferencesProps {
  onSave: (rules: CategoryRule[]) => void;
  existingRules: CategoryRule[];
}

export function CategoryPreferences({ onSave, existingRules }: CategoryPreferencesProps) {
  const [rules, setRules] = useState<CategoryRule[]>(existingRules);
  const [newDomain, setNewDomain] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const categories = [
    { value: 'call-me', label: 'Call Me - Urgent notifications', color: 'bg-red-500' },
    { value: 'remind-me', label: 'Remind Me - Important but can wait', color: 'bg-blue-500' },
    { value: 'keep-quiet', label: 'Keep Quiet - No notifications', color: 'bg-gray-500' },
    { value: 'newsletter', label: 'Newsletter - Summarize in calls', color: 'bg-green-500' },
    { value: 'why-did-i-signup', label: 'Why Subscribe - Consider unsubscribing', color: 'bg-yellow-500' },
    { value: 'dont-tell-anyone', label: 'Personal - Private handling', color: 'bg-purple-500' }
  ];

  const addRule = () => {
    if (newDomain && newCategory) {
      const rule: CategoryRule = {
        id: Date.now().toString(),
        domain: newDomain,
        category: newCategory,
        reason: 'user_defined'
      };
      setRules([...rules, rule]);
      setNewDomain("");
      setNewCategory("");
    }
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.value === category)?.color || 'bg-gray-500';
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Email Categorization Rules</CardTitle>
        <CardDescription>
          Set custom rules for how emails from specific domains should be categorized.
          These rules override AI decisions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Rule */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium">Domain</label>
            <Input
              placeholder="e.g., gmail.com, linkedin.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">Category</label>
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addRule} disabled={!newDomain || !newCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </div>

        {/* Existing Rules */}
        <div className="space-y-3">
          <h4 className="font-medium">Active Rules ({rules.length})</h4>
          {rules.length === 0 ? (
            <p className="text-gray-500 text-sm">No custom rules defined. AI will categorize all emails automatically.</p>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {rule.domain}
                  </Badge>
                  <span className="text-sm">→</span>
                  <Badge className={`${getCategoryColor(rule.category)} text-white`}>
                    {getCategoryLabel(rule.category)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRule(rule.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t">
          <Button onClick={() => onSave(rules)} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Categorization Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}