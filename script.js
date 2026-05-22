/* ══════════════════════════════════════════
   Belly Bea — script.js
   Hero Slideshow · Catálogo · Modal/Carrossel
   Carrinho · Finalização WhatsApp
   ══════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   ⚙️  CONFIGURAÇÃO — edite aqui
   ──────────────────────────────────────── */

/**
 * Número do WhatsApp para receber pedidos.
 * Formato: DDI + DDD + número (apenas dígitos)
 * Exemplo Brasil: '5551999998888'
 */
const CONFIG = {
  whatsappNumber: '5551999803234',
  heroInterval:   5000,   // ms entre slides do hero
  toastDuration:  2800,   // ms que o toast fica visível
};

/* ════════════════════════════════════════
   1. BASE DE PRODUTOS
   ════════════════════════════════════════

   🗂️  ESTRUTURA DE PASTAS RECOMENDADA PARA USO REAL:
   ─────────────────────────────────────────────────
   /
   ├── index.html
   ├── style.css
   ├── script.js
   └── images/
       ├── produto-1/
       │   ├── img1.jpg
       │   ├── img2.jpg
       │   ├── img3.jpg
       │   └── img4.jpg
       ├── produto-2/
       │   └── ...
       └── ...

   Para usar imagens locais, substitua as URLs abaixo por:
   'images/produto-1/img1.jpg'

   Cada produto pode ter quantas imagens quiser no array `imagens`.
   O site carrega automaticamente todas — basta adicionar no array.
*/

const PRODUTOS = [
  {
    id: 1,
    categoria: 'fitness',
    nome: 'Top Maria',
    descricao: 'Top roxo muito legal com um short roxo muito legal também se quiser vim provar...',
    composicao: '100% Viscose. Lavar à mão com água fria. Não usar secadora. Passar em temperatura baixa.',
    tamanhos: ['P', 'M', 'G', 'GG'],
    precoPronta: 149.90,
    precoEnc:    124.90,
    imagens: [
      'images/top_maria/img1.jpeg',
      'images/top_maria/img2.jpeg',
      'images/top_maria/img3.jpeg',
      'images/top_maria/img4.jpeg'
],
  },
  {
    id: 2,
    categoria: 'praia',
    nome: 'Biquini sem nome',
    descricao: 'Biquini com bojo removível e alças que podem virar espaguetes flutuantes. Tecido dry com proteção UV50+. Estampa exclusiva coleção Verão 2025.',
    composicao: '82% Poliamida · 18% Elastano. Lavar à mão. Não torcer. Secar à sombra.',
    tamanhos: ['PP', 'P', 'M', 'G'],
    precoPronta: 99.90,
    precoEnc:    84.90,
    imagens: [
      'images/biquini_semnome/img1.jpeg',
      'images/biquini_semnome/img2.jpeg',
      'images/biquini_semnome/img3.jpeg',
      'images/biquini_semnome/img4.jpeg'
    ],
  },
  {
    id: 3,
    categoria: 'praia',
    nome: 'Biquini Rosa',
    descricao: 'Biquini pantera cor de rosa. Detalhe ilhós nas laterais para ventilação. Secagem rápida e conforto máximo.',
    composicao: '70% Viscose · 30% Linho. Lavar em ciclo delicado. Não usar secadora.',
    tamanhos: ['P', 'M', 'G', 'GG'],
    precoPronta: 119.90,
    precoEnc:    99.90,
    imagens: [
      'images/biquini_rosa/img1.jpeg',
      'images/biquini_rosa/img2.jpeg',
      'images/biquini_rosa/img3.jpeg',
      'images/biquini_rosa/img4.jpeg'
    ],
  },
  {
    id: 4,
    categoria: 'fitness',
    nome: 'Legging Power Flex',
    descricao: 'Legging de compressão média com bolso lateral zíper. Tecido sculpt anti-celulite de alta sustentação. Cintura alta com elástico reforçado e cós duplo.',
    composicao: '74% Poliamida · 26% Elastano. Lavar à mão ou em ciclo delicado. Não usar secadora.',
    tamanhos: ['P', 'M', 'G', 'GG', 'XGG'],
    precoPronta: 169.90,
    precoEnc:    144.90,
    imagens: [
      'images/leggin/img1.jpeg',
      'images/leggin/img2.jpeg',
      'images/leggin/img3.jpeg',
      'images/leggin/img4.jpeg',
    ],
  },
  {
    id: 5,
    categoria: 'fitness',
    nome: 'Macaquinho',
    descricao: 'Macaquinho preto. Elástico embutido e alça regulável. Ideal para yoga, pilates, funcional e treinos leves.',
    composicao: '68% Poliamida · 32% Elastano. Lavar à mão. Não torcer. Secar naturalmente.',
    tamanhos: ['PP', 'P', 'M', 'G'],
    precoPronta: 89.90,
    precoEnc:    74.90,
    imagens: [
      'images/macaquinho/img1.jpeg',
      'images/macaquinho/img2.jpeg',
      'images/macaquinho/img3.jpeg',
      'images/macaquinho/img4.jpeg',
    ],
  },
];

