import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/types/ticket";

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

const statusColors = {
  open: "bg-status-open",
  progress: "bg-status-progress",
  closed: "bg-status-closed",
};

const statusLabels = {
  open: "Open",
  progress: "In Progress",
  closed: "Closed",
};

export const TicketCard = ({ ticket, onClick }: TicketCardProps) => {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(ticket)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{ticket.title}</h3>
        <Badge className={statusColors[ticket.status]}>
          {statusLabels[ticket.status]}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{ticket.description}</p>
      <div className="text-xs text-gray-400 mt-2">
        Created: {new Date(ticket.createdAt).toLocaleDateString()}
      </div>
    </Card>
  );
};