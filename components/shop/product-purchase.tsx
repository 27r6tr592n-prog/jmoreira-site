"use client"

import { useState } from "react"

import { formatBRL } from "@/lib/format"
import { unitPrice } from "@/lib/pricing"
import type { CartItem } from "@/lib/store/cart"
import { AddToCartButton } from "./add-to-cart-button"
import { InstallationToggle, installationNote } from "./installation-toggle"
import { QuantityStepper } from "./quantity-stepper"
import { ShippingCalculator } from "./shipping-calculator"
import { TradeInToggle } from "./trade-in-toggle"

/** Bloco de compra da página de produto + barra fixa no celular. */
export function ProductPurchase({ item }: { item: Omit<CartItem, "quantity"> }) {
  const [quantity, setQuantity] = useState(1)
  const [tradeIn, setTradeIn] = useState(true)
  const [installation, setInstallation] = useState(false)
  const inStock = item.stock > 0
  const hasTradeIn = item.tradeIn !== null && item.tradeInSurcharge != null
  const price = unitPrice({ price: item.price, tradeInSurcharge: item.tradeInSurcharge, tradeIn: hasTradeIn ? tradeIn : null })

  return (
    <div className="space-y-5">
      {hasTradeIn && (
        <div className="rounded-2xl border border-cta/40 bg-warning-soft p-4">
          <TradeInToggle checked={tradeIn} surcharge={item.tradeInSurcharge!} onChange={setTradeIn} />
          {!tradeIn && (
            <p className="mt-2 text-sm font-semibold text-warning-ink">
              Preço sem a troca: <span className="tabular">{formatBRL(price)}</span>
            </p>
          )}
        </div>
      )}

      {inStock && item.installable && (
        <div className="rounded-2xl border bg-surface p-4">
          <InstallationToggle checked={installation} onChange={setInstallation} />
          <p className="mt-2 text-xs text-muted-foreground">{installationNote}</p>
        </div>
      )}

      {inStock && (
        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper label={item.name} value={quantity} max={item.stock} onChange={setQuantity} />
          <p className="text-sm text-muted-foreground">
            {item.stock <= 5 ? (
              <strong className="text-warning-ink">Últimas {item.stock} unidades</strong>
            ) : (
              <>
                <strong className="text-success">Em estoque</strong> · {item.stock} unidades
              </>
            )}
          </p>
        </div>
      )}

      <AddToCartButton
        item={item}
        quantity={quantity}
        tradeIn={hasTradeIn ? tradeIn : undefined}
        installation={item.installable ? installation : undefined}
        size="xl"
      />

      {inStock && (
        <ShippingCalculator
          items={[{ weightKg: item.weightKg, quantity, isBattery: item.isBattery, inStock }]}
          subtotal={price * quantity}
        />
      )}

      {/* Barra fixa no celular: preço + compra sempre à mão */}
      {inStock && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted-foreground">{item.name}</p>
              <p className="tabular text-lg font-bold">{formatBRL(price * quantity)}</p>
            </div>
            <AddToCartButton
              item={item}
              quantity={quantity}
              tradeIn={hasTradeIn ? tradeIn : undefined}
              installation={item.installable ? installation : undefined}
              size="lg"
              className="w-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}
