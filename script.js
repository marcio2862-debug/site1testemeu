/* ==========================================================================
   PORTAL PROFESSOR MÁRCIO 360 — LÓGICA COMPLETA E NAVEGAÇÃO PELO MENU SUPERIOR
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. FALLBACK AUTOMÁTICO DE IMAGENS
  const logoImg = document.getElementById("brand-logo-img");
  if (logoImg) {
    const logoFallbacks = [
      "./apple-touch-icon.png",
      "./android-chrome-512x512.jpg",
      "./imagens/logo.png",
      "./imagens/logo.jpg"
    ];
    let logoIdx = 0;
    logoImg.addEventListener("error", () => {
      if (logoIdx < logoFallbacks.length) logoImg.src = logoFallbacks[logoIdx++];
    });
  }

  const bannerInicio = document.getElementById("banner-inicio-img");
  if (bannerInicio) {
    const bannerFallbacks = [
      "./imagens/banner-inicio.png",
      "./imagens/banner-inicio.jpg.png",
      "./imagens/banner-inicio.jpeg"
    ];
    let bannerIdx = 0;
    bannerInicio.addEventListener("error", () => {
      if (bannerIdx < bannerFallbacks.length) bannerInicio.src = bannerFallbacks[bannerIdx++];
    });
  }

  // 2. NAVEGAÇÃO ENTRE TODAS AS PÁGINAS PELO MENU SUPERIOR
  const breadcrumbs = document.getElementById("breadcrumbs");

  function setBreadcrumbs(items) {
    if (!breadcrumbs) return;
    if (!items || items.length === 0) {
      breadcrumbs.innerHTML = "";
      return;
    }
    breadcrumbs.innerHTML = items
      .map((item, idx) => {
        if (item.action && idx < items.length - 1) {
          return `<button type="button" data-bc="${idx}">${item.label}</button><span>/</span>`;
        }
        return `<span>${item.label}</span>`;
      })
      .join(" ");

    breadcrumbs.querySelectorAll("button[data-bc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.bc, 10);
        if (items[i] && typeof items[i].action === "function") items[i].action();
      });
    });
  }

  function ativarView(viewName) {
    document.querySelectorAll(".view").forEach((sec) => sec.classList.remove("active"));
    const alvo = document.getElementById("view-" + viewName);
    if (alvo) alvo.classList.add("active");

    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    if (viewName === "home") {
      setBreadcrumbs([]);
    } else if (viewName === "aulas") {
      document.getElementById("aulas-areas")?.classList.remove("hidden");
      document.getElementById("aulas-conteudo")?.classList.add("hidden");
      setBreadcrumbs([
        { label: "Início", action: () => ativarView("home") },
        { label: "Minhas Aulas" }
      ]);
    } else if (viewName === "concursos") {
      document.getElementById("concursos-areas")?.classList.remove("hidden");
      document.getElementById("concursos-conteudo")?.classList.add("hidden");
      setBreadcrumbs([
        { label: "Início", action: () => ativarView("home") },
        { label: "Matemática para Concursos" }
      ]);
    } else if (viewName === "bancas") {
      setBreadcrumbs([
        { label: "Início", action: () => ativarView("home") },
        { label: "Questões por Bancas" }
      ]);
    } else if (viewName === "como-estudar") {
      setBreadcrumbs([
        { label: "Início", action: () => ativarView("home") },
        { label: "Como Estudar" }
      ]);
    } else if (viewName === "faq") {
      setBreadcrumbs([
        { label: "Início", action: () => ativarView("home") },
        { label: "Dúvidas & Contato" }
      ]);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (btn.dataset.view) ativarView(btn.dataset.view);
    });
  });

  document.getElementById("go-home")?.addEventListener("click", () => ativarView("home"));

  document.querySelectorAll("[data-go-view]").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.dataset.goView) ativarView(el.dataset.goView);
    });
  });

  // 3. SELETOR DE TEMA CLARO / ESCURO
  const btnLight = document.getElementById("btn-theme-light");
  const btnDark = document.getElementById("btn-theme-dark");

  function aplicarTema(tema) {
    if (tema === "light") {
      document.body.classList.add("light-theme");
      document.documentElement.setAttribute("data-theme", "light");
      btnLight?.classList.add("active");
      btnDark?.classList.remove("active");
    } else {
      document.body.classList.remove("light-theme");
      document.documentElement.setAttribute("data-theme", "dark");
      btnDark?.classList.add("active");
      btnLight?.classList.remove("active");
    }
    localStorage.setItem("pm360_theme", tema);
  }

  btnLight?.addEventListener("click", () => aplicarTema("light"));
  btnDark?.addEventListener("click", () => aplicarTema("dark"));

  const temaSalvo = localStorage.getItem("pm360_theme");
  if (temaSalvo) aplicarTema(temaSalvo);

  // 4. BOTÃO FLUTUANTE PARTILHAR SITE
  document.getElementById("btn-share-site")?.addEventListener("click", async () => {
    const url = window.location.href;
    const label = document.getElementById("share-btn-label");
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Professor Márcio 360 — Matemática Completa",
          text: "Estude Matemática da base à aprovação no portal Professor Márcio 360!",
          url
        });
        return;
      } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      if (label) {
        label.textContent = "✔ Link Copiado!";
        setTimeout(() => (label.textContent = "Partilhar Site"), 2500);
      }
    } catch (e) {}
  });

  // 5. DÚVIDAS FREQUENTES NA PÁGINA DÚVIDAS & CONTATO
  const db = window.PORTAL_DATA || window.DADOS || null;
  const faqPageContainer = document.getElementById("faq-page-container");
  if (faqPageContainer && db?.faqGeralHome) {
    faqPageContainer.innerHTML = `
      <div class="course-faq-list">
        ${db.faqGeralHome
          .map(
            (f) => `
          <div class="faq-item">
            <h4>${f.pergunta}</h4>
            <p>${f.resposta}</p>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // 6. MINHAS AULAS (4 COLUNAS FUNDAMENTAL II | 3 COLUNAS ENSINO MÉDIO)
  function renderColunasPorAno(container, lista, anosConfig, colsClass, tituloVoltar, onVoltar) {
    if (!container) return;
    container.classList.remove("hidden");
    const itens = Array.isArray(lista) ? lista : [];

    const colunasHtml = anosConfig
      .map((ano) => {
        const doAno = itens.filter((item) =>
          (item.categoria || "").toLowerCase().includes(ano.filtro.toLowerCase())
        );

        const cardsHtml =
          doAno.length > 0
            ? doAno
                .map(
                  (item, idx) => `
                <div class="card">
                  <span class="tag">${item.categoria || ano.titulo}</span>
                  <h3>${item.titulo || item.nome || "Assunto " + (idx + 1)}</h3>
                  <p>${item.resumo || item.descricao || "Material estruturado em 3 etapas."}</p>
                  <div class="card-actions">
                    ${
                      item.link
                        ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn primary">Abrir Material</a>`
                        : `<span class="btn primary">Em breve</span>`
                    }
                  </div>
                </div>
              `
                )
                .join("")
            : `<div class="card"><p class="muted">Conteúdos em preparação.</p></div>`;

        return `
          <div class="year-column">
            <div class="year-column-header">${ano.titulo}</div>
            ${cardsHtml}
          </div>
        `;
      })
      .join("");

    container.innerHTML = `
      <div style="margin-bottom: 18px;">
        <button type="button" class="btn" id="btn-voltar-secao">← ${tituloVoltar}</button>
      </div>
      <div class="grid ${colsClass}">
        ${colunasHtml}
      </div>
    `;

    document.getElementById("btn-voltar-secao")?.addEventListener("click", onVoltar);
  }

  document.querySelectorAll("[data-go-area]").forEach((card) => {
    card.addEventListener("click", () => {
      const area = card.dataset.goArea;
      const areasBox = document.getElementById("aulas-areas");
      const conteudoBox = document.getElementById("aulas-conteudo");
      areasBox?.classList.add("hidden");

      if (area === "fundamental") {
        setBreadcrumbs([
          { label: "Início", action: () => ativarView("home") },
          { label: "Minhas Aulas", action: () => ativarView("aulas") },
          { label: "Ensino Fundamental II (6º ao 9º ano)" }
        ]);

        renderColunasPorAno(
          conteudoBox,
          db?.fundamental || [],
          [
            { filtro: "6º Ano", titulo: "6º Ano" },
            { filtro: "7º Ano", titulo: "7º Ano" },
            { filtro: "8º Ano", titulo: "8º Ano" },
            { filtro: "9º Ano", titulo: "9º Ano" }
          ],
          "cols-4",
          "Voltar para Níveis Escolares",
          () => ativarView("aulas")
        );
      } else {
        setBreadcrumbs([
          { label: "Início", action: () => ativarView("home") },
          { label: "Minhas Aulas", action: () => ativarView("aulas") },
          { label: "Ensino Médio (1º ao 3º ano)" }
        ]);

        renderColunasPorAno(
          conteudoBox,
          db?.medio || [],
          [
            { filtro: "1º Ano", titulo: "1º Ano" },
            { filtro: "2º Ano", titulo: "2º Ano" },
            { filtro: "3º Ano", titulo: "3º Ano" }
          ],
          "cols-3",
          "Voltar para Níveis Escolares",
          () => ativarView("aulas")
        );
      }
    });
  });

  // 7. MATEMÁTICA PARA CONCURSOS (ESTILO PLATAFORMA)
  function renderCursoPlataforma(container, curso) {
    if (!container || !curso) return;
    container.classList.remove("hidden");

    const accordionHtml = curso.modulosAccordion
      .map(
        (mod, idx) => `
        <div class="course-acc-item ${idx === 1 ? "open" : ""}">
          <button type="button" class="course-acc-header">
            <span>${mod.titulo}</span>
            <span>⌄</span>
          </button>
          <div class="course-acc-body">
            ${mod.aulas
              .map(
                (aula) => `
              <div class="course-lesson-row">
                <span>▶</span>
                <span class="lesson-title">${aula.nome}</span>
                ${
                  aula.link
                    ? `<a href="${aula.link}" target="_blank" rel="noopener noreferrer" class="btn primary">Acessar Aula</a>`
                    : `<span class="lesson-badge">Em breve</span>`
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
      )
      .join("");

    const materiaisHtml = curso.materiaisApoio
      .map(
        (mat) => `
        <a href="${mat.link || "javascript:void(0)"}" ${
          mat.link ? 'target="_blank" rel="noopener noreferrer"' : ""
        } class="course-download-row">
          <span>⬇</span>
          <span class="download-title">${mat.titulo}</span>
          <span class="download-status">${mat.link ? "Baixar PDF" : "Em breve"}</span>
        </a>
      `
      )
      .join("");

    const ementaHtml = curso.ementaPartes
      .map(
        (p) => `
        <div class="ementa-parte">
          <h4>${p.parte}</h4>
          ${p.grupos
            .map(
              (g) => `
            <div class="ementa-grupo">
              <strong>» ${g.nome}:</strong>
              <ul>${g.itens.map((it) => `<li>${it}</li>`).join("")}</ul>
            </div>
          `
            )
            .join("")}
        </div>
      `
      )
      .join("");

    container.innerHTML = `
      <div class="course-shell">
        <div class="course-top-bar">
          <button type="button" class="btn" id="btn-voltar-concursos">← Voltar para Frentes de Concursos</button>
          <span class="course-workload">${curso.cargaHoraria}</span>
        </div>

        <div class="course-banner-header">
          <span class="tag">PORTAL PROFESSOR MÁRCIO 360</span>
          <h2>${curso.tituloCurso}</h2>
          <p class="muted">${curso.subtitulo}</p>
        </div>

        <div class="course-tabs">
          <button type="button" class="course-tab active" data-ctab="detalhes">Detalhes do Curso</button>
          <button type="button" class="course-tab" data-ctab="aulas">Aulas &amp; Módulos</button>
          <button type="button" class="course-tab" data-ctab="materiais">Materiais de Apoio</button>
        </div>

        <div class="course-panel active" id="cpanel-detalhes">
          <div class="mini-box" style="margin-bottom: 18px;">
            <h4>${curso.boasVindas.titulo}</h4>
            <p>${curso.boasVindas.texto}</p>
          </div>
          ${ementaHtml}
        </div>

        <div class="course-panel" id="cpanel-aulas">
          <div class="course-accordion">${accordionHtml}</div>
        </div>

        <div class="course-panel" id="cpanel-materiais">
          <div class="course-downloads-list">${materiaisHtml}</div>
        </div>
      </div>
    `;

    document.getElementById("btn-voltar-concursos")?.addEventListener("click", () => ativarView("concursos"));

    container.querySelectorAll(".course-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        container.querySelectorAll(".course-tab").forEach((t) => t.classList.toggle("active", t === tab));
        container.querySelectorAll(".course-panel").forEach((p) => p.classList.toggle("active", p.id === "cpanel-" + tab.dataset.ctab));
      });
    });

    container.querySelectorAll(".course-acc-header").forEach((header) => {
      header.addEventListener("click", () => header.parentElement?.classList.toggle("open"));
    });
  }

  document.querySelectorAll("[data-go-concurso]").forEach((card) => {
    card.addEventListener("click", () => {
      const frente = card.dataset.goConcurso;
      document.getElementById("concursos-areas")?.classList.add("hidden");
      renderCursoPlataforma(document.getElementById("concursos-conteudo"), db?.concursosCursos?.[frente]);
    });
  });

  // 8. BANCAS E PESQUISA GLOBAL
  const bancasFiltros = document.getElementById("bancas-filtros");
  const bancasLista = document.getElementById("bancas-lista");
  const questoesBancas = db && Array.isArray(db.bancas) ? db.bancas : [];

  function renderBancas(filtro = "TODAS") {
    if (!bancasLista) return;
    const filtradas =
      filtro === "TODAS"
        ? questoesBancas
        : questoesBancas.filter((q) => (q.banca || "").toUpperCase().includes(filtro.toUpperCase()));

    bancasLista.innerHTML =
      filtradas.length > 0
        ? filtradas
            .map(
              (q) => `
          <div class="card">
            <span class="tag">${q.banca || filtro}</span>
            <h3>${q.titulo || "Caderno de Questões"}</h3>
            <p>${q.descricao || "Questões selecionadas com resolução comentada."}</p>
            <div class="card-actions">
              ${q.link ? `<a href="${q.link}" target="_blank" rel="noopener noreferrer" class="btn primary">Resolver Questões</a>` : ""}
            </div>
          </div>
        `
            )
            .join("")
        : `<div class="card"><span class="tag">${filtro}</span><h3>Caderno de Questões — ${filtro}</h3><p>Novas listas comentadas da banca <strong>${filtro}</strong> estão sendo adicionadas ao portal.</p></div>`;
  }

  if (bancasFiltros) {
    const nomesBancas = [
      "TODAS", "CESPE", "CEBRASPE", "FGV", "FCC", "IBFC", "IADES", "QUADRIX",
      "IDECAN", "VUNESP", "FUNDATEC", "AOCP", "CONSULPAM", "AVALIA", "CMM",
      "MULTI", "RBO", "CESGRANRIO", "CONSULPLAN", "COPEVE", "SELECON",
      "UPENET", "FUNDEP", "OBJETIVA", "ADM&TEC"
    ];

    bancasFiltros.innerHTML = nomesBancas
      .map((b, i) => `<button type="button" class="pill ${i === 0 ? "active" : ""}" data-filter-banca="${b}">${b}</button>`)
      .join("");

    bancasFiltros.querySelectorAll(".pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        bancasFiltros.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        renderBancas(pill.dataset.filterBanca);
      });
    });

    renderBancas("TODAS");
  }

  document.querySelectorAll(".banca-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      const banca = tile.dataset.banca || "TODAS";
      const pill = Array.from(document.querySelectorAll("#bancas-filtros .pill")).find(
        (p) => p.dataset.filterBanca?.toUpperCase() === banca.toUpperCase()
      );
      if (pill) pill.click();
      else renderBancas(banca);
      bancasLista?.scrollIntoView({ behavior: "smooth" });
    });
  });

  const searchInput = document.getElementById("global-search");
  const searchBtn = document.getElementById("btn-search");
  const searchResults = document.getElementById("search-results");

  function executarPesquisa() {
    if (!searchInput || !searchResults) return;
    const termo = searchInput.value.trim().toLowerCase();
    if (!termo) {
      searchResults.classList.add("hidden");
      searchResults.innerHTML = "";
      return;
    }

    const todos = [...(db?.fundamental || []), ...(db?.medio || []), ...(db?.bancas || [])];
    const encontrados = todos.filter((item) =>
      `${item.titulo || ""} ${item.banca || ""} ${item.categoria || ""} ${item.descricao || ""} ${item.resumo || ""}`
        .toLowerCase()
        .includes(termo)
    );

    searchResults.classList.remove("hidden");
    searchResults.innerHTML =
      encontrados.length === 0
        ? `<p class="muted">Nenhum resultado encontrado para "<strong>${searchInput.value}</strong>".</p>`
        : `<div class="section-head"><h3>Resultados para "${searchInput.value}" (${encontrados.length})</h3></div>
           <div class="grid cols-2">${encontrados
             .map(
               (item) => `
              <div class="card">
                <span class="tag">${item.banca || item.categoria || "Conteúdo"}</span>
                <h3>${item.titulo}</h3>
                <p>${item.descricao || item.resumo || ""}</p>
              </div>`
             )
             .join("")}</div>`;
  }

  searchBtn?.addEventListener("click", executarPesquisa);
  searchInput?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") executarPesquisa();
  });
});