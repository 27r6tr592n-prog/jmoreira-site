import type { Metadata } from "next"

import { PageHero } from "@/components/sections/page-hero"
import { shipping } from "@/lib/config"
import { formatBRL } from "@/lib/format"
import { pageMetadata } from "@/lib/seo"
import { fullAddress, site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Privacidade, trocas e entregas",
  description: "Política de privacidade (LGPD), trocas e devoluções e regras de entrega do E-commerce JMoreira Serviços.",
  path: "/politicas",
})

// TODO cliente: texto-base escrito a partir do CDC e da LGPD. Recomenda-se
// revisão jurídica antes da publicação.

export default function PoliticasPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Privacidade, trocas e entregas", path: "/politicas" }]}
        eyebrow="Políticas"
        title="Privacidade, trocas e entregas"
        description="Regras claras para você comprar e contratar com tranquilidade."
      />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="Nesta página" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="space-y-1 text-sm">
            {[
              ["#privacidade", "Privacidade (LGPD)"],
              ["#trocas", "Trocas e devoluções"],
              ["#entregas", "Entregas e retirada"],
              ["#baterias", "Baterias usadas"],
              ["#servicos", "Garantia dos serviços"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="flex min-h-10 items-center rounded-lg px-3 hover:bg-muted">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="prose prose-slate max-w-3xl dark:prose-invert prose-headings:scroll-mt-28 prose-headings:font-bold prose-a:text-brand-ink">
          <h2 id="privacidade">Privacidade (LGPD)</h2>
          <p>
            A {site.legalName} (CNPJ {site.cnpj}) coleta apenas os dados necessários para atender você: nome, telefone, e-mail e
            endereço, informados nos formulários, no checkout ou no WhatsApp.
          </p>
          <ul>
            <li>
              <strong>Para que usamos:</strong> responder pedidos de orçamento, agendar visitas, entregar compras, emitir nota fiscal e
              avaliar cadastros de prestadores.
            </li>
            <li>
              <strong>Com quem compartilhamos:</strong> com o técnico que vai atender você, com o meio de pagamento (Mercado Pago) e com
              quem faz a entrega. Não vendemos dados.
            </li>
            <li>
              <strong>Seus direitos:</strong> você pode pedir acesso, correção ou exclusão dos seus dados pelo e-mail{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </li>
            <li>
              <strong>Cookies:</strong> o site usa apenas o armazenamento local do navegador para guardar o seu carrinho. O mapa
              incorporado é do Google e segue a política de privacidade do Google.
            </li>
          </ul>

          <h2 id="trocas">Trocas e devoluções</h2>
          <ul>
            <li>
              <strong>Arrependimento:</strong> em compras feitas pelo site, você tem 7 dias corridos a partir do recebimento para
              desistir, com reembolso integral (Código de Defesa do Consumidor, art. 49). O produto deve voltar sem sinais de uso ou
              instalação.
            </li>
            <li>
              <strong>Defeito:</strong> produtos com defeito podem ser trocados dentro da garantia do fabricante. Traga o produto e a
              nota fiscal até a sede ou fale com a gente no WhatsApp.
            </li>
            <li>
              <strong>Peça errada:</strong> se a medida não servir, trocamos por outra sem custo, desde que o produto não tenha sido
              instalado.
            </li>
          </ul>

          <h2 id="entregas">Entregas e retirada</h2>
          <ul>
            <li>
              <strong>São José do Rio Preto:</strong> entrega própria por {formatBRL(shipping.local.price)}, grátis acima de{" "}
              {formatBRL(shipping.local.freeAbove)}. Itens em estoque com pedido até as {shipping.local.sameDayCutoffHour}h de dias
              úteis chegam no mesmo dia.
            </li>
            <li>
              <strong>Região:</strong> {formatBRL(shipping.region.price)}, grátis acima de {formatBRL(shipping.region.freeAbove)}, em{" "}
              {shipping.region.days}.
            </li>
            <li>
              <strong>Outras cidades:</strong> apenas peças hidráulicas, por transportadora. O valor exibido é uma estimativa e é
              confirmado pelo WhatsApp antes do envio.
            </li>
            <li>
              <strong>Retirada na sede:</strong> grátis, em {fullAddress}. Avisamos quando o pedido estiver separado.
            </li>
          </ul>

          <h2 id="baterias">Baterias usadas</h2>
          <p>
            O preço das baterias automotivas considera a entrega da bateria usada (base de troca). Sem ela, é cobrado o acréscimo
            indicado na página do produto. As baterias recolhidas seguem para reciclagem, conforme a Resolução CONAMA 401/2008. Por
            serem produto perigoso para transporte, baterias são entregues apenas em Rio Preto e região.
          </p>

          <h2 id="servicos">Garantia dos serviços</h2>
          <p>
            Todo serviço técnico tem garantia de 90 dias, conforme o Código de Defesa do Consumidor, contada a partir da conclusão. Se
            o problema voltar, chame no WhatsApp com o número do atendimento.
          </p>
        </div>
      </div>
    </>
  )
}
