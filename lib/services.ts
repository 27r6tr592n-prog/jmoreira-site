// Conteúdo das páginas de serviço (textos de venda + SEO local).
// Escrito com marketing:draft-content seguindo o mapa de docs/seo-local.md.
// Regras de redação: não prometer 24h (atendimento 7h–21h), citar a ressalva dos
// 120 minutos, não inventar certificação que o cliente não confirmou.

export type ServiceIcon = "zap" | "droplets" | "sun" | "building" | "home" | "truck"

export type Faq = { q: string; a: string }

export type Service = {
  slug: string
  name: string
  icon: ServiceIcon
  audience: "Casa" | "Empresas" | "Casa e empresas"
  card: { summary: string; bullets: string[] }
  seo: { title: string; description: string }
  hero: { eyebrow: string; title: string; subtitle: string }
  /** Título da chamada final da página */
  ctaTitle: string
  intro: string
  included: { title: string; description: string }[]
  problems: { title: string; description: string }[]
  prep: string
  faq: Faq[]
  related: string[]
  /** Categoria da loja com peças ligadas ao serviço */
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
      summary: "Do disjuntor que desarma ao quadro novo. Diagnóstico com aparelho e serviço feito na hora.",
      bullets: ["Quadro de luz e disjuntores", "Chuveiro e tomadas", "Curto-circuito e falta de energia"],
    },
    seo: {
      title: "Eletricista em São José do Rio Preto",
      description:
        "Eletricista em São José do Rio Preto com chegada em até 2h. Quadro de luz, disjuntor, chuveiro, tomadas e curto-circuito. Visita de R$ 60 descontada. Chame no WhatsApp.",
    },
    hero: {
      eyebrow: "Eletricista em Rio Preto",
      title: "Eletricista em São José do Rio Preto, na sua casa em até 2 horas",
      subtitle:
        "Faltou luz em parte da casa, o disjuntor não para ligado ou o chuveiro queimou? Um técnico licenciado vai até você, encontra a causa e resolve no mesmo dia.",
    },
    ctaTitle: "Precisa de eletricista hoje?",
    intro:
      "A JMoreira atende como eletricista em São José do Rio Preto e região desde a sede no Jardim Alvorada. O técnico chega com multímetro, alicate amperímetro e as peças mais usadas no carro, para que a maior parte dos problemas elétricos se resolva na primeira visita. Antes de mexer em qualquer coisa, você recebe o orçamento por escrito. A visita custa R$ 60 e sai de graça se você aprovar o serviço no mesmo dia.",
    included: [
      { title: "Quadro de distribuição", description: "Troca e organização do quadro, identificação dos circuitos e substituição de disjuntores antigos." },
      { title: "Disjuntor e DR", description: "Disjuntor que desarma sozinho, disjuntor esquentando e instalação de DR, que protege contra choque." },
      { title: "Tomadas e interruptores", description: "Troca para o padrão novo de três pinos, tomadas que esquentam ou soltam faísca e novos pontos." },
      { title: "Chuveiro elétrico", description: "Instalação, troca de resistência e adequação do disjuntor e do fio para a potência do chuveiro." },
      { title: "Iluminação e ventilador", description: "Luminárias, spots, sensores de presença, iluminação externa e ventilador de teto." },
      { title: "Circuitos dedicados", description: "Circuito exclusivo para ar-condicionado, forno, cooktop de indução e máquina de lavar." },
    ],
    problems: [
      { title: "Disjuntor que desarma sozinho", description: "Pode ser sobrecarga, fuga de corrente ou um aparelho com defeito. Medimos antes de trocar qualquer peça." },
      { title: "Metade da casa sem energia", description: "Normalmente é uma fase caída, um disjuntor geral danificado ou uma conexão solta no padrão." },
      { title: "Cheiro de queimado na tomada", description: "Sinal de mau contato ou fio subdimensionado. Desligue o circuito e chame: é risco de incêndio." },
      { title: "Chuveiro que só esquenta morno", description: "Resistência no fim da vida, ou fio e disjuntor que não aguentam a potência do aparelho." },
      { title: "Choque em torneira ou eletrodoméstico", description: "Indica falta de aterramento ou fuga de corrente. O DR resolve e protege a família." },
      { title: "Lâmpadas piscando", description: "Pode ser interruptor, reator, conexão frouxa ou oscilação que vem da rede." },
    ],
    prep: "Para agilizar, mande pelo WhatsApp uma foto do quadro de luz aberto e conte o que acontece (desarma, esquenta, sem energia). Isso já nos ajuda a separar a peça certa.",
    faq: [
      { q: "Quanto custa a visita do eletricista?", a: "A visita de orçamento custa R$ 60,00. Se você aprovar o serviço no mesmo dia, esse valor é descontado do total. O orçamento é passado antes de qualquer reparo." },
      { q: "Vocês atendem eletricista 24 horas?", a: "Nosso atendimento é das 7h às 21h. Chamados que chegam depois disso entram no primeiro horário do dia seguinte. Em caso de cheiro de queimado ou fio soltando faísca, desligue o disjuntor geral e, se houver risco, ligue para os Bombeiros (193)." },
      { q: "Em quanto tempo o eletricista chega?", a: "Em até 120 minutos na maior parte de São José do Rio Preto. O prazo depende do bairro e da agenda do momento: confirmamos no WhatsApp antes de despachar o técnico." },
      { q: "O técnico leva o material?", a: "Leva as peças mais comuns (disjuntores, tomadas, fios, resistências). Peças específicas entram no orçamento; você também pode comprar na nossa loja e o técnico instala." },
      { q: "O serviço tem garantia?", a: "Sim. Todo serviço tem 90 dias de garantia, como prevê o Código de Defesa do Consumidor. As peças têm também a garantia do fabricante." },
    ],
    related: ["energia-solar", "manutencao-residencial", "manutencao-predial"],
    tip: "disjuntor-desarmando-sozinho",
    image: { src: "/fotos/tecnico-eletricista.jpg", alt: "Técnico da JMoreira, de uniforme, instalando uma luminária no teto", position: "50% 30%" },
  },
  {
    slug: "encanador",
    name: "Encanador",
    icon: "droplets",
    audience: "Casa e empresas",
    card: {
      summary: "Vazamento, entupimento e caixa d'água. Encontramos a origem do problema antes de quebrar parede.",
      bullets: ["Vazamentos e infiltrações", "Desentupimento", "Caixa d'água e registros"],
    },
    seo: {
      title: "Encanador em Rio Preto: vazamento e desentupimento",
      description:
        "Encanador em São José do Rio Preto para vazamento, desentupimento, caixa d'água e troca de registro. Chegada em até 2h e visita de R$ 60 descontada. Chame no WhatsApp.",
    },
    hero: {
      eyebrow: "Encanador em Rio Preto",
      title: "Encanador em Rio Preto para vazamento, entupimento e caixa d'água",
      subtitle:
        "Conta de água alta sem motivo, mancha na parede ou pia que não desce? O encanador da JMoreira encontra a origem e corrige quebrando o mínimo possível.",
    },
    ctaTitle: "Vazamento ou entupimento? Chame um encanador para já.",
    intro:
      "Somos encanadores em São José do Rio Preto para casa, apartamento e comércio. Antes de abrir parede, fazemos testes para localizar de onde vem a água: fechamento de registros, leitura do hidrômetro e inspeção dos pontos. Assim você só quebra onde precisa. Temos loja própria de peças hidráulicas, então registro, reparo de descarga e torneira-boia vão no carro do técnico.",
    included: [
      { title: "Vazamentos", description: "Vazamento aparente e oculto em parede, piso e laje. Localização por testes antes de quebrar." },
      { title: "Desentupimento", description: "Pia, ralo, vaso sanitário, tanque e caixa de gordura." },
      { title: "Caixa d'água", description: "Limpeza e higienização, troca de boia, conserto de vazamento e ligação de ladrão." },
      { title: "Registros e válvulas", description: "Troca de registro de gaveta e de pressão, válvula de descarga e reparo de caixa acoplada." },
      { title: "Torneiras e misturadores", description: "Instalação e troca de torneira, misturador, sifão, flexível e engate." },
      { title: "Esgoto e mau cheiro", description: "Troca do anel de vedação do vaso, ralo sem fecho hídrico e ventilação do esgoto." },
    ],
    problems: [
      { title: "Conta de água alta sem explicação", description: "Feche todas as torneiras e veja se o hidrômetro continua girando. Se continuar, há vazamento." },
      { title: "Mancha de umidade na parede", description: "Pode vir de cano furado, rejunte do box ou infiltração externa. Cada causa tem um conserto diferente." },
      { title: "Descarga que não para de correr", description: "Quase sempre é reparo ou vedação. Troca rápida, e o desperdício para no mesmo dia." },
      { title: "Pia ou ralo que não desce", description: "Gordura, cabelo e resto de comida. Desentupimos e orientamos para não voltar." },
      { title: "Ladrão da caixa d'água pingando", description: "Torneira-boia que não veda mais. Troca simples que evita desperdício diário." },
      { title: "Cheiro de esgoto no banheiro", description: "Anel do vaso ressecado ou ralo sem água no sifão. Resolvemos na visita." },
    ],
    prep: "Para agilizar, faça o teste do hidrômetro (tudo fechado, relógio girando?) e mande uma foto do local molhado pelo WhatsApp.",
    faq: [
      { q: "Vocês atendem encanador 24 horas?", a: "Nosso atendimento é das 7h às 21h. Se o vazamento começar fora desse horário, feche o registro geral (normalmente perto do hidrômetro) e mande mensagem no WhatsApp: entramos em contato no primeiro horário." },
      { q: "Quanto custa a visita do encanador?", a: "R$ 60,00, descontados do valor final se você fechar o serviço no mesmo dia. O orçamento é passado antes de começar." },
      { q: "Precisa quebrar a parede para achar o vazamento?", a: "Só depois de localizar o ponto. Fazemos testes por trecho para quebrar o mínimo, e o reparo é feito com luva de correr, sem trocar o cano inteiro." },
      { q: "Vocês fazem limpeza de caixa d'água?", a: "Sim. A recomendação é limpar a cada 6 meses. Esvaziamos, escovamos, higienizamos e conferimos boia e tampa." },
      { q: "O serviço tem garantia?", a: "Sim, 90 dias sobre o serviço, como prevê o Código de Defesa do Consumidor, além da garantia de fábrica das peças." },
    ],
    related: ["manutencao-residencial", "manutencao-predial", "eletricista"],
    shopCategory: "hidraulica",
    tip: "como-identificar-vazamento-escondido",
    image: { src: "/fotos/tecnico-encanador.jpg", alt: "Técnico da JMoreira, de uniforme, fazendo reparo hidráulico em um banheiro", position: "50% 40%" },
  },
  {
    slug: "energia-solar",
    name: "Energia solar",
    icon: "sun",
    audience: "Casa e empresas",
    card: {
      summary: "Instalação e manutenção de placas solares. Seu sistema gerando o que deveria gerar.",
      bullets: ["Limpeza e inspeção de placas", "Inversor e conexões", "Baterias para sistemas off-grid"],
    },
    seo: {
      title: "Energia solar em Rio Preto: instalação e manutenção",
      description:
        "Instalação e manutenção de energia solar em São José do Rio Preto: limpeza de placas, inspeção de inversor e conexões, baterias. Peça uma avaliação pelo WhatsApp.",
    },
    hero: {
      eyebrow: "Energia solar em Rio Preto",
      title: "Instalação e manutenção de energia solar em Rio Preto",
      subtitle:
        "Placa suja chega a gerar bem menos do que deveria, e no calor e na poeira do noroeste paulista isso acontece rápido. Cuidamos do sistema para ele continuar se pagando.",
    },
    ctaTitle: "Seu sistema solar está gerando o que deveria?",
    intro:
      "Fazemos manutenção de energia solar em São José do Rio Preto e região: limpeza de placas, inspeção elétrica, verificação do inversor e comparação da geração real com a esperada. Também instalamos sistemas novos e montamos bancos de baterias para quem quer backup ou energia fora da rede. Tudo começa com uma visita técnica e um relatório do que encontramos.",
    included: [
      { title: "Limpeza de placas", description: "Limpeza com água desmineralizada e escova macia, sem produto que risque o vidro ou tire a garantia." },
      { title: "Inspeção elétrica", description: "Conectores, cabos, string box, aterramento e proteção contra surtos." },
      { title: "Inversor", description: "Leitura de alarmes, reconexão ao Wi-Fi para monitoramento e análise do histórico de geração." },
      { title: "Troca de módulo", description: "Substituição de placa trincada por granizo ou com ponto quente." },
      { title: "Sistemas novos", description: "Dimensionamento pelo consumo, instalação e homologação na distribuidora, com projeto e ART de engenheiro responsável." },
      { title: "Baterias e backup", description: "Banco de baterias estacionárias para sistemas off-grid e para manter a casa ligada na falta de energia." },
    ],
    problems: [
      { title: "Geração caiu e ninguém viu", description: "Placa suja, sombra nova (árvore, construção) ou um string desligado. O app do inversor mostra a queda." },
      { title: "Inversor com luz vermelha", description: "Alarme de isolação, tensão da rede ou superaquecimento. Lemos o código e corrigimos a causa." },
      { title: "Conta de luz subiu mesmo com placas", description: "Pode ser problema no sistema, mudança de consumo ou erro na compensação dos créditos." },
      { title: "Placa trincada depois de chuva de granizo", description: "Módulo danificado perde rendimento e pode aquecer. Avaliamos e trocamos." },
      { title: "Inversor desconectado do monitoramento", description: "Troca de roteador ou de senha do Wi-Fi derruba o app. Reconectamos na visita." },
    ],
    prep: "Para agilizar, mande pelo WhatsApp uma foto do inversor (com a tela ligada) e um print do app de monitoramento, se tiver.",
    faq: [
      { q: "De quanto em quanto tempo limpar as placas solares?", a: "Em Rio Preto, com poeira e pouca chuva no inverno, a média é a cada 6 meses. Perto de estrada de terra, usina de cana ou obra, pode precisar de mais." },
      { q: "Posso lavar as placas eu mesmo?", a: "Não recomendamos subir no telhado sem equipamento de segurança. Lava-jato de alta pressão e produtos abrasivos também podem danificar o vidro e as vedações." },
      { q: "Vocês fazem projeto e homologação de sistema novo?", a: "Sim. A instalação inclui o dimensionamento pelo seu consumo e a documentação para a distribuidora, com projeto e ART emitidos por engenheiro responsável." },
      { q: "Quanto custa a visita técnica?", a: "A visita de avaliação custa R$ 60,00 e é descontada se você fechar o serviço no mesmo dia." },
      { q: "Vocês vendem baterias para energia solar?", a: "Sim, temos baterias estacionárias de ciclo profundo na loja, com entrega em Rio Preto e região. Calculamos quantas você precisa antes da compra." },
    ],
    related: ["eletricista", "manutencao-predial", "frotas"],
    shopCategory: "baterias-estacionarias",
    // TODO cliente: foto real de instalação solar (a do site antigo é de banco de imagens)
    image: { src: "https://picsum.photos/seed/jmoreira-solar/1200/900", alt: "Placas solares instaladas em um telhado" },
  },
  {
    slug: "manutencao-predial",
    name: "Manutenção predial",
    icon: "building",
    audience: "Empresas",
    card: {
      summary: "Para condomínios e comércio. Preventiva e corretiva, com um responsável que conhece o prédio.",
      bullets: ["Bombas, caixas d'água e quadros", "Áreas comuns", "Plano de visitas mensais"],
    },
    seo: {
      title: "Manutenção predial e de condomínios em Rio Preto",
      description:
        "Manutenção predial em São José do Rio Preto para condomínios e comércio: elétrica, hidráulica, bombas e caixas d'água. Preventiva e corretiva. Chame no WhatsApp.",
    },
    hero: {
      eyebrow: "Para condomínios e comércio",
      title: "Manutenção predial para condomínios e comércio em Rio Preto",
      subtitle:
        "Síndico e gerente de loja não têm tempo para caçar prestador a cada problema. A JMoreira cuida da elétrica e da hidráulica do prédio, com histórico de cada atendimento.",
    },
    ctaTitle: "Quer um plano de manutenção para o seu prédio?",
    intro:
      "Fazemos manutenção predial em São José do Rio Preto para condomínios residenciais, salas comerciais, lojas e pequenas indústrias. O trabalho combina visitas preventivas, que evitam a bomba queimada no domingo, com atendimento corretivo quando algo quebra. Cada visita gera um registro do que foi feito, útil para prestar contas em assembleia.",
    included: [
      { title: "Bombas de recalque", description: "Revisão, troca de chave-boia, alternância entre bombas e substituição quando necessário." },
      { title: "Caixas d'água e cisternas", description: "Limpeza semestral, troca de boias, tampas e reparo de vazamentos." },
      { title: "Quadros e áreas comuns", description: "Quadros de distribuição, iluminação de garagem, corredores e fachada, sensores e temporizadores." },
      { title: "Hidráulica das unidades comuns", description: "Vestiários, copas, banheiros de área comum e torneiras de jardim." },
      { title: "Preventiva programada", description: "Plano de visitas mensal ou bimestral com checklist e relatório." },
      { title: "Comércio", description: "Manutenção fora do horário comercial (até 21h) para não fechar a loja." },
    ],
    problems: [
      { title: "Bomba de recalque queimada", description: "Muitas vezes é chave-boia travada e a bomba trabalhando a seco. A preventiva pega antes." },
      { title: "Lâmpadas da garagem queimando toda hora", description: "Oscilação, reator ruim ou circuito sobrecarregado. Resolvemos a causa, não só a lâmpada." },
      { title: "Infiltração entre andares", description: "Localizamos se vem de prumada, ralo ou unidade privativa, e orientamos quem é o responsável." },
      { title: "Caixa d'água vencida na limpeza", description: "Agendamos a limpeza com aviso aos moradores e registro com fotos." },
      { title: "Quadro de área comum antigo", description: "Disjuntores velhos e sem identificação. Reorganizamos e mapeamos os circuitos." },
    ],
    prep: "Para orçar um plano, conte pelo WhatsApp quantos blocos ou andares tem o prédio, quantas bombas e caixas d'água, e quando foi a última limpeza.",
    faq: [
      { q: "Vocês fazem contrato mensal?", a: "Sim, montamos um plano de visitas preventivas conforme o tamanho do prédio. Chamados corretivos fora do plano têm prioridade de agenda." },
      { q: "Emitem nota fiscal?", a: "Sim, emitimos nota fiscal de serviço para condomínios e empresas." },
      { q: "Atendem fora do horário comercial?", a: "Atendemos das 7h às 21h, todos os dias. Para comércio, podemos agendar o serviço depois do expediente, até as 21h." },
      { q: "Fazem limpeza de caixa d'água de condomínio?", a: "Sim, com programação prévia, aviso aos moradores e registro fotográfico do antes e depois." },
      { q: "Quanto custa a visita?", a: "A visita de avaliação é de R$ 60,00, descontada se o serviço for fechado no mesmo dia. Planos de manutenção têm orçamento próprio." },
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
      summary: "Aquela lista de pequenos reparos que nunca sai do papel. Resolvemos tudo numa visita só.",
      bullets: ["Instalações e fixações", "Pequenos reparos", "Pintura de cômodos"],
    },
    seo: {
      title: "Pequenos reparos e marido de aluguel em Rio Preto",
      description:
        "Manutenção residencial em São José do Rio Preto: pequenos reparos, instalação de suportes e prateleiras, vedação e pintura. Junte a lista e resolva numa visita. WhatsApp.",
    },
    hero: {
      eyebrow: "Pequenos reparos em Rio Preto",
      title: "Pequenos reparos em casa, resolvidos numa visita só",
      subtitle:
        "Suporte de TV, prateleira, torneira pingando, silicone do box, porta raspando. Monte a lista que o técnico da JMoreira resolve tudo de uma vez.",
    },
    ctaTitle: "Monte a lista. A gente resolve numa visita.",
    intro:
      "É o serviço que muita gente procura como marido de aluguel em Rio Preto: um técnico de confiança para a lista de pequenos reparos da casa. Como o mesmo profissional resolve elétrica, hidráulica e acabamento, você não precisa chamar três prestadores. Mande a lista pelo WhatsApp e já recebe uma estimativa de tempo e valor antes da visita.",
    included: [
      { title: "Instalações e fixações", description: "Suporte de TV, prateleiras, cortinas e persianas, varal, espelhos e quadros." },
      { title: "Pequenos reparos hidráulicos", description: "Torneira pingando, sifão, flexível, reparo de descarga e chuveiro." },
      { title: "Pequenos reparos elétricos", description: "Troca de tomada, interruptor, luminária, campainha e lâmpadas de difícil acesso." },
      { title: "Vedação e rejunte", description: "Silicone de box e pia, rejunte de piso e azulejo, vedação de janela." },
      { title: "Portas e janelas", description: "Porta raspando, dobradiça, fechadura e puxador, trilho de janela e porta de correr." },
      { title: "Pintura", description: "Pintura de cômodos, retoque de paredes e portas, tratamento de mofo." },
    ],
    problems: [
      { title: "A lista que só cresce", description: "Agrupar os reparos numa visita sai mais barato do que chamar um prestador para cada item." },
      { title: "Mofo no canto do banheiro", description: "Tratamos a superfície e indicamos a causa (ventilação, infiltração, rejunte)." },
      { title: "Box com água vazando por baixo", description: "Silicone vencido ou rejunte aberto. Refazemos a vedação." },
      { title: "Porta que não fecha direito", description: "Dobradiça cedendo ou batente desalinhado. Ajuste rápido." },
      { title: "Mudança para casa nova", description: "Instalamos suportes, cortinas, luminárias e chuveiro antes de você se mudar." },
    ],
    prep: "Para agilizar, mande pelo WhatsApp a lista de reparos com uma foto de cada item. Respondemos com a estimativa de tempo e valor.",
    faq: [
      { q: "Vocês atendem como marido de aluguel?", a: "Sim. É exatamente esse serviço: um técnico para vários pequenos reparos numa só visita, com orçamento antes de começar." },
      { q: "Preciso comprar o material?", a: "Se preferir, sim. Ou o técnico leva o material e ele entra no orçamento. Peças hidráulicas temos na nossa loja." },
      { q: "Como é cobrado?", a: "Pela lista de serviços, com valor fechado antes de começar. A visita de R$ 60,00 é descontada se você aprovar no mesmo dia." },
      { q: "Vocês fazem pintura?", a: "Sim, pintura de cômodos, retoques e portas. Para obras grandes, avaliamos na visita." },
      { q: "O serviço tem garantia?", a: "Sim, 90 dias sobre o serviço, como prevê o Código de Defesa do Consumidor." },
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
      summary: "Bateria e pane elétrica dos veículos da sua empresa, resolvidas onde o carro estiver.",
      bullets: ["Troca de bateria no local", "Socorro em pane de bateria", "Condições para empresas"],
    },
    seo: {
      title: "Manutenção de frotas em Rio Preto: baterias e socorro",
      description:
        "Manutenção para frotas em São José do Rio Preto: troca de bateria no local, socorro em pane elétrica e manutenção da base. Condições para empresas. Chame no WhatsApp.",
    },
    hero: {
      eyebrow: "Para empresas com veículos",
      title: "Manutenção de frotas: bateria e pane elétrica resolvidas no local",
      subtitle:
        "Veículo parado é entrega atrasada. Levamos a bateria até o pátio, a garagem ou a rua, testamos o sistema de carga e colocamos o carro para rodar.",
    },
    ctaTitle: "Veículo parado? Chame a JMoreira.",
    intro:
      "Atendemos frotas de empresas em São José do Rio Preto e região: utilitários, carros de vendedores, vans e motos de entrega. O foco é o que mais para veículo no dia a dia, que é bateria e sistema elétrico de partida e carga. Como temos loja própria de baterias, o técnico já sai com a peça certa. Também cuidamos da elétrica e da hidráulica da base da empresa.",
    included: [
      { title: "Troca de bateria no local", description: "No pátio, na garagem ou onde o veículo parou, com recolhimento da bateria usada." },
      { title: "Teste do sistema de carga", description: "Alternador, motor de partida e consumo com o veículo desligado, para não trocar bateria à toa." },
      { title: "Socorro em pane de bateria", description: "Carga auxiliar para o veículo voltar a rodar até a troca." },
      { title: "Baterias para utilitários e motos", description: "Automotivas de 40Ah a 100Ah e de moto, com nota fiscal para a empresa." },
      { title: "Controle por veículo", description: "Registro de data de troca e garantia de cada bateria, por placa." },
      { title: "Manutenção da base", description: "Elétrica e hidráulica de garagem, oficina e escritório, com a mesma equipe." },
    ],
    problems: [
      { title: "Veículo que não pega de manhã", description: "Bateria no fim da vida ou consumo parasita (rastreador, som). Testamos antes de trocar." },
      { title: "Bateria trocada há pouco e já fraca", description: "Pode ser alternador carregando pouco. O teste mostra se o problema é a bateria." },
      { title: "Moto de entrega parada", description: "Bateria de moto em estoque e troca no local, para o entregador voltar à rota." },
      { title: "Sem controle de quando trocou", description: "Mantemos o histórico por placa para usar a garantia e planejar a próxima troca." },
    ],
    prep: "Para agilizar, mande pelo WhatsApp a placa, o modelo do veículo e onde ele está. Para um plano, informe quantos veículos tem a frota.",
    faq: [
      { q: "Vocês atendem frotas de qualquer tamanho?", a: "Sim, de 2 a dezenas de veículos. Para frotas recorrentes, combinamos condições comerciais e prioridade de agenda." },
      { q: "Emitem nota fiscal para a empresa?", a: "Sim, nota fiscal da bateria e do serviço no CNPJ da empresa." },
      { q: "O que fazem com a bateria usada?", a: "Recolhemos e encaminhamos para reciclagem, como exige a Resolução CONAMA 401/2008. A entrega da usada também reduz o preço da nova." },
      { q: "Em quanto tempo chegam?", a: "Em até 120 minutos em São José do Rio Preto, das 7h às 21h. Consulte a disponibilidade para outras cidades." },
      { q: "Vocês fazem mecânica?", a: "Não. Nosso foco é bateria e sistema elétrico de partida e carga. Se encontrarmos outro problema, avisamos para você levar à oficina de confiança." },
    ],
    related: ["eletricista", "manutencao-predial", "energia-solar"],
    shopCategory: "baterias-automotivas",
    tip: "quando-trocar-a-bateria-do-carro",
    image: { src: "/fotos/socorro-automotivo.jpg", alt: "Técnicos da JMoreira atendendo um carro parado na rua", position: "50% 60%" },
  },
]

