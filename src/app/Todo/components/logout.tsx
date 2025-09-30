"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function AccountInfo() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  if (!user) return <p>Not logged in</p>;

  return (
    <div className="space-y-2">
      <p className="text-sm">Logged in as: {user.email}</p>
      <Button variant="destructive" onClick={handleLogout}>
        Log Out
      </Button>
    </div>
  );
}
