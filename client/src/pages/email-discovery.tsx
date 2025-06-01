import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  Mail, 
  Users, 
  BarChart3, 
  Filter, 
  Search,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/sidebar';
import { apiRequest } from '@/lib/queryClient';

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSenders, setSelectedSenders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data: emailData, isLoading, error } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
    retry: false,
  });

  const allSenders = useMemo(() => {
    if (!emailData?.categorizedSenders) return [];
    return Object.values(emailData.categorizedSenders).flat();
  }, [emailData]);

  const filteredSenders = useMemo(() => {
    if (!searchQuery) return allSenders;
    return allSenders.filter(sender => 
      sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sender.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sender.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allSenders, searchQuery]);

  const paginatedSenders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSenders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSenders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSenders.length / itemsPerPage);

  const handleSenderToggle = (senderId: string) => {
    setSelectedSenders(prev => 
      prev.includes(senderId) 
        ? prev.filter(id => id !== senderId)
        : [...prev, senderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSenders.length === filteredSenders.length) {
      setSelectedSenders([]);
    } else {
      setSelectedSenders(filteredSenders.map(s => s.id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Analyzing your email patterns...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !emailData) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load email data</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Email Discovery</h1>
              <p className="text-slate-600 mt-1">
                Found {emailData.totalSenders} unique email senders in your inbox
              </p>
            </div>
            <Link href="/categorization">
              <Button disabled={selectedSenders.length === 0}>
                Categorize Selected ({selectedSenders.length})
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Senders</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{emailData.totalSenders}</p>
                  </div>
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Selected</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{selectedSenders.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Emails</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">
                      {allSenders.reduce((sum, sender) => sum + sender.emailCount, 0)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Controls */}
          <Card className="bg-white border-slate-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search senders by name, email, or domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleSelectAll}>
                    {selectedSenders.length === filteredSenders.length ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Clear All
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Select All ({filteredSenders.length})
                      </>
                    )}
                  </Button>
                  
                  <span className="text-sm text-slate-600">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredSenders.length)}-{Math.min(currentPage * itemsPerPage, filteredSenders.length)} of {filteredSenders.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Senders List */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                {paginatedSenders.map((sender, index) => (
                  <motion.div
                    key={sender.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedSenders.includes(sender.id)}
                        onCheckedChange={() => handleSenderToggle(sender.id)}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-900 truncate">{sender.name}</h4>
                            <p className="text-sm text-slate-600 truncate">{sender.email}</p>
                            <p className="text-xs text-slate-500">{sender.domain}</p>
                          </div>
                          
                          <div className="ml-4 text-right">
                            <Badge variant="secondary">{sender.emailCount} emails</Badge>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(sender.lastEmailDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-xs text-slate-600 line-clamp-1">
                            Latest: {sender.latestSubject}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-6 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-slate-600 px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}