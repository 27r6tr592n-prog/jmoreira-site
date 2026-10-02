import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"

// Símbolo oficial (public/logo-jmoreira.png, extraído do site antigo).
// TODO cliente: pedir ao designer a versão vetorial (SVG) para nitidez máxima.
export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <Link href="/" className={cn("flex min-h-11 items-center gap-2.5 rounded-lg", className)} aria-label="JMoreira Serviços, página inicial">
      <Image src="/logo-jmoreira.png" alt="" width={40} height={40} priority className="size-10 rounded-lg" />
      <span className="flex flex-col leading-none" translate="no">
        <span className={cn("text-lg font-extrabold tracking-tight", inverse ? "text-white" : "text-foreground")}>JMoreira</span>{" "}
        <span className={cn("text-[0.7rem] font-semibold tracking-[0.18em] uppercase", inverse ? "text-white/70" : "text-muted-foreground")}>
          Serviços
        </span>
      </span>
    </Link>
  )
}
