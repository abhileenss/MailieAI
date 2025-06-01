import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Filter, Search, MoreVertical, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface EmailSender {
  id: string;
  name: string;
  email: string;
  domain: string;
  emailCount: number;
  latestSubject: string;
  lastEmailDate: string;
  category: string;
}

interface EmailStats {
  totalSenders: number;
  categoryStats: Record<string, number>;
  categorizedSenders: Record<string, EmailSender[]>;
}

export default function EmailDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: emailData, isLoading } = useQuery<EmailStats>({
    queryKey: ['/api/emails/processed'],
    enabled: true
  });

  const categories = [
    { id: 'call-me', label: 'Call Me', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { id: 'remind-me', label: 'Remind Me', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { id: 'keep-quiet', label: 'Keep Quiet', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { id: 'newsletter', label: 'Newsletter', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { id: 'why-did-i-signup', label: 'Why Did I Signup', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { id: 'dont-tell-anyone', label: 'Don\'t Tell Anyone', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
  ];

  const filteredSenders = emailData?.categorizedSenders 
    ? Object.entries(emailData.categorizedSenders)
        .flatMap(([category, senders]) => 
          selectedCategory && selectedCategory !== category ? [] : senders
        )
        .filter(sender => 
          sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sender.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  const handleUpdateCategory = async (senderId: string, newCategory: string) => {
    try {
      const response = await fetch(`/api/senders/${senderId}/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory })
      });

      if (response.ok) {
        toast({
          title: "Category Updated",
          description: "Sender category has been updated successfully"
        });
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update sender category",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Email Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your {emailData?.totalSenders || 0} email senders
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Test Call
            </Button>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {categories.map(category => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {emailData?.categoryStats[category.id] || 0}
                  </div>
                  <Badge className={category.color} variant="secondary">
                    {category.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search senders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Senders List */}
        <div className="space-y-4">
          {filteredSenders.map(sender => (
            <Card key={sender.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{sender.name}</div>
                      <div className="text-sm text-muted-foreground">{sender.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Latest: "{sender.latestSubject}"
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">{sender.emailCount} emails</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(sender.lastEmailDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Badge 
                      className={categories.find(c => c.id === sender.category)?.color}
                      variant="secondary"
                    >
                      {categories.find(c => c.id === sender.category)?.label}
                    </Badge>
                    
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSenders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No senders found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Connect your Gmail account to see your email senders"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}