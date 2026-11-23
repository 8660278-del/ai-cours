"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MaterialCopyButtonProps {
  text: string;
  label: string;
  description?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  className?: string;
}

export function MaterialCopyButton({
  text,
  label,
  description = "Материал скопирован в буфер обмена.",
  variant = "default",
  size = "default",
  className,
}: MaterialCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Скопировано", { description });

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Не удалось скопировать", {
        description: "Выделите текст материала и скопируйте его вручную.",
      });
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => {
        void handleCopy();
      }}
      className={cn(
        variant === "default" && "bg-[#f36f21] text-white hover:bg-[#d95c16]",
        className
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Скопировано" : label}
    </Button>
  );
}
