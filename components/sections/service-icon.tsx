import { Building2, Droplets, House, Sun, Truck, Zap, type LucideProps } from "lucide-react"

import type { ServiceIcon as IconKey } from "@/lib/services"

const map = { zap: Zap, droplets: Droplets, sun: Sun, building: Building2, home: House, truck: Truck } as const

export function ServiceIcon({ name, ...props }: { name: IconKey } & LucideProps) {
  const Icon = map[name]
  return <Icon aria-hidden {...props} />
}
