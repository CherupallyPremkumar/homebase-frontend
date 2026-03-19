'use client';

import { useState } from 'react';
import { supportApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate } from '@homebase/shared';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Input, Textarea, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@homebase/ui';
import type { ColumnDef } from '@tanstack/react-table';
import type { SupportTicket } from '@homebase/types';
import { Plus } from 'lucide-react';
import { useCreateSellerTicket } from '../api/queries';

const columns: ColumnDef<SupportTicket, unknown>[] = [
  { accessorKey: 'subject', header: 'Subject' },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const p = row.original.priority;
      const color = p === 'URGENT' ? 'text-red-600' : p === 'HIGH' ? 'text-orange-600' : p === 'MEDIUM' ? 'text-yellow-600' : 'text-gray-600';
      return <span className={`font-medium ${color}`}>{p}</span>;
    },
  },
  { accessorKey: 'createdTime', header: 'Created', cell: ({ row }) => formatDate(row.original.createdTime) },
  { accessorKey: 'stateId', header: 'Status', cell: ({ row }) => <StateBadge state={row.original.stateId} /> },
];

export function SellerSupport() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const createTicket = useCreateSellerTicket();

  const handleSubmit = () => {
    createTicket.mutate(
      { subject, description, category, priority: 'MEDIUM' as const },
      { onSuccess: () => { setOpen(false); setSubject(''); setDescription(''); } },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support</h1>
          <p className="text-sm text-gray-500">Get help from the HomeBase seller support team</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1 h-4 w-4" />New Ticket</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Support Ticket</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="product">Product Listing</SelectItem>
                    <SelectItem value="payment">Payments & Settlement</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" placeholder="Brief description of your issue" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" rows={4} placeholder="Explain your issue in detail..." />
              </div>
              <Button onClick={handleSubmit} disabled={!subject || !description || createTicket.isPending} className="w-full">
                {createTicket.isPending ? 'Creating...' : 'Submit Ticket'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={columns}
        queryKey="seller-tickets"
        queryFn={supportApi.myTickets}
        searchable
        searchPlaceholder="Search tickets..."
        emptyTitle="No support tickets"
        emptyDescription="Everything running smoothly? Great! Create a ticket if you need help."
      />
    </div>
  );
}
