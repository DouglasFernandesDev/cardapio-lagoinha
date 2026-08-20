/* =========================================================================
   PIZZARIA LAGOINHA — SCRIPT.JS
   Lógica do cardápio, carrinho, checkout e envio do pedido via WhatsApp.
   ========================================================================= */

'use strict';

/* =========================================================================
   1. CONFIGURAÇÃO DA LOJA — troque pelos dados reais da pizzaria
   ========================================================================= */
const CONFIGURACAO = {
  // Número do WhatsApp com código do país + DDD, somente dígitos.
  // Exemplo: 55 (Brasil) + 21 (DDD) + número.
  numeroWhatsapp: '5522998328849',
  nomeLoja: 'Pizzaria Lagoinha',
  taxaEntrega: 6.0,
  chavePix: 'contato@nonnabella.com.br',
};

/* Horário de funcionamento por dia da semana. O índice de cada dia
   segue o mesmo padrão do JavaScript (Date.getDay()): 0 = domingo,
   1 = segunda-feira, 2 = terça-feira ... 6 = sábado.
   Para um dia fechado, use "null" no lugar de { abre, fecha }.
   Os horários são escritos como "HH:MM" (24 horas). */
const HORARIO_FUNCIONAMENTO_POR_DIA = {
  0: { abre: '18:00', fecha: '23:59' }, // domingo
  1: null,                              // segunda-feira — fechado
  2: { abre: '18:00', fecha: '23:00' }, // terça-feira
  3: { abre: '18:00', fecha: '23:00' }, // quarta-feira
  4: { abre: '18:00', fecha: '23:00' }, // quinta-feira
  5: { abre: '18:00', fecha: '23:59' }, // sexta-feira
  6: { abre: '18:00', fecha: '23:59' }, // sábado
};

/* =========================================================================
   2. DADOS DO CARDÁPIO
   ========================================================================= */
const CATEGORIAS = [
  { id: 'monte', nome: 'Monte sua Pizza', icone: '🍕' },
  { id: 'tradicionais', nome: 'Pizzas Tradicionais', icone: '🍕' },
  { id: 'especiais', nome: 'Especiais', icone: '⭐' },
  { id: 'premium', nome: 'Premium', icone: '⭐' },
  { id: 'doces', nome: 'Pizzas Doces', icone: '🍫' },
  { id: 'bordas', nome: 'Bordas Recheadas', icone: '🧀' },
  { id: 'bebidas', nome: 'Bebidas', icone: '🥤' },
  { id: 'combos', nome: 'Combos', icone: '⭐'},
];

/* Categorias cujos sabores podem entrar no "Monte sua Pizza". Ficam de
   fora "doces": elas só têm variação "media"/"grande" (sem "gigante"),
   então não teriam preço para a opção Gigante do montador — e misturar
   sabor doce com salgado na mesma pizza também não faz sentido prático. */
const CATEGORIAS_SABORES_MONTAGEM = ['tradicionais', 'especiais', 'premium'];

const PRODUTOS = [
  // ---------------- PIZZAS TRADICIONAIS ----------------

  {
    id: 'p01', categoriaId: 'tradicionais', emoji: '🍕',
    nome: 'Mussarela',
    descricao: 'Mussarela e orégano',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 44.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 64.99 },
    ],
  },  
  {
    id: 'p02', categoriaId: 'tradicionais', emoji: '🌶️',
    nome: 'Calabresa',
    descricao: 'Mussarela, calabresa e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 44.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 64.99 },
    ],
  },
  {
    id: 'p03', categoriaId: 'tradicionais', emoji: '🍗',
    nome: 'Presunto',
    descricao: 'Mussarela, presuntop e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 44.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 64.99 },
    ],
  },

  // ---------------- ESPECIAIS----------------
  {
    id: 'p04', categoriaId: 'especiais', emoji: '🥚',
    nome: 'Portuguesa',
    descricao: 'Mussarela, presunto, calabresa, tomate, pimentão, cebola, palmito, ovo e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 49.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 70.99 },
    ],
  },
  {
    id: 'p05', categoriaId: 'especiais', emoji: '🧀',
    nome: 'Calabresa com cebola',
    descricao: 'Mussarela, calabresa, cebola e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 46.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 66.99 },
    ],
  },
  {
    id: 'p06', categoriaId: 'especiais', emoji: '🍕',
    nome: 'Calabresa com Requeijão',
    descricao: 'Mussarela, calabresa, requeijão cremoso e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 49.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 69.99 },
    ],
  },
  {
    id: 'p07', categoriaId: 'especiais', emoji: '🌿',
    nome: 'Frango com Requeijão',
    descricao: 'Mussarela, frango, requeijão cremoso e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 49.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 70.99 },
    ],
  },
  {
    id: 'p08', categoriaId: 'especiais', emoji: '🫒',
    nome: 'Mista',
    descricao: 'Mussarela, presunto, calabresa, tomate, pimentão, cebola, palmito, ovo e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 49.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 70.99 },
    ],
  },
  {
    id: 'p09', categoriaId: 'especiais', emoji: '🐃',
    nome: 'Alho torrado',
    descricao: 'Mussarela, alho torrado e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 49.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 70.99 },
    ],
  },
  {
    id: 'p10', categoriaId: 'especiais', emoji: '🍆',
    nome: 'Peito de Peru',
    descricao: 'Mussarela, peito de peru e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 49.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 70.99 },
    ],
  },
  {
    id: 'p11', categoriaId: 'especiais', emoji: '🍆',
    nome: 'Bacon',
    descricao: 'Mussarela, bacon e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 49.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 70.99 },
    ],
  },
  {
    id: 'p12', categoriaId: 'especiais', emoji: '🍆',
    nome: 'Bacon com ovos',
    descricao: 'Mussarela, bacon, ovo e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 51.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 72.99 },
    ],
  },

  // ---------------- PREMIUM ----------------
  {
    id: 'p13', categoriaId: 'premium', emoji: '🍆',
    nome: 'Camarão com requeijão',
    descricao: 'Mussarela, camarão, requeijão cremoso e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 54.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 80.99 },
    ],
  },
  {
    id: 'p14', categoriaId: 'premium', emoji: '🍆',
    nome: 'Três porquinhos',
    descricao: 'Mussarela, presunto, calabresa, bacon e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 54.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 80.99 },
    ],
  },
  {
    id: 'p15', categoriaId: 'premium', emoji: '🍆',
    nome: 'Quatro queijos',
    descricao: 'Mussarela, parmesão, provolone, requeijão cremoso e oregano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 54.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 80.99 },
    ],
  },
  {
    id: 'p16', categoriaId: 'premium', emoji: '🍆',
    nome: 'Carne seca',
    descricao: 'Mussarela, carne seca, requeijão cremoso, cebola  e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 54.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 80.99 },
    ],
  },
  {
    id: 'p17', categoriaId: 'premium', emoji: '🍆',
    nome: 'Frango com cheddar e bacon',
    descricao: 'Mussarela, frango, bacon, cheddar e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 54.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 80.99 },
    ],
  },
  {
    id: 'p18', categoriaId: 'premium', emoji: '🍆',
    nome: 'Frango caipira',
    descricao: 'Mussarela, frango, milho, requeijão cremoso e orégano.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 54.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 80.99 },
    ],
  },

  // ---------------- PIZZAS DOCES ----------------
  {
    id: 'p19', categoriaId: 'doces', emoji: '🍫',
    nome: 'Romeu e Julieta',
    descricao: 'Mussarela, queijo e Goiabada — o clássico queridinho do Brasil.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 44.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 67.99 },
    ],
  },
  {
    id: 'p20', categoriaId: 'doces', emoji: '🍌',
    nome: 'Banana',
    descricao: 'Mussarela, banana, açucar e canela.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 44.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 67.99 },
    ],
  },
  {
    id: 'p21', categoriaId: 'doces', emoji: '🍬',
    nome: 'Banana Nevada',
    descricao: 'Uma pitada de mussarela, banana, açucar, canela e chocolate branco.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 54.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 80.99 },
    ],
  },
  {
    id: 'p22', categoriaId: 'doces', emoji: '🍬',
    nome: 'Churros',
    descricao: 'Mussarela, doce de leite, açucar e canela - Trazendo o sabor irresistível do tradicional churros em cada fatia.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 51.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 77.99 },
    ],
  },
  {
    id: 'p23', categoriaId: 'doces', emoji: '🍬',
    nome: 'Banoffe',
    descricao: 'Uma pitada de mussarela, banana, açucar, canela e doce de leite.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 51.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 77.99 },
    ],
  },
  {
    id: 'p24', categoriaId: 'doces', emoji: '🍬',
    nome: 'Chocolate ao leite',
    descricao: 'Mussarela, chocolate ao leite e confetes coloridos - trazendo uma combinação divertida, cremosa e irresistível.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 51.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 77.99 },
    ],
  },
  {
    id: 'p25', categoriaId: 'doces', emoji: '🍬',
    nome: 'Chocoduo',
    descricao: 'uma pitada de mussarela, chocolate ao leite e chocolate branco.',
    variacoes: [
      { id: 'grande', nome: 'Grande 35cm · 6 fatias', preco: 54.99 },
      { id: 'gigante', nome: 'Gigante 45cm · 8 fatias', preco: 80.99 },
    ],
  },

  // ---------------- BORDAS RECHEADAS ----------------
 
  {
    id: 'p26', categoriaId: 'bordas', emoji: '🧈',
    nome: 'Borda de Requeijão cremoso',
    descricao: 'Adicione uma borda generosa recheada com requeijão cremoso.',
    variacoes: [{ id: 'unica', nome: 'Adicionar à pizza', preco: 14.00 }]
  },
  {
    id: 'p27', categoriaId: 'bordas', emoji: '🧈',
    nome: 'Borda de Cheddar',
    descricao: 'Borda recheada com cheddar cremoso derretido.',
    variacoes: [{ id: 'unica', nome: 'Adicionar à pizza', preco: 14.00 }],
  },
  {
    id: 'p28', categoriaId: 'bordas', emoji: '🧈',
    nome: 'Borda Frango com requeijão',
    descricao: 'Borda recheada com frango e requeijão cremoso.',
    variacoes: [{ id: 'unica', nome: 'Adicionar à pizza', preco: 17.00 }],
  },
  {
    id: 'p29', categoriaId: 'bordas', emoji: '🧈',
    nome: 'Borda Queijo com presunto',
    descricao: 'Borda recheada com queijo derretido e presunto.',
    variacoes: [{ id: 'unica', nome: 'Adicionar à pizza', preco: 17.00 }],
  },
  {
    id: 'p30', categoriaId: 'bordas', emoji: '🍫',
    nome: 'Borda de Chocolate ao leite',
    descricao: 'Borda recheada com chocolate ao leite — ideal para pizzas doces.',
    variacoes: [{ id: 'unica', nome: 'Adicionar à pizza', preco: 20.00 }],
  },
  {
    id: 'p31', categoriaId: 'bordas', emoji: '🧈',
    nome: 'Borda Romeu e Julieta',
    descricao: 'Borda recheada com Goiabada e quejo derretidos.',
    variacoes: [{ id: 'unica', nome: 'Adicionar à pizza', preco: 18.00 }],
  },
  {
    id: 'p32', categoriaId: 'bordas', emoji: '🧈',
    nome: 'Borda de doce de leite',
    descricao: 'Borda recheada com doce de leite delicioso.',
    variacoes: [{ id: 'unica', nome: 'Adicionar à pizza', preco: 18.00 }],
  },

  // ---------------- BEBIDAS ----------------
  {
    id: 'p33', categoriaId: 'bebidas', emoji: '🥤',
    nome: 'Coca-Cola 1,5L',
    descricao: 'Coca-Cola 1,5L gelada.',
    variacoes: [{ id: 'unica', nome: '1,5 litros', preco: 12.00 }],
  },
  {
    id: 'p34', categoriaId: 'bebidas', emoji: '🍾',
    nome: 'Fanta Uva 1,5L',
    descricao: 'Fanta Uva de 2 litros, gelada.',
    variacoes: [{ id: 'unica', nome: '2 litros', preco: 10.00 }],
  },
  {
    id: 'p35', categoriaId: 'bebidas', emoji: '🧃',
    nome: 'Guaraná Antártica',
    descricao: 'Guanará de 1,5L.',
    variacoes: [{ id: 'unica', nome: '1,5 litros', preco: 12.00 }],
  },
  
  // ---------------- COMBOS ----------------
  {
    id: 'p36', categoriaId: 'combos', emoji: '',
    nome: 'Combo Tradicional',
    descricao: '2 pizzas gigantes (calabresa, presunto ou mussarela) + 1 coca-cola 1,5 litros',
    variacoes: [{ id: 'unica', nome: 'Combo Tradicional', preco: 134.99 }],
  },
  {
    id: 'p37', categoriaId: 'combos', emoji: '',
    nome: 'Combo Lagoinha',
    descricao: '1 pizza gigante salgada (exceto sabor premium) + 1 pizza grande doce + 1 coca-cola 1,5 litros',
    variacoes: [{ id: 'unica', nome: 'Combo Lagoinha', preco: 129.99 }],
  },
  {
    id: 'p38', categoriaId: 'combos', emoji: '',
    nome: 'Super Combo',
    descricao: '2 pizzas gigantes + 1 pizza grande + 1 coca-cola 1,5 litros',
    variacoes: [{ id: 'unica', nome: 'Super Combo', preco: 199.99 }],
  },
  {
    id: 'p39', categoriaId: 'combos', emoji: '',
    nome: 'Combo Casal',
    descricao: '2 pizzas grandes qualquer sabor + 1 coca-cola 1,5 litros',
    variacoes: [{ id: 'unica', nome: 'Combo casal', preco: 109.99 }],
  },
  {
    id: 'p40', categoriaId: 'combos', emoji: '',
    nome: 'Trio Grande',
    descricao: '3 pizzas grandes qualquer sabor + 2 coca-cola 1,5 litros',
    variacoes: [{ id: 'unica', nome: 'Trio Grande', preco: 169.99 }],
  },
];

