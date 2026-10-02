// Textos de SEO das páginas de categoria do E-commerce (mapa em docs/seo-local.md).

type CategoryContent = { title: string; h1: string; description: string; intro: string }

const content: Record<string, CategoryContent> = {
  baterias: {
    title: "Baterias em Rio Preto: automotivas, moto e estacionárias",
    h1: "Baterias em Rio Preto com entrega no mesmo dia",
    description:
      "Baterias automotivas de 40Ah a 100Ah, de moto e estacionárias em São José do Rio Preto. Preço com troca da bateria usada, entrega no mesmo dia e até 10x sem juros.",
    intro: "Automotivas, de moto e estacionárias. Preço com a troca da bateria usada e entrega no mesmo dia em Rio Preto. A instalação pode ser contratada junto, como item separado.",
  },
  "baterias-automotivas": {
    title: "Bateria automotiva em Rio Preto: 40Ah a 100Ah",
    h1: "Bateria automotiva em Rio Preto",
    description:
      "Bateria automotiva em São José do Rio Preto: Moura, Heliar e Zetta de 40Ah a 100Ah. Preço com troca da usada, entrega no mesmo dia e até 10x sem juros.",
    intro: "Da 40Ah do carro compacto à 100Ah da picape a diesel. Confira a amperagem no manual ou na bateria atual: na dúvida, mande uma foto no WhatsApp.",
  },
  "baterias-estacionarias": {
    title: "Bateria estacionária em Rio Preto: nobreak e off-grid",
    h1: "Baterias estacionárias",
    description:
      "Baterias estacionárias de ciclo profundo em São José do Rio Preto para nobreak, alarme, cerca elétrica e sistemas off-grid. Entrega no mesmo dia.",
    intro: "Baterias de ciclo profundo para nobreak, alarme, cerca elétrica e sistemas off-grid. Confira a capacidade indicada pelo fabricante do equipamento.",
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
      "Material hidráulico em São José do Rio Preto: registros, torneiras, tubos e conexões, reparos de descarga, boias e sifões. Entrega no mesmo dia ou retirada na sede.",
    intro: "Registros, torneiras, tubos, conexões e reparos usados nos atendimentos de hidráulica. A mão de obra de instalação pode ser contratada junto com a peça, como item separado e sob orçamento.",
  },
}

export function categoryContent(slug: string, name: string): CategoryContent {
  return (
    content[slug] ?? {
      title: `${name} em Rio Preto`,
      h1: `${name} em Rio Preto`,
      description: `${name} com entrega no mesmo dia em São José do Rio Preto ou retirada grátis na sede da JMoreira, no Jardim Alvorada.`,
      intro: "Entrega no mesmo dia em Rio Preto para itens em estoque ou retirada grátis na sede.",
    }
  )
}
