/**
 * Fonte de dados editorial (versão PT-BR).
 *
 * Esta é a camada local que substitui temporariamente um CMS. A modelagem
 * abaixo espelha uma coleção "posts" do Payload CMS: para migrar, basta
 * trocar `posts` por um fetch em `${PAYLOAD_URL}/api/posts?depth=1` e manter
 * exatamente as mesmas chaves.
 */

export type PostSource = {
  label: string;
  url: string;
};

export type PostSection = {
  heading?: string;
  paragraphs: string[];
};

export type PostCategory =
  | "Luto"
  | "Rodeio"
  | "Nashville"
  | "Premiações"
  | "Charts"
  | "Americana"
  | "Turnês"
  | "Artistas"
  | "Lançamentos";

export type Post = {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  category: PostCategory;
  tags: string[];
  author: string;
  publishedAt: string; // ISO
  publishedLabel: string;
  readingTime: string;
  summary: string[]; // bloco "Em resumo"
  sections: PostSection[];
  sources: PostSource[];
};

export const SITE_NAME = "Fazenda Rodeo Radio";
export const SITE_URL = "https://honky-tonk.lovable.app";
export const SITE_CTA =
  "🎧 Ouça Fazenda Rodeo Radio — Country Music, 100% Sem comerciais.";
export const AUTHOR = "Redação Fazenda Rodeo";

