import { cn } from "cn"

import { WhatsAppIcon } from "@/components/brand/icons"
import { buttonVariants } from "@/components/ui/button"
import { cta } from "@/lib/copy"
import { whatsappUrl } from "@/lib/whatsapp"

/** Botão principal de WhatsApp (âmbar = urgência). */
export function WhatsAppCta({
  message,
  label = cta.whatsapp,
  size = "xl",
  className,
}: {
  message: string
  label?: string
  size?: "default" | "lg" | "xl"
  className?: string
}) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ variant: "cta", size, className: cn(className) })}
    >
      <WhatsAppIcon className="size-5" />
      {label}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}
