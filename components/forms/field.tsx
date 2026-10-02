"use client"

import { useEffect, useRef } from "react"
import { cn } from "cn"

import { motionDisabled } from "@/lib/motion"

/**
 * Rótulo + campo + dica + erro, com os ids ligados por aria-describedby.
 * O campo filho recebe id/aria-* via render prop para manter o controle.
 * Quando aparece um erro, o campo treme 4 px e a mensagem entra com fade + slide.
 */
export function Field({
  id,
  label,
  error,
  hint,
  optional,
  className,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  className?: string
  children: (props: { id: string; "aria-invalid": true | undefined; "aria-describedby": string | undefined }) => React.ReactNode
}) {
  const describedBy = [hint ? `${id}-dica` : null, error ? `${id}-erro` : null].filter(Boolean).join(" ") || undefined
  const control = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!error || motionDisabled() || !control.current) return
    control.current.animate(
      ["none", "translateX(-4px)", "translateX(4px)", "translateX(-4px)", "translateX(4px)", "none"].map((transform) => ({ transform })),
      { duration: 320, easing: "ease-in-out" },
    )
  }, [error])

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-muted-foreground"> (opcional)</span>}
      </label>
      <div ref={control}>{children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}</div>
      {hint && !error && (
        <p id={`${id}-dica`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        // Entra com fade + slide de 4 px (CSS; reduzido: só fade)
        <p id={`${id}-erro`} className="field-error text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

/** Campo invisível anti-spam (honeypot). */
export function Honeypot({ register }: { register: () => object }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Não preencha este campo
        <input type="text" tabIndex={-1} autoComplete="off" {...register()} />
      </label>
    </div>
  )
}
