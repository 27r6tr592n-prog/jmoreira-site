// Textos de SEO das páginas de categoria da loja (mapa em docs/seo-local.md).

type CategoryContent = { title: string; h1: string; description: string; intro: string }

const content: Record<string, CategoryContent> = {
  baterias: {
    title: "Baterias em Rio Preto: automotivas, moto e estacionárias",
    h1: "Baterias em Rio Preto com entrega no mesmo dia",
    description:
      "Baterias automotivas de 40Ah a 100Ah, de moto e estacionárias em São José do Rio Preto. Preço com troca da bateria usada, entrega no mesmo dia e até 10x sem juros.",
    intro: "Automotivas, de moto e estacionárias para nobreak e energia solar. Preço com a troca da bateria usada e entrega no mesmo dia em Rio Preto.",
  },
  "baterias-automotivas": {
    title: "Bateria automotiva em Rio Preto: 40Ah a 100Ah",
    h1: "Bateria automotiva em Rio Preto",
    description:
      "Bateria automotiva em São José do Rio Preto: Moura, Heliar e Zetta de 40Ah a 100Ah. Preço com troca da usada, entrega no mesmo dia e até 10x sem juros.",
    intro: "Da 40Ah do carro compacto à 100Ah da picape a diesel. Confira a amperagem no manual ou na bateria atual: na dúvida, mande uma foto no WhatsApp.",
  },
  "baterias-estacionarias": {
    title: "Bateria estacionária em Rio Preto: nobreak e solar",
    h1: "Baterias estacionárias para nobreak e energia solar",
    description:
      "Baterias estacionárias em Rio Preto para nobreak, alarme, cerca elétrica e energia solar off-grid. Entrega no mesmo dia e dimensionamento sem custo.",
    intro: "Baterias de ciclo profundo para quem precisa de energia quando a rede cai. Nossa equipe de energia solar ajuda a calcular quantas você precisa.",
  },
  "baterias-moto": {
    title: "Bateria de moto em Rio Preto",
    h1: "Bateria de moto em Rio Preto",
    description: "Bateria de moto em São José do Rio Preto para CG, Fan, Titan, Biz, Factor e motos até 300cc. Entrega no mesmo dia.",
    intro: "Baterias seladas, ativadas de fábrica, para as motos mais rodadas da cidade.",
  },
  hidraulica: {
    title: "Material hidráulico em Rio Preto: peças e reparos",
    h1: "Peças hidráulicas em Rio Preto",
    description:
      "Material hidráulico em São José do Rio Preto: registros, torneiras, tubos e conexões, reparos de descarga, boias e sifões. Entrega no mesmo dia ou retirada na loja.",
    intro: "As mesmas peças que nossos encanadores usam no dia a dia. Comprou e prefere não instalar? Chame um técnico JMoreira.",
  },
}

export function categoryContent(slug: string, name: string): CategoryContent {
  return (
    content[slug] ?? {
      title: `${name} em Rio Preto`,
      h1: `${name} em Rio Preto`,
      description: `${name} com entrega no mesmo dia em São José do Rio Preto ou retirada grátis na loja JMoreira, no Jardim Alvorada.`,
      intro: "Entrega no mesmo dia em Rio Preto para itens em estoque ou retirada grátis na loja.",
    }
  )
}
