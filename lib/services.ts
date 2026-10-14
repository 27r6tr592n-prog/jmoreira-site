// Conteúdo das páginas de serviço (texto técnico + SEO local, mapa em docs/seo-local.md).
// Regras de redação (briefing v3): nome correto do serviço, do que é feito e o que
// está incluso; sem frase de propaganda; cada informação comercial (visita,
// garantia, prazo) aparece uma vez por página, nos selos do topo. Não prometer
// 24h (atendimento 7h–21h) nem inventar certificação.
// Energia solar: a JMoreira faz SOMENTE limpeza de placas. Nada de instalação.

export type ServiceIcon = "zap" | "droplets" | "sun" | "building" | "home" | "truck"

export type Faq = { q: string; a: string }

export type Service = {
  slug: string
  name: string
  icon: ServiceIcon
  audience: "Casa" | "Empresas" | "Casa e empresas"
  card: { summary: string }
  seo: { title: string; description: string }
  hero: { eyebrow: string; title: string; subtitle: string }
  /** Título da chamada final da página */
  ctaTitle: string
  /** Como o serviço é feito (sem repetir visita/garantia/prazo, que ficam nos selos) */
  intro: string
  included: { title: string; description: string }[]
  prep: string
  /** Só perguntas específicas do serviço; as gerais ficam em generalFaq */
  faq: Faq[]
  related: string[]
  /** Categoria do E-commerce com peças ligadas ao serviço */
  shopCategory?: string
  /** Slug da dica do blog relacionada */
  tip?: string
  /** position: ponto de foco da foto no recorte (CSS object-position) */
  image: { src: string; alt: string; position?: string }
}

