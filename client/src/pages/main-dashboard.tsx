import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Mail, 
  Phone, 
  Brain, 
  Archive, 
  Trash2, 
  User,
  Settings,
  Bell,
  MessageSquare,
  Filter
} from "lucide-react";

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

interface ProcessedEmailsResponse {
  success: boolean;
  totalSenders: number;
  categorizedSenders: Record<string, EmailSender[]>;
  categoryStats: Record<string, number>;
}

const categories = {
  'call-me': {
    title: 'Call Me For This',
    description: 'Urgent items requiring immediate attention',
    icon: Phone,
    color: 'bg-red-500',
    textColor: 'text-red-500',
    buttonColor: 'hover:bg-red-50 hover:border-red-200'
  },
  'remind-me': {
    title: 'Remind Me For This',
    description: 'Important but not urgent items',
    icon: Brain,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    buttonColor: 'hover:bg-yellow-50 hover:border-yellow-200'
  },
  'newsletter': {
    title: 'Newsletter',
    description: 'Industry insights and informational content',
    icon: Mail,
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    buttonColor: 'hover:bg-blue-50 hover:border-blue-200'
  },
  'why-did-i-signup': {
    title: 'Why Did I Sign Up For This?',
    description: 'Promotional and marketing emails',
    icon: Trash2,
    color: 'bg-gray-500',
    textColor: 'text-gray-500',
    buttonColor: 'hover:bg-gray-50 hover:border-gray-200'
  },
  'keep-quiet': {
    title: 'Keep But Don\'t Care',
    description: 'Reference materials and confirmations',
    icon: Archive,
    color: 'bg-green-500',
    textColor: 'text-green-500',
    buttonColor: 'hover:bg-green-50 hover:border-green-200'
  },
  'dont-tell-anyone': {
    title: "Don't Tell Anyone",
    description: 'Personal emails in work inbox',
    icon: User,
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    buttonColor: 'hover:bg-purple-50 hover:border-purple-200'
  }
};

export default function MainDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSender, setSelectedSender] = useState<EmailSender | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch processed emails
  const { data: processedEmails, isLoading } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
  });

  // Group senders by company/domain
  const companySenders = useMemo(() => {
    if (!processedEmails) return {};
    
    const allSenders = Object.values(processedEmails.categorizedSenders).flat();
    const companies: Record<string, EmailSender[]> = {};
    
    allSenders.forEach(sender => {
      const companyName = getCompanyName(sender.domain, sender.name);
      if (!companies[companyName]) {
        companies[companyName] = [];
      }
      companies[companyName].push(sender);
    });
    
    return companies;
  }, [processedEmails]);

  // Filter companies based on search and category
  const filteredCompanies = useMemo(() => {
    const filtered: Record<string, EmailSender[]> = {};
    
    Object.entries(companySenders).forEach(([company, senders]) => {
      const matchesSearch = company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        senders.some(s => s.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = filterCategory === 'all' || 
        senders.some(s => s.category === filterCategory);
      
      if (matchesSearch && matchesCategory) {
        filtered[company] = senders;
      }
    });
    
    return filtered;
  }, [companySenders, searchTerm, filterCategory]);

  // Update sender category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ senderId, category }: { senderId: string; category: string }) => {
      const response = await fetch(`/api/emails/sender/${senderId}/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails/processed'] });
      toast({
        title: "Category Updated",
        description: "Email sender category has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCategoryUpdate = (sender: EmailSender, category: string) => {
    updateCategoryMutation.mutate({ senderId: sender.id, category });
  };

  function getCompanyName(domain: string, name: string): string {
    // Extract company name from domain or sender name
    if (domain.includes('gmail.com') || domain.includes('yahoo.com') || domain.includes('outlook.com')) {
      return name || domain;
    }
    
    // Common company domain patterns
    const domainParts = domain.split('.');
    if (domainParts.length >= 2) {
      const companyPart = domainParts[domainParts.length - 2];
      return companyPart.charAt(0).toUpperCase() + companyPart.slice(1);
    }
    
    return domain;
  }

  function getTotalEmailsForCompany(senders: EmailSender[]): number {
    return senders.reduce((total, sender) => total + sender.emailCount, 0);
  }

  function getMostRecentEmail(senders: EmailSender[]): EmailSender {
    return senders.reduce((latest, sender) => 
      new Date(sender.lastEmailDate) > new Date(latest.lastEmailDate) ? sender : latest
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Mail className="w-16 h-16 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your email senders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">PookAi Email Manager</h1>
            <p className="text-muted-foreground">
              {Object.keys(companySenders).length} companies • {processedEmails?.totalSenders || 0} senders
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Company List */}
        <div className="w-1/2 border-r border-border flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-border">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search companies or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-sm border border-border rounded px-2 py-1 bg-background"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(categories).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.title}</option>
                  ))}
                  <option value="unassigned">Unassigned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Company List */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(filteredCompanies).map(([company, senders]) => {
              const totalEmails = getTotalEmailsForCompany(senders);
              const recentSender = getMostRecentEmail(senders);
              const isSelected = selectedSender?.id === recentSender.id;

              return (
                <div
                  key={company}
                  className={`p-4 border-b border-border cursor-pointer transition-colors ${
                    isSelected ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedSender(recentSender)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{company}</h3>
                        <Badge variant="secondary">{totalEmails} emails</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {senders.length} sender{senders.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        Latest: {recentSender.latestSubject}
                      </p>
                    </div>
                    <div className="text-right">
                      {recentSender.category !== 'unassigned' && (
                        <Badge 
                          variant="outline" 
                          className={categories[recentSender.category as keyof typeof categories]?.textColor}
                        >
                          {categories[recentSender.category as keyof typeof categories]?.title}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Email Preview and Actions */}
        <div className="w-1/2 flex flex-col">
          {selectedSender ? (
            <>
              {/* Email Preview Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedSender.name}</h2>
                    <p className="text-muted-foreground">{selectedSender.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedSender.emailCount} emails • Last: {new Date(selectedSender.lastEmailDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedSender.domain}
                  </Badge>
                </div>
              </div>

              {/* Latest Email Preview */}
              <div className="p-6 border-b border-border">
                <h3 className="font-medium mb-2">Latest Email</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-sm">{selectedSender.latestSubject}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selectedSender.lastEmailDate).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Category Actions */}
              <div className="p-6">
                <h3 className="font-medium mb-4">Categorize this sender</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(categories).map(([key, category]) => {
                    const Icon = category.icon;
                    const isSelected = selectedSender.category === key;
                    
                    return (
                      <Button
                        key={key}
                        variant={isSelected ? "default" : "outline"}
                        className={`justify-start h-auto p-4 ${category.buttonColor}`}
                        onClick={() => handleCategoryUpdate(selectedSender, key)}
                        disabled={updateCategoryMutation.isPending}
                      >
                        <Icon className={`w-4 h-4 mr-3 ${isSelected ? 'text-white' : category.textColor}`} />
                        <div className="text-left">
                          <div className="font-medium">{category.title}</div>
                          <div className="text-xs opacity-70">{category.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Select a company</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a company from the left to preview emails and set categories
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}