/* =========================================================================
   3. ESTADO DA APLICAÇÃO
   ========================================================================= */
const estado = {
  carrinho: [],           // itens do carrinho
  produtoAtual: null,     // produto aberto no modal
  variacaoSelecionada: null,
  quantidadeSelecionada: 1,
};

/* Estado próprio do "Monte sua Pizza" — separado do "estado" normal
   porque a montagem lida com VÁRIOS sabores ao mesmo tempo (não um só),
   então precisa da sua própria estrutura. */
const estadoMontagem = {
  tamanho: 'grande',        // 'grande' ou 'gigante'
  maxSabores: 2,             // 2 para Grande, 4 para Gigante
  saboresSelecionados: [],   // lista de produtos (sabores) escolhidos
  bordaSelecionada: null,
  quantidade: 1,
};

/* =========================================================================
   4. UTILITÁRIOS
   ========================================================================= */
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function gerarIdUnico() {
  return 'item-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/* Converte um texto digitado pelo cliente (ex: "100,00", "1.234,56",
   "100.00", "100") em número. Trata o formato brasileiro corretamente:
   quando há vírgula, qualquer ponto é tratado como separador de milhar
   e removido antes de interpretar a vírgula como separador decimal —
   isso evita que "1.000,00" seja lido incorretamente como "1".
   Retorna null se o texto não representar um número válido. */
function converterTextoParaNumero(texto) {
  if (!texto) return null;
  let limpo = texto.replace(/[^\d,.-]/g, '');
  if (limpo.includes(',')) {
    limpo = limpo.replace(/\./g, '').replace(',', '.');
  }
  const numero = parseFloat(limpo);
  return Number.isFinite(numero) ? numero : null;
}

function buscarProdutoPorId(produtoId) {
  return PRODUTOS.find((produto) => produto.id === produtoId);
}

/* Mostra uma notificação rápida (toast) por 3.2s, usando uma simples
   troca de classe. Como os painéis e modais voltaram a ser divs
   controladas por nós (em vez de <dialog> nativo competindo pela
   camada superior do navegador), um z-index alto é suficiente para
   garantir que o toast sempre apareça por cima de tudo. */
function mostrarToast(mensagem, tipo = '') {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.className = 'toast toast--visivel' + (tipo ? ' toast--' + tipo : '');
  clearTimeout(mostrarToast._timeout);
  mostrarToast._timeout = setTimeout(() => {
    toast.classList.remove('toast--visivel');
  }, 3200);
}

function travarRolagemFundo(travar) {
  document.body.style.overflow = travar ? 'hidden' : '';
}

/* =========================================================================
   5. STATUS DA LOJA (aberto/fechado)
   ========================================================================= */

/* Converte um horário no formato "HH:MM" para minutos desde a meia-noite
   (ex: "18:00" -> 1080, "23:59" -> 1439) — mais simples e preciso de
   comparar do que lidar com horas fracionadas. */
function converterHorarioParaMinutos(horario) {
  const [horas, minutos] = horario.split(':').map(Number);
  return horas * 60 + minutos;
}

function atualizarStatusLoja() {
  const agora = new Date();
  const horarioDeHoje = HORARIO_FUNCIONAMENTO_POR_DIA[agora.getDay()];
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  let aberto = false;
  if (horarioDeHoje) {
    const minutosAbre = converterHorarioParaMinutos(horarioDeHoje.abre);
    const minutosFecha = converterHorarioParaMinutos(horarioDeHoje.fecha);
    aberto = minutosAgora >= minutosAbre && minutosAgora <= minutosFecha;
  }

  const elementoStatus = document.getElementById('statusLoja');
  const textoStatus = document.getElementById('textoStatus');

  elementoStatus.classList.toggle('cabecalho__status--fechado', !aberto);
  textoStatus.textContent = aberto ? 'Aberto agora' : 'Fechado no momento';
}

/* =========================================================================
   6. RENDERIZAÇÃO DO CARDÁPIO
   ========================================================================= */
