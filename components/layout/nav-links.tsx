"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

import { mainNav } from "@/lib/site"

export function NavLinks({ vertical = false, onNavigate }: { vertical?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <ul className={cn(vertical ? "flex flex-col gap-1" : "flex items-center gap-1")}>
      {mainNav.map((item, i) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <li key={item.href} className={vertical ? "animate-rise-in" : undefined} style={vertical ? { animationDelay: `${60 + i * 45}ms` } : undefined}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center rounded-lg font-semibold transition-colors",
                vertical ? "h-12 px-3 text-base" : "h-10 px-3 text-sm",
                active
                  ? "bg-brand-soft text-brand-soft-ink"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
