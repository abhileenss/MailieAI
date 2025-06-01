import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, Users, BarChart3, Filter, ArrowRight, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CleanNavigation } from "@/components/clean-navigation";
import { NavigationFooter } from "@/components/navigation-footer";
import { SEOHead } from "@/components/seo-head";
import { useLocation } from "wouter";

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

export default function EmailDiscovery() {
  const [, setLocation] = useLocation();
  const [selectedSenders, setSelectedSenders] = useState<string[]>([]);
  const [filterDomain, setFilterDomain] = useState('');

  // Fetch your real processed emails
  const { data: emailData, isLoading } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed']
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your email analysis...</p>
        </div>
      </div>
    );
  }

  if (!emailData?.success || emailData.totalSenders === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <CleanNavigation currentPage="/discovery" />
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">No Email Data Found</h1>
          <p className="text-muted-foreground mb-6">
            Please scan your emails first to see who you're getting emails from.
          </p>
          <Button onClick={() => setLocation('/scanning')}>
            Scan Your Emails
          </Button>
        </div>
      </div>
    );
  }

  // Get all senders from all categories
  const allSenders = Object.values(emailData.categorizedSenders).flat();
  
  // Domain analysis
  const domainStats = allSenders.reduce((acc, sender) => {
    acc[sender.domain] = (acc[sender.domain] || 0) + sender.emailCount;
    return acc;
  }, {} as Record<string, number>);

  const topDomains = Object.entries(domainStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  // Category analysis
  const categoryStats = emailData.categoryStats;
  const totalEmails = Object.values(categoryStats).reduce((a, b) => a + b, 0);

  const filteredSenders = filterDomain 
    ? allSenders.filter(sender => sender.domain.includes(filterDomain))
    : allSenders;

  const handleSenderToggle = (senderId: string) => {
    setSelectedSenders(prev => 
      prev.includes(senderId) 
        ? prev.filter(id => id !== senderId)
        : [...prev, senderId]
    );
  };

  const proceedToDashboard = () => {
    // Store selected senders in localStorage or state management
    localStorage.setItem('selectedSenders', JSON.stringify(selectedSenders));
    setLocation('/dashboard');
  };

  return (
    <>
      <SEOHead 
        title="Email Discovery - PookAi | Who Are You Getting Emails From?"
        description="Discover and analyze your email senders. See who's sending you emails, from which domains, and choose what matters most for your AI voice assistant."
        canonical="https://pookai.com/discovery"
        keywords="email analysis, email senders, domain analysis, email discovery, inbox analytics"
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <CleanNavigation currentPage="/discovery" />
        
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">
              Here's Who You're Getting Emails From
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              We analyzed your inbox and found {emailData.totalSenders} unique email senders. 
              Choose what matters most to you for personalized voice summaries.
            </p>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{emailData.totalSenders}</p>
                <p className="text-sm text-muted-foreground">Total Senders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{Object.keys(domainStats).length}</p>
                <p className="text-sm text-muted-foreground">Unique Domains</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{totalEmails}</p>
                <p className="text-sm text-muted-foreground">Total Emails</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Filter className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{selectedSenders.length}</p>
                <p className="text-sm text-muted-foreground">Selected</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Domains Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Top Email Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topDomains.map(([domain, count], index) => (
                    <div key={domain} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-8">{index + 1}.</span>
                        <span className="font-medium">{domain}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...Object.values(domainStats))) * 100}%` }}
                          />
                        </div>
                        <Badge variant="secondary">{count} emails</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filter and Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Choose Your Email Senders
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Filter by domain..."
                      value={filterDomain}
                      onChange={(e) => setFilterDomain(e.target.value)}
                      className="px-3 py-1 border border-border rounded-md text-sm"
                    />
                    <Button
                      onClick={() => setSelectedSenders(allSenders.map(s => s.id))}
                      variant="outline"
                      size="sm"
                    >
                      Select All
                    </Button>
                    <Button
                      onClick={() => setSelectedSenders([])}
                      variant="outline"
                      size="sm"
                    >
                      Clear All
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {filteredSenders.map((sender, index) => (
                    <div
                      key={`${sender.id}-${index}`}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedSenders.includes(sender.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-accent'
                      }`}
                      onClick={() => handleSenderToggle(sender.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{sender.name}</h4>
                          <p className="text-sm text-muted-foreground">{sender.email}</p>
                          <p className="text-xs text-muted-foreground">{sender.domain}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{sender.emailCount} emails</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(sender.lastEmailDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          Latest: {sender.latestSubject}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center space-x-4"
          >
            <Button
              onClick={proceedToDashboard}
              disabled={selectedSenders.length === 0}
              size="lg"
            >
              Continue to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={() => setLocation('/dashboard')}
              variant="outline"
              size="lg"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Later
            </Button>
          </motion.div>
        </div>
      </div>
      <NavigationFooter />
    </>
  );
}