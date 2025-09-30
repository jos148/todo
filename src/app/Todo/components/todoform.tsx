"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { supabase } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";


export default function TodoForm() {

  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
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
          label: "Done",
          onClick: () => console.log("Done"),
        },
      });
    }
    setLoading(false);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  

  return (
    <Form {...form}>
      <form onSubmit={addTodo} className="space-y-8">
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel></FormLabel>

              <label>Add New Task</label>

              <Input
                placeholder="New todo..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 mb-3"
              />

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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-start text-left font-normal my-3"
                  >
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
              <FormDescription>Description</FormDescription>
              <FormMessage />
              <Textarea
                placeholder="Type your message here."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-3"
              />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
