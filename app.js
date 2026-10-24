
// ZYRON DIGITAL — SCRIPTS STORE
// ETAPA 1: CATÁLOGO DEMONSTRATIVO
// Nenhum pagamento ou download é realizado nesta versão.

const products = [
  {
    id: "rb1",
    name: "Sistema de Loja Roblox",
    category: "Roblox",
    price: 19.90,
    icon: "🎮",
    description: "Exemplo de sistema de loja com interface para um projeto Roblox.",
    requirements: "Roblox Studio"
  },
  {
    id: "dc1",
    name: "Bot de Tickets Discord",
    category: "Discord",
    price: 14.90,
    icon: "🤖",
    description: "Exemplo de bot para organizar solicitações e atendimentos.",
    requirements: "Node.js • Discord"
  },
  {
    id: "wb1",
    name: "Landing Page Moderna",
    category: "Web",
    price: 24.90,
    icon: "🌐",
    description: "Modelo de página responsiva para apresentação de serviços.",
    requirements: "HTML • CSS • JS"
  },
  {
    id: "au1",
    name: "Organizador de Arquivos",
    category: "Automação",
    price: 9.90,
    icon: "⚙️",
    description: "Exemplo de ferramenta local para organizar arquivos em pastas.",
    requirements: "Python • Windows"
  },
  {
    id: "dc2",
    name: "Bot de Boas-vindas",
    category: "Discord",
    price: 9.90,
    icon: "💬",
    description: "Exemplo de mensagens de entrada e configuração de canais.",
    requirements: "Node.js • Discord"
  },
  {
    id: "wb2",
    name: "Página de Links",
    category: "Web",
    price: 9.90,
    icon: "🔗",
    description: "Modelo simples de página de links para criadores e negócios.",
    requirements: "HTML • CSS"
  },
  {
    id: "rb2",
    name: "Sistema de Inventário Roblox",
    category: "Roblox",
    price: 19.90,
    icon: "🎒",
    description: "Exemplo de interface de inventário para experiências Roblox.",
    requirements: "Roblox Studio"
  },
  {
    id: "au2",
    name: "Gerador de Relatórios",
    category: "Automação",
    price: 14.90,
    icon: "📊",
    description: "Exemplo de script para gerar relatórios a partir de dados locais.",
    requirements: "Python"
  }
];

// FORMATAÇÃO DE PREÇOS

const brl = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
};

// ESTADO DO CARRINHO

const cart = new Set();
let filter = "Todos";

const $ = (selector) => document.querySelector(selector);

// PROTEÇÃO PARA TEXTOS DO CATÁLOGO

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[char];
  });
}

// RENDERIZAR PRODUTOS

function render() {
  const term = $("#search").value
    .trim()
    .toLocaleLowerCase("pt-BR");

  const list = products.filter((product) => {
    const categoryMatches =
      filter === "Todos" || product.category === filter;

    const searchableText = [
      product.name,
      product.description,
      product.requirements
    ].join(" ").toLocaleLowerCase("pt-BR");

    return categoryMatches && searchableText.includes(term);
  });

  $("#products").innerHTML = list.map((product) => {
    const added = cart.has(product.id);

    return `
      <article class="product">
        <div class="art">
          <span>${escapeHtml(product.category)}</span>
          ${escapeHtml(product.icon)}
        </div>

        <div class="details">
          <h3>${escapeHtml(product.name)}</h3>

          <p>${escapeHtml(product.description)}</p>

          <div class="meta">
            Requisitos: ${escapeHtml(product.requirements)}
          </div>

          <div class="bottom">
            <span class="price">${brl(product.price)}</span>

            <button
              class="add"
              data-add="${escapeHtml(product.id)}"
            >
              ${added ? "✓ Adicionado" : "+ Carrinho"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  $("#empty").hidden = list.length !== 0;
}

// RENDERIZAR CARRINHO

function renderCart() {
  const selected = products.filter((product) => {
    return cart.has(product.id);
  });

  $("#cartCount").textContent = selected.length;

  if (selected.length === 0) {
    $("#cartItems").textContent = "Seu carrinho está vazio.";
  } else {
    $("#cartItems").innerHTML = selected.map((product) => {
      return `
        <div class="cartrow">
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <small>${brl(product.price)}</small>
          </div>

          <button
            data-remove="${escapeHtml(product.id)}"
            aria-label="Remover ${escapeHtml(product.name)}"
          >
            Remover
          </button>
        </div>
      `;
    }).join("");
  }

  const total = selected.reduce((sum, product) => {
    return sum + product.price;
  }, 0);

  $("#total").textContent = brl(total);

  render();
}

// ABRIR E FECHAR CARRINHO

function openCart() {
  $("#overlay").hidden = false;
  $("#drawer").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
  $("#closeCart").focus();
}

function closeCart() {
  $("#overlay").hidden = true;
  $("#drawer").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
  $("#openCart").focus();
}

// FILTROS

$("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");

  if (!button) return;

  filter = button.dataset.filter;

  document.querySelectorAll("[data-filter]").forEach((item) => {
    item.classList.toggle("active", item === button);
  });

  render();
});

// PESQUISA

$("#search").addEventListener("input", render);

// ADICIONAR AO CARRINHO

$("#products").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  cart.add(button.dataset.add);
  renderCart();
});

// REMOVER DO CARRINHO

$("#cartItems").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");

  if (!button) return;

  cart.delete(button.dataset.remove);
  renderCart();
});

// EVENTOS DOS BOTÕES

$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);

// FECHAR CARRINHO COM ESC

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    $("#drawer").classList.contains("open")
  ) {
    closeCart();
  }
});

// ANO AUTOMÁTICO NO RODAPÉ

$("#year").textContent = new Date().getFullYear();

// INICIALIZAÇÃO

renderCart();
