"use client"

import { FaCalendarAlt } from "react-icons/fa";
import { LuUpload } from "react-icons/lu"
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleArrowLeft, CirclePlus } from "lucide-react";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import TodoTable from "./todotable"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TodoForm from "./todoform";


export default function Main () {

  return (
    <div className="w-full p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          {/* Left side - Title + Back Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="rounded-full">
              <CircleArrowLeft />
            </Button>
            <CardTitle className="text-2xl">My To-do</CardTitle>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
            <Button variant="outline">
              <FaCalendarAlt />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-teal-600 text-white hover:bg-teal-700">
                  <CirclePlus className="mr-2" /> Add Task
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add New Todo List</AlertDialogTitle>
                  <AlertDialogDescription>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                    <TodoForm />
                <AlertDialogFooter>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button className="bg-blue-900 text-white hover:bg-blue-800">
              <LuUpload className="mr-2" /> Upload
            </Button>
          </div>
        </CardHeader>

        {/* Tabs Section */}
        <Tabs defaultValue="todo" className="w-full">
          <TabsList className="">
            <TabsTrigger value="todo">Todo</TabsTrigger>
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="todo">
            <Card>
              <TodoTable />
            </Card>
          </TabsContent>
          <TabsContent value="inprogress">
            <Card>
              <TodoTable />
            </Card>
          </TabsContent>
          <TabsContent value="completed">
            <Card>
              <TodoTable />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}