function renderizarNavegacaoCategorias() {
  const nav = document.getElementById('navCategorias');
  const itens = CATEGORIAS.map((categoria, indice) => `
    <li>
      <button
        type="button"
        class="navegacao-categorias__botao"
        data-categoria-alvo="categoria-${categoria.id}"
        aria-current="${indice === 0 ? 'true' : 'false'}"
      >${categoria.icone} ${categoria.nome}</button>
    </li>
  `).join('');

  // O botão hambúrguer só aparece visualmente em telas de celular/tablet
  // (ver mobile.css) — no desktop ele fica escondido e a lista de
  // categorias volta a aparecer sempre visível, na horizontal, como já
  // era antes. Gerar os dois juntos aqui evita ter que manter duas
  // versões de HTML/JS diferentes para cada tamanho de tela.
  nav.innerHTML = `
    <button
      type="button"
      id="botaoMenuCategorias"
      class="navegacao-categorias__hamburguer"
      aria-expanded="false"
      aria-controls="listaCategoriasNav"
      aria-label="Abrir menu de categorias"
    >
      <span class="navegacao-categorias__hamburguer-icone" aria-hidden="true">
        <span class="navegacao-categorias__hamburguer-linha"></span>
        <span class="navegacao-categorias__hamburguer-linha"></span>
        <span class="navegacao-categorias__hamburguer-linha"></span>
      </span>
      <span class="navegacao-categorias__hamburguer-texto">Categorias</span>
    </button>
    <ul class="navegacao-categorias__lista" id="listaCategoriasNav">${itens}</ul>
  `;

  nav.querySelectorAll('.navegacao-categorias__botao').forEach((botao) => {
    botao.addEventListener('click', () => {
      rolarParaSecao(botao.dataset.categoriaAlvo);
      fecharMenuCategorias();
    });
  });

  configurarMenuHamburguer();
}

/* Abre/fecha o menu suspenso de categorias (só existe visualmente em
   telas de celular/tablet — ver mobile.css). Fecha automaticamente ao
   escolher uma categoria ou ao clicar fora do menu. */
function configurarMenuHamburguer() {
  const botao = document.getElementById('botaoMenuCategorias');
  const lista = document.getElementById('listaCategoriasNav');
  if (!botao || !lista) return;

  botao.addEventListener('click', (evento) => {
    evento.stopPropagation();
    const vaiAbrir = !lista.classList.contains('navegacao-categorias__lista--aberta');
    lista.classList.toggle('navegacao-categorias__lista--aberta', vaiAbrir);
    botao.setAttribute('aria-expanded', String(vaiAbrir));
  });

  document.addEventListener('click', (evento) => {
    if (!evento.target.closest('#navCategorias')) fecharMenuCategorias();
  });
}

function fecharMenuCategorias() {
  const botao = document.getElementById('botaoMenuCategorias');
  const lista = document.getElementById('listaCategoriasNav');
  if (!botao || !lista) return;
  lista.classList.remove('navegacao-categorias__lista--aberta');
  botao.setAttribute('aria-expanded', 'false');
}

/* Calcula a posição exata da seção (medindo a altura real da barra fixa
   no momento do clique) e rola até ela com uma animação própria, feita
   à mão com requestAnimationFrame.

   Por quê não usar scrollIntoView()/window.scrollTo({behavior:'smooth'})
   direto? Testamos exaustivamente e confirmamos: a rolagem suave NATIVA
   do navegador tem duração variável (mais longa quanto maior a
   distância) e pode ser interrompida por qualquer nova chamada de
   rolagem ou, em celulares mais lentos, simplesmente não terminar a
   tempo — fazendo a página "empacar" no meio do caminho. Isso era
   exatamente o bug relatado. Controlando a animação nós mesmos, com
   duração sempre fixa (450ms) e um único requestAnimationFrame por vez,
   garantimos que a rolagem sempre termina no lugar certo. */
function rolarParaSecao(idSecao) {
  const secao = document.getElementById(idSecao);
  const nav = document.getElementById('navCategorias');
  if (!secao || !nav) return;

  const alturaNav = nav.getBoundingClientRect().height;
  const respiro = 16;
  const posicaoInicial = window.pageYOffset || document.documentElement.scrollTop;
  const alturaMaximaRolavel = document.documentElement.scrollHeight - window.innerHeight;
  const posicaoAlvoBruta = secao.getBoundingClientRect().top + posicaoInicial - alturaNav - respiro;
  const posicaoAlvo = Math.max(0, Math.min(posicaoAlvoBruta, alturaMaximaRolavel));

  rolarSuavemente(posicaoAlvo, 450);
}

/* Anima a rolagem vertical da página até "destinoY" ao longo de
   "duracaoMs", usando requestAnimationFrame com suavização
   ease-in-out. Cada quadro usa window.scrollTo com behavior:'instant'
   de propósito — é a nossa própria função quem controla a suavidade
   quadro a quadro; se deixássemos o navegador "suavizar" cada
   mini-salto também, as duas suavizações se atrapalhariam. */
let animacaoDeRolagemEmAndamento = null;

function rolarSuavemente(destinoY, duracaoMs) {
  if (animacaoDeRolagemEmAndamento) {
    cancelAnimationFrame(animacaoDeRolagemEmAndamento);
  }

  const origemY = window.pageYOffset || document.documentElement.scrollTop;
  const distancia = destinoY - origemY;
  const inicioTempo = performance.now();

  function suavizarEaseInOutCubico(progresso) {
    return progresso < 0.5
      ? 4 * progresso * progresso * progresso
      : 1 - Math.pow(-2 * progresso + 2, 3) / 2;
  }

  function passo(agora) {
    const decorrido = agora - inicioTempo;
    const progresso = Math.min(decorrido / duracaoMs, 1);
    const y = origemY + distancia * suavizarEaseInOutCubico(progresso);

    window.scrollTo({ top: y, behavior: 'instant' });

    if (progresso < 1) {
      animacaoDeRolagemEmAndamento = requestAnimationFrame(passo);
    } else {
      animacaoDeRolagemEmAndamento = null;
    }
  }

  animacaoDeRolagemEmAndamento = requestAnimationFrame(passo);
}

/* Mede a altura real da barra fixa de categorias — usada apenas para
   manter o "scroll-margin-top" em CSS coerente (útil para outros casos
   de rolagem que não passam por rolarParaSecao, como navegação por
   teclado/leitor de tela). */
function ajustarMargemDeRolagem() {
  const nav = document.getElementById('navCategorias');
  if (!nav) return;
  const altura = nav.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--altura-nav-categorias', (altura + 16) + 'px');
}

/* Reforça, via JavaScript, o comportamento de "barra de categorias fixa
   no topo ao rolar" que o CSS ("position: sticky") já tenta fazer
   sozinho. Observamos a faixa superior do cabeçalho (logo + busca): no
   instante em que ela sai completamente da tela por cima (o cliente já
   rolou além dela), ligamos a classe que muda a barra para
   "position: fixed" — bem mais simples e previsível do que confiar só
   no sticky. Compensamos o espaço que a barra deixa de ocupar dentro
   do cabeçalho (padding-bottom) para o resto da página não "pular"
   quando isso acontece. */
function configurarBarraFixaAoRolar() {
  const faixaSuperior = document.querySelector('.cabecalho__faixa-superior');
  const nav = document.getElementById('navCategorias');
  const cabecalho = document.getElementById('cabecalho');
  if (!faixaSuperior || !nav || !cabecalho) return;

  const observador = new IntersectionObserver(([entrada]) => {
    const rolouAlemDoTopo = !entrada.isIntersecting && entrada.boundingClientRect.top < 0;

    if (rolouAlemDoTopo) {
      cabecalho.style.paddingBottom = nav.getBoundingClientRect().height + 'px';
      nav.classList.add('navegacao-categorias--fixa');
    } else {
      cabecalho.style.paddingBottom = '';
      nav.classList.remove('navegacao-categorias--fixa');
    }
  }, { threshold: 0 });

  observador.observe(faixaSuperior);
}

/* Retorna as opções de borda disponíveis (todas as pizzas cadastradas
   na categoria "bordas"), no formato { id, nome, preco } — os mesmos
   valores já usados quando a borda é vendida como item avulso. */
function obterOpcoesDeBorda() {
  return PRODUTOS
    .filter((produto) => produto.categoriaId === 'bordas')
    .map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      preco: produto.variacoes[0].preco,
    }));
}

/* Define em quais categorias faz sentido oferecer a escolha de borda —
   ou seja, todas as pizzas de verdade. Fica de fora: a própria
   categoria "bordas" (não faz sentido perguntar a borda de uma borda),
   "bebidas" e "combos" (itens fechados, sem essa customização). */
function precisaDeSelecaoDeBorda(categoriaId) {
  return ['tradicionais', 'especiais', 'premium', 'doces'].includes(categoriaId);
}

function renderizarCartaoProduto(produto) {
  const menorPreco = Math.min(...produto.variacoes.map((v) => v.preco));
  const prefixo = produto.variacoes.length > 1 ? 'a partir de' : 'preço';
  const caminhoFoto = `imagens/produtos/${produto.id}.jpg`;

  return `
    <li>
      <article class="cartao-produto" data-produto-id="${produto.id}" data-nome-busca="${normalizarTexto(produto.nome + ' ' + produto.descricao)}">
        <figure class="cartao-produto__emoji-area">
          <span class="cartao-produto__emoji-fallback" aria-hidden="true">${produto.emoji}</span>
          <img class="cartao-produto__foto" src="${caminhoFoto}" alt="Foto de ${produto.nome}" loading="lazy">
        </figure>
        <div class="cartao-produto__conteudo">
          <h3 class="cartao-produto__nome">${produto.nome}</h3>
          <p class="cartao-produto__descricao">${produto.descricao}</p>
          <footer class="cartao-produto__rodape">
            <span class="cartao-produto__preco"><span>${prefixo}</span>${formatarMoeda(menorPreco)}</span>
            <button type="button" class="botao botao--adicionar-cartao" data-abrir-produto="${produto.id}">
              + Adicionar
            </button>
          </footer>
        </div>
      </article>
    </li>
  `;
}

