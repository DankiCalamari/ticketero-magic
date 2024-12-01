import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TicketCard } from "@/components/TicketCard";
import { TicketForm } from "@/components/TicketForm";
import { Ticket, TicketStatus } from "@/types/ticket";
import { toast } from "sonner";

const Index = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | "all">("all");

  const handleCreateTicket = (newTicket: Omit<Ticket, "id" | "createdAt">) => {
    const ticket: Ticket = {
      ...newTicket,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => [ticket, ...prev]);
    toast.success("Ticket created successfully!");
  };

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
    toast.success("Ticket status updated!");
  };

  const filteredTickets = tickets.filter(
    (ticket) => selectedStatus === "all" || ticket.status === selectedStatus
  );

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