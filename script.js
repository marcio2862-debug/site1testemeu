document.addEventListener("DOMContentLoaded", () => {
  const DADOS = window.MARCIO_DADOS || {};

  // GESTÃO DE TEMA (CLARO / ESCURO)
  const btnThemeLight = document.getElementById("btn-theme-light");
  const btnThemeDark = document.getElementById("btn-theme-dark");

  function aplicarTema(tema) {
    const isLight = tema === "light";
    document.body.classList.toggle("light-theme", isLight);
    btnThemeLight?.classList.toggle("active", isLight);
    btnThemeDark?.classList.toggle("active", !isLight);
    localStorage.setItem("marcio_educa_tema", tema);
  }

  const temaSalvo = localStorage.getItem("marcio_educa_tema") || "dark";
  aplicarTema(temaSalvo);

  btnThemeLight?.addEventListener("click", () => aplicarTema("light"));
  btnThemeDark?.addEventListener("click", () => aplicarTema("dark"));

  // ESTADO DA NAVEGAÇÃO
  const state = {
    view: "home",
    area: null,
    subfiltro: "todos",
    banca: "TODAS",
    concluidos: JSON.parse(localStorage.getItem("marcio_educa_concluidos") || "[]")
  };

  const AREA_CONFIG = {
    fundamental: {
      titulo: "Ensino Fundamental II (6º ao 9º ano)",
      filtros: ["todos", "6º Ano", "7º Ano", "8º Ano", "9º Ano"]
    },
    medio: {
      titulo: "Ensino Médio (1º ao 3º ano)",
      filtros: ["todos", "1ª Série", "2ª Série", "3ª Série"]
    },
    basica: {
      titulo: "Matemática Básica",
      filtros: ["todos"]
    },
    especifica: {
      titulo: "Matemática Específica",
      filtros: ["todos"]
    }
  };

  function salvarConcluidos() {
    localStorage.setItem("marcio_educa_concluidos", JSON.stringify(state.concluidos));
  }

  function alternarConcluido(id) {
    if (state.concluidos.includes(id)) {
      state.concluidos = state.concluidos.filter(item => item !== id);
    } else {
      state.concluidos.push(id);
    }
    salvarConcluidos();
    renderTudo();
  }

  function setView(viewName, resetArea = true) {
    state.view = viewName;
    if (resetArea) {
      state.area = null;
      state.subfiltro = "todos";
    }

    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.add("active");

    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    renderTudo();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderBreadcrumbs() {
    const bc = document.getElementById("breadcrumbs");
    if (!bc) return;

    const nomes = {
      home: "Início",
      aulas: "Minhas Aulas",
      concursos: "Concursos",
      bancas: "Questões por Bancas",
      materiais: "Materiais",
      "como-estudar": "Como Estudar"
    };

    if (state.view === "home") {
      bc.innerHTML = `<span>Você está em: <strong>Início</strong></span>`;
      return;
    }

    let html = `<button type="button" data-bc-view="home">Início</button> <span>›</span> `;
    if (state.view === "aulas" && state.area && AREA_CONFIG[state.area]) {
      html += `<button type="button" data-bc-view="aulas">Minhas Aulas</button> <span>›</span> <strong>${AREA_CONFIG[state.area].titulo}</strong>`;
    } else {
      html += `<strong>${nomes[state.view] || state.view}</strong>`;
    }
    bc.innerHTML = html;

    bc.querySelectorAll("[data-bc-view]").forEach(btn => {
      btn.addEventListener("click", () => setView(btn.dataset.bcView, true));
    });
  }

  function criarCardAssunto(item) {
    const concluido = state.concluidos.includes(item.id);
    const linkDef = item.definicoes || "#";
    const linkExe = item.exercicios || "#";
    const linkRes = item.resolucoes || "#";

    return `
      <div class="card">
        <span class="tag">${item.serie || item.categoria || "Matemática"}</span>
        <h3>${item.titulo}</h3>
        <p>${item.descricao || "Estude em 3 etapas: teoria, prática e resolução comentada."}</p>

        <div class="etapas-box">
          <a class="etapa-link" href="${linkDef}" target="_blank" rel="noopener">
            <span>1. Definições e Propriedades</span> <span>Abrir ↗</span>
          </a>
          <a class="etapa-link" href="${linkExe}" target="_blank" rel="noopener">
            <span>2. Exercícios Propostos</span> <span>Abrir ↗</span>
          </a>
          <a class="etapa-link" href="${linkRes}" target="_blank" rel="noopener">
            <span>3. Resoluções Comentadas</span> <span>Abrir ↗</span>
          </a>
        </div>

        <div class="card-actions" style="margin-top: 14px;">
          <button type="button" class="btn ${concluido ? "done" : ""}" data-toggle-done="${item.id}">
            ${concluido ? "✓ Concluído" : "Marcar como concluído"}
          </button>
        </div>
      </div>
    `;
  }

  function renderAulas() {
    const areasBox = document.getElementById("aulas-areas");
    const conteudoBox = document.getElementById("aulas-conteudo");
    if (!areasBox || !conteudoBox) return;

    if (!state.area || !AREA_CONFIG[state.area]) {
      areasBox.classList.remove("hidden");
      conteudoBox.classList.add("hidden");
      conteudoBox.innerHTML = "";
      return;
    }

    areasBox.classList.add("hidden");
    conteudoBox.classList.remove("hidden");

    const cfg = AREA_CONFIG[state.area];
    const lista = (DADOS.aulas && DADOS.aulas[state.area]) || [];
    const filtrada = state.subfiltro === "todos"
      ? lista
      : lista.filter(i => (i.serie || "").toLowerCase() === state.subfiltro.toLowerCase());

    const pillsHtml = cfg.filtros.length > 1
      ? `<div class="pills">
          ${cfg.filtros.map(f => `
            <button type="button" class="pill ${state.subfiltro === f ? "active" : ""}" data-subfiltro="${f}">
              ${f === "todos" ? "Todos" : f}
            </button>
          `).join("")}
        </div>`
      : "";

    conteudoBox.innerHTML = `
      <div class="section-head">
        <div>
          <h3>${cfg.titulo}</h3>
          <p class="muted">Acesse cada assunto pelas 3 etapas de aprendizagem.</p>
        </div>
        <button type="button" class="btn" id="btn-voltar-areas">← Voltar às Áreas</button>
      </div>
      ${pillsHtml}
      <div class="grid cols-2">
        ${filtrada.length
          ? filtrada.map(criarCardAssunto).join("")
          : `<div class="card"><p>Nenhum conteúdo cadastrado para este filtro ainda.</p></div>`}
      </div>
    `;

    document.getElementById("btn-voltar-areas")?.addEventListener("click", () => {
      state.area = null;
      state.subfiltro = "todos";
      renderBreadcrumbs();
      renderAulas();
    });

    conteudoBox.querySelectorAll("[data-subfiltro]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.subfiltro = btn.dataset.subfiltro;
        renderAulas();
      });
    });
  }

  function renderConcursos() {
    const box = document.getElementById("concursos-lista");
    if (!box) return;
    const lista = DADOS.concursos || [];
    box.innerHTML = lista.length
      ? lista.map(criarCardAssunto).join("")
      : `<div class="card"><p>Conteúdos de concursos em atualização.</p></div>`;
  }

  function renderBancas() {
    const filtrosBox = document.getElementById("bancas-filtros");
    const listaBox = document.getElementById("bancas-lista");
    if (!filtrosBox || !listaBox) return;

    const bancas = ["TODAS", ...(DADOS.bancas || ["FGV", "CEBRASPE", "VUNESP", "FCC", "IBFC"])];
    filtrosBox.innerHTML = bancas.map(b => `
      <button type="button" class="pill ${state.banca === b ? "active" : ""}" data-banca="${b}">${b}</button>
    `).join("");

    filtrosBox.querySelectorAll("[data-banca]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.banca = btn.dataset.banca;
        renderBancas();
      });
    });

    const questoes = DADOS.questoesBancas || [];
    const filtradas = state.banca === "TODAS"
      ? questoes
      : questoes.filter(q => (q.banca || "").toUpperCase() === state.banca.toUpperCase());

    listaBox.innerHTML = filtradas.length
      ? filtradas.map(q => `
          <div class="card">
            <span class="tag">${q.banca}</span>
            <h3>${q.titulo}</h3>
            <p>${q.descricao || "Caderno de questões selecionadas com gabarito comentado."}</p>
            <div class="card-actions">
              <a class="btn primary" href="${q.link || "#"}" target="_blank" rel="noopener">Abrir Caderno ↗</a>
              ${q.gabarito ? `<a class="btn" href="${q.gabarito}" target="_blank" rel="noopener">Resolução ↗</a>` : ""}
            </div>
          </div>
        `).join("")
      : `<div class="card"><p>Nenhum caderno encontrado para a banca selecionada.</p></div>`;
  }

  function renderMateriais() {
    const box = document.getElementById("materiais-lista");
    if (!box) return;
    const lista = DADOS.materiais || [];

    box.innerHTML = lista.map(m => `
      <div class="card">
        <span class="tag">${m.tag || "Material"}</span>
        <h3>${m.titulo}</h3>
        <p>${m.descricao || ""}</p>
        <div class="card-actions">
          <a class="btn primary" href="${m.link || "#"}" target="_blank" rel="noopener">Baixar / Abrir ↗</a>
        </div>
      </div>
    `).join("");
  }

  function executarPesquisa() {
    const input = document.getElementById("global-search");
    const resultsBox = document.getElementById("search-results");
    if (!input || !resultsBox) return;

    const termo = input.value.trim().toLowerCase();
    if (!termo) {
      resultsBox.classList.add("hidden");
      resultsBox.innerHTML = "";
      return;
    }

    const todosAulas = Object.values(DADOS.aulas || {}).flat();
    const todosConcursos = DADOS.concursos || [];
    const todosBancas = DADOS.questoesBancas || [];

    const encontrados = [
      ...todosAulas.filter(i => `${i.titulo} ${i.serie || ""} ${i.descricao || ""}`.toLowerCase().includes(termo)),
      ...todosConcursos.filter(i => `${i.titulo} ${i.descricao || ""}`.toLowerCase().includes(termo)),
      ...todosBancas.filter(i => `${i.titulo} ${i.banca || ""} ${i.descricao || ""}`.toLowerCase().includes(termo))
    ];

    resultsBox.classList.remove("hidden");
    resultsBox.innerHTML = `
      <div class="section-head">
        <h3>Resultados para "${input.value}" (${encontrados.length})</h3>
        <button type="button" class="btn" id="close-search">Limpar</button>
      </div>
      <div class="grid cols-2">
        ${encontrados.length
          ? encontrados.map(item => item.banca
              ? `<div class="card"><span class="tag">${item.banca}</span><h3>${item.titulo}</h3><p>${item.descricao || ""}</p><div class="card-actions"><a class="btn primary" href="${item.link || "#"}" target="_blank" rel="noopener">Abrir ↗</a></div></div>`
              : criarCardAssunto(item)
            ).join("")
          : `<p class="muted">Nenhum resultado encontrado para este termo.</p>`}
      </div>
    `;

    document.getElementById("close-search")?.addEventListener("click", () => {
      input.value = "";
      resultsBox.classList.add("hidden");
    });

    bindDoneButtons();
  }

  function bindDoneButtons() {
    document.querySelectorAll("[data-toggle-done]").forEach(btn => {
      btn.onclick = () => alternarConcluido(btn.dataset.toggleDone);
    });
  }

  function renderTudo() {
    renderBreadcrumbs();
    renderAulas();
    renderConcursos();
    renderBancas();
    renderMateriais();
    bindDoneButtons();
  }

  // Fallback automático (.png -> .jpg -> .jpeg)
  document.querySelectorAll("img.banner-img").forEach(img => {
    img.addEventListener("error", function tentarExtensao() {
      const src = this.getAttribute("src") || "";
      if (src.endsWith(".png")) {
        this.setAttribute("src", src.replace(".png", ".jpg"));
      } else if (src.endsWith(".jpg")) {
        this.setAttribute("src", src.replace(".jpg", ".jpeg"));
      } else {
        const box = this.closest(".banner-box");
        if (box) box.style.display = "none";
        this.removeEventListener("error", tentarExtensao);
      }
    });
  });

  // Navegação pelo menu superior
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => setView(btn.dataset.view, true));
  });

  // Navegação pelos cartões da página inicial
  document.querySelectorAll("[data-go-view]").forEach(el => {
    el.addEventListener("click", () => setView(el.dataset.goView, true));
  });

  // Navegação para as trilhas dentro de Minhas Aulas
  document.querySelectorAll("[data-go-area]").forEach(el => {
    el.addEventListener("click", () => {
      state.area = el.dataset.goArea;
      state.subfiltro = "todos";
      setView("aulas", false);
    });
  });

  document.getElementById("go-home")?.addEventListener("click", () => setView("home", true));
  document.getElementById("btn-search")?.addEventListener("click", executarPesquisa);
  document.getElementById("global-search")?.addEventListener("keyup", e => {
    if (e.key === "Enter") executarPesquisa();
  });

  renderTudo();
});