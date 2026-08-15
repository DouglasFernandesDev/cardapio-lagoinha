/* =========================================================================
   PIZZARIA NONNA BELLA — SCRIPT.JS
   Lógica do cardápio, carrinho, checkout e envio do pedido via WhatsApp.
   ========================================================================= */

'use strict';

/* =========================================================================
   1. CONFIGURAÇÃO DA LOJA — troque pelos dados reais da pizzaria
   ========================================================================= */
const CONFIGURACAO = {
  // Número do WhatsApp com código do país + DDD, somente dígitos.
  // Exemplo: 55 (Brasil) + 21 (DDD) + número.
  numeroWhatsapp: '5521999999999',
  nomeLoja: 'Pizzaria Nonna Bella',
  taxaEntrega: 6.0,
  horarioFuncionamento: { abre: 18, fecha: 23.5 }, // 23.5 = 23h30
  chavePix: 'contato@nonnabella.com.br',
};

/* =========================================================================
   2. DADOS DO CARDÁPIO
   ========================================================================= */
const CATEGORIAS = [
  { id: 'tradicionais', nome: 'Pizzas Tradicionais', icone: '🍕' },
  { id: 'especiais', nome: 'Especiais da Casa', icone: '⭐' },
  { id: 'doces', nome: 'Pizzas Doces', icone: '🍫' },
  { id: 'bordas', nome: 'Bordas Recheadas', icone: '🧀' },
  { id: 'bebidas', nome: 'Bebidas', icone: '🥤' },
  { id: 'sobremesas', nome: 'Sobremesas', icone: '🍮' },
];

