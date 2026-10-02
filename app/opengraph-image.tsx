import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "JMoreira Serviços: eletricista e encanador em São José do Rio Preto"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({
    eyebrow: "São José do Rio Preto e região",
    title: "Eletricista e encanador na sua casa em até 2 horas*",
    footer: "*Consulte a disponibilidade · Atendimento 7h às 21h",
  })
}
