// app/api/users/route.ts
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) return Response.json([]);

  const { data, error } = await supabase
    .from("users") // your Supabase table name
    .select("id, name, email")
    .ilike("name", `%${query}%`) // case-insensitive partial match
    .limit(10);

  if (error) {
    console.error("Supabase error:", error);
    return new Response("Error fetching users", { status: 500 });
  }

  return Response.json(data);
}