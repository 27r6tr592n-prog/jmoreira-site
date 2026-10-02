// Diagnóstico rápido da home: o visitante escolhe o problema e recebe o que
// fazer agora, o serviço indicado e o WhatsApp com a mensagem pronta.
// Orientações conservadoras: segurança primeiro, nada que exija ferramenta.

export type Urgency = "agora" | "hoje" | "agendar"

export type TriageIcon = "plug" | "zap" | "flame" | "droplets" | "waves" | "shower" | "car" | "sun" | "wrench"

export type TriageItem = {
  id: string
  label: string
  icon: TriageIcon
  urgency: Urgency
  /** O que fazer enquanto o técnico não chega */
  now: string[]
  link: { href: string; label: string }
  tip?: { href: string; label: string }
}

export const urgencyLabel: Record<Urgency, string> = {
  agora: "Urgente: aja agora",
  hoje: "Resolva hoje",
  agendar: "Pode agendar",
}

export const triage: TriageItem[] = [
  {
    id: "falta-luz",
    label: "Faltou luz em parte da casa",
    icon: "plug",
    urgency: "hoje",
    now: [
      "Veja no quadro se algum disjuntor caiu e tente religar uma vez.",
      "Se ele cair de novo, deixe desligado.",
      "Pergunte aos vizinhos: se eles também estão sem luz, o problema é da concessionária.",
    ],
    link: { href: "/servicos/eletricista", label: "Eletricista" },
  },
  {
    id: "disjuntor",
    label: "Disjuntor desarmando",
    icon: "zap",
    urgency: "hoje",
    now: [
      "Tire da tomada os aparelhos daquele cômodo.",
      "Religue o disjuntor e ligue um aparelho por vez.",
      "Nunca troque por um disjuntor maior: o fio pode esquentar.",
    ],
    link: { href: "/servicos/eletricista", label: "Eletricista" },
    tip: { href: "/dicas/disjuntor-desarmando-sozinho", label: "Teste seguro em 4 passos" },
  },
  {
    id: "queimado",
    label: "Cheiro de queimado ou faísca",
    icon: "flame",
    urgency: "agora",
    now: [
      "Desligue o disjuntor geral.",
      "Não toque na tomada, no fio ou no aparelho.",
      "Se houver fumaça ou fogo, saia de casa e ligue 193 (Bombeiros).",
    ],
    link: { href: "/servicos/eletricista", label: "Eletricista" },
  },
  {
    id: "vazamento",
    label: "Vazamento ou conta de água alta",
    icon: "droplets",
    urgency: "hoje",
    now: [
      "Feche o registro do cômodo ou o registro geral.",
      "Afaste aparelhos e extensões elétricas da água.",
      "Com tudo fechado, veja se o hidrômetro continua girando.",
    ],
    link: { href: "/servicos/encanador", label: "Encanador" },
    tip: { href: "/dicas/como-identificar-vazamento-escondido", label: "Como achar vazamento escondido" },
  },
  {
    id: "entupimento",
    label: "Pia, ralo ou vaso entupido",
    icon: "waves",
    urgency: "hoje",
    now: [
      "Não use soda cáustica: ela pode danificar o cano.",
      "Se o vaso está cheio, não dê descarga de novo.",
      "Se a água estiver subindo, feche o registro.",
    ],
    link: { href: "/servicos/encanador", label: "Encanador" },
  },
  {
    id: "chuveiro",
    label: "Chuveiro não esquenta",
    icon: "shower",
    urgency: "agendar",
    now: [
      "Confira se a chave está na posição inverno.",
      "Veja se o disjuntor do chuveiro está ligado.",
      "Antes de mexer no chuveiro, desligue o disjuntor dele.",
    ],
    link: { href: "/servicos/eletricista", label: "Eletricista" },
  },
  {
    id: "bateria",
    label: "Carro não pega",
    icon: "car",
    urgency: "hoje",
    now: [
      "Espere um minuto entre uma tentativa de partida e outra.",
      "Painel acendendo fraco ou piscando costuma ser bateria.",
      "Anote o modelo e o ano do carro para separarmos a bateria certa.",
    ],
    link: { href: "/loja/categoria/baterias-automotivas", label: "Baterias" },
    tip: { href: "/dicas/quando-trocar-a-bateria-do-carro", label: "Quando trocar a bateria" },
  },
  {
    id: "solar",
    label: "Placas solares sujas",
    icon: "sun",
    urgency: "agendar",
    now: [
      "Compare a geração deste mês com a do mesmo mês do ano anterior no app do sistema.",
      "Sujeira visível sobre as placas reduz a geração: agende a limpeza.",
      "Não suba no telhado para lavar as placas.",
      "Luz vermelha ou código de erro no inversor: procure a empresa responsável pelo sistema (a JMoreira faz só a limpeza).",
    ],
    link: { href: "/servicos/limpeza-placas-solares", label: "Limpeza de placas solares" },
  },
  {
    id: "reparos",
    label: "Pequenos reparos em casa",
    icon: "wrench",
    urgency: "agendar",
    now: [
      "Faça a lista de tudo o que precisa de conserto.",
      "Tire uma foto de cada item.",
      "Mande tudo junto: sai mais barato resolver numa visita só.",
    ],
    link: { href: "/servicos/manutencao-residencial", label: "Manutenção residencial" },
  },
]