/* Esconde a foto de um produto se ela não existir ainda (o cliente
   ainda não subiu o arquivo correspondente), deixando o emoji/gradiente
   visível por baixo como visual provisório — sem quebrar o layout com
   um ícone de "imagem quebrada". Assim que o cliente adicionar o
   arquivo com o nome certo (ex: imagens/produtos/p01.jpg), a foto passa
   a aparecer sozinha, sem precisar mudar nada no código. */
function configurarFallbackDeFotos(escopo) {
  escopo.querySelectorAll('.cartao-produto__foto, .modal-produto__foto, .cabecalho__logo-foto, .item-carrinho__foto').forEach((img) => {
    img.onerror = () => {
      img.style.display = 'none';
    };

    // Cobre o caso de fotos com "src" já fixo no HTML desde o início
    // (como a do "Monte sua Pizza"): o navegador pode começar a
    // carregar essa imagem assim que a página é lida, antes do nosso
    // JavaScript sequer rodar — se ela já falhou nesse meio-tempo, o
    // "onerror" acima nunca vai disparar (o erro já aconteceu e ninguém
    // "escutou"). "img.complete && naturalWidth === 0" identifica esse
    // caso e escondemos na hora, sem depender do evento.
    if (img.complete && img.naturalWidth === 0) {
      img.style.display = 'none';
    }
  });
}

/* -------------------------------------------------------------------------
   "MONTE SUA PIZZA" — cartão especial que abre o modal de montagem
   ------------------------------------------------------------------------- */

/* Lista de sabores (produtos) elegíveis para entrar no "Monte sua
   Pizza" — ver CATEGORIAS_SABORES_MONTAGEM. */
function obterSaboresParaMontagem() {
  return PRODUTOS.filter((produto) => CATEGORIAS_SABORES_MONTAGEM.includes(produto.categoriaId));
}

/* Preço "a partir de" mostrado no cartão — o sabor mais barato no
   tamanho Grande, sem borda (o cenário mais barato possível). */
function calcularMenorPrecoMontagem() {
  const precos = obterSaboresParaMontagem()
    .map((sabor) => sabor.variacoes.find((v) => v.id === 'grande'))
    .filter(Boolean)
    .map((variacao) => variacao.preco);
  return precos.length ? Math.min(...precos) : 0;
}

function renderizarSecaoMontarPizza(categoria) {
  const menorPreco = calcularMenorPrecoMontagem();
  const caminhoFoto = 'imagens/produtos/monte.jpg';

  return `
    <section class="secao-categoria" id="categoria-${categoria.id}" data-categoria-secao>
      <h2 class="secao-categoria__titulo">${categoria.icone} ${categoria.nome}</h2>
      <ul class="grade-produtos">
        <li>
          <article class="cartao-produto" data-produto-id="monte">
            <figure class="cartao-produto__emoji-area">
              <span class="cartao-produto__emoji-fallback" aria-hidden="true">🍕</span>
              <img class="cartao-produto__foto" src="${caminhoFoto}" alt="Foto do Monte sua Pizza" loading="lazy">
            </figure>
            <div class="cartao-produto__conteudo">
              <h3 class="cartao-produto__nome">Monte sua Pizza</h3>
              <p class="cartao-produto__descricao">Escolha o tamanho, até 2 sabores (Grande) ou até 4 sabores (Gigante), e a borda que quiser.</p>
              <footer class="cartao-produto__rodape">
                <span class="cartao-produto__preco"><span>a partir de</span>${formatarMoeda(menorPreco)}</span>
                <button type="button" class="botao botao--adicionar-cartao" id="botaoAbrirMontarPizza">
                  + Montar
                </button>
              </footer>
            </div>
          </article>
        </li>
      </ul>
    </section>
  `;
}

function renderizarCardapio() {
  const container = document.getElementById('listaCategorias');

  container.innerHTML = CATEGORIAS.map((categoria) => {
    if (categoria.id === 'monte') {
      return renderizarSecaoMontarPizza(categoria);
    }

    const produtosDaCategoria = PRODUTOS.filter((p) => p.categoriaId === categoria.id);
    if (produtosDaCategoria.length === 0) return '';

    return `
      <section class="secao-categoria" id="categoria-${categoria.id}" data-categoria-secao>
        <h2 class="secao-categoria__titulo">${categoria.icone} ${categoria.nome}</h2>
        <ul class="grade-produtos">
          ${produtosDaCategoria.map(renderizarCartaoProduto).join('')}
        </ul>
      </section>
    `;
  }).join('');

  container.querySelectorAll('[data-abrir-produto]').forEach((botao) => {
    botao.addEventListener('click', () => abrirModalProduto(botao.dataset.abrirProduto));
  });

  const botaoMontar = document.getElementById('botaoAbrirMontarPizza');
  if (botaoMontar) botaoMontar.addEventListener('click', abrirModalMontarPizza);

  configurarFallbackDeFotos(container);
}

/* Destaca a categoria visível durante a rolagem.
   IMPORTANTE: aqui usamos APENAS o scrollLeft da lista de categorias
   (rolagem horizontal), nunca scrollIntoView(). O scrollIntoView()
   soma ajustes em TODOS os contêineres roláveis de um elemento — como
   o botão de categoria vive dentro da barra horizontal E dentro da
   página (rolagem vertical), ele também tentava ajustar a rolagem
   vertical da página, o que CANCELAVA a rolagem suave que estava em
   andamento (disparada ao clicar numa categoria). Esse cancelamento no
   meio do caminho era exatamente o bug "não consigo rolar pra baixo".
   Usando scrollLeft diretamente, mexemos só na barra horizontal e
   nunca tocamos na rolagem vertical da página. */
function observarCategoriasVisiveis() {
  const secoes = document.querySelectorAll('[data-categoria-secao]');
  const botoesNav = document.querySelectorAll('.navegacao-categorias__botao');
  const listaNav = document.querySelector('.navegacao-categorias__lista');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      botoesNav.forEach((botao) => {
        const ativo = botao.dataset.categoriaAlvo === entrada.target.id;
        botao.setAttribute('aria-current', ativo ? 'true' : 'false');
        if (ativo) centralizarBotaoNaNavegacao(botao, listaNav);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  secoes.forEach((secao) => observador.observe(secao));
}

function centralizarBotaoNaNavegacao(botao, listaNav) {
  if (!listaNav) return;
  const alvo = botao.offsetLeft + botao.offsetWidth / 2 - listaNav.clientWidth / 2;
  listaNav.scrollTo({ left: Math.max(alvo, 0), behavior: 'smooth' });
}

/* =========================================================================
   7. BUSCA DE PRODUTOS
   ========================================================================= */
function configurarBusca() {
  const input = document.getElementById('buscaProduto');
  const mensagemSemResultado = document.getElementById('mensagemSemResultado');

  input.addEventListener('input', () => {
    const termo = normalizarTexto(input.value.trim());
    const secoes = document.querySelectorAll('[data-categoria-secao]');
    let algumResultado = false;

    secoes.forEach((secao) => {
      const cartoes = secao.querySelectorAll('.cartao-produto');
      let algumVisivelNaSecao = false;

      cartoes.forEach((cartao) => {
        const corresponde = !termo || cartao.dataset.nomeBusca.includes(termo);
        // O <li> é quem controla a visibilidade (o cartão em si fica sem
        // classe extra), assim a grade não deixa "buracos" de espaçamento.
        cartao.closest('li').classList.toggle('oculto', !corresponde);
        if (corresponde) { algumVisivelNaSecao = true; algumResultado = true; }
      });

      secao.classList.toggle('oculto', !algumVisivelNaSecao);
    });

    mensagemSemResultado.classList.toggle('oculto', algumResultado || !termo);
  });
}

/* =========================================================================
   8. ABRIR/FECHAR MODAIS E PAINÉIS (mecanismo por classe)
   ========================================================================= */

/* Mapeia cada modal/painel para sua sobreposição (overlay) associada.
   Cada um tem sua própria div de fundo escurecido — mais simples e
   previsível do que compartilhar uma única sobreposição entre os três. */
const MAPA_SOBREPOSICOES = {
  modalProduto: 'sobreposicaoProduto',
  modalMontarPizza: 'sobreposicaoMontarPizza',
  painelCarrinho: 'sobreposicaoCarrinho',
  painelCheckout: 'sobreposicaoCheckout',
};

function abrirPainel(idPainel) {
  document.getElementById(MAPA_SOBREPOSICOES[idPainel]).classList.remove('oculto');
  document.getElementById(idPainel).classList.remove('oculto');
  travarRolagemFundo(true);
}

function fecharPainel(idPainel) {
  document.getElementById(MAPA_SOBREPOSICOES[idPainel]).classList.add('oculto');
  document.getElementById(idPainel).classList.add('oculto');
  travarRolagemFundo(false);
}

function configurarComportamentoDosPaineis() {
  Object.entries(MAPA_SOBREPOSICOES).forEach(([idPainel, idSobreposicao]) => {
    // Clicar na sobreposição (fora do painel) fecha o painel
    document.getElementById(idSobreposicao).addEventListener('click', () => {
      fecharPainel(idPainel);
    });
  });

  // Esc fecha o painel/modal que estiver aberto no momento
  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape') return;
    Object.keys(MAPA_SOBREPOSICOES).forEach((idPainel) => {
      if (!document.getElementById(idPainel).classList.contains('oculto')) {
        fecharPainel(idPainel);
      }
    });
  });
}

/* =========================================================================
   9. MODAL DE PRODUTO
   ========================================================================= */
