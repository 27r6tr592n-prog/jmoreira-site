import type { Metadata } from "next"

import type { Post } from "@/lib/posts"
import type { Faq, Service } from "@/lib/services"
import { nearbyCities, site } from "@/lib/site"
import type { CatalogProduct } from "@/lib/types"

const BUSINESS_ID = `${site.url}/#empresa`

/** Metadata padrão de página: canonical, Open Graph e Twitter. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = "website",
}: {
  title: string
  description: string
  path: string
  absoluteTitle?: boolean
  type?: "website" | "article"
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type, locale: "pt_BR", siteName: site.name },
    twitter: { card: "summary_large_image", title, description },
  }
}

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Electrician", "Plumber"],
    "@id": BUSINESS_ID,
    name: site.name,
    slogan: site.slogan,
    url: site.url,
    logo: `${site.url}/logo-jmoreira.png`,
    image: [`${site.url}/fotos/fachada-sede.jpg`, `${site.url}/opengraph-image`],
    telephone: site.phone.e164,
    email: site.email,
    taxID: site.cnpj,
    priceRange: "$$",
    currenciesAccepted: "BRL",
    paymentAccepted: "Pix, cartão de crédito, cartão de débito, dinheiro",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.cep,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.latitude, longitude: site.geo.longitude },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    areaServed: [site.address.city, ...nearbyCities].map((name) => ({ "@type": "City", name })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [site.social.instagram.url, site.social.facebook.url],
    contactPoint: [
      { "@type": "ContactPoint", telephone: site.phone.e164, contactType: "customer service", availableLanguage: "Portuguese" },
      { "@type": "ContactPoint", telephone: `+${site.whatsapp.e164}`, contactType: "sales", availableLanguage: "Portuguese" },
    ],
  }
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.seo.title,
    serviceType: service.name,
    description: service.seo.description,
    url: `${site.url}/servicos/${service.slug}`,
    provider: { "@id": BUSINESS_ID },
    areaServed: [site.address.city, ...nearbyCities].map((name) => ({ "@type": "City", name })),
    offers: {
      "@type": "Offer",
      name: "Visita técnica de orçamento",
      price: site.promises.visitFee,
      priceCurrency: "BRL",
      description: site.promises.visitFeeRule,
    },
  }
}

export function faqJsonLd(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  }
}

export function productJsonLd(product: CatalogProduct) {
  const url = `${site.url}/loja/${product.slug}`
  // Preço válido por 30 dias a partir do build; atualize o catálogo para renovar.
  const validUntil = new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10)
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.short_description,
    image: product.images.map((src) => (src.startsWith("http") ? src : `${site.url}${src}`)),
    brand: { "@type": "Brand", name: product.brand },
    category: `${product.parent.name} > ${product.category.name}`,
    additionalProperty: product.specs.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "BRL",
      price: product.price.toFixed(2),
      priceValidUntil: validUntil,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": BUSINESS_ID },
      // Direito de arrependimento em compras online (CDC, art. 49): 7 dias.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "BR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnInStore",
      },
    },
  }
}

export function articleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "pt-BR",
    mainEntityOfPage: `${site.url}/dicas/${post.slug}`,
    image: `${site.url}/dicas/${post.slug}/opengraph-image`,
    author: { "@id": BUSINESS_ID, "@type": "Organization", name: site.name },
    publisher: { "@id": BUSINESS_ID, "@type": "Organization", name: site.name, logo: `${site.url}/logo-jmoreira.png` },
  }
}
