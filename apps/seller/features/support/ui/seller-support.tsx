'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@homebase/ui';
import {
  AlertCircle, RefreshCw, CheckCircle2, Clock, Plus, Search, MessageSquare, Paperclip,
  BookOpen, HelpCircle, Phone, Mail, ChevronRight,
} from 'lucide-react';

/* ---------- mock data ---------- */

const stats = [
  { label: 'Open Tickets', value: '2', icon: AlertCircle, iconBg: 'bg-red-50', iconColor: 'text-red-500', badge: 'Urgent', badgeCls: 'bg-red-50 text-red-600', bar: 'bg-red-500', barW: '20%' },
  { label: 'In Progress', value: '3', icon: RefreshCw, iconBg: 'bg-orange-50', iconColor: 'text-orange-500', badge: 'Active', badgeCls: 'bg-orange-50 text-orange-600', bar: 'bg-orange-500', barW: '35%' },
  { label: 'Resolved', value: '45', icon: CheckCircle2, iconBg: 'bg-green-50', iconColor: 'text-green-500', badge: '+6', badgeCls: 'bg-green-50 text-green-600', bar: 'bg-green-500', barW: '90%' },
  { label: 'Avg Response Time', value: '2.4', unit: 'hrs', icon: Clock, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', badge: '-18%', badgeCls: 'bg-green-50 text-green-600', bar: 'bg-blue-500', barW: '76%' },
];

interface Ticket {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  category: string;
  title: string;
  description: string;
  updatedAgo: string;
  replies: number;
  attachments: number;
  assignedTo: string;
}

const tickets: Ticket[] = [
  { id: 'TKT-1042', priority: 'High', status: 'Open', category: 'Order Issue', title: 'Order #ORD-8834 not delivered but marked as completed', description: 'Customer is claiming the order was never received despite the tracking showing delivered. Need urgent investigation on the delivery partner\'s proof of delivery...', updatedAgo: '2 hours ago', replies: 4, attachments: 2, assignedTo: 'Support Team A' },
  { id: 'TKT-1039', priority: 'High', status: 'In Progress', category: 'Payment', title: 'Settlement payment delayed for March cycle', description: 'The settlement amount of Rs. 1,24,500 for the March 15-22 cycle has not been credited to the registered bank account. Expected date was March 25...', updatedAgo: '5 hours ago', replies: 6, attachments: 1, assignedTo: 'Finance Team' },
  { id: 'TKT-1036', priority: 'Medium', status: 'In Progress', category: 'Product', title: 'Product listing rejected - incorrect category mapping', description: 'Submitted 5 new product listings under "Home Appliances" but they were rejected with error "Category mismatch". The products are kitchen appliances and should qualify...', updatedAgo: '1 day ago', replies: 3, attachments: 5, assignedTo: 'Catalog Team' },
  { id: 'TKT-1031', priority: 'Low', status: 'Open', category: 'Account', title: 'Request to update registered business address', description: 'We have relocated our warehouse to a new address in Bengaluru. Need to update the registered business address and GST details in the seller profile...', updatedAgo: '2 days ago', replies: 1, attachments: 3, assignedTo: 'Account Team' },
  { id: 'TKT-1025', priority: 'Medium', status: 'Resolved', category: 'Shipping', title: 'Return pickup not scheduled for order #ORD-8721', description: 'Customer initiated a return 5 days ago but the pickup has not been scheduled. The customer is getting frustrated and threatening negative review...', updatedAgo: '3 days ago', replies: 8, attachments: 1, assignedTo: 'Logistics Team' },
];

const knowledgeBase = [
  { title: 'Getting Started Guide', desc: 'Complete guide for new sellers on HomeBase', articles: 12, icon: BookOpen },
  { title: 'Product Listing Help', desc: 'How to create, edit and optimize product listings', articles: 8, icon: HelpCircle },
  { title: 'Shipping & Delivery', desc: 'Manage shipping settings, delivery partners', articles: 15, icon: RefreshCw },
  { title: 'Payments & Settlements', desc: 'Understanding your payment cycles and reports', articles: 10, icon: Clock },
];

/* ---------- helpers ---------- */

const priorityStyles: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-orange-100 text-orange-700',
  Low: 'bg-green-100 text-green-700',
};

const statusStyles: Record<string, string> = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-orange-100 text-orange-700',
  Resolved: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-100 text-gray-600',
};

export function SellerSupport() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = tickets.filter((t) => {
    if (activeTab !== 'all' && t.status.toLowerCase().replace(' ', '-') !== activeTab) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support Center</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your tickets and find help resources</p>
        </div>
        <Button><Plus className="mr-1.5 h-4 w-4" />Create New Ticket</Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <Card key={s.label} className="hover:-translate-y-0.5 transition-transform">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.iconColor}`} />
                </div>
                <Badge variant="secondary" className={s.badgeCls}>{s.badge}</Badge>
              </div>
              <p className="text-2xl font-bold">
                {s.value}
                {s.unit && <span className="text-base font-normal text-gray-400 ml-1">{s.unit}</span>}
              </p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${s.bar} rounded-full`} style={{ width: s.barW }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tickets Section */}
      <Card>
        <div className="flex items-center justify-between p-5 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All (50)</TabsTrigger>
              <TabsTrigger value="open">Open (2)</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress (3)</TabsTrigger>
              <TabsTrigger value="resolved">Resolved (45)</TabsTrigger>
              <TabsTrigger value="closed">Closed (0)</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets..." className="pl-10 w-56" />
          </div>
        </div>

        <div className="divide-y">
          {filtered.map((t) => (
            <div key={t.id} className="p-5 cursor-pointer hover:bg-gray-50/50 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-400">#{t.id}</span>
                    <Badge variant="secondary" className={priorityStyles[t.priority]}>{t.priority}</Badge>
                    <Badge variant="secondary" className={statusStyles[t.status]}>{t.status}</Badge>
                    <Badge variant="outline">{t.category}</Badge>
                  </div>
                  <h4 className="text-sm font-semibold mb-1">{t.title}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2">{t.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-gray-400">Updated</p>
                  <p className="text-xs font-medium text-gray-600">{t.updatedAgo}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-400"><MessageSquare className="h-3.5 w-3.5" />{t.replies} replies</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400"><Paperclip className="h-3.5 w-3.5" />{t.attachments} attachments</span>
                <span className="text-xs text-gray-400">Assigned to: <span className="font-medium text-gray-600">{t.assignedTo}</span></span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-gray-400">No tickets match your filter.</div>
          )}
        </div>
      </Card>

      {/* Knowledge Base */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Knowledge Base</h2>
          <Button variant="link" className="text-sm">View All Articles <ChevronRight className="ml-1 h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {knowledgeBase.map((kb) => (
            <Card key={kb.title} className="hover:-translate-y-0.5 transition-transform cursor-pointer">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-3">
                  <kb.icon className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{kb.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{kb.desc}</p>
                <p className="text-xs font-medium text-orange-500">{kb.articles} articles</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Support Card */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Need immediate help?</h3>
            <p className="text-sm text-orange-100">Our support team is available Mon-Sat, 9AM to 6PM IST</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
              <Phone className="mr-1.5 h-4 w-4" />Call Us
            </Button>
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
              <Mail className="mr-1.5 h-4 w-4" />Email Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
