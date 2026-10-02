"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useId, useMemo, useState } from "react"
import { AnimatePresence, m } from "motion/react"
import { PackageSearch, Search, SlidersHorizontal, X } from "lucide-react"
import { cn } from "cn"

import { WhatsAppIcon } from "@/components/brand/icons"
import { MotionScope } from "@/components/motion/motion-scope"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  filterProducts,
  filtersToParams,
  matchesCategory,
  parseFilters,
  pricePresets,
  sortOptions,
  type CatalogFilters,
  type SortKey,
} from "@/lib/catalog-filter"
import { empty } from "@/lib/copy"
import { formatBRL } from "@/lib/format"
import { duration, easeOut } from "@/lib/motion"
import type { CategoryRow } from "@/lib/supabase/types"
import type { CatalogProduct } from "@/lib/types"
import { whatsappUrl } from "@/lib/whatsapp"
import { ProductCard } from "./product-card"

type Props = {
  products: CatalogProduct[]
  categories: CategoryRow[]
  /** Categoria fixada pela rota (/loja/categoria/[slug]) */
  category: string | null
}

export function ShopCatalog({ products, categories, category }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const paramsKey = searchParams.toString()
  const filters = useMemo(() => parseFilters(new URLSearchParams(paramsKey), category), [paramsKey, category])
  const [query, setQuery] = useState(filters.q)
  const [sheetOpen, setSheetOpen] = useState(false)
  // Só anima a grade quando o filtro muda (não no carregamento da página)

  const update = (patch: Partial<CatalogFilters>) => {
    const next = { ...filters, ...patch }
    const params = filtersToParams(next)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  // Busca com pequeno atraso para não reescrever a URL a cada tecla
  useEffect(() => {
    if (query === filters.q) return
    const t = setTimeout(() => update({ q: query.trim() }), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const results = useMemo(() => filterProducts(products, filters), [products, filters])
  const brandsInScope = useMemo(
    () => [...new Set(products.filter((p) => matchesCategory(p, category)).map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [products, category],
  )

  const activeCount =
    filters.brands.length + (filters.min != null || filters.max != null ? 1 : 0) + (filters.inStock ? 1 : 0)
  const hasAnyFilter = activeCount > 0 || Boolean(filters.q)

  const clearAll = () => {
    setQuery("")
    router.replace(pathname, { scroll: false })
  }

  const panel = (
    <FilterPanel
      categories={categories}
      category={category}
      filters={filters}
      brands={brandsInScope}
      onChange={update}
      preserveQuery={filtersToParams({ ...filters, brands: [], min: null, max: null }).toString()}
      onNavigate={() => setSheetOpen(false)}
    />
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:block" aria-label="Filtros">
        <div className="sticky top-28">{panel}</div>
      </aside>

      <div className="min-w-0 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor="busca-produtos" className="sr-only">
              Buscar produto
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="busca-produtos"
              name="q"
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Buscar por nome, marca ou medida (ex.: 60Ah)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 pl-11 text-base"
            />
          </div>
          <div className="flex gap-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger render={<Button variant="outline" size="lg" className="flex-1 lg:hidden" />}>
                <SlidersHorizontal aria-hidden />
                Filtros
                {activeCount > 0 && (
                  <span className="tabular grid size-5 place-items-center rounded-full bg-brand text-xs text-white">{activeCount}</span>
                )}
              </SheetTrigger>
              <SheetContent side="left" className="gap-0 p-0 data-[side=left]:w-[88vw] data-[side=left]:max-w-sm">
                <SheetHeader className="border-b px-5 py-4 pr-14">
                  <SheetTitle className="text-lg font-bold">Filtros</SheetTitle>
                  <SheetDescription>Refine por categoria, preço e marca.</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-5 py-5">{panel}</div>
                <SheetFooter className="border-t px-5 py-4">
                  <Button size="lg" className="w-full" onClick={() => setSheetOpen(false)}>
                    Ver {results.length} {results.length === 1 ? "produto" : "produtos"}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <label htmlFor="ordenar" className="sr-only">
              Ordenar por
            </label>
            <select
              id="ordenar"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="h-12 flex-1 rounded-xl border border-input bg-background px-3 text-sm font-semibold text-foreground sm:flex-none dark:bg-surface"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-2 text-sm text-muted-foreground" aria-live="polite">
            <strong className="text-foreground">{results.length}</strong> {results.length === 1 ? "produto" : "produtos"}
          </p>
          {filters.q && <Chip label={`“${filters.q}”`} onRemove={() => { setQuery(""); update({ q: "" }) }} />}
          {filters.brands.map((b) => (
            <Chip key={b} label={b} onRemove={() => update({ brands: filters.brands.filter((x) => x !== b) })} />
          ))}
          {(filters.min != null || filters.max != null) && (
            <Chip label={priceLabel(filters.min, filters.max)} onRemove={() => update({ min: null, max: null })} />
          )}
          {filters.inStock && <Chip label="Em estoque" onRemove={() => update({ inStock: false })} />}
          {hasAnyFilter && (
            <button type="button" onClick={clearAll} className="min-h-9 px-1 text-sm font-semibold text-brand-ink hover:underline">
              Limpar filtros
            </button>
          )}
        </div>

        {results.length > 0 ? (
          // Filtros com `layout` (domMax só aqui): quem fica desliza para o novo lugar, quem sai encolhe e some
          <MotionScope layout>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((p, i) => (
                <m.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: duration.enter, ease: easeOut, opacity: { duration: duration.micro } }}
                  className="flex"
                >
                  <div className="flex w-full flex-col [&>article]:flex-1">
                    <ProductCard product={p} priority={i < 2} />
                  </div>
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
          </MotionScope>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand-soft-ink">
              <PackageSearch className="size-7" aria-hidden />
            </span>
            <div className="max-w-md space-y-1.5">
              <p className="text-lg font-bold">{empty.searchTitle(filters.q)}</p>
              <p className="text-sm text-muted-foreground">{empty.searchBody}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {hasAnyFilter && (
                <Button variant="outline" size="lg" onClick={clearAll}>
                  Limpar filtros
                </Button>
              )}
              <a
                href={whatsappUrl(`Olá, JMoreira! Procurei no E-commerce e não achei: ${filters.q || "uma peça"}. Vocês têm?`)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "cta", size: "lg" })}
              >
                <WhatsAppIcon className="size-5" />
                Mandar foto da peça no WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function priceLabel(min: number | null, max: number | null) {
  if (min != null && max != null) return `${formatBRL(min)} a ${formatBRL(max)}`
  if (min != null) return `Acima de ${formatBRL(min)}`
  return `Até ${formatBRL(max ?? 0)}`
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft py-1 pr-1 pl-3 text-sm font-semibold text-brand-soft-ink">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="grid size-7 place-items-center rounded-full hover:bg-brand/15"
        aria-label={`Remover filtro ${label}`}
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </span>
  )
}

function FilterPanel({
  categories,
  category,
  filters,
  brands,
  onChange,
  preserveQuery,
  onNavigate,
}: {
  categories: CategoryRow[]
  category: string | null
  filters: CatalogFilters
  brands: string[]
  onChange: (patch: Partial<CatalogFilters>) => void
  preserveQuery: string
  onNavigate: () => void
}) {
  const uid = useId()
  const [min, setMin] = useState(filters.min?.toString() ?? "")
  const [max, setMax] = useState(filters.max?.toString() ?? "")
  useEffect(() => {
    setMin(filters.min?.toString() ?? "")
    setMax(filters.max?.toString() ?? "")
  }, [filters.min, filters.max])

  const parents = categories.filter((c) => !c.parent_id).sort((a, b) => a.sort_order - b.sort_order)
  const childrenOf = (id: string) => categories.filter((c) => c.parent_id === id).sort((a, b) => a.sort_order - b.sort_order)
  const suffix = preserveQuery ? `?${preserveQuery}` : ""

  const catLink = (slug: string | null, label: string, level: 0 | 1) => {
    const active = category === slug
    return (
      <Link
        href={slug ? `/loja/categoria/${slug}${suffix}` : `/loja${suffix}`}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-10 items-center rounded-lg px-3 text-sm transition-colors",
          level === 1 && "pl-6",
          active ? "bg-brand-soft font-bold text-brand-soft-ink" : "hover:bg-muted",
          level === 0 && !active && "font-semibold",
        )}
      >
        {label}
      </Link>
    )
  }

  const applyPrice = () => {
    const toNum = (v: string) => (v.trim() === "" ? null : Math.max(0, Number(v.replace(",", "."))))
    const nMin = toNum(min)
    const nMax = toNum(max)
    onChange({
      min: nMin != null && Number.isFinite(nMin) ? nMin : null,
      max: nMax != null && Number.isFinite(nMax) ? nMax : null,
    })
  }

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-2 text-sm font-bold">Categorias</legend>
        <ul className="space-y-0.5">
          <li>{catLink(null, "Todos os produtos", 0)}</li>
          {parents.map((p) => (
            <li key={p.id}>
              {catLink(p.slug, p.name, 0)}
              <ul className="space-y-0.5">
                {childrenOf(p.id).map((c) => (
                  <li key={c.id}>{catLink(c.slug, c.name, 1)}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-bold">Faixa de preço</legend>
        <div className="flex flex-wrap gap-2">
          {pricePresets.map((p) => {
            const active = filters.min === p.min && filters.max === p.max
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(active ? { min: null, max: null } : { min: p.min, max: p.max })}
                className={cn(
                  "min-h-9 rounded-full border px-3 text-sm font-medium transition-colors",
                  active ? "border-brand bg-brand text-white" : "hover:border-brand-ink/40 hover:bg-muted",
                )}
              >
                {p.label}
              </button>
            )
          })}
        </div>
        <form
          className="mt-3 flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            applyPrice()
          }}
        >
          <div className="flex-1">
            <label htmlFor={`${uid}-min`} className="mb-1 block text-xs font-medium text-muted-foreground">
              Mínimo (R$)
            </label>
            <Input id={`${uid}-min`} name="min" autoComplete="off" inputMode="decimal" value={min} onChange={(e) => setMin(e.target.value)} placeholder="0" className="h-10" />
          </div>
          <div className="flex-1">
            <label htmlFor={`${uid}-max`} className="mb-1 block text-xs font-medium text-muted-foreground">
              Máximo (R$)
            </label>
            <Input id={`${uid}-max`} name="max" autoComplete="off" inputMode="decimal" value={max} onChange={(e) => setMax(e.target.value)} placeholder="2000" className="h-10" />
          </div>
          <Button type="submit" variant="outline" size="sm" className="h-10">
            Aplicar
          </Button>
        </form>
      </fieldset>

      {brands.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-sm font-bold">Marcas</legend>
          <ul className="space-y-0.5">
            {brands.map((b) => {
              const checked = filters.brands.includes(b)
              return (
                <li key={b}>
                  <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm hover:bg-muted">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) =>
                        onChange({ brands: v ? [...filters.brands, b] : filters.brands.filter((x) => x !== b) })
                      }
                    />
                    {b}
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
      )}

      <fieldset>
        <legend className="sr-only">Disponibilidade</legend>
        <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-semibold hover:bg-muted">
          <Checkbox checked={filters.inStock} onCheckedChange={(v) => onChange({ inStock: v === true })} />
          Só produtos em estoque
        </label>
      </fieldset>
    </div>
  )
}
