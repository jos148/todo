"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CardWithForm() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleStart = () => {
    // Redirect to the /Todo page with name as a query parameter
    router.push(`/Todo?name=${encodeURIComponent(name)}`);
    toast("New todo added", {
            description: `Task: ${name}`,
            action: {
              label: "Done",
              onClick: () => console.log("Done action"),
            },
          });
  };

  return (
    <div className="items-center my-50 mx-150">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create Todo List</CardTitle>
          <CardDescription>Start your new Todo in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleStart}>Start</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