function abrirModalProduto(produtoId) {
  const produto = buscarProdutoPorId(produtoId);
  if (!produto) return;

  estado.produtoAtual = produto;
  estado.variacaoSelecionada = produto.variacoes[0];
  estado.quantidadeSelecionada = 1;
  estado.bordaSelecionada = null;

  document.getElementById('modalProdutoEmoji').textContent = produto.emoji;
  document.getElementById('modalProdutoTitulo').textContent = produto.nome;
  document.getElementById('modalProdutoDescricao').textContent = produto.descricao;
  document.getElementById('observacaoProduto').value = '';
  document.getElementById('valorQuantidade').textContent = '1';

  const fotoModal = document.getElementById('modalProdutoFoto');
  fotoModal.style.display = '';
  fotoModal.src = `imagens/produtos/${produto.id}.jpg`;
  fotoModal.alt = `Foto de ${produto.nome}`;
  configurarFallbackDeFotos(document.getElementById('modalProduto'));

  const secaoVariacoes = document.getElementById('secaoVariacoes');
  secaoVariacoes.classList.toggle('oculto', produto.variacoes.length <= 1);

  const listaVariacoes = document.getElementById('listaVariacoes');
  listaVariacoes.innerHTML = produto.variacoes.map((variacao, indice) => `
    <li class="opcao-variacao">
      <label class="opcao-variacao__rotulo">
        <span class="opcao-variacao__linha-esquerda">
          <input type="radio" name="variacaoProduto" value="${variacao.id}" ${indice === 0 ? 'checked' : ''}>
          <span class="opcao-variacao__nome">${variacao.nome}</span>
        </span>
        <span class="opcao-variacao__preco">${formatarMoeda(variacao.preco)}</span>
      </label>
    </li>
  `).join('');

  listaVariacoes.querySelectorAll('input[name="variacaoProduto"]').forEach((input) => {
    input.addEventListener('change', () => {
      estado.variacaoSelecionada = produto.variacoes.find((v) => v.id === input.value);
      atualizarPrecoTotalModal();
    });
  });

  // Escolha da borda: aparece só nas pizzas de verdade (ver
  // precisaDeSelecaoDeBorda). "Sem borda" já vem marcado por padrão,
  // então o cliente não é obrigado a escolher nada se não quiser.
  const secaoBorda = document.getElementById('secaoBorda');
  const listaBordas = document.getElementById('listaBordas');
  const exibirBorda = precisaDeSelecaoDeBorda(produto.categoriaId);
  secaoBorda.classList.toggle('oculto', !exibirBorda);
 
  if (exibirBorda) {
    const opcoesBorda = [{ id: 'nenhuma', nome: 'Sem borda', preco: 0 }, ...obterOpcoesDeBorda()];
    estado.bordaSelecionada = opcoesBorda[0];
 
    listaBordas.innerHTML = opcoesBorda.map((opcao, indice) => `
      <li class="opcao-variacao">
        <label class="opcao-variacao__rotulo">
          <span class="opcao-variacao__linha-esquerda">
            <input type="radio" name="bordaProduto" value="${opcao.id}" ${indice === 0 ? 'checked' : ''}>
            <span class="opcao-variacao__nome">${opcao.nome}</span>
          </span>
          <span class="opcao-variacao__preco">${opcao.preco > 0 ? '+ ' + formatarMoeda(opcao.preco) : 'Grátis'}</span>
        </label>
      </li>
    `).join('');
 
    listaBordas.querySelectorAll('input[name="bordaProduto"]').forEach((input) => {
      input.addEventListener('change', () => {
        estado.bordaSelecionada = opcoesBorda.find((o) => o.id === input.value);
        atualizarPrecoTotalModal();
      });
    });
  } else {
    listaBordas.innerHTML = '';
  }

  atualizarPrecoTotalModal();
  abrirPainel('modalProduto');
}

function fecharModalProdutoFn() {
  fecharPainel('modalProduto');
}

function atualizarPrecoTotalModal() {
  const precoBorda = estado.bordaSelecionada ? estado.bordaSelecionada.preco : 0;
  const total = (estado.variacaoSelecionada.preco + precoBorda) * estado.quantidadeSelecionada;
  document.getElementById('precoTotalModal').textContent = formatarMoeda(total);
}
 
function configurarControlesQuantidadeModal() {
  document.getElementById('aumentarQuantidade').addEventListener('click', () => {
    estado.quantidadeSelecionada = Math.min(estado.quantidadeSelecionada + 1, 20);
    document.getElementById('valorQuantidade').textContent = estado.quantidadeSelecionada;
    atualizarPrecoTotalModal();
  });
  document.getElementById('diminuirQuantidade').addEventListener('click', () => {
    estado.quantidadeSelecionada = Math.max(estado.quantidadeSelecionada - 1, 1);
    document.getElementById('valorQuantidade').textContent = estado.quantidadeSelecionada;
    atualizarPrecoTotalModal();
  });
}
 
function configurarFormularioProduto() {
  document.getElementById('formModalProduto').addEventListener('submit', (evento) => {
    evento.preventDefault();
    const observacao = document.getElementById('observacaoProduto').value.trim();
 
    // Se o cliente escolheu uma borda (diferente de "Sem borda"), o
    // nome dela entra junto no nome da variação e o preço dela é somado
    // ao preço unitário — assim reaproveitamos, sem precisar mudar, toda
    // a lógica existente do carrinho, do resumo do checkout e da
    // mensagem do WhatsApp (que já sabem exibir "nome" e "variacaoNome").
    const precoBorda = estado.bordaSelecionada ? estado.bordaSelecionada.preco : 0;
    let variacaoNomeCompleta = estado.variacaoSelecionada.nome;
    if (estado.bordaSelecionada && estado.bordaSelecionada.id !== 'nenhuma') {
      variacaoNomeCompleta += ` + ${estado.bordaSelecionada.nome}`;
    }
 
    estado.carrinho.push({
      idItemCarrinho: gerarIdUnico(),
      produtoId: estado.produtoAtual.id,
      nome: estado.produtoAtual.nome,
      emoji: estado.produtoAtual.emoji,
      fotoId: estado.produtoAtual.id,
      variacaoNome: variacaoNomeCompleta,
      precoUnitario: estado.variacaoSelecionada.preco + precoBorda,
      quantidade: estado.quantidadeSelecionada,
      observacao,
    });
 
    salvarCarrinhoLocalStorage();
    renderizarCarrinho();
    atualizarIndicadoresCarrinho();
    fecharModalProdutoFn();
    mostrarToast(`${estado.produtoAtual.nome} adicionado ao carrinho! 🍕`, 'sucesso');
  });
}

/* =========================================================================
   9-B. MODAL "MONTE SUA PIZZA"
   ========================================================================= */
function abrirModalMontarPizza() {
  estadoMontagem.tamanho = 'grande';
  estadoMontagem.maxSabores = 2;
  estadoMontagem.saboresSelecionados = [];
  estadoMontagem.quantidade = 1;

  const radioGrande = document.querySelector('#formMontarPizza input[name="tamanhoMontagem"][value="grande"]');
  if (radioGrande) radioGrande.checked = true;
  document.getElementById('valorQuantidadeMontagem').textContent = '1';
  document.getElementById('observacaoMontagem').value = '';

  renderizarSaboresMontagem();
  renderizarBordasMontagem();
  atualizarPrecoTotalMontagem();
  configurarFallbackDeFotos(document.getElementById('modalMontarPizza'));

  abrirPainel('modalMontarPizza');
}

function fecharModalMontarPizzaFn() {
  fecharPainel('modalMontarPizza');
}

/* Desenha a lista de sabores disponíveis (checkboxes) para o tamanho
   atual, mostrando o preço de cada sabor NESSE tamanho — o preço final
   da pizza é sempre o do sabor mais caro escolhido (ver
   calcularPrecoBaseMontagem), prática padrão de pizzaria para
   pizzas com mais de um sabor. */
function renderizarSaboresMontagem() {
  const sabores = obterSaboresParaMontagem();
  const lista = document.getElementById('listaSaboresMontagem');

  lista.innerHTML = sabores.map((sabor) => {
    const variacao = sabor.variacoes.find((v) => v.id === estadoMontagem.tamanho);
    const preco = variacao ? variacao.preco : 0;
    return `
      <li class="opcao-variacao">
        <label class="opcao-variacao__rotulo">
          <span class="opcao-variacao__linha-esquerda">
            <input type="checkbox" name="saborMontagem" value="${sabor.id}">
            <span class="opcao-variacao__nome">${sabor.nome}</span>
          </span>
          <span class="opcao-variacao__preco">${formatarMoeda(preco)}</span>
        </label>
      </li>
    `;
  }).join('');

  lista.querySelectorAll('input[name="saborMontagem"]').forEach((input) => {
    input.addEventListener('change', () => alternarSaborMontagem(input));
  });

  atualizarContadorSabores();
  atualizarLimitesSabores();
}

function alternarSaborMontagem(input) {
  const sabor = buscarProdutoPorId(input.value);

  if (input.checked) {
    // Segurança extra: os checkboxes já ficam desabilitados ao atingir
    // o limite (ver atualizarLimitesSabores), mas isso evita ultrapassar
    // o limite em qualquer cenário.
    if (estadoMontagem.saboresSelecionados.length >= estadoMontagem.maxSabores) {
      input.checked = false;
      return;
    }
    estadoMontagem.saboresSelecionados.push(sabor);
  } else {
    estadoMontagem.saboresSelecionados = estadoMontagem.saboresSelecionados.filter((s) => s.id !== sabor.id);
  }

  atualizarContadorSabores();
  atualizarLimitesSabores();
  atualizarPrecoTotalMontagem();
}

