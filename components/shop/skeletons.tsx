/** Esqueletos das páginas da loja (aparecem durante a navegação). */

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="skeleton aspect-square rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-6 w-1/2" />
        <div className="skeleton h-11 w-full" />
      </div>
    </div>
  )
}

export function ShopSkeleton() {
  return (
    <div role="status" aria-label="Carregando produtos" className="container-page py-10 sm:py-14">
      <div className="skeleton mb-3 h-4 w-40" />
      <div className="skeleton mb-8 h-10 w-full max-w-xl" />
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton h-9 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProductSkeleton() {
  return (
    <div role="status" aria-label="Carregando produto" className="container-page py-8 sm:py-12">
      <div className="skeleton mb-6 h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-3">
          <div className="skeleton aspect-square rounded-3xl" />
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton aspect-square" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-9 w-full" />
          <div className="skeleton h-9 w-3/4" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-12 w-48" />
          <div className="skeleton h-14 w-full" />
          <div className="skeleton h-32 w-full" />
        </div>
      </div>
    </div>
  )
}
