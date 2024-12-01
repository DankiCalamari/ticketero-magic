import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TicketCard } from "@/components/TicketCard";
import { TicketForm } from "@/components/TicketForm";
import { Ticket, TicketStatus } from "@/types/ticket";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | "all">("all");
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Ticket[];
    }
  });

  const createTicketMutation = useMutation({
    mutationFn: async (newTicket: Omit<Ticket, "id" | "createdAt">) => {
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          title: newTicket.title,
          description: newTicket.description,
          status: newTicket.status,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Ticket created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create ticket: " + error.message);
    }
  });

  const updateTicketStatusMutation = useMutation({
    mutationFn: async ({ ticketId, newStatus }: { ticketId: string; newStatus: TicketStatus }) => {
      const { data, error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', ticketId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Ticket status updated!");
    },
    onError: (error) => {
      toast.error("Failed to update ticket: " + error.message);
    }
  });

  const handleCreateTicket = (newTicket: Omit<Ticket, "id" | "createdAt">) => {
    createTicketMutation.mutate(newTicket);
  };

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    updateTicketStatusMutation.mutate({ ticketId, newStatus });
  };

  const filteredTickets = tickets.filter(
    (ticket) => selectedStatus === "all" || ticket.status === selectedStatus
  );

  if (isLoading) {
    return <div className="container mx-auto py-8 text-center">Loading tickets...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Ticket Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Ticket</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>
            <TicketForm onSubmit={handleCreateTicket} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={selectedStatus === "all" ? "default" : "outline"}
          onClick={() => setSelectedStatus("all")}
        >
          All
        </Button>
        <Button
          variant={selectedStatus === "open" ? "default" : "outline"}
          onClick={() => setSelectedStatus("open")}
          className="bg-status-open text-secondary-foreground"
        >
          Open
        </Button>
        <Button
          variant={selectedStatus === "progress" ? "default" : "outline"}
          onClick={() => setSelectedStatus("progress")}
          className="bg-status-progress text-secondary-foreground"
        >
          In Progress
        </Button>
        <Button
          variant={selectedStatus === "closed" ? "default" : "outline"}
          onClick={() => setSelectedStatus("closed")}
          className="bg-status-closed text-secondary-foreground"
        >
          Closed
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={(ticket) => {
              const newStatus: TicketStatus = 
                ticket.status === "open" ? "progress" :
                ticket.status === "progress" ? "closed" : "open";
              handleStatusChange(ticket.id, newStatus);
            }}
          />
        ))}
        {filteredTickets.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No tickets found. Create a new ticket to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;