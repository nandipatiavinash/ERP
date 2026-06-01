"use client";

import { useRef, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ConfirmSubmitButtonProps = ButtonProps & {
  confirmTitle?: string;
  confirmDescription?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function ConfirmSubmitButton({
  children,
  confirmTitle = "Confirm action",
  confirmDescription = "Please confirm before saving this change.",
  confirmLabel = "Confirm",
  cancelLabel = "Close",
  disabled,
  ...props
}: ConfirmSubmitButtonProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function submitForm() {
    const form = buttonRef.current?.closest("form");
    setOpen(false);
    window.setTimeout(() => form?.requestSubmit(), 0);
  }

  return (
    <>
      <Button ref={buttonRef} type="button" disabled={disabled} onClick={() => setOpen(true)} {...props}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmTitle}</DialogTitle>
            <DialogDescription>{confirmDescription}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">{cancelLabel}</Button>
            </DialogClose>
            <Button type="button" onClick={submitForm}>{confirmLabel}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
