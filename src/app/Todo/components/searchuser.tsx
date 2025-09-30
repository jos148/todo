// components/SearchUsers.tsx
"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { useDebounce } from "use-debounce";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // ✅ Make sure this is correct

interface User {
  id: string;
  name: string;
  priority?: string;
  description: string;
}

export function SearchUsers() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("users") // ✅ Make sure your table is called 'users'
        .select("id, name, description, priority")
        .ilike("name", `%${debouncedQuery}%`); // ✅ Case-insensitive search

      if (error) {
        console.error("Supabase error:", error.message);
        setResults([]);
      } else {
        setResults(data || []);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [debouncedQuery]);

  return (
    <Command className="rounded-lg border shadow-md w-full max-w-md">
      <CommandInput
        placeholder="Search todo..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {results.map((user) => (
              <CommandItem key={user.id} value={user.name}>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.priority ?? "No priority"}
                  </span>
                </div>
              </CommandItem>
            ))}
          </>
        )}
      </CommandList>
    </Command>
  );
}