/* ════════════════════════════════════════
   2. ESTADO GLOBAL
   ════════════════════════════════════════ */

const STATE = {
  carrinho:          [],   // [{ produto, tamanho, quantidade }]
  tamanhoSelecionado: {},  // { [produtoId]: 'M' }
  modalProduto:      null, // produto atualmente no modal
  modalImagemIdx:    0,    // índice da imagem ativa no modal
  filtroAtivo:       'todos',
};

/* ════════════════════════════════════════
   3. UTILITÁRIOS
   ════════════════════════════════════════ */

/** Formata número como moeda BRL */
function fmt(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Pluraliza "item" / "itens" */
function pluralItem(n) { return n === 1 ? '1 item' : `${n} itens`; }

/** Total de itens no carrinho */
function totalItens() {
  return STATE.carrinho.reduce((s, i) => s + i.quantidade, 0);
}

/** Valor total do carrinho */
function totalValor() {
  return STATE.carrinho.reduce((s, i) => s + i.produto.precoPronta * i.quantidade, 0);
}

/* ════════════════════════════════════════
   4. HERO SLIDESHOW
   ════════════════════════════════════════ */

(function initHero() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0;
  let timer    = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    slides[current].classList.add('leaving');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    setTimeout(() => slides[current].classList.remove('leaving'), 1200);

    current = idx;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, CONFIG.heroInterval);
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // Dots manuais
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Pausa no hover
  const hero = document.getElementById('hero');
  hero.addEventListener('mouseenter', stopAuto);
  hero.addEventListener('mouseleave', startAuto);

  startAuto();
})();

/* ════════════════════════════════════════
   5. HEADER — scroll effect
   ════════════════════════════════════════ */

