"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Flag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"


interface User {
  id: number;
  priority: string;
  name: string;
  date: string;
}

interface PriorityStyles {
  [key: string]: string;
}

const priorities: PriorityStyles = {
  Urgent: "bg-red-100 text-red-700 border-red-200",
  Important: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Medium: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function TodoTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Fetch + subscribe
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, count, error } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        setUsers(data || []);
        setTotalCount(count || 0);
      }

      setIsLoading(false);
    };

    fetchData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("users-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          console.log("Realtime change:", payload);

          setUsers((prev) => {
            if (payload.eventType === "INSERT") {
              return [...prev, payload.new as User];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((user) =>
                user.id === (payload.new as User).id
                  ? (payload.new as User)
                  : user
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter(
                (user) => user.id !== (payload.old as User).id
              );
            }
            return prev;
          });
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage]);

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => (
      <PaginationItem key={i + 1}>
        <PaginationLink
          isActive={currentPage === i + 1}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    ));
  };


  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[160px]" />
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[80px] rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.date}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {/* Example with multiple avatars */}
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>A1</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://github.com/evilrabbit.png" />
                    <AvatarFallback>A2</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">+1</span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                      priorities[user.priority]
                    }`}
                  >
                    <Flag className="h-3 w-3" />
                    {user.priority}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {renderPageNumbers()}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