export const services: Service[] = [
  {
    slug: "eletricista",
    name: "Eletricista",
    icon: "zap",
    audience: "Casa e empresas",
    card: {
      summary: "Instalação, manutenção e reparo de instalações elétricas de baixa tensão em casas e comércios.",
    },
    seo: {
      title: "Eletricista em São José do Rio Preto",
      description:
        "Eletricista em São José do Rio Preto: quadro de distribuição, disjuntores e DR, tomadas, chuveiro, iluminação e circuitos dedicados. Visita de R$ 60 descontada no serviço.",
    },
    hero: {
      eyebrow: "Elétrica residencial e comercial",
      title: "Eletricista em São José do Rio Preto",
      subtitle:
        "Instalação, manutenção e reparo da parte elétrica de baixa tensão, do quadro de distribuição às tomadas, com diagnóstico antes da troca de qualquer peça.",
    },
    ctaTitle: "Solicite um eletricista",
    intro:
      "O atendimento começa pelo diagnóstico: o técnico mede o circuito com defeito para identificar a causa (sobrecarga, fuga de corrente, mau contato ou aparelho em curto) antes de trocar componentes. Disjuntores, tomadas, fios e resistências de uso comum seguem no veículo; peças específicas entram no orçamento, aprovado antes do serviço.",
    included: [
      { title: "Quadro de distribuição", description: "Troca e reorganização do quadro, identificação dos circuitos e substituição de disjuntores." },
      { title: "Disjuntores e DR", description: "Diagnóstico de desarme e instalação de dispositivo DR, que desliga o circuito em caso de fuga de corrente." },
      { title: "Tomadas e interruptores", description: "Troca para o padrão de três pinos, correção de mau contato e aquecimento, instalação de novos pontos." },
      { title: "Chuveiro elétrico", description: "Instalação, troca de resistência e adequação de fiação e disjuntor à potência do aparelho." },
      { title: "Iluminação e ventilação", description: "Luminárias, spots, sensores de presença, iluminação externa e ventilador de teto." },
      { title: "Circuitos dedicados", description: "Circuito exclusivo para ar-condicionado, forno, cooktop de indução e máquina de lavar." },
    ],
    prep: "Para agilizar, mande pelo WhatsApp uma foto do quadro de luz aberto e diga o que acontece: desarma, esquenta ou está sem energia.",
    faq: [
      { q: "O técnico leva o material?", a: "Leva as peças de uso comum: disjuntores, tomadas, fios e resistências. Peças específicas entram no orçamento. Se preferir comprar a peça no E-commerce, a mão de obra de instalação é contratada à parte." },
      { q: "O que fazer se a tomada soltar faísca ou cheirar a queimado?", a: "Desligue o disjuntor do circuito (ou o geral) e não use a tomada até a avaliação. Se houver fogo ou fumaça, ligue para os Bombeiros (193)." },
    ],
    related: ["encanador", "manutencao-residencial", "manutencao-predial"],
    tip: "disjuntor-desarmando-sozinho",
    image: { src: "/fotos/tecnico-eletricista.jpg", alt: "Técnico da JMoreira, de uniforme, instalando uma luminária no teto", position: "50% 30%" },
  },
  {
    slug: "encanador",
    name: "Encanador",
    icon: "droplets",
    audience: "Casa e empresas",
    card: {
      summary: "Detecção e reparo de vazamentos, desentupimento e manutenção de caixa d'água, registros e válvulas.",
    },
    seo: {
      title: "Encanador em Rio Preto: vazamento e desentupimento",
      description:
        "Encanador em São José do Rio Preto: detecção de vazamento, desentupimento, limpeza de caixa d'água e troca de registros e válvulas. Visita de R$ 60 descontada no serviço.",
    },
    hero: {
      eyebrow: "Hidráulica residencial e comercial",
      title: "Encanador em São José do Rio Preto",
      subtitle:
        "Detecção e reparo de vazamentos, desentupimento e manutenção das instalações de água fria e esgoto em casas, apartamentos e comércios.",
    },
    ctaTitle: "Solicite um encanador",
    intro:
      "Antes de abrir parede ou piso, o vazamento é localizado por testes: fechamento de registros por trecho, leitura do hidrômetro e inspeção dos pontos de consumo. O reparo é feito só no trecho afetado, sem troca desnecessária de tubulação. Registros, reparos de descarga e torneiras-boia de uso comum seguem no veículo.",
    included: [
      { title: "Vazamentos", description: "Aparente e oculto em parede, piso e laje, com localização por testes antes de qualquer quebra." },
      { title: "Desentupimento", description: "Pia, ralo, vaso sanitário, tanque e caixa de gordura." },
      { title: "Caixa d'água", description: "Limpeza e higienização, troca de boia, reparo de vazamento e ligação do extravasor (ladrão)." },
      { title: "Registros e válvulas", description: "Registro de gaveta e de pressão, válvula de descarga e mecanismo de caixa acoplada." },
      { title: "Torneiras e metais", description: "Instalação e troca de torneira, misturador, sifão, flexível e engate." },
      { title: "Esgoto e mau cheiro", description: "Troca do anel de vedação do vaso, correção de ralo sem fecho hídrico e ventilação do esgoto." },
    ],
    prep: "Para agilizar, faça o teste do hidrômetro (tudo fechado: o relógio continua girando?) e mande uma foto do local molhado pelo WhatsApp.",
    faq: [
      { q: "Como saber se há vazamento?", a: "Feche todas as torneiras e aparelhos que usam água e observe o hidrômetro. Se ele continuar girando, há vazamento em algum trecho." },
      { q: "Precisa quebrar a parede para achar o vazamento?", a: "Só depois de localizar o ponto. Os testes são feitos por trecho para quebrar o mínimo, e o reparo usa luva de correr, sem trocar o cano inteiro." },
      { q: "De quanto em quanto tempo limpar a caixa d'água?", a: "A recomendação é a cada 6 meses. O serviço inclui esvaziamento, escovação, higienização e conferência de boia e tampa." },
    ],
    related: ["manutencao-residencial", "manutencao-predial", "eletricista"],
    shopCategory: "hidraulica",
    tip: "como-identificar-vazamento-escondido",
    image: { src: "/fotos/tecnico-encanador.jpg", alt: "Técnico da JMoreira, de uniforme, fazendo reparo hidráulico em um banheiro", position: "50% 40%" },
  },
  {
    slug: "limpeza-placas-solares",
    name: "Limpeza de placas solares",
    icon: "sun",
    audience: "Casa e empresas",
    card: {
      summary: "Limpeza de módulos fotovoltaicos com água desmineralizada e escova macia, sem produto abrasivo.",
    },
    seo: {
      title: "Limpeza de placas solares em Rio Preto",
      description:
        "Limpeza de placas solares (módulos fotovoltaicos) em São José do Rio Preto e região, com água desmineralizada e escova macia, sem produto abrasivo. Solicite pelo WhatsApp.",
    },
    hero: {
      eyebrow: "Módulos fotovoltaicos",
      title: "Limpeza de placas solares em São José do Rio Preto",
      subtitle:
        "Remoção da sujeira acumulada sobre os módulos, com água desmineralizada e escova de cerdas macias, sem produto abrasivo e sem jato de alta pressão.",
    },
    ctaTitle: "Agende a limpeza das placas",
    intro:
      "A sujeira sobre os módulos reduz a luz que chega às células e, com ela, a geração. No noroeste paulista, com poeira e pouca chuva no inverno, o acúmulo é rápido. A JMoreira faz somente a limpeza das placas: não instala, não altera e não faz manutenção elétrica de sistemas fotovoltaicos.",
    included: [
      { title: "Limpeza dos módulos", description: "Água desmineralizada e escova de cerdas macias em toda a superfície, que não riscam o vidro nem danificam as vedações." },
      { title: "Sujeira aderida", description: "Remoção de poeira, fuligem, folhas e sujeira de aves." },
      { title: "Limpeza periódica", description: "Recomendação de intervalo conforme o local: em geral a cada 6 meses, ou menos perto de estrada de terra, usina ou obra." },
    ],
    prep: "Para agilizar, mande pelo WhatsApp a quantidade de placas, o tipo de telhado e uma foto das placas.",
    faq: [
      { q: "De quanto em quanto tempo limpar as placas solares?", a: "Em Rio Preto, com poeira e pouca chuva no inverno, a média é a cada 6 meses. Perto de estrada de terra, usina de cana ou obra, pode ser preciso limpar com mais frequência." },
      { q: "Posso lavar as placas eu mesmo?", a: "Não é recomendado subir no telhado sem equipamento de segurança. Jato de alta pressão e produtos abrasivos também podem danificar o vidro e as vedações." },
      { q: "Vocês instalam ou consertam sistemas solares?", a: "Não. A JMoreira faz somente a limpeza das placas. Para instalação, troca de placa ou problema no inversor, procure a empresa responsável pelo sistema." },
    ],
    related: ["eletricista", "manutencao-predial", "manutencao-residencial"],
    // TODO cliente: foto real de limpeza de placas (a do site antigo é de banco de imagens)
    image: { src: "https://picsum.photos/seed/jmoreira-solar/1200/900", alt: "Placas solares sobre um telhado" },
  },
  {
    slug: "manutencao-predial",
    name: "Manutenção predial",
    icon: "building",
    audience: "Empresas",
    card: {
      summary: "Manutenção preventiva e corretiva das instalações elétricas e hidráulicas de condomínios e comércios.",
    },
    seo: {
      title: "Manutenção predial e de condomínios em Rio Preto",
      description:
        "Manutenção predial em São José do Rio Preto para condomínios e comércio: elétrica, hidráulica, bombas de recalque e caixas d'água. Preventiva e corretiva.",
    },
    hero: {
      eyebrow: "Condomínios e comércio",
      title: "Manutenção predial em São José do Rio Preto",
      subtitle:
        "Preventiva e corretiva para condomínios, salas comerciais e lojas: elétrica, hidráulica, bombas e reservatórios, com registro de cada atendimento.",
    },
    ctaTitle: "Solicite um plano de manutenção",
    intro:
      "A manutenção combina visitas preventivas programadas, com checklist de bombas, reservatórios, quadros e iluminação, e atendimento corretivo quando há falha. Cada visita gera um registro do que foi verificado e executado, que pode ser apresentado em assembleia. Planos de manutenção têm orçamento próprio.",
    included: [
      { title: "Bombas de recalque", description: "Revisão, troca de chave-boia, alternância entre bombas e substituição quando necessário." },
      { title: "Caixas d'água e cisternas", description: "Limpeza semestral, troca de boias e tampas e reparo de vazamentos." },
      { title: "Quadros e áreas comuns", description: "Quadros de distribuição e iluminação de garagem, corredores e fachada, com sensores e temporizadores." },
      { title: "Hidráulica de uso comum", description: "Vestiários, copas, banheiros de área comum e torneiras de jardim." },
      { title: "Preventiva programada", description: "Plano de visitas mensal ou bimestral, com checklist e relatório." },
      { title: "Comércio", description: "Serviços agendados depois do expediente, até as 21h." },
    ],
    prep: "Para orçar um plano, informe pelo WhatsApp quantos blocos ou andares tem o prédio, quantas bombas e caixas d'água e quando foi a última limpeza.",
    faq: [
      { q: "Vocês fazem contrato mensal?", a: "Sim. O plano de visitas preventivas é montado conforme o tamanho do prédio. Chamados corretivos fora do plano têm prioridade de agenda." },
      { q: "Emitem nota fiscal?", a: "Sim, nota fiscal de serviço para condomínios e empresas." },
      { q: "Como é feita a limpeza de caixa d'água de condomínio?", a: "Com programação prévia, aviso aos moradores e registro fotográfico do antes e depois." },
    ],
    related: ["eletricista", "encanador", "manutencao-residencial"],
    image: { src: "/fotos/equipe-jmoreira.jpg", alt: "Equipe da JMoreira reunida na recepção da sede, no Jardim Alvorada", position: "50% 45%" },
  },
  {
    slug: "manutencao-residencial",
    name: "Manutenção residencial",
    icon: "home",
    audience: "Casa",
    card: {
      summary: "Pequenos reparos elétricos, hidráulicos e de acabamento agrupados em uma única visita.",
    },
    seo: {
      title: "Manutenção residencial e pequenos reparos em Rio Preto",
      description:
        "Manutenção residencial em São José do Rio Preto (serviço conhecido como marido de aluguel): fixações, reparos elétricos e hidráulicos simples, vedação e pintura.",
    },
    hero: {
      eyebrow: "Pequenos reparos",
      title: "Manutenção residencial em São José do Rio Preto",
      subtitle:
        "Fixações, reparos elétricos e hidráulicos simples, vedação e pintura, executados pelo mesmo técnico em uma visita.",
    },
    ctaTitle: "Envie a lista de reparos",
    intro:
      "Os itens são levantados antes da visita, por lista e fotos no WhatsApp, para estimar tempo e material. O valor é fechado por lista antes de começar. Como o mesmo técnico faz elétrica, hidráulica e acabamento, não é preciso chamar um prestador para cada item.",
    included: [
      { title: "Instalações e fixações", description: "Suporte de TV, prateleiras, cortinas e persianas, varal, espelhos e quadros." },
      { title: "Reparos hidráulicos", description: "Torneira pingando, sifão, flexível, reparo de descarga e chuveiro." },
      { title: "Reparos elétricos", description: "Troca de tomada, interruptor, luminária, campainha e lâmpadas de difícil acesso." },
      { title: "Vedação e rejunte", description: "Silicone de box e pia, rejunte de piso e azulejo, vedação de janela." },
      { title: "Portas e janelas", description: "Ajuste de porta e dobradiça, fechadura e puxador, trilho de janela e de porta de correr." },
      { title: "Pintura", description: "Pintura de cômodos, retoque de paredes e portas e tratamento de mofo." },
    ],
    prep: "Para agilizar, mande pelo WhatsApp a lista de reparos com uma foto de cada item.",
    faq: [
      { q: "Preciso comprar o material?", a: "Não é obrigatório: o técnico pode levar o material, que entra no orçamento. Peças hidráulicas e baterias também estão no E-commerce; nesse caso, a mão de obra de instalação é contratada à parte." },
      { q: "Como é cobrado?", a: "Pela lista de serviços, com valor fechado antes de começar." },
      { q: "Vocês fazem pintura?", a: "Sim: cômodos, retoques e portas. Obras maiores são avaliadas na visita." },
    ],
    related: ["encanador", "eletricista", "manutencao-predial"],
    shopCategory: "hidraulica",
    image: { src: "/fotos/moto-atendimento.jpg", alt: "Moto de atendimento da JMoreira com baú identificado e telefone da empresa", position: "50% 55%" },
  },
  {
    // TODO cliente: escopo inferido do serviço "Socorro para autos" do site antigo e
    // da venda de baterias. Confirmar o que está incluso para frotas.
    slug: "frotas",
    name: "Frotas",
    icon: "truck",
    audience: "Empresas",
    card: {
      summary: "Troca de bateria no local, teste do sistema de partida e carga e socorro em pane de bateria para veículos de empresas.",
    },
    seo: {
      title: "Manutenção de frotas em Rio Preto: baterias e socorro",
      description:
        "Atendimento a frotas em São José do Rio Preto: troca de bateria no local, teste de alternador e motor de partida, socorro em pane de bateria. Nota fiscal para empresas.",
    },
    hero: {
      eyebrow: "Empresas com veículos",
      title: "Atendimento a frotas: bateria e sistema elétrico de partida",
      subtitle:
        "Troca de bateria onde o veículo estiver, teste do sistema de partida e carga e carga auxiliar para utilitários, carros, vans e motos de empresas.",
    },
    ctaTitle: "Solicite atendimento para a frota",
    intro:
      "O atendimento cobre bateria e sistema elétrico de partida e carga. Antes da troca, o técnico testa alternador, motor de partida e consumo com o veículo desligado, para confirmar que a bateria é a causa. A bateria usada é recolhida para reciclagem, conforme a Resolução CONAMA 401/2008. Não fazemos mecânica.",
    included: [
      { title: "Troca de bateria no local", description: "No pátio, na garagem ou onde o veículo parou, com recolhimento da bateria usada." },
      { title: "Teste do sistema de carga", description: "Alternador, motor de partida e consumo com o veículo desligado." },
      { title: "Socorro em pane de bateria", description: "Carga auxiliar para o veículo voltar a rodar até a troca." },
      { title: "Baterias para utilitários e motos", description: "Automotivas de 40Ah a 100Ah e de moto, com nota fiscal para a empresa." },
      { title: "Controle por veículo", description: "Registro da data de troca e da garantia de cada bateria, por placa." },
      { title: "Manutenção da base", description: "Elétrica e hidráulica de garagem, oficina e escritório." },
    ],
    prep: "Para agilizar, mande pelo WhatsApp a placa, o modelo do veículo e onde ele está. Para um plano, informe quantos veículos a frota tem.",
    faq: [
      { q: "Vocês atendem frotas de qualquer tamanho?", a: "Sim, de 2 a dezenas de veículos. Para frotas recorrentes, são combinadas condições comerciais e prioridade de agenda." },
      { q: "Emitem nota fiscal para a empresa?", a: "Sim, nota fiscal da bateria e do serviço no CNPJ da empresa." },
      { q: "O que fazem com a bateria usada?", a: "Recolhemos e encaminhamos para reciclagem, como exige a Resolução CONAMA 401/2008. A entrega da usada também reduz o preço da nova." },
      { q: "Vocês fazem mecânica?", a: "Não. O atendimento cobre bateria e sistema elétrico de partida e carga. Se outro problema for encontrado, você é avisado para levar o veículo à oficina." },
    ],
    related: ["eletricista", "manutencao-predial", "manutencao-residencial"],
    shopCategory: "baterias-automotivas",
    tip: "quando-trocar-a-bateria-do-carro",
    image: { src: "/fotos/socorro-automotivo.jpg", alt: "Técnicos da JMoreira atendendo um carro parado na rua", position: "50% 60%" },
  },
]

