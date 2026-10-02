import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, BatteryCharging, Recycle, ShieldCheck, Store, Truck, Wrench } from "lucide-react"

import { WhatsAppIcon } from "@/components/brand/icons"
import { Breadcrumbs } from "@/components/sections/breadcrumbs"
import { SectionHeading } from "@/components/sections/section-heading"
import { JsonLd } from "@/components/seo/json-ld"
import { Price } from "@/components/shop/price"
import { ProductCard } from "@/components/shop/product-card"
import { ProductGallery } from "@/components/shop/product-gallery"
import { ProductPurchase } from "@/components/shop/product-purchase"
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog"
import { toCartItem } from "@/lib/cart-item"
import { notices } from "@/lib/copy"
import { formatBRL } from "@/lib/format"
import { pageMetadata, productJsonLd } from "@/lib/seo"
import { fullAddress } from "@/lib/site"
import { isBattery } from "@/lib/types"
import { whatsappUrl } from "@/lib/whatsapp"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const description = `${product.short_description} ${formatBRL(product.price)} à vista. Entrega no mesmo dia em São José do Rio Preto ou retirada na loja.`
  return pageMetadata({
    title: `${product.name} em Rio Preto`,
    description: description.length > 160 ? `${description.slice(0, 157)}…` : description,
    path: `/loja/${slug}`,
  })
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product, 4)
  const battery = isBattery(product)
  const inStock = product.stock > 0
  const installService = battery
    ? { href: "/servicos/frotas", label: "Instalação de bateria no local", text: "Levamos e instalamos, com teste do alternador." }
    : { href: "/servicos/encanador", label: "Precisa de alguém para instalar?", text: "Um encanador JMoreira instala a peça para você." }

  // Especificações: campos de bateria primeiro, depois as livres
  const specs = [
    ...(battery && product.amperage_ah ? [{ label: "Amperagem", value: `${product.amperage_ah} Ah` }] : []),
    ...(battery && product.voltage_v ? [{ label: "Tensão", value: `${product.voltage_v} V` }] : []),
    ...(product.warranty_months ? [{ label: "Garantia", value: `${product.warranty_months} meses` }] : []),
    ...product.specs.filter((s) => !(battery && (s.label === "Tensão" || s.label === "Capacidade"))),
    { label: "Marca", value: product.brand },
    { label: "Código (SKU)", value: product.sku },
    { label: "Peso aproximado", value: `${Number(product.weight_kg).toLocaleString("pt-BR")} kg` },
  ]

  return (
    <div className="pb-24 lg:pb-0">
      <JsonLd data={productJsonLd(product)} />

      <div className="container-page py-6 sm:py-8">
        <Breadcrumbs
          items={[
            { name: "Loja", path: "/loja" },
            { name: product.parent.name, path: `/loja/categoria/${product.parent.slug}` },
            ...(product.category.slug !== product.parent.slug
              ? [{ name: product.category.name, path: `/loja/categoria/${product.category.slug}` }]
              : []),
            { name: product.name, path: `/loja/${product.slug}` },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} name={product.name} />

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{product.brand}</p>
              <h1 data-wa-title={product.name} className="text-3xl leading-tight font-extrabold sm:text-4xl">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">{product.short_description}</p>
              {battery && (
                <ul className="flex flex-wrap gap-2 text-sm font-semibold" aria-label="Especificações principais">
                  {product.amperage_ah && <li className="rounded-lg bg-brand-soft px-3 py-1 text-brand-soft-ink">{product.amperage_ah} Ah</li>}
                  {product.voltage_v && <li className="rounded-lg bg-brand-soft px-3 py-1 text-brand-soft-ink">{product.voltage_v} V</li>}
                  {product.warranty_months && (
                    <li className="rounded-lg bg-brand-soft px-3 py-1 text-brand-soft-ink">Garantia de {product.warranty_months} meses</li>
                  )}
                </ul>
              )}
            </div>

            <div className="space-y-2 border-y py-5">
              <Price price={product.price} compareAt={product.compare_at_price} size="lg" />
              {product.trade_in_required && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Recycle className="size-4 shrink-0" aria-hidden />
                  {notices.tradeIn}
                </p>
              )}
              {inStock ? (
                <p className="flex items-center gap-2 text-sm font-bold text-success">
                  <Truck className="size-4 shrink-0" aria-hidden />
                  {notices.sameDay}
                </p>
              ) : (
                <p className="inline-flex rounded-full bg-foreground px-3 py-1 text-sm font-bold text-background">{notices.outOfStock}</p>
              )}
            </div>

            <ProductPurchase item={toCartItem(product)} />

            <ul className="grid gap-3 text-sm sm:grid-cols-2">
              <li className="flex gap-3 rounded-xl bg-surface p-3">
                <Store className="mt-0.5 size-5 shrink-0 text-brand-ink" aria-hidden />
                <span>
                  <strong className="block">Retirada grátis na loja</strong>
                  <span className="text-muted-foreground">{fullAddress}</span>
                </span>
              </li>
              <li className="flex gap-3 rounded-xl bg-surface p-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-ink" aria-hidden />
                <span>
                  <strong className="block">Compra garantida</strong>
                  <span className="text-muted-foreground">7 dias para desistir da compra online, com nota fiscal.</span>
                </span>
              </li>
            </ul>

            <a
              href={whatsappUrl(`Olá, JMoreira! Tenho uma dúvida sobre o produto ${product.name} (${product.sku}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-ink hover:underline"
            >
              <WhatsAppIcon className="size-5 text-whatsapp" />
              Tirar dúvida sobre este produto no WhatsApp
            </a>
          </div>
        </div>
      </div>

      <section aria-labelledby="detalhes" className="border-t bg-surface py-12 sm:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-8">
            <div>
              <h2 id="detalhes" className="text-2xl font-extrabold">
                Descrição
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed">
                {product.description.split("\n\n").map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </div>

            {battery && product.trade_in_required && product.trade_in_surcharge != null && (
              <div className="rounded-2xl border bg-card p-5">
                <h3 className="flex items-center gap-2 font-bold">
                  <Recycle className="size-5 text-success" aria-hidden />
                  Como funciona a troca da bateria usada
                </h3>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
                  <li>O preço anunciado já considera que você entrega a bateria velha.</li>
                  <li>Na entrega ou na instalação, recolhemos a usada. Na retirada, traga a bateria antiga com você.</li>
                  <li>Sem a bateria usada, há um acréscimo de {formatBRL(product.trade_in_surcharge)}.</li>
                  <li>A bateria velha segue para reciclagem, como exige a Resolução CONAMA 401/2008.</li>
                </ol>
              </div>
            )}
            {battery && (
              <p className="flex gap-2 text-sm text-muted-foreground">
                <BatteryCharging className="mt-0.5 size-4 shrink-0" aria-hidden />
                Especificações de referência. Confira a amperagem e a polaridade no manual do veículo ou na bateria atual. Na dúvida,
                mande uma foto no WhatsApp.
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold">Especificações técnicas</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border bg-card">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Especificações de {product.name}</caption>
                  <tbody>
                    {specs.map((s) => (
                      <tr key={s.label} className="border-b last:border-0">
                        <th scope="row" className="w-2/5 bg-surface px-4 py-3 font-semibold">
                          {s.label}
                        </th>
                        <td className="px-4 py-3">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Link href={installService.href} className="group flex items-center gap-4 rounded-2xl border bg-card p-5 hover:border-brand-ink/40">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-soft-ink">
                <Wrench className="size-6" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block font-bold">{installService.label}</span>
                <span className="block text-sm text-muted-foreground">{installService.text}</span>
              </span>
              <ArrowRight className="size-5 text-brand-ink transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="py-12 sm:py-16">
          <div className="container-page">
            <SectionHeading id="relacionados" title="Produtos relacionados" />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
