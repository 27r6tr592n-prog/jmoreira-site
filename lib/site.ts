// Fonte única dos dados da empresa. Tudo que aparece no site (rodapé, JSON-LD,
// links de WhatsApp e telefone) sai daqui. Mantenha igual ao Perfil da Empresa
// no Google: nome, endereço e telefone idênticos ajudam na busca local.

export const site = {
  name: "JMoreira Serviços",
  legalName: "JMoreira Serviços",
  slogan: "JMoreira para já!",
  cnpj: "20.076.722/0001-37",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jmoreiraassistencia.com.br").replace(/\/$/, ""),
  address: {
    street: "Rua Lázaro Camargo Enke, 2282",
    district: "Jardim Alvorada",
    city: "São José do Rio Preto",
    state: "SP",
    cep: "15020-080",
    country: "BR",
  },
  // Calculado a partir do Plus Code do Perfil da Empresa no Google (58FG5JM3+5C).
  geo: { latitude: -20.81706, longitude: -49.39644 },
  phone: { display: "(17) 3214-4800", e164: "+551732144800" },
  whatsapp: { display: "(17) 99652-3680", e164: "5517996523680" },
  email: "contato@jmoreiraassistencia.com.br",
  social: {
    instagram: { handle: "@jmoreiraassistencia24horas", url: "https://www.instagram.com/jmoreiraassistencia24horas/" },
    facebook: { handle: "jmoreiraassistencia", url: "https://www.facebook.com/jmoreiraassistencia" },
  },
  rating: { value: 4.8, count: 86, source: "Google" },
  // Decisão conservadora: o briefing informa "7h às 21h" sem dias da semana.
  // Publicamos todos os dias até o cliente confirmar. TODO cliente: confirmar.
  hours: {
    label: "Todos os dias, das 7h às 21h",
    short: "7h às 21h",
    opens: "07:00",
    closes: "21:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  serviceArea: "São José do Rio Preto e região",
  promises: {
    arrivalMinutes: 120,
    arrivalCaveat: "Consulte a disponibilidade para sua localidade.",
    visitFee: 60,
    visitFeeRule: "Descontada do valor final se o serviço for fechado no mesmo dia.",
    providers: "2.500",
  },
} as const

export const fullAddress = `${site.address.street} — ${site.address.district}, ${site.address.city}/${site.address.state}, CEP ${site.address.cep}`

export const mapsQuery = encodeURIComponent(
  `${site.address.street}, ${site.address.district}, ${site.address.city} - ${site.address.state}, ${site.address.cep}`,
)
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`
export const telHref = `tel:${site.phone.e164}`

// TODO cliente: revisar a lista. São os bairros mais buscados; atendemos a cidade toda.
export const neighborhoods = [
  "Centro",
  "Boa Vista",
  "Redentora",
  "Nova Redentora",
  "Jardim Alvorada",
  "Vila Ercília",
  "Higienópolis",
  "Jardim Panorama",
  "Eldorado",
  "São Deocleciano",
  "Santo Antônio",
  "Jardim Vetorasso",
  "Jardim Tarraf",
  "Vila Imperial",
  "Vila Maceno",
  "Solo Sagrado",
  "Jardim Mugnaini",
  "Cidade Jardim",
  "Jardim Francisco Fernandes",
  "Parque Estoril",
  "Jardim Yolanda",
  "Jardim Canaã",
  "Vila Toninho",
  "Jardim Maria Lúcia",
  "Cecap",
  "Parque Industrial",
  "Bom Jardim",
  "Jardim Seyon",
  "Jardim Walkíria",
  "Damha",
] as const

export const nearbyCities = [
  "Mirassol",
  "Bady Bassitt",
  "Cedral",
  "Guapiaçu",
  "Ipiguá",
  "Potirendaba",
  "Bálsamo",
  "Nova Aliança",
  "Uchoa",
  "Onda Verde",
] as const

/** Menu principal. Leva e Traz em destaque; Dicas e Seja prestador ficam no rodapé. */
export const mainNav = [
  { href: "/servicos", label: "Serviços" },
  { href: "/loja", label: "E-commerce" },
  { href: "/leva-e-traz", label: "Leva e Traz", highlight: true },
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/contato", label: "Contato" },
] as const

/** Link do botão "Solicitar serviço" (header e menu do celular) */
export const requestServiceHref = "/servico-particular"
