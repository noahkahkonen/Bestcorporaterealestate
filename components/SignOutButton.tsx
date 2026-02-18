"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-sm font-medium text-[var(--charcoal-light)] hover:text-[var(--navy)]"
    >
      Sign out
    </button>
  );
}
