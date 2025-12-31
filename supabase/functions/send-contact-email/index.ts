import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  email: string;
  name: string;
  message: string;
  investor_profile?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-contact-email function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MAILERLITE_API_KEY = Deno.env.get("MAILERLITE_API_KEY");
    
    if (!MAILERLITE_API_KEY) {
      console.error("MAILERLITE_API_KEY is not set");
      throw new Error("MailerLite API key is not configured");
    }

    const { email, name, message, investor_profile }: ContactRequest = await req.json();
    
    console.log(`Processing contact form submission from: ${email}, investor_profile: ${investor_profile}`);

    // Validate inputs
    if (!email || !name || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Email, name, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Build fields object with investor_profile custom field
    const fields: Record<string, string> = {
      name: name,
    };
    
    if (investor_profile) {
      fields.investor_profile = investor_profile;
    }

    // Add subscriber to MailerLite with group assignment and custom fields
    const subscriberResponse = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        fields: fields,
        groups: ["175309374057613174"],
      }),
    });

    const subscriberData = await subscriberResponse.json();
    console.log("MailerLite subscriber response:", JSON.stringify(subscriberData));

    if (!subscriberResponse.ok && subscriberResponse.status !== 409) {
      // 409 means subscriber already exists, which is fine
      console.error("Failed to add subscriber to MailerLite:", subscriberData);
      throw new Error("Failed to process subscription");
    }

    // Send automation/campaign trigger or use MailerLite's campaign API
    // For now, we'll log the contact message (you can extend this to use automations)
    console.log(`Contact message from ${name} (${email}): ${message}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact form submitted successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
