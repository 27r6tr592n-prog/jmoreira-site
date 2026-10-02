# Briefing v3: conteúdo, E-commerce, Leva e Traz e serviço particular

Classificação: **arquitetural** (seções novas, mudança no carrinho, renomeações no site todo).
Plano e lista de cortes aprovados pelo cliente em 2026-10-02.

## Decisões do cliente
- **Leva e Traz:** transporte de **pessoas**, **encomendas pequenas** e **transporte executivo**.
  Preço **a combinar** (nenhum valor publicado). A pesquisa de preços da região ficou registrada
  no PR, só como referência.
- **Mão de obra de instalação:** sob orçamento (item separado, sem preço no site).
- **Energia solar:** a JMoreira faz **só limpeza de placas**. Nada de instalação, inversor,
  troca de módulo, projeto/ART ou banco de baterias.
- **Repositório:** GitHub privado `27r6tr592n-prog/jmoreira-site`; trabalho na branch
  `feat/conteudo-v3`, entrega por PR, sem deploy.

## O que muda
1. **Textos técnicos e sem repetição.** Cada ideia fica num lugar só (tabela de cortes no PR).
2. **Solar → "Limpeza de placas solares"**: nova URL `/servicos/limpeza-placas-solares`;
   `/servicos/energia-solar` redireciona (301).
3. **"Loja" → "E-commerce"** no site todo; o local físico vira **"sede"**. URLs `/loja/...`
   mantidas; `/e-commerce` e `/e-commerce/*` redirecionam para elas.
4. **Peça + mão de obra:** opção "Contratar instalação" no produto e no carrinho. No carrinho,
   no checkout e na mensagem do pedido a instalação aparece como **linha própria**, "sob
   orçamento", fora do total. Texto fixo: comprar só a peça não inclui o serviço.
5. **Leva e Traz** (`/leva-e-traz`): item em destaque no menu, atalho no herói, formulário em
   2 etapas (tipo + origem + destino → telefone + e-mail + preferências), validação, estado de
   erro e de enviado, transições entre etapas (só fade com movimento reduzido).
6. **Serviço particular** (`/servico-particular`): formulário curto (o que precisa, endereço,
   telefone, melhor horário) e botão "Solicitar serviço" no header.
7. **Envio:** mesmo caminho dos formulários atuais (server action → tabela `leads` no Supabase,
   com `source` próprio) + tela de enviado com o WhatsApp da empresa já preenchido.
8. **Tipografia:** Source Serif 4 (títulos, 600) + IBM Plex Sans (texto e interface, 400/500/600),
   escala 13/16/20/25/31/39/49 px.
9. **Herói:** o card "Seu atendimento" (repetia o "Como funciona") dá lugar a atalhos de serviço.
10. **Menu:** Serviços · E-commerce · Leva e Traz · Quem somos · Contato + "Solicitar serviço";
    Dicas e Seja prestador no rodapé.

## Regras
Celular primeiro; `prefers-reduced-motion` respeitado; nada de preço, número, cliente ou
depoimento inventado; carrinho e checkout atuais continuam funcionando (testes e2e).