function atualizarContadorSabores() {
  const contador = document.getElementById('contadorSaboresMontagem');
  if (contador) {
    contador.textContent = `(${estadoMontagem.saboresSelecionados.length}/${estadoMontagem.maxSabores} selecionados)`;
  }
}

/* Desabilita os sabores ainda não marcados assim que o limite do
   tamanho escolhido é atingido, e liga/desliga o botão de adicionar
   (precisa de pelo menos 1 sabor escolhido). */
function atualizarLimitesSabores() {
  const atingiuLimite = estadoMontagem.saboresSelecionados.length >= estadoMontagem.maxSabores;
  document.querySelectorAll('#listaSaboresMontagem input[name="saborMontagem"]').forEach((input) => {
    if (!input.checked) input.disabled = atingiuLimite;
  });

  const botaoAdicionar = document.getElementById('botaoAdicionarMontagem');
  if (botaoAdicionar) botaoAdicionar.disabled = estadoMontagem.saboresSelecionados.length === 0;
}

function renderizarBordasMontagem() {
  const opcoes = [{ id: 'nenhuma', nome: 'Sem borda', preco: 0 }, ...obterOpcoesDeBorda()];
  const lista = document.getElementById('listaBordasMontagem');

  lista.innerHTML = opcoes.map((opcao, indice) => `
    <li class="opcao-variacao">
      <label class="opcao-variacao__rotulo">
        <span class="opcao-variacao__linha-esquerda">
          <input type="radio" name="bordaMontagem" value="${opcao.id}" ${indice === 0 ? 'checked' : ''}>
          <span class="opcao-variacao__nome">${opcao.nome}</span>
        </span>
        <span class="opcao-variacao__preco">${opcao.preco > 0 ? '+ ' + formatarMoeda(opcao.preco) : 'Grátis'}</span>
      </label>
    </li>
  `).join('');
  estadoMontagem.bordaSelecionada = opcoes[0];

  lista.querySelectorAll('input[name="bordaMontagem"]').forEach((input) => {
    input.addEventListener('change', () => {
      estadoMontagem.bordaSelecionada = opcoes.find((o) => o.id === input.value);
      atualizarPrecoTotalMontagem();
    });
  });
}

/* Troca entre Grande (até 2 sabores) e Gigante (até 4 sabores). Se o
   cliente já tinha escolhido mais sabores do que o novo limite permite
   (ex: tinha 4 no Gigante e voltou pra Grande), os sabores excedentes
   são removidos automaticamente — mantemos sempre os primeiros
   escolhidos. */
function configurarTamanhoMontagem() {
  document.querySelectorAll('#formMontarPizza input[name="tamanhoMontagem"]').forEach((input) => {
    input.addEventListener('change', () => {
      estadoMontagem.tamanho = input.value;
      estadoMontagem.maxSabores = input.value === 'gigante' ? 4 : 2;

      if (estadoMontagem.saboresSelecionados.length > estadoMontagem.maxSabores) {
        estadoMontagem.saboresSelecionados = estadoMontagem.saboresSelecionados.slice(0, estadoMontagem.maxSabores);
      }

      renderizarSaboresMontagem();

      const idsSelecionados = estadoMontagem.saboresSelecionados.map((s) => s.id);
      document.querySelectorAll('#listaSaboresMontagem input[name="saborMontagem"]').forEach((checkbox) => {
        checkbox.checked = idsSelecionados.includes(checkbox.value);
      });

      atualizarContadorSabores();
      atualizarLimitesSabores();
      atualizarPrecoTotalMontagem();
    });
  });
}

/* O preço-base da pizza montada é o preço do sabor MAIS CARO entre os
   escolhidos (no tamanho selecionado) — é assim que se cobra uma pizza
   meio a meio (ou em mais partes) em praticamente toda pizzaria: o
   cliente paga pelo sabor mais caro, não pela soma de todos. */
function calcularPrecoBaseMontagem() {
  if (estadoMontagem.saboresSelecionados.length === 0) return 0;

  const precos = estadoMontagem.saboresSelecionados.map((sabor) => {
    const variacao = sabor.variacoes.find((v) => v.id === estadoMontagem.tamanho);
    return variacao ? variacao.preco : 0;
  });

  return Math.max(...precos);
}

function atualizarPrecoTotalMontagem() {
  const precoBase = calcularPrecoBaseMontagem();
  const precoBorda = estadoMontagem.bordaSelecionada ? estadoMontagem.bordaSelecionada.preco : 0;
  const total = (precoBase + precoBorda) * estadoMontagem.quantidade;
  document.getElementById('precoTotalMontagem').textContent = formatarMoeda(total);
}

function configurarControlesQuantidadeMontagem() {
  document.getElementById('aumentarQuantidadeMontagem').addEventListener('click', () => {
    estadoMontagem.quantidade = Math.min(estadoMontagem.quantidade + 1, 20);
    document.getElementById('valorQuantidadeMontagem').textContent = estadoMontagem.quantidade;
    atualizarPrecoTotalMontagem();
  });
  document.getElementById('diminuirQuantidadeMontagem').addEventListener('click', () => {
    estadoMontagem.quantidade = Math.max(estadoMontagem.quantidade - 1, 1);
    document.getElementById('valorQuantidadeMontagem').textContent = estadoMontagem.quantidade;
    atualizarPrecoTotalMontagem();
  });
}

/* Ao adicionar ao carrinho, montamos um "nome de variação" descritivo
   (tamanho + sabores + borda) e reaproveitamos, sem alterar nada, toda
   a lógica existente do carrinho / checkout / mensagem de WhatsApp —
   que já sabe exibir "nome" + "variacaoNome" + "precoUnitario". */
function configurarFormularioMontagem() {
  document.getElementById('formMontarPizza').addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (estadoMontagem.saboresSelecionados.length === 0) {
      mostrarToast('Escolha pelo menos 1 sabor.', 'erro');
      return;
    }

    const observacao = document.getElementById('observacaoMontagem').value.trim();
    const precoBase = calcularPrecoBaseMontagem();
    const precoBorda = estadoMontagem.bordaSelecionada ? estadoMontagem.bordaSelecionada.preco : 0;
    const nomeTamanho = estadoMontagem.tamanho === 'gigante' ? 'Gigante · 8 fatias' : 'Grande · 6 fatias';
    const nomesSabores = estadoMontagem.saboresSelecionados.map((s) => s.nome).join(' + ');

    let variacaoNomeCompleta = `${nomeTamanho} · Sabores: ${nomesSabores}`;
    if (estadoMontagem.bordaSelecionada && estadoMontagem.bordaSelecionada.id !== 'nenhuma') {
      variacaoNomeCompleta += ` + ${estadoMontagem.bordaSelecionada.nome}`;
    }

    estado.carrinho.push({
      idItemCarrinho: gerarIdUnico(),
      produtoId: 'monte-sua-pizza',
      nome: 'Monte sua Pizza',
      emoji: '🍕',
      fotoId: 'monte',
      variacaoNome: variacaoNomeCompleta,
      precoUnitario: precoBase + precoBorda,
      quantidade: estadoMontagem.quantidade,
      observacao,
    });

    salvarCarrinhoLocalStorage();
    renderizarCarrinho();
    atualizarIndicadoresCarrinho();
    fecharModalMontarPizzaFn();
    mostrarToast('Sua pizza personalizada foi adicionada ao carrinho! 🍕', 'sucesso');
  });
}
 
/* =========================================================================
   10. CARRINHO
   ========================================================================= */
function calcularSubtotalCarrinho() {
  return estado.carrinho.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0);
}
 
function atualizarIndicadoresCarrinho() {
  const quantidadeTotal = estado.carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  const subtotal = calcularSubtotalCarrinho();
 
  document.getElementById('contadorCarrinho').textContent = quantidadeTotal;
  document.getElementById('totalCarrinhoFlutuante').textContent = formatarMoeda(subtotal);
  // O botão fica sempre visível (mesmo com o carrinho vazio) para que o
  // cliente sempre tenha acesso rápido a ele.
}
 
function renderizarItemCarrinho(item) {
  const caminhoFoto = `imagens/produtos/${item.fotoId}.jpg`;
  return `
    <li class="item-carrinho" data-item-id="${item.idItemCarrinho}">
      <figure class="item-carrinho__foto-area">
        <span class="item-carrinho__emoji-fallback" aria-hidden="true">${item.emoji}</span>
        <img class="item-carrinho__foto" src="${caminhoFoto}" alt="" loading="lazy">
      </figure>
      <div class="item-carrinho__info">
        <p class="item-carrinho__nome">${item.nome}</p>
        <p class="item-carrinho__variacao">${item.variacaoNome}</p>
        ${item.observacao ? `<span class="item-carrinho__obs">📝 ${item.observacao}</span>` : ''}
      </div>
      <span class="item-carrinho__preco">${formatarMoeda(item.precoUnitario * item.quantidade)}</span>
      <div class="item-carrinho__acoes">
        <div class="item-carrinho__controle">
          <button type="button" data-acao="diminuir" aria-label="Diminuir quantidade">−</button>
          <span>${item.quantidade}</span>
          <button type="button" data-acao="aumentar" aria-label="Aumentar quantidade">+</button>
        </div>
        <button type="button" class="item-carrinho__remover" data-acao="remover">Remover</button>
      </div>
    </li>
  `;
}
 
