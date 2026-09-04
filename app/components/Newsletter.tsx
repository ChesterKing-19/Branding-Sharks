"use client";

import { FormEvent, useState } from "react";
import { Arrow } from "./Arrow";

export function Newsletter() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <section className="newsletter">
      <p className="eyebrow">The Monday current</p>
      <h2>GOOD MARKETING<br />IN YOUR <em>INBOX.</em></h2>
      <form onSubmit={submit}>
        {sent ? (
          <p className="success">You&apos;re on the list. Expect good things.</p>
        ) : (
          <>
            <label className="sr-only" htmlFor="email">Email address</label>
            <input id="email" type="email" required placeholder="Your email address" />
            <button>Subscribe <Arrow /></button>
          </>
        )}
      </form>
    </section>
  );
}
