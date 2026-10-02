import Link from "next/link"
import type { UseFormRegisterReturn } from "react-hook-form"

/** Aceite LGPD (mesmo texto do formulário de contato). */
export function ConsentField({ id, registration, error }: { id: string; registration: UseFormRegisterReturn; error?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-erro` : undefined}
          {...registration}
        />
        <span>
          Autorizo a JMoreira a entrar em contato pelos dados informados, conforme a{" "}
          <Link href="/politicas#privacidade" className="font-semibold text-brand-ink underline underline-offset-2">
            política de privacidade
          </Link>
          .
        </span>
      </label>
      {error && (
        <p id={`${id}-erro`} className="field-error text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
