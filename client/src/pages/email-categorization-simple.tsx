import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Mail, 
  Phone, 
  Brain, 
  Archive, 
  Trash2, 
  User,
  Building2,
  Clock
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
    description: 'Urgent items requiring immediate voice call',
    icon: Phone,
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-50 hover:border-red-200',
    badgeColor: 'bg-red-100 text-red-800'
  },
  'remind-me': {
    title: 'Remind Me For This',
    description: 'Important but not urgent - send reminders',
    icon: Brain,
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-50 hover:border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-800'
  },
  'newsletter': {
    title: 'Newsletter',
    description: 'Industry insights and news updates',
    icon: Mail,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-50 hover:border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  'why-did-i-signup': {
    title: 'Why Did I Sign Up?',
    description: 'Promotional emails I probably don\'t need',
    icon: Trash2,
    color: 'bg-gray-500',
    hoverColor: 'hover:bg-gray-50 hover:border-gray-200',
    badgeColor: 'bg-gray-100 text-gray-800'
  },
  'keep-quiet': {
    title: 'Keep But Don\'t Care',
    description: 'Archive these - keep but no notifications',
    icon: Archive,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-50 hover:border-green-200',
    badgeColor: 'bg-green-100 text-green-800'
  },
  'dont-tell-anyone': {
    title: "Don't Tell Anyone",
    description: 'Personal emails in work inbox',
    icon: User,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-50 hover:border-purple-200',
    badgeColor: 'bg-purple-100 text-purple-800'
  }
};

export default function EmailCategorizationSimple() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch processed emails
  const { data: processedEmails, isLoading } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
  });

  // Group senders by company/domain for clean display
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
    
    // Sort companies by total email volume
    const sortedCompanies = Object.entries(companies)
      .sort(([,a], [,b]) => getTotalEmailsForCompany(b) - getTotalEmailsForCompany(a))
      .reduce((acc, [company, senders]) => {
        acc[company] = senders;
        return acc;
      }, {} as Record<string, EmailSender[]>);
    
    return sortedCompanies;
  }, [processedEmails]);

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return companySenders;
    
    const filtered: Record<string, EmailSender[]> = {};
    Object.entries(companySenders).forEach(([company, senders]) => {
      const matchesSearch = company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        senders.some(s => s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (matchesSearch) {
        filtered[company] = senders;
      }
    });
    
    return filtered;
  }, [companySenders, searchTerm]);

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
        title: "Updated!",
        description: "Email category has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCategoryUpdate = (sender: EmailSender, category: string) => {
    updateCategoryMutation.mutate({ senderId: sender.id, category });
  };

  function getCompanyName(domain: string, name: string): string {
    // Extract clean company name from domain or sender name
    if (domain.includes('gmail.com') || domain.includes('yahoo.com') || domain.includes('outlook.com')) {
      return name || domain;
    }
    
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

  function getMainCategory(senders: EmailSender[]): string {
    const categoryCounts: Record<string, number> = {};
    senders.forEach(sender => {
      const cat = sender.category || 'unassigned';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    return Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unassigned';
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Mail className="w-16 h-16 animate-pulse text-purple-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading your emails...</h2>
          <p className="text-gray-600">Organizing your senders by company</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Organize Your Email Senders
            </h1>
            <p className="text-gray-600 text-lg">
              Sort your {Object.keys(companySenders).length} companies into smart categories
            </p>
          </div>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 border-purple-200 focus:border-purple-400 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Company Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(filteredCompanies).map(([company, senders]) => {
            const totalEmails = getTotalEmailsForCompany(senders);
            const recentEmail = getMostRecentEmail(senders);
            const mainCategory = getMainCategory(senders);
            const categoryInfo = categories[mainCategory as keyof typeof categories];
            
            return (
              <Card key={company} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 neo-pop-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500">
                        <AvatarFallback className="text-white font-semibold">
                          {company.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{company}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Mail className="w-4 h-4" />
                          <span>{totalEmails} emails</span>
                          {senders.length > 1 && (
                            <>
                              <span>•</span>
                              <span>{senders.length} senders</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {categoryInfo && (
                      <Badge className={categoryInfo.badgeColor}>
                        {categoryInfo.title}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Latest Email Preview */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">Latest email</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                      {recentEmail.latestSubject}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(recentEmail.lastEmailDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Category Buttons */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600 mb-3">How should PookAi handle emails from {company}?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(categories).map(([catKey, catInfo]) => {
                        const IconComponent = catInfo.icon;
                        const isSelected = senders.some(s => s.category === catKey);
                        
                        return (
                          <Button
                            key={catKey}
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            className={`${catInfo.hoverColor} text-xs h-auto py-2 px-2 justify-start ${
                              isSelected ? catInfo.color + ' text-white' : ''
                            }`}
                            onClick={() => {
                              // Update all senders from this company
                              senders.forEach(sender => {
                                handleCategoryUpdate(sender, catKey);
                              });
                            }}
                            disabled={updateCategoryMutation.isPending}
                          >
                            <IconComponent className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{catInfo.title}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {Object.keys(filteredCompanies).length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No companies found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}