const PRODUTOS = [
  // ---------------- PIZZAS TRADICIONAIS ----------------
  {
    id: 'p01', categoriaId: 'tradicionais', emoji: '🍕',
    nome: 'Marguerita',
    descricao: 'Molho de tomate artesanal, mussarela, tomate fresco, manjericão e azeite extravirgem.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 46.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 58.90 },
      { id: 'familia', nome: 'Família · 12 fatias', preco: 76.90 },
    ],
  },
  {
    id: 'p02', categoriaId: 'tradicionais', emoji: '🌶️',
    nome: 'Calabresa',
    descricao: 'Molho de tomate, mussarela, calabresa fatiada, cebola roxa e orégano.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 44.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 56.90 },
      { id: 'familia', nome: 'Família · 12 fatias', preco: 74.90 },
    ],
  },
  {
    id: 'p03', categoriaId: 'tradicionais', emoji: '🍗',
    nome: 'Frango com Catupiry',
    descricao: 'Frango desfiado temperado, catupiry cremoso, milho e orégano.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 47.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 59.90 },
      { id: 'familia', nome: 'Família · 12 fatias', preco: 78.90 },
    ],
  },
  {
    id: 'p04', categoriaId: 'tradicionais', emoji: '🥚',
    nome: 'Portuguesa',
    descricao: 'Presunto, ovos, cebola, azeitona, ervilha e mussarela.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 47.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 59.90 },
      { id: 'familia', nome: 'Família · 12 fatias', preco: 78.90 },
    ],
  },
  {
    id: 'p05', categoriaId: 'tradicionais', emoji: '🧀',
    nome: 'Quatro Queijos',
    descricao: 'Mussarela, provolone, parmesão e gorgonzola sobre molho branco.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 49.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 62.90 },
      { id: 'familia', nome: 'Família · 12 fatias', preco: 81.90 },
    ],
  },
  {
    id: 'p06', categoriaId: 'tradicionais', emoji: '🍕',
    nome: 'Pepperoni',
    descricao: 'Molho de tomate, mussarela, pepperoni fatiado e orégano.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 48.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 60.90 },
      { id: 'familia', nome: 'Família · 12 fatias', preco: 79.90 },
    ],
  },

  // ---------------- ESPECIAIS DA CASA ----------------
  {
    id: 'p07', categoriaId: 'especiais', emoji: '🌿',
    nome: 'Nonna Bella',
    descricao: 'Presunto de parma, rúcula fresca, tomate seco e lascas de parmesão.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 56.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 69.90 },
      { id: 'familia', nome: 'Família · 12 fatias', preco: 89.90 },
    ],
  },
  {
    id: 'p08', categoriaId: 'especiais', emoji: '🫒',
    nome: 'Toscana',
    descricao: 'Linguiça toscana defumada, pimentão, cebola roxa e azeitona preta.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 52.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 65.90 },
      { id: 'familia', nome: 'Família · 12 fatias', preco: 84.90 },
    ],
  },
  {
    id: 'p09', categoriaId: 'especiais', emoji: '🐃',
    nome: 'Búfala',
    descricao: 'Mussarela de búfala, tomate cereja, manjericão fresco e azeite trufado.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 57.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 71.90 },
      { id: 'familia', nome: 'Família · 12 fatias', preco: 92.90 },
    ],
  },
  {
    id: 'p10', categoriaId: 'especiais', emoji: '🍆',
    nome: 'Vegetariana Grelhada',
    descricao: 'Berinjela, abobrinha, pimentão e cebola caramelizada com mussarela.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 49.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 62.90 },
      { id: 'familia', nome: 'Família · 12 fatias', preco: 81.90 },
    ],
  },

  // ---------------- PIZZAS DOCES ----------------
  {
    id: 'p11', categoriaId: 'doces', emoji: '🍫',
    nome: 'Chocolate com Morango',
    descricao: 'Chocolate ao leite derretido e morangos frescos fatiados.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 44.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 56.90 },
    ],
  },
  {
    id: 'p12', categoriaId: 'doces', emoji: '🍌',
    nome: 'Banana com Canela',
    descricao: 'Banana caramelizada, canela e fio generoso de doce de leite.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 42.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 54.90 },
    ],
  },
  {
    id: 'p13', categoriaId: 'doces', emoji: '🍬',
    nome: 'Romeu e Julieta',
    descricao: 'Goiabada derretida e mussarela — o clássico queridinho do Brasil.',
    variacoes: [
      { id: 'media', nome: 'Média · 6 fatias', preco: 41.90 },
      { id: 'grande', nome: 'Grande · 8 fatias', preco: 53.90 },
    ],
  },

  // ---------------- BORDAS RECHEADAS ----------------
  {
    id: 'p14', categoriaId: 'bordas', emoji: '🧀',
    nome: 'Borda de Catupiry',
    descricao: 'Adicione uma borda generosa recheada com catupiry cremoso.',
    variacoes: [{ id: 'unica', nome: 'Adicionar à pizza', preco: 9.90 }],
  },
  {
    id: 'p15', categoriaId: 'bordas', emoji: '🧈',
    nome: 'Borda de Cheddar',
    descricao: 'Borda recheada com cheddar cremoso derretido.',
    variacoes: [{ id: 'unica', nome: 'Adicionar à pizza', preco: 9.90 }],
  },
  {
    id: 'p16', categoriaId: 'bordas', emoji: '🍫',
    nome: 'Borda de Chocolate',
    descricao: 'Borda recheada com chocolate ao leite — ideal para pizzas doces.',
    variacoes: [{ id: 'unica', nome: 'Adicionar à pizza', preco: 11.90 }],
  },

  // ---------------- BEBIDAS ----------------
  {
    id: 'p17', categoriaId: 'bebidas', emoji: '🥤',
    nome: 'Refrigerante Lata',
    descricao: 'Coca-Cola, Guaraná ou Fanta — 350ml, gelada.',
    variacoes: [{ id: 'unica', nome: '350ml', preco: 7.00 }],
  },
  {
    id: 'p18', categoriaId: 'bebidas', emoji: '🍾',
    nome: 'Refrigerante 2L',
    descricao: 'Coca-Cola ou Guaraná — garrafa de 2 litros, gelada.',
    variacoes: [{ id: 'unica', nome: '2 litros', preco: 15.00 }],
  },
  {
    id: 'p19', categoriaId: 'bebidas', emoji: '🧃',
    nome: 'Suco Natural',
    descricao: 'Laranja, limão ou maracujá — feito na hora, 500ml.',
    variacoes: [{ id: 'unica', nome: '500ml', preco: 11.00 }],
  },
  {
    id: 'p20', categoriaId: 'bebidas', emoji: '🍺',
    nome: 'Cerveja Long Neck',
    descricao: 'Long neck gelada — ótima parceira da pizza.',
    variacoes: [{ id: 'unica', nome: '355ml', preco: 12.00 }],
  },
  {
    id: 'p21', categoriaId: 'bebidas', emoji: '💧',
    nome: 'Água Mineral',
    descricao: 'Com ou sem gás, 500ml.',
    variacoes: [{ id: 'unica', nome: '500ml', preco: 5.00 }],
  },

  // ---------------- SOBREMESAS ----------------
  {
    id: 'p22', categoriaId: 'sobremesas', emoji: '🍮',
    nome: 'Petit Gâteau',
    descricao: 'Bolinho de chocolate quente com recheio cremoso e sorvete de creme.',
    variacoes: [{ id: 'unica', nome: 'Porção individual', preco: 19.90 }],
  },
  {
    id: 'p23', categoriaId: 'sobremesas', emoji: '🍨',
    nome: 'Brownie com Sorvete',
    descricao: 'Brownie de chocolate meio amargo com bola de sorvete de creme.',
    variacoes: [{ id: 'unica', nome: 'Porção individual', preco: 17.90 }],
  },
  {
    id: 'p24', categoriaId: 'sobremesas', emoji: '🍹',
    nome: 'Mousse de Maracujá',
    descricao: 'Mousse aerado e cremoso, com calda de maracujá fresco.',
    variacoes: [{ id: 'unica', nome: 'Porção individual', preco: 14.90 }],
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

/* Mostra uma notificação rápida (toast). Usa a Popover API nativa
   (showPopover()/hidePopover()) para garantir que a mensagem sempre
   apareça acima de qualquer <dialog> aberto — ambos são renderizados
   na mesma camada especial do navegador (o "top layer"), e o elemento
   mostrado mais recentemente fica por cima. Em navegadores muito
   antigos, sem suporte à Popover API, cai num modo de reserva baseado
   em classe CSS. */
function mostrarToast(mensagem, tipo = '') {
  const toast = document.getElementById('toast');
  const suportaPopover = typeof toast.showPopover === 'function';

  clearTimeout(mostrarToast._timeout);
  toast.textContent = mensagem;
  toast.className = 'toast' + (tipo ? ' toast--' + tipo : '');

  if (suportaPopover) {
    if (toast.matches(':popover-open')) toast.hidePopover();
    toast.showPopover();
  } else {
    toast.classList.add('toast--visivel');
  }

  mostrarToast._timeout = setTimeout(() => {
    if (suportaPopover) {
      toast.hidePopover();
    } else {
      toast.classList.remove('toast--visivel');
    }
  }, 3200);
}

function travarRolagemFundo(travar) {
  document.body.style.overflow = travar ? 'hidden' : '';
}

/* =========================================================================
   5. STATUS DA LOJA (aberto/fechado)
   ========================================================================= */
function atualizarStatusLoja() {
  const agora = new Date();
  const horaAtual = agora.getHours() + agora.getMinutes() / 60;
  const { abre, fecha } = CONFIGURACAO.horarioFuncionamento;
  const aberto = horaAtual >= abre && horaAtual < fecha;

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

  nav.innerHTML = `<ul class="navegacao-categorias__lista">${itens}</ul>`;

  nav.querySelectorAll('.navegacao-categorias__botao').forEach((botao) => {
    botao.addEventListener('click', () => {
      const alvo = document.getElementById(botao.dataset.categoriaAlvo);
      if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function renderizarCartaoProduto(produto) {
  const menorPreco = Math.min(...produto.variacoes.map((v) => v.preco));
  const prefixo = produto.variacoes.length > 1 ? 'a partir de' : 'preço';

  return `
    <li>
      <article class="cartao-produto" data-produto-id="${produto.id}" data-nome-busca="${normalizarTexto(produto.nome + ' ' + produto.descricao)}">
        <figure class="cartao-produto__emoji-area" aria-hidden="true">${produto.emoji}</figure>
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

function renderizarCardapio() {
  const container = document.getElementById('listaCategorias');

  container.innerHTML = CATEGORIAS.map((categoria) => {
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
}

/* Destaca a categoria visível durante a rolagem */
function observarCategoriasVisiveis() {
  const secoes = document.querySelectorAll('[data-categoria-secao]');
  const botoesNav = document.querySelectorAll('.navegacao-categorias__botao');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      botoesNav.forEach((botao) => {
        const ativo = botao.dataset.categoriaAlvo === entrada.target.id;
        botao.setAttribute('aria-current', ativo ? 'true' : 'false');
        if (ativo) botao.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  secoes.forEach((secao) => observador.observe(secao));
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
   8. <DIALOG> — ABERTURA/FECHAMENTO SEGUROS
   ========================================================================= */

/* Abre um <dialog> com showModal(), protegendo contra o erro que o
   navegador lançaria se ele já estivesse aberto (ex: duplo clique muito
   rápido no botão que o aciona). */
function abrirDialogo(dialogo) {
  if (!dialogo.open) dialogo.showModal();
}

/* Fecha um <dialog>. close() já é seguro de chamar mesmo se o diálogo
   não estiver aberto (não faz nada e não lança erro), mas o "if"
   deixa a intenção explícita e evita disparar o evento "close" à toa. */
function fecharDialogo(dialogo) {
  if (dialogo.open) dialogo.close();
}

/* Fecha o diálogo quando o clique acontece fora da área visível dele
   (ou seja, no ::backdrop). Comparamos as coordenadas do clique com o
   retângulo real do elemento em vez de checar "event.target === dialogo",
   que é uma forma menos confiável de detectar clique no backdrop entre
   navegadores diferentes. */
function fecharAoClicarFora(dialogo) {
  dialogo.addEventListener('click', (evento) => {
    const retangulo = dialogo.getBoundingClientRect();
    const cliqueDentro = (
      evento.clientX >= retangulo.left &&
      evento.clientX <= retangulo.right &&
      evento.clientY >= retangulo.top &&
      evento.clientY <= retangulo.bottom
    );
    if (!cliqueDentro) dialogo.close();
  });
}

/* Configura o comportamento comum aos três <dialog> da página: destrava
   a rolagem do fundo assim que qualquer um deles fecha (por botão, Esc
   ou clique fora — o evento "close" nativo cobre todos os casos) e
   permite fechar clicando fora. */
function configurarComportamentoDosDialogos() {
  ['modalProduto', 'painelCarrinho', 'painelCheckout'].forEach((id) => {
    const dialogo = document.getElementById(id);
    dialogo.addEventListener('close', () => travarRolagemFundo(false));
    fecharAoClicarFora(dialogo);
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

  document.getElementById('modalProdutoEmoji').textContent = produto.emoji;
  document.getElementById('modalProdutoTitulo').textContent = produto.nome;
  document.getElementById('modalProdutoDescricao').textContent = produto.descricao;
  document.getElementById('observacaoProduto').value = '';
  document.getElementById('valorQuantidade').textContent = '1';

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

  atualizarPrecoTotalModal();
  abrirDialogo(document.getElementById('modalProduto'));
  travarRolagemFundo(true);
}

function fecharModalProdutoFn() {
  fecharDialogo(document.getElementById('modalProduto'));
}

function atualizarPrecoTotalModal() {
  const total = estado.variacaoSelecionada.preco * estado.quantidadeSelecionada;
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

    estado.carrinho.push({
      idItemCarrinho: gerarIdUnico(),
      produtoId: estado.produtoAtual.id,
      nome: estado.produtoAtual.nome,
      emoji: estado.produtoAtual.emoji,
      variacaoNome: estado.variacaoSelecionada.nome,
      precoUnitario: estado.variacaoSelecionada.preco,
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
  document.getElementById('botaoCarrinhoFlutuante').classList.toggle('oculto', quantidadeTotal === 0);
}

function renderizarItemCarrinho(item) {
  return `
    <li class="item-carrinho" data-item-id="${item.idItemCarrinho}">
      <span class="item-carrinho__emoji" aria-hidden="true">${item.emoji}</span>
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
    localStorage.setItem('nonnaBellaCarrinho', JSON.stringify(estado.carrinho));
  } catch (erro) {
    console.warn('Não foi possível salvar o carrinho localmente:', erro);
  }
}

function carregarCarrinhoLocalStorage() {
  try {
    const dados = localStorage.getItem('nonnaBellaCarrinho');
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
  if (estado.carrinho.length === 0) {
    mostrarToast('Seu carrinho está vazio. Adicione uma pizza! 🍕');
    return;
  }
  abrirDialogo(document.getElementById('painelCarrinho'));
  travarRolagemFundo(true);
}

function fecharCarrinhoFn() {
  fecharDialogo(document.getElementById('painelCarrinho'));
}

function abrirCheckout() {
  fecharCarrinhoFn();
  ocultarLinkManualWhatsApp();
  atualizarResumoCheckout();
  abrirDialogo(document.getElementById('painelCheckout'));
  travarRolagemFundo(true);
}

function fecharCheckoutFn() {
  ocultarLinkManualWhatsApp();
  fecharDialogo(document.getElementById('painelCheckout'));
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
      nomeCliente: formulario.nomeCliente.value.trim(),
      telefoneCliente: formulario.telefoneCliente.value.trim(),
      tipoEntrega: obterTipoEntregaSelecionado(),
      ruaEndereco: formulario.ruaEndereco.value.trim(),
      numeroEndereco: formulario.numeroEndereco.value.trim(),
      bairroEndereco: formulario.bairroEndereco.value.trim(),
      complementoEndereco: formulario.complementoEndereco.value.trim(),
      referenciaEndereco: formulario.referenciaEndereco.value.trim(),
      formaPagamento: obterFormaPagamentoSelecionada(),
      trocoPara: formulario.trocoPara.value.trim(),
      observacoesGerais: formulario.observacoesGerais.value.trim(),
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
  document.getElementById('botaoIrParaCheckout').addEventListener('click', abrirCheckout);
  document.getElementById('fecharCheckout').addEventListener('click', fecharCheckoutFn);
  document.getElementById('voltarParaCarrinho').addEventListener('click', () => {
    fecharCheckoutFn();
    abrirCarrinho();
  });

  // Não é preciso mais escutar a tecla Esc manualmente: o <dialog>
  // nativo já fecha sozinho com Esc (dispara "cancel" e depois "close").
}

/* =========================================================================
   15. INICIALIZAÇÃO
   ========================================================================= */
function inicializarAplicacao() {
  carregarCarrinhoLocalStorage();
  renderizarNavegacaoCategorias();
  renderizarCardapio();
  observarCategoriasVisiveis();
  configurarBusca();
  configurarComportamentoDosDialogos();
  configurarControlesQuantidadeModal();
  configurarFormularioProduto();
  configurarAlternanciaEntrega();
  configurarAlternanciaPagamento();
  configurarEnvioFormularioCheckout();
  configurarEventosGerais();
  atualizarStatusLoja();
  renderizarCarrinho();
  atualizarIndicadoresCarrinho();
}

document.addEventListener('DOMContentLoaded', inicializarAplicacao);