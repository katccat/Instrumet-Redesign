import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/*
  Non-functional newsletter signup STUB. It is structured to accept a real
  handler later without changing the markup: replace the body of `onSubmit`
  with a fetch to your endpoint (or wire an `action` prop). Right now it does
  nothing but show an inline acknowledgement, and never posts anywhere.
*/
export default function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: POST `email` to a list provider or serverless function here.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Thanks. We will be in touch at{" "}
        <span className="font-medium text-foreground">{email}</span>.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="sm:flex-1"
      />
      <Button type="submit" size="sm">
        Subscribe
      </Button>
    </form>
  );
}
