// Metadados das dicas (blog). O corpo de cada post fica em content/dicas/<slug>.mdx.

export type Post = {
  slug: string
  title: string
  description: string
  /** ISO date */
  date: string
  readingMinutes: number
  category: "Hidráulica" | "Elétrica" | "Baterias"
  service: string
  productCategory?: string
  image: { src: string; alt: string; position?: string }
}

export const posts: Post[] = [
  {
    slug: "como-identificar-vazamento-escondido",
    title: "Como identificar um vazamento escondido (antes da conta chegar)",
    description:
      "O teste do hidrômetro, os sinais na parede e no piso e os pontos onde o vazamento escondido mais aparece. Guia prático para quem mora em Rio Preto.",
    date: "2026-09-08",
    readingMinutes: 6,
    category: "Hidráulica",
    service: "encanador",
    productCategory: "hidraulica",
    image: { src: "/fotos/tecnico-encanador.jpg", alt: "Técnico da JMoreira verificando a hidráulica de um banheiro", position: "50% 35%" },
  },
  {
    slug: "quando-trocar-a-bateria-do-carro",
    title: "Quando trocar a bateria do carro: 6 sinais e como testar",
    description:
      "Partida lenta, luz no painel e idade da bateria. Veja como testar com um voltímetro, quanto tempo dura uma bateria no calor de Rio Preto e como escolher a certa.",
    date: "2026-09-15",
    readingMinutes: 5,
    category: "Baterias",
    service: "frotas",
    productCategory: "baterias-automotivas",
    image: { src: "/fotos/socorro-automotivo.jpg", alt: "Técnicos da JMoreira atendendo um carro que não pegou", position: "50% 55%" },
  },
  {
    slug: "disjuntor-desarmando-sozinho",
    title: "Disjuntor desarmando sozinho: o que fazer (e o que nunca fazer)",
    description:
      "Sobrecarga, curto ou fuga de corrente? Um teste seguro para descobrir a causa do disjuntor que desarma e os sinais de que é hora de chamar o eletricista.",
    date: "2026-09-22",
    readingMinutes: 5,
    category: "Elétrica",
    service: "eletricista",
    image: { src: "/fotos/tecnico-eletricista.jpg", alt: "Eletricista da JMoreira trabalhando na parte elétrica do teto", position: "50% 25%" },
  },
]

export const getPost = (slug: string) => posts.find((p) => p.slug === slug) ?? null

export const formatPostDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso))