function renderizarCarrinho() {
  const lista = document.getElementById('listaItensCarrinho');
  const vazio = document.getElementById('carrinhoVazio');
  const rodape = document.getElementById('rodapeCarrinho');
 
  if (estado.carrinho.length === 0) {
    lista.innerHTML = '';
    vazio.classList.remove('oculto');
    rodape.classList.add('oculto');
    return;
  }
 
  vazio.classList.add('oculto');
  rodape.classList.remove('oculto');
  lista.innerHTML = estado.carrinho.map(renderizarItemCarrinho).join('');
  configurarFallbackDeFotos(lista);
 
  lista.querySelectorAll('.item-carrinho').forEach((elementoItem) => {
    const idItem = elementoItem.dataset.itemId;
 
    elementoItem.querySelector('[data-acao="aumentar"]').addEventListener('click', () => alterarQuantidadeItem(idItem, 1));
    elementoItem.querySelector('[data-acao="diminuir"]').addEventListener('click', () => alterarQuantidadeItem(idItem, -1));
    elementoItem.querySelector('[data-acao="remover"]').addEventListener('click', () => removerItemCarrinho(idItem));
  });
 
  document.getElementById('subtotalCarrinho').textContent = formatarMoeda(calcularSubtotalCarrinho());
}
 
function alterarQuantidadeItem(idItem, delta) {
  const item = estado.carrinho.find((i) => i.idItemCarrinho === idItem);
  if (!item) return;
 
  item.quantidade += delta;
  if (item.quantidade <= 0) {
    estado.carrinho = estado.carrinho.filter((i) => i.idItemCarrinho !== idItem);
  }
 
  salvarCarrinhoLocalStorage();
  renderizarCarrinho();
  atualizarIndicadoresCarrinho();
}
 
function removerItemCarrinho(idItem) {
  estado.carrinho = estado.carrinho.filter((i) => i.idItemCarrinho !== idItem);
  salvarCarrinhoLocalStorage();
  renderizarCarrinho();
  atualizarIndicadoresCarrinho();
  mostrarToast('Item removido do carrinho.');
}
 
function salvarCarrinhoLocalStorage() {
  try {
    localStorage.setItem('lagoinhaCarrinho', JSON.stringify(estado.carrinho));
  } catch (erro) {
    console.warn('Não foi possível salvar o carrinho localmente:', erro);
  }
}
 
function carregarCarrinhoLocalStorage() {
  try {
    const dados = localStorage.getItem('lagoinhaCarrinho');
    if (dados) estado.carrinho = JSON.parse(dados);
  } catch (erro) {
    console.warn('Não foi possível carregar o carrinho salvo:', erro);
    estado.carrinho = [];
  }
}
 
/* =========================================================================
   11. ABRIR/FECHAR PAINÉIS (carrinho e checkout)
   ========================================================================= */
function abrirCarrinho() {
  // O painel sempre abre, mesmo com o carrinho vazio — nesse caso ele
  // mostra a mensagem "Seu carrinho está vazio" (ver #carrinhoVazio em
  // renderizarCarrinho()) em vez de recusar abrir.
  abrirPainel('painelCarrinho');
}
 
function fecharCarrinhoFn() {
  fecharPainel('painelCarrinho');
}
 
function abrirCheckout() {
  fecharCarrinhoFn();
  ocultarLinkManualWhatsApp();
  atualizarResumoCheckout();
  abrirPainel('painelCheckout');
}
 
function fecharCheckoutFn() {
  ocultarLinkManualWhatsApp();
  fecharPainel('painelCheckout');
}
 
/* =========================================================================
   12. CHECKOUT — ENDEREÇO, PAGAMENTO E RESUMO
   ========================================================================= */
function obterTipoEntregaSelecionado() {
  return document.querySelector('#formCheckout input[name="tipoEntrega"]:checked').value;
}
 
function obterFormaPagamentoSelecionada() {
  return document.querySelector('#formCheckout input[name="formaPagamento"]:checked').value;
}
 
/* Mostra/esconde o bloco de endereço e sincroniza os campos obrigatórios
   com o tipo de entrega selecionado. Além de esconder o <fieldset> de
   endereço, também o desabilita (fieldset.disabled = true) quando não
   se aplica: isso desliga nativamente todos os campos dentro dele
   (não recebem foco, não são validados, não são enviados), reforçando
   de forma nativa a validação manual que já fazemos em JavaScript. */
function sincronizarCamposDeEntrega() {
  const ehEntrega = obterTipoEntregaSelecionado() === 'entrega';
  const fieldsetEndereco = document.getElementById('camposEndereco');
 
  fieldsetEndereco.classList.toggle('oculto', !ehEntrega);
  fieldsetEndereco.disabled = !ehEntrega;
 
  ['ruaEndereco', 'numeroEndereco', 'bairroEndereco'].forEach((idCampo) => {
    document.getElementById(idCampo).required = ehEntrega;
  });
}
 
function configurarAlternanciaEntrega() {
  sincronizarCamposDeEntrega();
  document.querySelectorAll('input[name="tipoEntrega"]').forEach((input) => {
    input.addEventListener('change', () => {
      sincronizarCamposDeEntrega();
      atualizarResumoCheckout();
    });
  });
}
 
function configurarAlternanciaPagamento() {
  document.querySelectorAll('input[name="formaPagamento"]').forEach((input) => {
    input.addEventListener('change', () => {
      const forma = obterFormaPagamentoSelecionada();
      document.getElementById('campoTroco').classList.toggle('oculto', forma !== 'dinheiro');
      document.getElementById('avisoPix').classList.toggle('oculto', forma !== 'pix');
    });
  });
}
 
function atualizarResumoCheckout() {
  const resumo = document.getElementById('resumoPedido');
  resumo.innerHTML = estado.carrinho.map((item) => `
    <li class="resumo-pedido__item">
      <span class="resumo-pedido__nome">${item.quantidade}x ${item.nome} (${item.variacaoNome})</span>
      <span class="resumo-pedido__preco">${formatarMoeda(item.precoUnitario * item.quantidade)}</span>
    </li>
  `).join('');
 
  const subtotal = calcularSubtotalCarrinho();
  const ehEntrega = obterTipoEntregaSelecionado() === 'entrega';
  const taxaEntrega = ehEntrega ? CONFIGURACAO.taxaEntrega : 0;
  const total = subtotal + taxaEntrega;
 
  document.getElementById('resumoSubtotal').textContent = formatarMoeda(subtotal);
  document.getElementById('resumoTaxaEntrega').textContent = formatarMoeda(taxaEntrega);
  document.getElementById('resumoTotal').textContent = formatarMoeda(total);
 
  // A linha "Taxa de entrega" é um par <dt>/<dd> dentro do <dl>: para
  // escondê-la sem quebrar o alinhamento do grid, escondemos os dois
  // elementos individualmente (o CSS Grid ignora itens com display:none
  // e reflui o restante automaticamente).
  document.getElementById('rotuloTaxaEntrega').classList.toggle('oculto', !ehEntrega);
  document.getElementById('resumoTaxaEntrega').classList.toggle('oculto', !ehEntrega);
}
 
/* =========================================================================
   13. VALIDAÇÃO E ENVIO DO PEDIDO
   ========================================================================= */
function validarFormularioCheckout(dados) {
  if (!dados.nomeCliente) {
    mostrarToast('Por favor, informe seu nome.', 'erro');
    return false;
  }
  if (!dados.telefoneCliente || dados.telefoneCliente.replace(/\D/g, '').length < 10) {
    mostrarToast('Informe um telefone/WhatsApp válido.', 'erro');
    return false;
  }
  if (dados.tipoEntrega === 'entrega') {
    if (!dados.ruaEndereco || !dados.numeroEndereco || !dados.bairroEndereco) {
      mostrarToast('Preencha rua, número e bairro para a entrega.', 'erro');
      return false;
    }
  }
  if (estado.carrinho.length === 0) {
    mostrarToast('Seu carrinho está vazio.', 'erro');
    return false;
  }
  if (dados.formaPagamento === 'dinheiro' && dados.trocoPara) {
    const valorTroco = converterTextoParaNumero(dados.trocoPara);
    const ehEntrega = dados.tipoEntrega === 'entrega';
    const totalPedido = calcularSubtotalCarrinho() + (ehEntrega ? CONFIGURACAO.taxaEntrega : 0);
 
    if (valorTroco === null) {
      mostrarToast('Informe um valor de troco válido, ex: 100,00.', 'erro');
      return false;
    }
    if (valorTroco < totalPedido) {
      mostrarToast(`O troco deve ser para um valor maior que o total do pedido (${formatarMoeda(totalPedido)}).`, 'erro');
      return false;
    }
  }
  return true;
}
 