export const getService = (slug: string) => services.find((s) => s.slug === slug) ?? null

/** Passos do atendimento (home e páginas de serviço). Prazo e visita ficam nos selos/FAQ. */
export const howItWorks = [
  { title: "Contato pelo WhatsApp", description: "Descreva o problema e envie fotos. Informamos a previsão de chegada." },
  { title: "Agendamento", description: "No mesmo dia ou no horário que você escolher." },
  { title: "Visita técnica", description: "O técnico vai ao local com as peças de uso mais comum." },
  { title: "Orçamento e execução", description: "O serviço começa depois que você aprova o orçamento." },
] as const

/** FAQ geral (home). Prazo, horário e região numa resposta só. */
export const generalFaq: Faq[] = [
  {
    q: "Quanto custa a visita técnica?",
    a: "A visita de orçamento custa R$ 60,00. Se você aprovar o serviço no mesmo dia, esse valor é descontado do total. Você sempre recebe o orçamento antes de qualquer reparo.",
  },
  {
    // TODO cliente: confirmar as formas de pagamento aceitas no atendimento técnico.
    q: "Quais as formas de pagamento?",
    a: "Pix, cartão de crédito e débito e dinheiro. Serviços de valor maior podem ser parcelados no cartão. Confirme a forma de pagamento com o atendente ao agendar.",
  },
  {
    q: "O serviço tem garantia?",
    a: "Sim. Todo serviço tem 90 dias de garantia, como prevê o Código de Defesa do Consumidor. As peças têm ainda a garantia do fabricante.",
  },
  {
    q: "Em quanto tempo o técnico chega?",
    a: "Em até 120 minutos na maior parte de São José do Rio Preto, das 7h às 21h, todos os dias. Nas cidades da região o prazo pode ser maior. Confirmamos pelo WhatsApp antes de sair; mensagens fora do horário são respondidas na manhã seguinte.",
  },
]
