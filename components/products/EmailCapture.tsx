"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent, EVENTS } from "@/config/analytics";
import { siteConfig } from "@/config/site";

export function EmailCapture({ variant = "inline" }: { variant?: "inline" | "banner" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      // TODO: Replace with your email provider endpoint (ConvertKit, Buttondown, etc.)
      // Example: await fetch("https://api.convertkit.com/v3/forms/FORM_ID/subscribe", ...)
      const endpoint = process.env.NEXT_PUBLIC_EMAIL_ENDPOINT;
      if (endpoint) {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      }
      setStatus("success");
      setEmail("");
      trackEvent(EVENTS.EMAIL_SUBSCRIBE, { variant });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          You're in! Watch your inbox.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          We'll send honest reviews and deals — no spam, ever.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm font-semibold text-foreground">
          Get the best student tech deals in your inbox
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        Weekly: new reviews, comparison updates, and Amazon deals picked for Indian CS students.
        No spam. Unsubscribe any time.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={status === "loading"}
        />
        <Button type="submit" size="sm" disabled={status === "loading"} className="shrink-0 gap-1.5">
          {status === "loading" ? "..." : <>Subscribe <ArrowRight className="h-3.5 w-3.5" /></>}
        </Button>
      </form>
      {status === "error" && (
        <p className="text-xs text-destructive">Something went wrong. Try again?</p>
      )}
    </div>
  );
}