export const posts: Post[] = [
  {
    id: "1",
    slug: "adeus-dolly-parton-luto-country-2026",
    title:
      "Adeus a Dolly Parton: o Country se despede de uma de suas maiores vozes",
    seoTitle: "Morte de Dolly Parton: o adeus a uma lenda do country | Fazenda Rodeo Radio",
    metaDescription:
      "Dolly Parton morreu em 25 de agosto de 2026, aos 80 anos. Relembre o legado artístico, a filantropia e a primeira gravação póstuma da cantora.",
    excerpt:
      "Aos 80 anos, a artista que traduziu o Tennessee em canção deixa um legado que atravessa gerações — e uma primeira gravação póstuma lançada em setembro.",
    category: "Luto",
    tags: ["Dolly Parton", "Luto", "Nashville", "Legado"],
    author: AUTHOR,
    publishedAt: "2026-09-11",
    publishedLabel: "11 de setembro de 2026",
    readingTime: "5 min",
    summary: [
      "Dolly Parton morreu em 25 de agosto de 2026, aos 80 anos.",
      "A morte ocorreu após uma batalha breve contra o câncer, mantida em âmbito privado.",
      "Em setembro, a irmã Stella Parton afirmou que Dolly partiu em paz.",
      "A primeira gravação póstuma, \"Bound to Ride\", foi lançada em setembro e havia sido registrada em 2022.",
    ],
    sections: [
      {
        paragraphs: [
          "A música country perdeu uma de suas vozes definitivas. Dolly Parton morreu em 25 de agosto de 2026, aos 80 anos, encerrando uma trajetória que começou nas montanhas do Tennessee e terminou como referência mundial de canção popular.",
          "A morte veio após uma batalha breve contra o câncer, conduzida longe dos holofotes. A discrição foi coerente com a forma como a artista sempre separou a persona pública generosa da vida privada guardada.",
        ],
      },
      {
        heading: "Uma despedida em paz",
        paragraphs: [
          "Em setembro, sua irmã Stella Parton falou publicamente sobre os últimos dias e afirmou que Dolly estava em paz quando morreu. O relato familiar ajudou a dar contorno humano a uma perda que mobilizou Nashville e o público em todo o mundo.",
          "Nos dias seguintes, homenagens partiram de palcos, rádios e casas de show. O tom predominante não foi o do espetáculo, e sim o do reconhecimento: uma compositora que soube escrever sobre pobreza, fé, amor e independência sem jamais soar distante de quem a ouvia.",
        ],
      },
      {
        heading: "\"Bound to Ride\": a primeira gravação póstuma",
        paragraphs: [
          "Ainda em setembro chegou ao público \"Bound to Ride\", a primeira gravação póstuma da cantora. A faixa havia sido registrada em 2022 para um projeto de tributo aos Stanley Brothers, dupla fundamental do bluegrass.",
          "A escolha do repertório diz muito sobre o percurso dela. Mesmo depois de atravessar o pop, o cinema e a cultura de massa, Dolly seguiu voltando às raízes acústicas do gênero — o mesmo território sonoro em que sua voz aprendeu a se apoiar.",
        ],
      },
      {
        heading: "O legado além dos discos",
        paragraphs: [
          "Reduzir Dolly Parton ao catálogo seria injusto. Sua atuação filantrópica, com destaque para iniciativas de incentivo à leitura infantil, alcançou milhões de famílias e se tornou parte inseparável de sua biografia.",
          "Para o country, ela representou uma forma rara de equilíbrio: manteve a identidade rural e o sotaque das montanhas enquanto conversava com plateias que nunca haviam pisado no Tennessee. É esse duplo pertencimento que explica por que artistas de gerações tão diferentes a citam como origem.",
          "Na Fazenda Rodeo Radio, sua música continua tocando. É a maneira mais direta de manter viva uma obra que sempre foi feita para ser ouvida em voz alta.",
        ],
      },
    ],
    sources: [
      {
        label: "People — Stella Parton diz que Dolly estava em paz",
        url: "https://people.com/dolly-parton-sister-stella-says-country-icon-was-at-peace-when-she-died-12114574",
      },
      {
        label: "People — Primeira canção póstuma \"Bound to Ride\"",
        url: "https://people.com/dolly-parton-first-posthumous-song-bound-to-ride-12115377",
      },
    ],
  },
  {
    id: "2",
    slug: "barretos-2026-1-milhao-visitas-rodeio",
    title:
      "Barretos 2026 chega a 1 milhão de visitas e confirma a força do rodeio no Brasil",
    seoTitle: "Festa do Peão de Barretos 2026: 1 milhão de visitas | Fazenda Rodeo Radio",
    metaDescription:
      "A 71ª Festa do Peão de Barretos reuniu 1 milhão de visitas em 11 dias, público de 2.938 municípios e anunciou Chitãozinho & Xororó como embaixadores de 2027.",
    excerpt:
      "Onze dias, 1 milhão de visitas e compradores de ingressos em quase 3 mil cidades: a 71ª edição reafirmou Barretos como o centro do rodeio brasileiro.",
    category: "Rodeio",
    tags: ["Barretos", "Rodeio", "Sertanejo", "Brasil"],
    author: AUTHOR,
    publishedAt: "2026-09-11",
    publishedLabel: "11 de setembro de 2026",
    readingTime: "4 min",
    summary: [
      "A 71ª Festa do Peão de Barretos aconteceu de 20 a 30 de agosto de 2026.",
      "Foram 1 milhão de visitas em 11 dias de evento.",
      "Houve compradores de ingressos em 2.938 municípios brasileiros.",
      "Chitãozinho & Xororó foram anunciados como embaixadores da edição de 2027.",
    ],
    sections: [
      {
        paragraphs: [
          "A 71ª Festa do Peão de Barretos foi realizada entre 20 e 30 de agosto de 2026 e encerrou com um número que resume sua dimensão: 1 milhão de visitas em 11 dias de programação.",
          "Mais do que o volume, chama atenção a capilaridade. Segundo a organização, houve compradores de ingressos em 2.938 municípios brasileiros — um mapa que mostra o rodeio como fenômeno nacional, e não apenas regional.",
        ],
      },
      {
        heading: "A arena em números",
        paragraphs: [
          "Para a edição, foram anunciados cerca de 3,5 mil competidores distribuídos em nove modalidades, disputando mais de R$ 1,5 milhão em premiação.",
          "É essa estrutura esportiva que sustenta a festa. Antes de ser palco de shows, Barretos é um circuito competitivo com calendário, ranking e atletas que organizam a temporada em torno dele.",
        ],
      },
      {
        heading: "Encerramento e olhar para 2027",
        paragraphs: [
          "O encerramento coroou os campeões do rodeio e trouxe o anúncio mais comentado da noite: Chitãozinho & Xororó assumem como embaixadores da edição de 2027.",
          "A escolha tem simbolismo. A dupla é peça central na formação do público sertanejo contemporâneo e conecta o presente da festa com a história que a tornou a maior do gênero na América Latina.",
        ],
      },
      {
        heading: "Por que isso importa para o country",
        paragraphs: [
          "Barretos funciona como um espelho brasileiro do que Nashville representa nos Estados Unidos: um ponto de encontro onde esporte, indústria musical e cultura popular se cruzam.",
          "Para quem acompanha country e sertanejo, a edição de 2026 confirma que o público não só cresceu como se espalhou pelo país — e continua comprando ingresso para estar perto da arena.",
        ],
      },
    ],
    sources: [
      {
        label: "Os Independentes — 1 milhão de visitas e ingressos para mais de 2,9 mil cidades",
        url: "https://www.independentes.com.br/festadopeao/noticia/3608/-festa-do-peao-de-barretos-recebe-1-milhao-de-visitas-e-vende-ingressos-para-mais-de-29-mil-cidades",
      },
      {
        label: "Os Independentes — Encerramento, campeões e embaixadores de 2027",
        url: "https://www.independentes.com.br/festadopeao/noticia/3607/festa-do-peao-de-barretos-encerra-edicao-com-campeoes-do-rodeio-e-embaixadores-de-2027-",
      },
      {
        label: "Os Independentes — 11 dias de festa a partir do dia 20",
        url: "https://www.independentes.com.br/festadopeao/noticia/3528/maior-festa-do-peao-da-america-latina-movimenta-barretos-por-11-dias-a-partir-desta-quinta-dia-20",
      },
    ],
  },
  {
    id: "3",
    slug: "cma-awards-2026-ella-langley-indicacoes",
    title: "CMA Awards 2026: Ella Langley lidera indicações e disputa Artista do Ano",
    seoTitle: "CMA Awards 2026: indicados, favoritos e data | Fazenda Rodeo Radio",
    metaDescription:
      "Ella Langley lidera o 60º CMA Awards com 9 indicações. Veja os concorrentes a Entertainer of the Year e detalhes da cerimônia em 18 de novembro de 2026.",
    excerpt:
      "Com nove indicações, Ella Langley encabeça a 60ª edição do CMA Awards e concorre ao prêmio principal ao lado de Chris Stapleton e Lainey Wilson.",
    category: "Premiações",
    tags: ["CMA Awards", "Ella Langley", "Nashville", "Premiações"],
    author: AUTHOR,
    publishedAt: "2026-09-11",
    publishedLabel: "11 de setembro de 2026",
    readingTime: "4 min",
    summary: [
      "As indicações foram anunciadas em 10 de setembro de 2026.",
      "Ella Langley lidera com 9 indicações; Miranda Lambert tem 7.",
      "Entertainer of the Year: Ella Langley, Luke Combs, Cody Johnson, Chris Stapleton e Lainey Wilson.",
      "A cerimônia acontece em 18 de novembro no Bridgestone Arena, em Nashville.",
    ],
    sections: [
      {
        paragraphs: [
          "A CMA anunciou em 10 de setembro os indicados da 60ª edição do CMA Awards, e o nome que domina a lista é o de Ella Langley, com nove indicações.",
          "Logo atrás aparece Miranda Lambert, com sete. Kacey Musgraves e Ben West somam cinco cada, enquanto Cody Johnson, Chris Stapleton e Stephen Wilson Jr. aparecem com quatro.",
        ],
      },
      {
        heading: "A disputa pelo prêmio principal",
        paragraphs: [
          "A categoria Entertainer of the Year reúne Ella Langley, Luke Combs, Cody Johnson, Chris Stapleton e Lainey Wilson.",
          "É uma lista que combina nomes já consolidados como cabeças de cartaz com uma artista em ascensão acelerada — situação que costuma tornar a votação imprevisível.",
        ],
      },
      {
        heading: "Uma temporada de estreias",
        paragraphs: [
          "Outro dado relevante da lista: 13 indicados chegam pela primeira vez à premiação. A renovação acompanha o momento comercial vivido pelo gênero, com artistas recentes ocupando espaço nas rádios e nas paradas.",
        ],
      },
      {
        heading: "Quando e onde",
        paragraphs: [
          "A cerimônia está marcada para 18 de novembro de 2026, no Bridgestone Arena, em Nashville — endereço habitual da premiação e ponto central do calendário do country.",
        ],
      },
    ],
    sources: [
      {
        label: "CMA — Anúncio dos indicados da 60ª edição",
        url: "https://www.cmaworld.com/cma-announces-nominees-for-the-60th-annual-cma-awards/",
      },
      {
        label: "ABC — Cobertura do CMA Awards",
        url: "https://abc.com/news/9522e0a5-01d9-4ba8-85f7-54dca140a645/category/828413",
      },
    ],
  },
  {
    id: "4",
    slug: "taylor-swift-volta-cma-awards-country-2026",
    title:
      "Taylor Swift volta ao CMA Awards após uma década e reacende sua ligação com o Country",
    seoTitle: "Taylor Swift confirma presença no CMA Awards 2026 | Fazenda Rodeo Radio",
    metaDescription:
      "Taylor Swift confirmou presença no CMA Awards 2026, após cerca de dez anos ausente, com \"I Knew It, I Knew You\" indicada a Single of the Year.",
    excerpt:
      "Indicada a Single of the Year, a artista que começou em Nashville retorna à premiação depois de aproximadamente dez anos de ausência.",
    category: "Nashville",
    tags: ["Taylor Swift", "CMA Awards", "Nashville", "Rádio Country"],
    author: AUTHOR,
    publishedAt: "2026-09-11",
    publishedLabel: "11 de setembro de 2026",
    readingTime: "3 min",
    summary: [
      "Taylor Swift confirmou presença no CMA Awards 2026.",
      "É seu retorno à cerimônia após cerca de dez anos.",
      "\"I Knew It, I Knew You\" foi indicada a Single of the Year.",
      "A canção alcançou o topo das rádios country dos Estados Unidos.",
    ],
    sections: [
      {
        paragraphs: [
          "Taylor Swift confirmou que estará no CMA Awards 2026. O detalhe que transforma a presença em notícia é o intervalo: a artista não comparecia à cerimônia havia cerca de dez anos.",
          "O retorno vem acompanhado de uma indicação. \"I Knew It, I Knew You\" concorre a Single of the Year, categoria que reconhece o desempenho da faixa ao longo do ano.",
        ],
      },
      {
        heading: "De volta às rádios country",
        paragraphs: [
          "A canção chegou ao topo das rádios country dos Estados Unidos, formato que foi o ponto de partida da carreira dela e que, por muitos anos, ficou fora de sua rota principal.",
          "Esse dado explica boa parte da repercussão: não se trata apenas de uma aparição, mas de um resultado concreto dentro do próprio ecossistema do gênero.",
        ],
      },
      {
        heading: "A origem em Nashville",
        paragraphs: [
          "Vale lembrar o começo. Taylor Swift construiu os primeiros anos de carreira em Nashville, escrevendo e gravando dentro da estrutura do country antes de migrar para o pop.",
          "O que acontece a partir daqui ainda é território aberto. Até o momento, o que está confirmado é a presença na cerimônia e a indicação — qualquer projeção sobre próximos álbuns permanece especulação.",
        ],
      },
    ],
    sources: [
      {
        label: "People — Taylor Swift confirma presença no CMA Awards 2026",
        url: "https://people.com/taylor-swift-confirms-attending-cma-awards-2026-12114666",
      },
      {
        label: "CMA — Indicados da 60ª edição",
        url: "https://www.cmaworld.com/cma-announces-nominees-for-the-60th-annual-cma-awards/",
      },
    ],
  },
  {
    id: "5",
    slug: "choosin-texas-musica-verao-2026-ella-langley",
    title:
      "\"Choosin' Texas\" vira a música do verão de 2026 e coloca o Country no centro das paradas",
    seoTitle: "Choosin' Texas é a música do verão 2026 da Billboard | Fazenda Rodeo Radio",
    metaDescription:
      "\"Choosin' Texas\", de Ella Langley, liderou o Billboard Songs of the Summer 2026 e chegou a 21 semanas no topo do Hot 100.",
    excerpt:
      "A faixa de Ella Langley liderou o Songs of the Summer da Billboard em um ano em que o country ocupou até o Top 5 inteiro do Hot 100.",
    category: "Charts",
    tags: ["Ella Langley", "Billboard", "Hot 100", "Charts"],
    author: AUTHOR,
    publishedAt: "2026-09-11",
    publishedLabel: "11 de setembro de 2026",
    readingTime: "4 min",
    summary: [
      "\"Choosin' Texas\", de Ella Langley, foi nº 1 no Billboard Songs of the Summer 2026.",
      "A faixa chegou a 21 semanas no topo do Hot 100 até 9 de setembro.",
      "Em agosto, canções country ocuparam todo o Top 5 do Hot 100 pela primeira vez.",
      "O gênero levou os três primeiros lugares do Songs of the Summer.",
    ],
    sections: [
      {
        paragraphs: [
          "O verão norte-americano de 2026 teve trilha definida: \"Choosin' Texas\", de Ella Langley, terminou como número 1 do ranking Songs of the Summer da Billboard.",
          "O desempenho não foi pontual. Até 9 de setembro, a faixa acumulava 21 semanas no topo do Hot 100 — uma permanência que a coloca entre os fenômenos de chart da década.",
        ],
      },
      {
        heading: "Um Top 5 inteiramente country",
        paragraphs: [
          "Em agosto, a parada registrou um marco inédito: músicas country ocuparam simultaneamente todas as cinco primeiras posições do Hot 100.",
          "É o tipo de dado que muda a leitura do mercado. O gênero deixou de ser categoria paralela para se tornar, naquele momento, o centro do consumo musical americano.",
        ],
      },
      {
        heading: "Três em três no ranking do verão",
        paragraphs: [
          "O domínio se repetiu no Songs of the Summer, com o pódio inteiro country: \"Choosin' Texas\", \"I Knew It, I Knew You\" e \"Be Her\".",
          "Para as rádios do gênero, o efeito é direto. A programação passa a disputar audiência com repertório que também é hit de massa — e isso amplia a porta de entrada para novos ouvintes.",
        ],
      },
    ],
    sources: [
      {
        label: "MusicRow — \"Choosin' Texas\" é a música do verão da Billboard",
        url: "https://musicrow.com/2026/09/choosin-texas-named-billboard-song-of-the-summer/",
      },
      {
        label: "MusicRow — Recorde de \"Choosin' Texas\" nas paradas",
        url: "https://musicrow.com/2026/09/ella-langleys-choosin-texas-breaks-billboard-chart-record/",
      },
    ],
  },
  {
    id: "6",
    slug: "grand-ole-opry-aniversario-2026-vince-gill-brad-paisley",
    title:
      "Grand Ole Opry amplia fim de semana de aniversário com Vince Gill, Brad Paisley e grandes nomes",
    seoTitle: "Aniversário do Grand Ole Opry 2026: programação | Fazenda Rodeo Radio",
    metaDescription:
      "O Grand Ole Opry ampliou seu fim de semana de aniversário, de 1º a 4 de outubro de 2026, com shows extras, festas na praça e ações comunitárias.",
    excerpt:
      "De 1º a 4 de outubro, a casa mais tradicional de Nashville amplia a celebração com shows extras e nomes históricos do gênero.",
    category: "Nashville",
    tags: ["Grand Ole Opry", "Nashville", "Vince Gill", "Brad Paisley"],
    author: AUTHOR,
    publishedAt: "2026-09-11",
    publishedLabel: "11 de setembro de 2026",
    readingTime: "3 min",
    summary: [
      "A programação de aniversário vai de 1º a 4 de outubro de 2026.",
      "Haverá shows extras, festas na praça e ações comunitárias.",
      "Entre os confirmados estão Vince Gill, Brad Paisley e Ricky Skaggs.",
      "A lista completa segue a programação divulgada pela própria casa.",
    ],
    sections: [
      {
        paragraphs: [
          "O Grand Ole Opry ampliou a celebração de seu aniversário em 2026. A programação se estende de 1º a 4 de outubro, transformando o que costuma ser uma noite especial em vários dias de eventos.",
          "Além dos shows adicionais, a casa preparou festas na praça e ações comunitárias, aproximando a comemoração de quem circula pelo entorno e não necessariamente entra no auditório.",
        ],
      },
      {
        heading: "Quem sobe ao palco",
        paragraphs: [
          "Conforme a programação disponível, estão entre os nomes confirmados Vince Gill, Brad Paisley, Steven Curtis Chapman, Bill Anderson, Suzy Bogguss, Rhonda Vincent, The Oak Ridge Boys e Ricky Skaggs.",
          "A combinação é típica do Opry: veteranos que ajudaram a definir o repertório clássico convivendo com artistas que mantêm o gênero em movimento.",
        ],
      },
      {
        heading: "Por que o Opry ainda importa",
        paragraphs: [
          "Poucas instituições musicais no mundo mantêm um programa vivo por tantas décadas. O Opry é, ao mesmo tempo, palco, rádio e arquivo em funcionamento.",
          "Para o ouvinte, o aniversário funciona como um bom ponto de reencontro com esse repertório — e é exatamente o tipo de acervo que segue tocando na Fazenda Rodeo Radio.",
        ],
      },
    ],
    sources: [
      { label: "Grand Ole Opry — Opry Birthday", url: "https://www.opry.com/opry-birthday" },
      {
        label: "Grand Ole Opry — Agenda de outubro de 2026",
        url: "https://www.opry.com/events/filtered/2026/October",
      },
      {
        label: "MusicRow — Opry amplia fim de semana de aniversário",
        url: "https://musicrow.com/2026/09/grand-ole-opry-expands-birthday-weekend/",
      },
    ],
  },
  {
    id: "7",
    slug: "americana-honors-2026-robert-plant-brandi-carlile",
    title:
      "Americana Honors 2026 reúne Robert Plant, Brandi Carlile, Margo Price e a nova geração roots",
    seoTitle: "Americana Honors & Awards 2026 no Ryman | Fazenda Rodeo Radio",
    metaDescription:
      "A 25ª edição do Americana Honors & Awards acontece em 16 de setembro de 2026 no Ryman Auditorium, com Robert Plant recebendo o Lifetime Achievement Award.",
    excerpt:
      "A 25ª edição da premiação acontece no Ryman Auditorium, com Lifetime Achievement Award para Robert Plant e apresentações da nova geração roots.",
    category: "Americana",
    tags: ["Americana", "Robert Plant", "Brandi Carlile", "Ryman"],
    author: AUTHOR,
    publishedAt: "2026-09-11",
    publishedLabel: "11 de setembro de 2026",
    readingTime: "3 min",
    summary: [
      "A 25ª edição do Americana Honors & Awards será em 16 de setembro de 2026, no Ryman Auditorium.",
      "Robert Plant receberá o Lifetime Achievement Award.",
      "Entre os anunciados para apresentações estão Brandi Carlile, Margo Price e Molly Tuttle.",
      "O AMERICANAFEST ocorre de 15 a 19 de setembro.",
    ],
    sections: [
      {
        paragraphs: [
          "O Americana Honors & Awards chega à 25ª edição em 16 de setembro de 2026, no Ryman Auditorium, em Nashville — endereço que carrega boa parte da memória sonora do gênero.",
          "O destaque da noite é o Lifetime Achievement Award concedido a Robert Plant, artista cuja trajetória atravessou o rock britânico e desembocou, décadas depois, em colaborações profundamente ligadas à música de raiz americana.",
        ],
      },
      {
        heading: "Quem se apresenta",
        paragraphs: [
          "Entre os nomes anunciados para apresentações estão Robert Plant, Brandi Carlile, Margo Price e Molly Tuttle, ao lado de outros artistas confirmados pela organização.",
          "É um recorte que resume o que a Americana virou: um espaço onde folk, bluegrass, country e rock convivem sem precisar escolher um rótulo único.",
        ],
      },
      {
        heading: "AMERICANAFEST",
        paragraphs: [
          "A premiação está inserida no AMERICANAFEST, que ocorre de 15 a 19 de setembro e ocupa a cidade com shows, painéis e encontros da indústria.",
          "Para quem acompanha o gênero de fora dos Estados Unidos, é a semana mais concentrada do ano em novidades de raiz.",
        ],
      },
    ],
    sources: [
      {
        label: "Americana Music — Robert Plant receberá o Lifetime Achievement Award",
        url: "https://americanamusic.org/robert-plant-announced-as-lifetime-achievement-recipent-for-2026-americana-honors-awards/",
      },
      { label: "Americana Music — Awards", url: "https://americanamusic.org/awards/" },
      {
        label: "Americana Music — Indicados de 2026",
        url: "https://americanamusic.org/2026-americana-honors-awards-nominees-revealed/",
      },
      {
        label: "MusicRow — Atrações da 25ª edição",
        url: "https://musicrow.com/2026/09/americana-music-association-announces-performers-for-25th-annual-honors-awards-show/",
      },
    ],
  },
  {
    id: "8",
    slug: "garth-brooks-tour-2026-salt-lake-city",
    title:
      "Garth Brooks leva nova turnê a Salt Lake City após ultrapassar 200 mil ingressos vendidos",
    seoTitle: "Garth Brooks anuncia Salt Lake City na turnê 2026 | Fazenda Rodeo Radio",
    metaDescription:
      "A \"Blame It All On My Roots Arena Tour\" chega a Salt Lake City em 9 e 10 de outubro, no Delta Center, após superar 200 mil ingressos vendidos.",
    excerpt:
      "A \"Blame It All On My Roots Arena Tour\" chega ao Delta Center em 9 e 10 de outubro e serve de base para o álbum ao vivo \"Killer Live\".",
    category: "Turnês",
    tags: ["Garth Brooks", "Turnê", "Salt Lake City", "Ao vivo"],
    author: AUTHOR,
    publishedAt: "2026-09-11",
    publishedLabel: "11 de setembro de 2026",
    readingTime: "3 min",
    summary: [
      "A turnê se chama \"Blame It All On My Roots Arena Tour\".",
      "Salt Lake City é a sexta parada, com shows em 9 e 10 de outubro no Delta Center.",
      "A turnê já havia superado 200 mil ingressos vendidos.",
      "O projeto serve de base para um novo álbum ao vivo, \"Killer Live\".",
    ],
    sections: [
      {
        paragraphs: [
          "Garth Brooks anunciou Salt Lake City como a sexta parada da \"Blame It All On My Roots Arena Tour\". Serão dois shows, em 9 e 10 de outubro, no Delta Center.",
          "O anúncio chega em um momento favorável: a turnê já havia superado a marca de 200 mil ingressos vendidos.",
        ],
      },
      {
        heading: "Uma turnê que vira disco",
        paragraphs: [
          "Mais do que uma sequência de datas, o projeto tem função de estúdio itinerante. As apresentações estão servindo de base para um novo álbum ao vivo, \"Killer Live\".",
          "É uma estratégia coerente com a carreira dele, construída em cima da performance de arena e da relação direta com a plateia.",
        ],
      },
      {
        heading: "O peso do formato arena",
        paragraphs: [
          "Poucos artistas do gênero sustentam múltiplas noites na mesma cidade com essa consistência. O retorno ao circuito de arenas mantém Brooks entre os principais nomes da bilheteria country.",
        ],
      },
    ],
    sources: [
      {
        label: "MusicRow — Garth Brooks anuncia Salt Lake City na turnê",
        url: "https://musicrow.com/2026/09/garth-brooks-announces-salt-lake-city-as-next-stop-on-blame-it-all-on-my-roots-tour/",
      },
    ],
  },
  {
    id: "9",
    slug: "rosanne-cash-adia-shows-emergencia-medica-2026",
    title: "Rosanne Cash adia shows após emergência médica e prevê retorno ainda em setembro",
    seoTitle: "Rosanne Cash adia shows por emergência médica | Fazenda Rodeo Radio",
    metaDescription:
      "Rosanne Cash adiou três apresentações após uma emergência médica inesperada. A próxima data prevista na agenda divulgada é 19 de setembro, em Jonesboro.",
    excerpt:
      "A cantora adiou três apresentações por recomendação médica; a agenda divulgada aponta retorno em 19 de setembro, em Jonesboro, no Arkansas.",
    category: "Artistas",
    tags: ["Rosanne Cash", "Agenda", "Saúde", "Ao vivo"],
    author: AUTHOR,
    publishedAt: "2026-09-11",
    publishedLabel: "11 de setembro de 2026",
    readingTime: "2 min",
    summary: [
      "Rosanne Cash adiou três shows após uma emergência médica inesperada.",
      "Médicos recomendaram pausa temporária em viagens e apresentações.",
      "A próxima data prevista na agenda divulgada é 19 de setembro, em Jonesboro, Arkansas.",
      "Não há informação pública sobre diagnóstico ou causa.",
    ],
    sections: [
      {
        paragraphs: [
          "Rosanne Cash adiou três apresentações depois de uma emergência médica inesperada. A informação foi comunicada publicamente e não veio acompanhada de detalhes clínicos.",
          "Segundo o comunicado, médicos recomendaram uma pausa temporária em viagens e apresentações.",
        ],
      },
      {
        heading: "O que está previsto",
        paragraphs: [
          "De acordo com a agenda divulgada, a próxima apresentação prevista era 19 de setembro, em Jonesboro, no Arkansas.",
          "Sem confirmação oficial sobre causa ou diagnóstico, qualquer leitura além disso seria especulação. A Fazenda Rodeo Radio se limita ao que foi comunicado e deseja pronta recuperação à artista.",
        ],
      },
    ],
    sources: [
      {
        label: "Entertainment Weekly — Rosanne Cash adia shows por emergência médica",
        url: "https://ew.com/rosanne-cash-postpones-shows-due-to-medical-emergency-12110652",
      },
    ],
  },
  {
    id: "10",
    slug: "lancamentos-country-11-setembro-2026",
    title: "Novidades Country da semana: Eric Church, Luke Bryan, Warren Zeiders e mais",
    seoTitle: "Lançamentos country de 11 de setembro de 2026 | Fazenda Rodeo Radio",
    metaDescription:
      "Os lançamentos country desta sexta-feira, 11 de setembro de 2026: Eric Church, Luke Bryan, Warren Zeiders com Bellah Mae, Belles e Thomason.",
    excerpt:
      "Cinco faixas chegaram nesta sexta-feira, 11 de setembro, e já entram no radar de programação da Fazenda Rodeo Radio.",
    category: "Lançamentos",
    tags: ["Lançamentos", "Eric Church", "Luke Bryan", "Warren Zeiders"],
    author: AUTHOR,
    publishedAt: "2026-09-11",
    publishedLabel: "11 de setembro de 2026",
    readingTime: "2 min",
    summary: [
      "Roundup dos lançamentos country desta sexta-feira, 11 de setembro.",
      "Eric Church lança \"On The Road\" e Luke Bryan traz \"I Liked Loving You\".",
      "Warren Zeiders divide \"Overrated\" com Bellah Mae.",
      "Completam a lista Belles, com \"Cowgirl Up\", e Thomason, com \"Something In The Whiskey\".",
    ],
    sections: [
      {
        paragraphs: [
          "Sexta-feira é dia de novidade, e a semana de 11 de setembro trouxe um conjunto variado de lançamentos para quem acompanha o gênero.",
        ],
      },
      {
        heading: "As faixas da semana",
        paragraphs: [
          "Eric Church apresenta \"On The Road\".",
          "Luke Bryan lança \"I Liked Loving You\".",
          "Warren Zeiders divide os vocais com Bellah Mae em \"Overrated\".",
          "Belles chega com \"Cowgirl Up\".",
          "Thomason completa a lista com \"Something In The Whiskey\".",
        ],
      },
      {
        heading: "O que ouvir primeiro",
        paragraphs: [
          "Como toda semana de lançamentos, o desempenho de cada faixa ainda vai se definir nas próximas rodadas de rádio e streaming. Por enquanto, o que existe é o material novo disponível para ouvir.",
          "Todas entram no radar de programação da Fazenda Rodeo Radio.",
        ],
      },
    ],
    sources: [
      {
        label: "Country Swag — Novas músicas country da semana (11/09/26)",
        url: "https://countryswag.com/here-are-the-new-country-songs-you-need-to-know-this-week-9-11-26/",
      },
    ],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Destaque da home/blog: Dolly Parton. */
export const featuredPost =
  getPostBySlug("adeus-dolly-parton-luto-country-2026") ?? posts[0];

/** Chamadas secundárias da revista na home. */
export const secondaryPosts: Post[] = [
  getPostBySlug("barretos-2026-1-milhao-visitas-rodeio"),
  getPostBySlug("cma-awards-2026-ella-langley-indicacoes"),
].filter((p): p is Post => Boolean(p));

export const categories: PostCategory[] = Array.from(
  new Set(posts.map((p) => p.category)),
) as PostCategory[];
