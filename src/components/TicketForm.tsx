import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Ticket, TicketStatus } from "@/types/ticket";

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, "id" | "createdAt">) => void;
}

export const TicketForm = ({ onSubmit }: TicketFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status: "open" as TicketStatus,
    });
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Ticket Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Ticket Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>
      <Button type="submit" className="w-full">
        Create Ticket
      </Button>
    </form>
  );
};