export const getService = (slug: string) => services.find((s) => s.slug === slug) ?? null

/** Passos do atendimento (home e páginas de serviço) */
export const howItWorks = [
  { title: "Você chama no WhatsApp", description: "Conte o problema e mande uma foto. Respondemos com a previsão de chegada." },
  { title: "Agendamos a visita", description: "Na hora ou no horário que for melhor para você, das 7h às 21h." },
  { title: "Técnico vai até você", description: "Em até 120 minutos em Rio Preto*, identificado e com as peças mais usadas." },
  { title: "Orçamento aprovado, serviço feito", description: "Você aprova o valor antes. Fechando no dia, a visita de R$ 60 é descontada." },
] as const

/** FAQ geral (home e /servicos) */
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
    a: "Em até 120 minutos na maior parte de São José do Rio Preto, das 7h às 21h. O prazo depende do bairro e da agenda do momento: confirmamos pelo WhatsApp antes de sair.",
  },
  {
    q: "Vocês atendem fora de Rio Preto?",
    a: "Sim, atendemos cidades da região, como Mirassol, Bady Bassitt, Cedral e Guapiaçu. O prazo de chegada pode ser maior: consulte a disponibilidade para a sua cidade pelo WhatsApp.",
  },
  {
    q: "Vocês atendem 24 horas?",
    a: "Nosso atendimento é das 7h às 21h, todos os dias. Mensagens enviadas fora desse horário são respondidas no primeiro horário da manhã.",
  },
]