(function initHeader() {
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ════════════════════════════════════════
   6. RENDERIZAÇÃO DO CATÁLOGO
   ════════════════════════════════════════ */

function renderCatalogo(lista) {
  const grid  = document.getElementById('catalogGrid');
  const count = document.getElementById('productCount');

  grid.innerHTML = '';
  count.textContent = `${lista.length} ${lista.length === 1 ? 'peça' : 'peças'}`;

  if (lista.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--stone);padding:80px 0;font-size:15px;">Nenhum produto encontrado.</p>';
    return;
  }

  lista.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.style.animationDelay = `${idx * 0.07}s`;
    card.dataset.id = p.id;

    const label   = p.categoria === 'praia' ? '🌊 Praia' : '💪 Fitness';
    const tagCls  = p.categoria === 'praia' ? 'card-tag--praia' : 'card-tag--fitness';
    const imgPrev = p.imagens[0];

    const sizesHtml = p.tamanhos
      .map(t => `<span class="card-size-dot" data-id="${p.id}" data-size="${t}">${t}</span>`)
      .join('');

    card.innerHTML = `
      <div class="card-thumb" data-id="${p.id}" role="button" tabindex="0" aria-label="Ver detalhes de ${p.nome}">
        <img
          src="${imgPrev}"
          alt="${p.nome}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=800&q=80'"
        />
        <div class="card-overlay">
          <button class="card-overlay-btn" tabindex="-1">Ver Detalhes</button>
        </div>
        <span class="card-tag ${tagCls}">${label}</span>
      </div>

      <div class="card-body">
        <h3 class="card-name" data-id="${p.id}" role="button" tabindex="0">${p.nome}</h3>
        <p class="card-desc">${p.descricao.split('.')[0]}.</p>
        <div class="card-sizes">${sizesHtml}</div>
        <div class="card-price-row">
          <span class="card-price-main">${fmt(p.precoPronta)}</span>
          <span class="card-price-label">pronta entrega</span>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn-add-card" data-id="${p.id}">Adicionar</button>
        <button class="btn-detail-card" data-id="${p.id}" aria-label="Ver detalhes de ${p.nome}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  vincularEventosCards();
}

/* ════════════════════════════════════════
   7. EVENTOS DOS CARDS
   ════════════════════════════════════════ */

function vincularEventosCards() {
  const grid = document.getElementById('catalogGrid');

  // Seleção de tamanho no card
  grid.querySelectorAll('.card-size-dot').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(el.dataset.id);
      const sz = el.dataset.size;

      grid.querySelectorAll(`.card-size-dot[data-id="${id}"]`)
        .forEach(d => d.style.cssText = '');

      el.style.background    = 'var(--ink)';
      el.style.color         = 'var(--white)';
      el.style.borderColor   = 'var(--ink)';

      STATE.tamanhoSelecionado[id] = sz;
    });
  });

  // Abrir modal — thumb, nome, botão olho
  grid.querySelectorAll('[data-id]').forEach(el => {
    const isThumb  = el.classList.contains('card-thumb');
    const isName   = el.classList.contains('card-name');
    const isDetail = el.classList.contains('btn-detail-card');

    if (isThumb || isName || isDetail) {
      el.addEventListener('click', () => abrirModal(parseInt(el.dataset.id)));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrirModal(parseInt(el.dataset.id));
        }
      });
    }
  });

  // Botão "Adicionar" no card
  grid.querySelectorAll('.btn-add-card').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      adicionarAoCarrinho(parseInt(btn.dataset.id), btn);
    });
  });
}

/* ════════════════════════════════════════
   8. MODAL — abertura e fechamento
   ════════════════════════════════════════ */

function abrirModal(produtoId) {
  const p = PRODUTOS.find(x => x.id === produtoId);
  if (!p) return;

  STATE.modalProduto   = p;
  STATE.modalImagemIdx = 0;

  // Preenche conteúdo
  document.getElementById('modalCategory').textContent    = p.categoria === 'praia' ? '🌊 Moda Praia' : '💪 Fitness';
  document.getElementById('modalProductName').textContent  = p.nome;
  document.getElementById('modalDesc').textContent         = p.descricao;
  document.getElementById('modalPricePronta').textContent  = fmt(p.precoPronta);
  document.getElementById('modalPriceEnc').textContent     = fmt(p.precoEnc);
  document.getElementById('modalComposicao').textContent   = p.composicao;

  renderGaleria(p);
  renderTamanhosModal(p);

  // Reseta estado do botão
  const btnAdd = document.getElementById('btnAddModal');
  btnAdd.textContent = 'Adicionar ao Carrinho';
  btnAdd.classList.remove('added');
  btnAdd.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
    Adicionar ao Carrinho
  `;

  // Abre backdrop
  const backdrop = document.getElementById('modalBackdrop');
  backdrop.classList.add('open');
  backdrop.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalClose').focus();
}

function fecharModal() {
  document.getElementById('modalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════════════
   9. GALERIA DO MODAL — renderização
   ════════════════════════════════════════ */

function renderGaleria(p) {
  const mainImg = document.getElementById('galleryMainImg');
  const thumbs  = document.getElementById('galleryThumbs');
  const counter = document.getElementById('galleryCounter');

  // Imagem principal
  mainImg.src = p.imagens[0];
  mainImg.alt = p.nome;

  // Miniaturas
  thumbs.innerHTML = '';
  p.imagens.forEach((url, i) => {
    const div = document.createElement('div');
    div.className = `gallery-thumb${i === 0 ? ' active' : ''}`;
    div.dataset.idx = i;
    div.innerHTML = `<img src="${url}" alt="${p.nome} - imagem ${i + 1}" loading="lazy">`;
    div.addEventListener('click', () => irParaImagem(i));
    thumbs.appendChild(div);
  });

  counter.textContent = `1 / ${p.imagens.length}`;
}

/** Navega para imagem pelo índice */
function irParaImagem(idx) {
  const p       = STATE.modalProduto;
  const mainImg = document.getElementById('galleryMainImg');
  const thumbs  = document.querySelectorAll('.gallery-thumb');
  const counter = document.getElementById('galleryCounter');

  // Transição suave
  mainImg.classList.add('changing');
  setTimeout(() => {
    mainImg.src = p.imagens[idx];
    mainImg.classList.remove('changing');
  }, 200);

  // Atualiza thumb ativa
  thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
  counter.textContent = `${idx + 1} / ${p.imagens.length}`;
  STATE.modalImagemIdx = idx;

  // Scroll da miniatura ativa para o centro
  const activeThumb = document.querySelector('.gallery-thumb.active');
  if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

/** Avança/volta na galeria */
function navegarGaleria(delta) {
  const total = STATE.modalProduto.imagens.length;
  const next  = (STATE.modalImagemIdx + delta + total) % total;
  irParaImagem(next);
}

/* ════════════════════════════════════════
   10. TAMANHOS DO MODAL
   ════════════════════════════════════════ */

function renderTamanhosModal(p) {
  const container = document.getElementById('modalSizes');
  container.innerHTML = '';

  // Mantém seleção anterior se houver
  const prev = STATE.tamanhoSelecionado[p.id];

  p.tamanhos.forEach(t => {
    const btn = document.createElement('button');
    btn.className = `modal-size-btn${prev === t ? ' selected' : ''}`;
    btn.textContent = t;
    btn.dataset.size = t;

    btn.addEventListener('click', () => {
      container.querySelectorAll('.modal-size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      STATE.tamanhoSelecionado[p.id] = t;
    });

    container.appendChild(btn);
  });
}

/* ════════════════════════════════════════
   11. CARRINHO — lógica
   ════════════════════════════════════════ */

/**
 * Adiciona produto ao carrinho.
 * Exige tamanho selecionado; caso contrário, anima os botões.
 * @param {number} produtoId
 * @param {HTMLElement|null} btnRef  - referência para feedback visual
 * @param {boolean} fromModal        - se true, fecha o modal após adicionar
 */
function adicionarAoCarrinho(produtoId, btnRef, fromModal = false) {
  const p       = PRODUTOS.find(x => x.id === produtoId);
  const tamanho = STATE.tamanhoSelecionado[produtoId];

  if (!p) return;

  if (!tamanho) {
    // Nenhum tamanho selecionado — agita os botões
    const ctx = fromModal
      ? document.getElementById('modalSizes')
      : document.querySelector(`.catalog-grid [data-id="${produtoId}"].card-thumb`)
          ?.closest('.product-card')
          ?.querySelector('.card-sizes');

    if (ctx) {
      ctx.querySelectorAll('button, .card-size-dot').forEach(b => {
        b.classList.add('shake');
        setTimeout(() => b.classList.remove('shake'), 500);
      });
    }
    showToast('⚠️ Selecione um tamanho antes de adicionar!');
    return;
  }

  // Verifica se já existe no carrinho
  const existente = STATE.carrinho.find(i => i.produto.id === produtoId && i.tamanho === tamanho);
  if (existente) {
    existente.quantidade++;
  } else {
    STATE.carrinho.push({ produto: p, tamanho, quantidade: 1 });
  }

  // Feedback visual no botão
  if (btnRef) {
    btnRef.classList.add('added');
    if (fromModal) {
      btnRef.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Adicionado!
      `;
    } else {
      btnRef.textContent = '✓ Adicionado!';
    }
    setTimeout(() => {
      btnRef.classList.remove('added');
      if (fromModal) {
        btnRef.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Adicionar ao Carrinho
        `;
      } else {
        btnRef.textContent = 'Adicionar';
      }
    }, 2000);
  }

  atualizarCarrinho();
  showToast(`✓ ${p.nome} (${tamanho}) adicionado ao pedido!`);

  if (fromModal) {
    setTimeout(fecharModal, 600);
  }
}

function removerItem(idx) {
  STATE.carrinho.splice(idx, 1);
  atualizarCarrinho();
}

function alterarQtd(idx, delta) {
  STATE.carrinho[idx].quantidade += delta;
  if (STATE.carrinho[idx].quantidade <= 0) {
    removerItem(idx);
  } else {
    atualizarCarrinho();
  }
}

/** Atualiza badge + conteúdo do sidebar */
function atualizarCarrinho() {
  const total = totalItens();

  // Badge header
  document.getElementById('cartBadge').textContent = total;

  // Sidebar
  renderSidebar();
}

function renderSidebar() {
  const empty   = document.getElementById('cartEmpty');
  const items   = document.getElementById('cartItems');
  const footer  = document.getElementById('cartFooter');
  const count   = document.getElementById('cartItemCount');
  const subtot  = document.getElementById('cartSubtotal');
  const tot     = document.getElementById('cartTotal');

  count.textContent = pluralItem(totalItens());

  if (STATE.carrinho.length === 0) {
    empty.style.display  = 'flex';
    items.style.display  = 'none';
    footer.hidden        = true;
    return;
  }

  empty.style.display  = 'none';
  items.style.display  = 'block';
  footer.hidden        = false;

  items.innerHTML = '';

  STATE.carrinho.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img
        class="cart-item-img"
        src="${item.produto.imagens[0]}"
        alt="${item.produto.nome}"
        onerror="this.src='https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=200&q=80'"
      />
      <div class="cart-item-info">
        <p class="cart-item-name">${item.produto.nome}</p>
        <p class="cart-item-meta">Tamanho: ${item.tamanho}</p>
        <p class="cart-item-price">${fmt(item.produto.precoPronta)}</p>
      </div>
      <div class="cart-qty-ctrl">
        <button class="qty-btn" onclick="alterarQtd(${idx}, 1)" aria-label="Aumentar quantidade">+</button>
        <span class="qty-val">${item.quantidade}</span>
        <button class="qty-btn" onclick="alterarQtd(${idx}, -1)" aria-label="Diminuir quantidade ou remover">−</button>
      </div>
    `;
    items.appendChild(li);
  });

  const val = totalValor();
  subtot.textContent = fmt(val);
  tot.textContent    = fmt(val);
}

/* ════════════════════════════════════════
   12. ABRIR / FECHAR SIDEBAR
   ════════════════════════════════════════ */

function abrirCarrinho() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  if (!document.getElementById('modalBackdrop').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

/* ════════════════════════════════════════
   13. FINALIZAÇÃO — WhatsApp
   ════════════════════════════════════════ */

function finalizarPedido() {
  if (STATE.carrinho.length === 0) {
    showToast('Seu carrinho está vazio!');
    return;
  }

  const linhas = STATE.carrinho.map(i => {
    const subtotal = fmt(i.produto.precoPronta * i.quantidade);
    return `• ${i.produto.nome} (Tam. ${i.tamanho}) × ${i.quantidade} — ${subtotal}`;
  }).join('\n');

  const msg =
    `Olá! Gostaria de fazer o seguinte pedido:\n\n` +
    `${linhas}\n\n` +
    `*Total: ${fmt(totalValor())}*\n\n` +
    `Aguardo confirmação de disponibilidade e dados para pagamento. Obrigada!`;

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ════════════════════════════════════════
   14. FILTROS
   ════════════════════════════════════════ */

function aplicarFiltro(filtro) {
  STATE.filtroAtivo = filtro;
  const lista = filtro === 'todos'
    ? PRODUTOS
    : PRODUTOS.filter(p => p.categoria === filtro);
  renderCatalogo(lista);
}

/* ════════════════════════════════════════
   15. TOAST
   ════════════════════════════════════════ */

let _toastTimer = null;

function showToast(msg) {
  const el  = document.getElementById('toast');
  const msg_ = document.getElementById('toastMsg');

  msg_.textContent = msg;
  el.classList.add('show');

  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), CONFIG.toastDuration);
}

/* ════════════════════════════════════════
   16. INICIALIZAÇÃO
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* Catálogo inicial */
  renderCatalogo(PRODUTOS);

  /* Filtros */
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      aplicarFiltro(btn.dataset.filter);
    });
  });

  /* Abrir carrinho */
  document.getElementById('cartBtn').addEventListener('click', abrirCarrinho);

  /* Fechar carrinho */
  document.getElementById('cartClose').addEventListener('click', fecharCarrinho);
  document.getElementById('cartOverlay').addEventListener('click', fecharCarrinho);

  /* WhatsApp */
  document.getElementById('btnWhatsApp').addEventListener('click', finalizarPedido);

  /* Modal — fechar */
  document.getElementById('modalClose').addEventListener('click', fecharModal);
  document.getElementById('modalBackdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('modalBackdrop')) fecharModal();
  });

  /* Modal — adicionar ao carrinho */
  document.getElementById('btnAddModal').addEventListener('click', () => {
    const btn = document.getElementById('btnAddModal');
    adicionarAoCarrinho(STATE.modalProduto.id, btn, true);
  });

  /* Galeria — setas */
  document.getElementById('galleryPrev').addEventListener('click', () => navegarGaleria(-1));
  document.getElementById('galleryNext').addEventListener('click', () => navegarGaleria(1));

  /* Galeria — teclado no modal */
  document.addEventListener('keydown', e => {
    const modalOpen = document.getElementById('modalBackdrop').classList.contains('open');

    if (e.key === 'Escape') {
      if (modalOpen) fecharModal();
      else fecharCarrinho();
    }

    if (modalOpen) {
      if (e.key === 'ArrowLeft')  navegarGaleria(-1);
      if (e.key === 'ArrowRight') navegarGaleria(1);
    }
  });

  /* Galeria — swipe touch no modal */
  (function initSwipe() {
    const gallery = document.querySelector('.gallery-main');
    let startX = 0;

    gallery.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    gallery.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) navegarGaleria(diff > 0 ? 1 : -1);
    }, { passive: true });
  })();

  /* Estado inicial do sidebar */
  renderSidebar();
});
