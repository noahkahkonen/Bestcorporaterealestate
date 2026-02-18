"use client";

import { useState } from "react";
import { formatPhone } from "@/lib/format-phone";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M8.25 1.5A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75A2.25 2.25 0 0 0 15.75 1.5h-7.5ZM12.75 19.5a.75.75 0 0 1-.75.75h-2a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v1Z" clipRule="evenodd" />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908z" />
    </svg>
  );
}

interface BrokerContactRevealProps {
  phone: string | null;
  ext: string | null;
  email: string;
}

export default function BrokerContactReveal({ phone, ext, email }: BrokerContactRevealProps) {
  const [revealedPhone, setRevealedPhone] = useState(false);
  const [revealedEmail, setRevealedEmail] = useState(false);

  const iconButtonClass =
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-[var(--navy)] transition-opacity hover:opacity-80";

  return (
    <div className="-ml-4 mt-2 flex flex-col gap-2">
      {phone && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setRevealedPhone(true)}
            className={iconButtonClass}
            aria-label="Reveal phone number"
          >
            <PhoneIcon className="h-6 w-6 shrink-0" />
          </button>
          {revealedPhone ? (
            <a
              href={`tel:+1${phone.replace(/\D/g, "").slice(-10)}`}
              className="text-sm text-[var(--charcoal)] hover:text-[var(--navy)]"
            >
              {formatPhone(phone)}
              {ext && ` Ext. ${ext}`}
            </a>
          ) : null}
        </div>
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setRevealedEmail(true)}
          className={iconButtonClass}
          aria-label="Reveal email"
        >
          <EnvelopeIcon className="h-6 w-6 shrink-0" />
        </button>
        {revealedEmail ? (
          <a
            href={`mailto:${email}`}
            className="break-all text-sm text-[var(--charcoal)] hover:text-[var(--navy)]"
          >
            {email}
          </a>
        ) : null}
      </div>
    </div>
  );
}
