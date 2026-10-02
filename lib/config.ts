// Regras comerciais do E-commerce. Valores conservadores; ajuste com o cliente.

export const pricing = {
  // Parcelamento sem juros no cartão. A parcela mínima evita "12x de R$ 1,24".
  maxInstallments: 10,
  minInstallment: 30,
  // Desconto no Pix/à vista. Começa em 0: preço único é a opção mais segura até o
  // cliente decidir a política (e evita divergência com o que o balcão pratica).
  pixDiscount: 0,
}

export const shipping = {
  // Rio Preto: CEPs 15000-000 a 15099-999 (faixa dos Correios para o município)
  localCepRange: [15000000, 15099999] as const,
  // Região: demais CEPs iniciados em 15 (Noroeste Paulista)
  regionCepRange: [15000000, 15999999] as const,
  local: {
    price: 14.9,
    freeAbove: 250,
    sameDayCutoffHour: 15,
    label: "Entrega JMoreira em Rio Preto",
  },
  region: {
    price: 29.9,
    freeAbove: 600,
    days: "1 a 2 dias úteis",
    label: "Entrega JMoreira na região",
  },
  // Fora da região: só hidráulica, por transportadora. Valor estimado por peso.
  // TODO: trocar por cotação real (Melhor Envio / Correios) quando houver contrato.
  carrier: {
    base: 32.9,
    perKg: 4.6,
    days: "4 a 9 dias úteis",
    label: "Transportadora (estimativa)",
  },
  pickup: {
    label: "Retirar na sede",
    leadTime: "Pronto em até 2 horas (itens em estoque)",
  },
} as const
