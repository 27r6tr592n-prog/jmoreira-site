import { CheckCircle2 } from "lucide-react"

import { WhatsAppCta } from "@/components/sections/whatsapp-cta"

export function FormSuccess({ title, text, waMessage, onReset }: { title: string; text: string; waMessage: string; onReset: () => void }) {
  return (
    <div role="status" className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-success-soft text-success">
        <CheckCircle2 className="size-8" aria-hidden />
      </span>
      <div className="space-y-1.5">
        <p className="text-xl font-bold">{title}</p>
        <p className="text-muted-foreground">{text}</p>
      </div>
      <WhatsAppCta message={waMessage} label="Falar agora no WhatsApp" size="lg" />
      <button type="button" onClick={onReset} className="min-h-10 text-sm font-semibold text-brand-ink hover:underline">
        Enviar outra mensagem
      </button>
    </div>
  )
}
