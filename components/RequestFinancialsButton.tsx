"use client";

import { useState } from "react";
import NdaFormModal from "./NdaFormModal";

interface RequestFinancialsButtonProps {
  listingSlug: string;
  listingTitle: string;
  className?: string;
  children?: React.ReactNode;
}

export default function RequestFinancialsButton({ listingSlug, listingTitle, className, children }: RequestFinancialsButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? "flex w-full items-center justify-center rounded-md border border-[var(--navy)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:text-white"}
      >
        {children ?? "Request financial documents"}
      </button>
      {open && (
        <NdaFormModal
          listingSlug={listingSlug}
          listingTitle={listingTitle}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
