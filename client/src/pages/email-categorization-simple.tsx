import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Clock,
  CreditCard,
  Calendar,
  Newspaper,
  Tag,
  HelpCircle
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
    badgeColor: 'bg-red-500 text-white',
    borderColor: 'border-red-500'
  },
  'remind-me': {
    title: 'Remind Me For This',
    description: 'Important but not urgent - send reminders',
    icon: Brain,
    color: 'bg-orange-500',
    badgeColor: 'bg-orange-500 text-white',
    borderColor: 'border-orange-500'
  },
  'keep-quiet': {
    title: 'Keep But Don\'t Care',
    description: 'Archive but don\'t notify',
    icon: Archive,
    color: 'bg-green-500',
    badgeColor: 'bg-green-500 text-white',
    borderColor: 'border-green-500'
  },
  'why-did-i-signup': {
    title: 'Why Did I Sign Up For This?',
    description: 'Unwanted subscriptions to review',
    icon: HelpCircle,
    color: 'bg-gray-500',
    badgeColor: 'bg-gray-500 text-white',
    borderColor: 'border-gray-500'
  },
  'dont-tell-anyone': {
    title: "Don't Tell Anyone",
    description: 'Personal emails in work inbox',
    icon: User,
    color: 'bg-purple-500',
    badgeColor: 'bg-purple-500 text-white',
    borderColor: 'border-purple-500'
  }
};

export default function EmailCategorizationSimple() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Mail className="w-16 h-16 animate-pulse text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading your emails...</h2>
          <p className="text-gray-400">Organizing your senders by company</p>
        </div>
      </div>
    );
  }

  const selectedCompanySenders = selectedCompany ? filteredCompanies[selectedCompany] || [] : [];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Company List */}
      <div className="w-1/2 bg-black flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder-gray-400 rounded-lg"
            />
          </div>
        </div>

        {/* Company List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {Object.entries(filteredCompanies).map(([company, senders]) => {
            const totalEmails = getTotalEmailsForCompany(senders);
            const recentEmail = getMostRecentEmail(senders);
            const mainCategory = getMainCategory(senders);
            const categoryInfo = categories[mainCategory as keyof typeof categories];
            const isSelected = selectedCompany === company;
            
            return (
              <Card 
                key={company} 
                className={`cursor-pointer transition-all duration-200 bg-zinc-900 border-zinc-800 hover:border-zinc-700 ${
                  isSelected ? 'ring-2 ring-orange-400 border-orange-400' : ''
                }`}
                onClick={() => setSelectedCompany(company)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600">
                        <AvatarFallback className="text-black text-sm font-semibold">
                          {company.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">{company}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Mail className="w-3 h-3" />
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
                      <Badge className={`${categoryInfo.badgeColor} text-xs`}>
                        {categoryInfo.title}
                      </Badge>
                    )}
                    {!categoryInfo && (
                      <Badge className="bg-gray-600 text-white text-xs">
                        Uncategorized
                      </Badge>
                    )}
                  </div>
                  
                  {/* Latest Email Preview */}
                  <div className="mt-3 p-3 bg-zinc-800 rounded-lg text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Latest email</span>
                    </div>
                    <p className="text-gray-300 line-clamp-2 mb-1">
                      {recentEmail.latestSubject}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(recentEmail.lastEmailDate).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Categorization */}
      <div className="w-1/2 bg-black flex flex-col">
        {selectedCompany ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-2">
                How should PookAi handle emails from {selectedCompany}?
              </h2>
              <p className="text-gray-400">
                {selectedCompanySenders.length} senders • {getTotalEmailsForCompany(selectedCompanySenders)} total emails
              </p>
            </div>

            {/* Category Options */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(categories).map(([catKey, catInfo]) => {
                  const IconComponent = catInfo.icon;
                  const isSelected = selectedCompanySenders.some(s => s.category === catKey);
                  
                  return (
                    <Button
                      key={catKey}
                      variant="ghost"
                      className={`h-auto p-6 justify-start text-left rounded-2xl border-2 transition-all ${
                        isSelected 
                          ? `${catInfo.color} ${catInfo.borderColor} text-white hover:opacity-90` 
                          : 'bg-zinc-900 border-zinc-800 text-gray-300 hover:bg-zinc-800 hover:border-zinc-700'
                      }`}
                      onClick={() => {
                        selectedCompanySenders.forEach(sender => {
                          handleCategoryUpdate(sender, catKey);
                        });
                      }}
                      disabled={updateCategoryMutation.isPending}
                    >
                      <div className="flex items-start space-x-4 w-full">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected 
                            ? 'bg-black/20' 
                            : 'bg-zinc-800'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            isSelected 
                              ? catKey === 'sales-promo' ? 'text-black' : 'text-white'
                              : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{catInfo.title}</h3>
                          <p className={`text-sm ${
                            isSelected 
                              ? catKey === 'sales-promo' ? 'text-black/80' : 'text-gray-300'
                              : 'text-gray-500'
                          }`}>
                            {catInfo.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-medium mb-2 text-gray-400">Select a company</h3>
              <p className="text-gray-500">Choose a company from the left to set how PookAi should handle all emails from that company</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}