function montarMensagemWhatsApp(dados) {
  const subtotal = calcularSubtotalCarrinho();
  const ehEntrega = dados.tipoEntrega === 'entrega';
  const taxaEntrega = ehEntrega ? CONFIGURACAO.taxaEntrega : 0;
  const total = subtotal + taxaEntrega;
 
  const linhasItens = estado.carrinho.map((item) => {
    let linha = `• ${item.quantidade}x ${item.nome} (${item.variacaoNome}) — ${formatarMoeda(item.precoUnitario * item.quantidade)}`;
    if (item.observacao) linha += `\n   _Obs: ${item.observacao}_`;
    return linha;
  }).join('\n');
 
  let blocoEntrega = '';
  if (ehEntrega) {
    blocoEntrega = `*Entrega:* 🛵 Delivery\n${dados.ruaEndereco}, ${dados.numeroEndereco} — ${dados.bairroEndereco}`;
    if (dados.complementoEndereco) blocoEntrega += `\nComplemento: ${dados.complementoEndereco}`;
    if (dados.referenciaEndereco) blocoEntrega += `\nReferência: ${dados.referenciaEndereco}`;
  } else {
    blocoEntrega = '*Entrega:* 🏠 Retirada no local';
  }
 
  let blocoPagamento = '*Pagamento:* ';
  if (dados.formaPagamento === 'dinheiro') {
    blocoPagamento += '💵 Dinheiro';
    if (dados.trocoPara) blocoPagamento += ` (troco para R$ ${dados.trocoPara})`;
  } else if (dados.formaPagamento === 'cartao') {
    blocoPagamento += '💳 Cartão na entrega';
  } else {
    blocoPagamento += '📱 Pix';
  }
 
  const partes = [
    `*NOVO PEDIDO — ${CONFIGURACAO.nomeLoja.toUpperCase()}* 🍕`,
    `*Cliente:* ${dados.nomeCliente}`,
    `*Telefone:* ${dados.telefoneCliente}`,
    '',
    '*Itens do pedido:*',
    linhasItens,
    '',
    `*Subtotal:* ${formatarMoeda(subtotal)}`,
  ];
 
  if (ehEntrega) partes.push(`*Taxa de entrega:* ${formatarMoeda(taxaEntrega)}`);
  partes.push(`*Total:* ${formatarMoeda(total)}`, '', blocoEntrega, '', blocoPagamento);
 
  if (dados.observacoesGerais) {
    partes.push('', `*Observações gerais:* ${dados.observacoesGerais}`);
  }
 
  partes.push('', '_Pedido enviado pelo cardápio digital._');
 
  return partes.join('\n');
}
 
/* Abre o WhatsApp criando e "clicando" num link real (<a target="_blank">)
   em vez de usar window.open(). Isso evita a maioria dos bloqueios de
   pop-up dos navegadores, que costumam mirar especificamente chamadas de
   window.open() e não a navegação por um link. Retorna true/false apenas
   para log interno — a garantia real de que o cliente consiga enviar o
   pedido vem do link manual de apoio (ver exibirLinkManualWhatsApp). */
function abrirWhatsApp(url) {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (erro) {
    console.warn('Não foi possível abrir o WhatsApp automaticamente:', erro);
    return false;
  }
}
 
/* Mostra um botão de apoio, sempre visível após o envio, com o link
   pronto do pedido. Garante que o cliente NUNCA fique sem conseguir
   enviar o pedido, mesmo se a abertura automática for bloqueada pelo
   navegador (comum em Safari/iOS e em navegadores dentro de apps como
   Instagram/Facebook). O link já contém a mensagem completa do pedido,
   então continua válido mesmo depois do carrinho ser limpo. */
function exibirLinkManualWhatsApp(url) {
  const link = document.getElementById('linkManualWhatsapp');
  link.href = url;
  link.classList.remove('oculto');
}
 
function ocultarLinkManualWhatsApp() {
  const link = document.getElementById('linkManualWhatsapp');
  link.classList.add('oculto');
  link.href = '#';
}
 
function configurarEnvioFormularioCheckout() {
  document.getElementById('formCheckout').addEventListener('submit', (evento) => {
    evento.preventDefault();
 
    const formulario = evento.target;
    const dados = {
      nomeCliente: document.getElementById('nomeCliente').value.trim(),
      telefoneCliente: document.getElementById('telefoneCliente').value.trim(),
      tipoEntrega: obterTipoEntregaSelecionado(),
      ruaEndereco: document.getElementById('ruaEndereco').value.trim(),
      numeroEndereco: document.getElementById('numeroEndereco').value.trim(),
      bairroEndereco: document.getElementById('bairroEndereco').value.trim(),
      complementoEndereco: document.getElementById('complementoEndereco').value.trim(),
      referenciaEndereco: document.getElementById('referenciaEndereco').value.trim(),
      formaPagamento: obterFormaPagamentoSelecionada(),
      trocoPara: document.getElementById('trocoPara').value.trim(),
      observacoesGerais: document.getElementById('observacoesGerais').value.trim(),
    };
 
    if (!validarFormularioCheckout(dados)) return;
 
    const mensagem = montarMensagemWhatsApp(dados);
    const url = `https://wa.me/${CONFIGURACAO.numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
 
    const abriuAutomaticamente = abrirWhatsApp(url);
 
    // O link manual fica sempre visível após o envio — mesmo quando a
    // abertura automática funciona — como uma rede de segurança caso o
    // cliente feche a aba do WhatsApp sem enviar por engano.
    exibirLinkManualWhatsApp(url);
 
    mostrarToast(
      abriuAutomaticamente
        ? 'Pedido pronto! Confirme o envio na aba do WhatsApp que abrimos. 🍕✅'
        : 'Pedido pronto! Toque no botão dourado abaixo para enviar pelo WhatsApp. 🍕✅',
      'sucesso'
    );
 
    // É seguro limpar o carrinho agora: a mensagem completa do pedido já
    // está guardada na URL do link manual, então o cliente não perde nada
    // mesmo se a abertura automática tiver falhado.
    estado.carrinho = [];
    salvarCarrinhoLocalStorage();
    renderizarCarrinho();
    atualizarIndicadoresCarrinho();
 
    formulario.reset();
    sincronizarCamposDeEntrega();
    document.getElementById('campoTroco').classList.remove('oculto');
    document.getElementById('avisoPix').classList.add('oculto');
 
    // Importante: NÃO fechamos o painel de checkout automaticamente aqui.
    // Se fechássemos, o botão de apoio (linkManualWhatsapp) ficaria
    // escondido junto com o painel, e o cliente perderia a única forma de
    // reenviar o pedido caso a abertura automática tenha sido bloqueada.
    // O cliente fecha o painel manualmente (✕) quando tiver concluído o
    // envio no WhatsApp.
  });
}
 
/* =========================================================================
   14. EVENTOS GERAIS DE INTERFACE
   ========================================================================= */
function configurarEventosGerais() {
  document.getElementById('botaoCarrinhoFlutuante').addEventListener('click', abrirCarrinho);
  document.getElementById('fecharCarrinho').addEventListener('click', fecharCarrinhoFn);
  document.getElementById('fecharModalProduto').addEventListener('click', fecharModalProdutoFn);
  document.getElementById('fecharModalMontarPizza').addEventListener('click', fecharModalMontarPizzaFn);
  document.getElementById('botaoIrParaCheckout').addEventListener('click', abrirCheckout);
  document.getElementById('fecharCheckout').addEventListener('click', fecharCheckoutFn);
  document.getElementById('voltarParaCarrinho').addEventListener('click', () => {
    fecharCheckoutFn();
    abrirCarrinho();
  });
}
 
/* =========================================================================
   15. INICIALIZAÇÃO
   ========================================================================= */
function inicializarAplicacao() {
  carregarCarrinhoLocalStorage();
  renderizarNavegacaoCategorias();
  renderizarCardapio();

  // A foto do "Monte sua Pizza" e a logo da loja vêm fixas no HTML
  // desde o início (ao contrário das outras, que só ganham "src" quando
  // um modal abre) — por isso conectamos o fallback delas aqui, o
  // quanto antes possível.
  const modalMontarPizza = document.getElementById('modalMontarPizza');
  if (modalMontarPizza) configurarFallbackDeFotos(modalMontarPizza);
  const cabecalho = document.getElementById('cabecalho');
  if (cabecalho) configurarFallbackDeFotos(cabecalho);

  ajustarMargemDeRolagem();
  window.addEventListener('resize', ajustarMargemDeRolagem);
 
  // observarCategoriasVisiveis() é só um realce visual (destaca a
  // categoria atual na navegação enquanto o cliente rola a página).
  // Isolamos com try/catch de propósito: se IntersectionObserver não
  // existir ou falhar por qualquer motivo em algum navegador, isso NÃO
  // pode impedir a busca, o carrinho e o checkout de funcionarem —
  // que são as funções essenciais configuradas logo abaixo.
  try {
    observarCategoriasVisiveis();
  } catch (erro) {
    console.warn('Realce de categoria ativa desativado (navegador sem suporte?):', erro);
  }

  // Mesmo raciocínio aqui: se por algum motivo isso falhar, a barra de
  // categorias ainda tem o "position: sticky" do CSS como plano B — não
  // pode travar o resto da inicialização.
  try {
    configurarBarraFixaAoRolar();
  } catch (erro) {
    console.warn('Reforço de barra fixa desativado (navegador sem suporte?):', erro);
  }

  configurarBusca();
  configurarComportamentoDosPaineis();
  configurarControlesQuantidadeModal();
  configurarFormularioProduto();
  configurarTamanhoMontagem();
  configurarControlesQuantidadeMontagem();
  configurarFormularioMontagem();
  configurarAlternanciaEntrega();
  configurarAlternanciaPagamento();
  configurarEnvioFormularioCheckout();
  configurarEventosGerais();
  atualizarStatusLoja();
  renderizarCarrinho();
  atualizarIndicadoresCarrinho();
}
 
document.addEventListener('DOMContentLoaded', inicializarAplicacao);