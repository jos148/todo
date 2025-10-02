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
import { AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

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
      toast("New todo list added", {
        description: `Task List: ${name}`,
        action: {
          label: "Done",
          onClick: () => console.log("Done action"),
        },
      });

    }
    setLoading(false);
  };

  return (
    <form onSubmit={addTodo} className="my-6 mx-7 items-center">
      {/* Title input */}
      <label>Add Name</label>

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
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction asChild>
      <Button type="submit" disabled={loading} className="mx-2">
        {loading ? "Submitting..." : "Submit"}
      </Button>
      </AlertDialogAction>
    </form>
  );
}
