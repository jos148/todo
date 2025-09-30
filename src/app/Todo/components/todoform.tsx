"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function TodoForm() {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !priority || !description) return;

    setLoading(true);
    const { error } = await supabase.from("users").insert([
      {
        name,
        priority,
        date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
        description,
      },
    ]);

    if (error) {
      console.error("Error inserting todo:", error.message);
      toast.error(`Failed to add todo: ${error.message}`);
    } else {
      setName("");
      setPriority("");
      setDueDate(undefined);
      setDescription("");
      toast("New todo added", {
        description: `Task: ${name}`,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo action"),
        },
      });

    }
    setLoading(false);
  };

  return (
    <form onSubmit={addTodo} className="my-6 mx-7 items-center">
      {/* Title input */}
      <label>Add New Task</label>

      <Input
        placeholder="New todo..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 mb-3"
      />

      {/* Completed select */}
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Urgent">Urgent ✅</SelectItem>
          <SelectItem value="Important">Important ✅</SelectItem>
          <SelectItem value="Medium">Medium ✅</SelectItem>
        </SelectContent>
      </Select>

      {/* Date picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[180px] justify-start text-left font-normal my-3"
          >
            {dueDate ? format(dueDate, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={setDueDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Textarea
        placeholder="Type your message here."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-3"
      />

      {/* Submit button */}
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>
    </form>
  );
}
