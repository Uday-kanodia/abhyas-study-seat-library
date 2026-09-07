import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    const raw = typeof query === "string" ? query.trim() : "";
    if (raw.length < 5 || raw.length > 255) {
      return json({ error: "Enter your registered email address or phone number." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const isEmail = raw.includes("@");
    const digits = raw.replace(/\D/g, "");

    let builder = supabase
      .from("memberships")
      .select(
        "id,name,email,phone,plan_type,branch,shift_timings,seat_number,is_reserved,start_date,expiry_date,fee_total,fee_paid,notes",
      )
      .order("expiry_date", { ascending: false })
      .limit(5);

    if (isEmail) {
      builder = builder.ilike("email", raw);
    } else {
      if (digits.length < 10) {
        return json({ error: "Enter a valid 10-digit phone number." }, 400);
      }
      builder = builder.ilike("phone", `%${digits.slice(-10)}%`);
    }

    const { data, error } = await builder;
    if (error) throw error;

    return json({ memberships: data ?? [] });
  } catch (err) {
    console.error("membership-lookup failed", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
