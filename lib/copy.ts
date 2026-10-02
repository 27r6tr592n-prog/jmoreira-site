// Glossário e textos de interface reutilizados. Regra: o mesmo nome para a
// mesma coisa em todo o site (ex.: sempre "bateria usada", nunca "casco" ou
// "sucata"; sempre "visita técnica", nunca "deslocamento").
//
// Padrões adotados (design:ux-copy):
// - CTA começa com verbo e diz o resultado ("Chamar no WhatsApp", não "Clique aqui")
// - Erro = o que houve + como resolver
// - Estado vazio = o que é + por que está vazio + próximo passo
// - Carregamento diz o que está acontecendo ("Calculando frete…")

export const cta = {
  whatsapp: "Chamar no WhatsApp",
  whatsappShort: "WhatsApp",
  call: "Ligar agora",
  shop: "Ver peças e baterias",
  services: "Ver todos os serviços",
  addToCart: "Adicionar ao carrinho",
  checkout: "Finalizar compra",
  checkoutWhatsapp: "Finalizar pelo WhatsApp",
  payOnline: "Pagar online",
  askAvailability: "Consultar prazo no WhatsApp",
  continueShopping: "Continuar comprando",
  calcShipping: "Calcular",
} as const

export const loading = {
  shipping: "Calculando frete…",
  sending: "Enviando…",
  placingOrder: "Registrando pedido…",
  redirectingPayment: "Abrindo o pagamento…",
} as const

export const empty = {
  cartTitle: "Seu carrinho está vazio",
  cartBody: "Peças hidráulicas e baterias com entrega no mesmo dia em Rio Preto para itens em estoque.",
  searchTitle: (q: string) => (q ? `Nenhum produto encontrado para “${q}”` : "Nenhum produto com esses filtros"),
  searchBody: "Confira a grafia ou limpe os filtros. Não achou a peça? Mande uma foto dela no WhatsApp que a gente procura.",
} as const

export const notices = {
  outOfStock: "Sem estoque no momento",
  sameDay: "Entrega no mesmo dia em Rio Preto",
  tradeIn: "Preço com a entrega da bateria usada",
  onlineUnavailable:
    "O pagamento online está temporariamente indisponível. Seu pedido já foi registrado: envie pelo WhatsApp e combinamos o pagamento por lá (Pix ou cartão).",
} as const

export const errors = {
  generic: "Não conseguimos enviar agora. Tente de novo em instantes ou chame no WhatsApp.",
  network: "Sem conexão com o servidor. Confira sua internet e tente de novo.",
} as const
