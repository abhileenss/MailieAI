import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  CreditCard
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
    borderColor: 'border-red-500'
  },
  'remind-me': {
    title: 'Remind Me For This',
    description: 'Important but can wait for scheduled reminder',
    icon: Clock,
    color: 'bg-yellow-500',
    borderColor: 'border-yellow-500'
  },
  'keep-quiet': {
    title: 'Keep But Don\'t Care',
    description: 'Archive quietly for future reference',
    icon: Archive,
    color: 'bg-blue-500',
    borderColor: 'border-blue-500'
  },
  'sales-promo': {
    title: 'Why Did I Sign Up For This?',
    description: 'Newsletters and promotions to unsubscribe from',
    icon: CreditCard,
    color: 'bg-yellow-400',
    borderColor: 'border-yellow-400'
  },
  'dont-tell-anyone': {
    title: 'Don\'t Tell Anyone',
    description: 'Private matters to handle discreetly',
    icon: User,
    color: 'bg-purple-500',
    borderColor: 'border-purple-500'
  }
};

export default function EmailCategorizationSimple() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: processedEmails, isLoading } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
    enabled: true
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ senderId, category }: { senderId: string; category: string }) => {
      const response = await fetch(`/api/email-senders/${senderId}/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', response.status, errorData);
        throw new Error(`Failed to update category: ${response.status}`);
      }
      return response.json();
    },
    onMutate: async ({ senderId, category }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/emails/processed'] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['/api/emails/processed']);
      
      // Optimistically update the cache
      queryClient.setQueryData(['/api/emails/processed'], (old: any) => {
        if (!old?.categorizedSenders) return old;
        
        const updated = { ...old };
        // Update the sender in all categories
        Object.keys(updated.categorizedSenders).forEach(cat => {
          updated.categorizedSenders[cat] = updated.categorizedSenders[cat].map((sender: EmailSender) => 
            sender.id === senderId ? { ...sender, category } : sender
          );
        });
        
        return updated;
      });
      
      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['/api/emails/processed'], context.previousData);
      }
      console.error('Category update error:', error);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      toast({
        title: "Category updated",
        description: "Email sender category has been successfully updated."
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['/api/emails/processed'] });
    }
  });

  const handleCategoryUpdate = (sender: EmailSender, category: string) => {
    updateCategoryMutation.mutate({ senderId: sender.id, category });
  };

  const filteredCompanies = useMemo(() => {
    if (!processedEmails?.categorizedSenders) return {};
    
    const companies: Record<string, EmailSender[]> = {};
    
    Object.values(processedEmails.categorizedSenders).flat().forEach(sender => {
      const companyName = getCompanyName(sender.domain, sender.name);
      if (!companies[companyName]) {
        companies[companyName] = [];
      }
      companies[companyName].push(sender);
    });

    if (!searchTerm) return companies;
    
    const filtered: Record<string, EmailSender[]> = {};
    Object.entries(companies).forEach(([company, senders]) => {
      if (company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          senders.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.email.toLowerCase().includes(searchTerm.toLowerCase()))) {
        filtered[company] = senders;
      }
    });
    
    return filtered;
  }, [processedEmails, searchTerm]);

  function getCompanyName(domain: string, name: string): string {
    if (domain && domain !== 'unknown') {
      return domain.replace(/^www\./, '').split('.')[0];
    }
    return name || 'Unknown Sender';
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
    <div className="min-h-screen bg-black">
      {/* Search Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="relative max-w-4xl mx-auto">
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
      <div className="max-w-4xl mx-auto p-4 space-y-3">
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
              onClick={() => setSelectedCompany(isSelected ? '' : company)}
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
                      <p className="text-sm text-gray-400">
                        {senders.length} sender{senders.length !== 1 ? 's' : ''} • {totalEmails} emails
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {categoryInfo && (
                      <div className="flex items-center space-x-2 mb-2">
                        <categoryInfo.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">{categoryInfo.title}</span>
                      </div>
                    )}
                    <p className="text-gray-300 line-clamp-2 mb-1 text-sm">
                      {recentEmail.latestSubject}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(recentEmail.lastEmailDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
              
              {/* Inline Categorization Panel - appears when company is selected */}
              {isSelected && (
                <div className="border-t border-zinc-800 bg-zinc-950 p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    How should mailieAI handle emails from {company}?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(categories).map(([catKey, catInfo]) => {
                      const IconComponent = catInfo.icon;
                      const isSelectedCategory = selectedCompanySenders.some(s => s.category === catKey);
                      
                      return (
                        <Button
                          key={catKey}
                          variant="ghost"
                          className={`h-auto p-4 justify-start text-left rounded-xl border-2 transition-all ${
                            isSelectedCategory 
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
                          <div className="flex items-center space-x-3 w-full">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelectedCategory 
                                ? 'bg-black/20' 
                                : 'bg-zinc-800'
                            }`}>
                              <IconComponent className={`w-4 h-4 ${
                                isSelectedCategory 
                                  ? catKey === 'sales-promo' ? 'text-black' : 'text-white'
                                  : 'text-gray-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm mb-1">{catInfo.title}</h4>
                              <p className={`text-xs ${
                                isSelectedCategory 
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
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}