/* ==========================================================================
   PORTAL PROFESSOR MÁRCIO 360 — SCRIPT.JS COMPLETO E ATUALIZADO (V15)
   Controle 100% centralizado no arquivo dados.js
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

  // 6. MINHAS AULAS — LÊ O STATUS CONFIGURADO NO DADOS.JS
  //    status: "liberado" | "programado" | "bloqueado"
  function gerarLinhaLinkHtml(lk) {
    const status = (lk.status || (lk.url ? "liberado" : "programado")).toLowerCase().trim();

    if (status === "liberado") {
      const botaoPrincipal = lk.url
        ? `<a href="${lk.url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm status-liberado">${lk.rotulo}</a>`
        : `<span class="btn btn-sm status-liberado">${lk.rotulo}</span>`;

      return `
        <div class="link-control-row">
          <div class="link-main-line">
            <div class="link-btn-slot" style="flex:1; display:flex;">
              ${botaoPrincipal}
            </div>
            <span class="status-badge-fixed badge-liberado">Liberado</span>
          </div>
        </div>
      `;
    }

    if (status === "programado") {
      return `
        <div class="link-control-row">
          <div class="link-main-line">
            <div class="link-btn-slot" style="flex:1; display:flex;">
              <span class="btn btn-sm status-programado">${lk.rotulo}</span>
            </div>
            <span class="status-badge-fixed badge-programado">Programado</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="link-control-row">
        <div class="link-main-line">
          <div class="link-btn-slot" style="flex:1; display:flex;">
            <span class="btn btn-sm status-bloqueado">${lk.rotulo}</span>
          </div>
          <span class="status-badge-fixed badge-bloqueado">Bloqueado</span>
        </div>
      </div>
    `;
  }

  function renderCardUnidade(item, categoriaPadrao, idx) {
    if (Array.isArray(item.capitulos) && item.capitulos.length > 0) {
      const capitulosHtml = item.capitulos
        .map((cap) => {
          const linksHtml = (cap.links || [])
            .map((lk) => gerarLinhaLinkHtml(lk))
            .join("");

          return `
            <div class="chapter-block">
              <div class="chapter-header-toggle" role="button" tabindex="0" title="Minimizar ou expandir capítulo">
                <span class="chapter-title">${cap.titulo}</span>
                <span class="toggle-chevron">▾</span>
              </div>
              <div class="chapter-links">${linksHtml}</div>
            </div>
          `;
        })
        .join("");

      return `
        <div class="card unit-card">
          <span class="tag">${item.categoria || categoriaPadrao}</span>
          <div class="unit-header-toggle" role="button" tabindex="0" title="Minimizar ou expandir unidade">
            <h3>${item.titulo || "Unidade " + (idx + 1)}</h3>
            <span class="toggle-chevron">▾</span>
          </div>
          <div class="chapters-list">
            ${capitulosHtml}
          </div>
        </div>
      `;
    }

    return `
      <div class="card">
        <span class="tag">${item.categoria || categoriaPadrao}</span>
        <h3>${item.titulo || item.nome || "Assunto " + (idx + 1)}</h3>
        <p>${item.resumo || item.descricao || "Material estruturado em etapas."}</p>
        <div class="card-actions">
          ${
            item.link
              ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn primary">Abrir Material</a>`
              : `<span class="btn primary">Em breve</span>`
          }
        </div>
      </div>
    `;
  }

  function ativarInteracoesUnidades(container) {
    if (!container) return;

    container.querySelectorAll(".unit-header-toggle").forEach((header) => {
      header.addEventListener("click", () => {
        header.closest(".unit-card")?.classList.toggle("collapsed");
      });
    });

    container.querySelectorAll(".chapter-header-toggle").forEach((header) => {
      header.addEventListener("click", () => {
        header.closest(".chapter-block")?.classList.toggle("collapsed");
      });
    });
  }

  // Abre a página exclusiva de um único ano em UMA SÓ COLUNA
  function abrirPaginaDoAno(conteudoBox, listaCompleta, nivelLabel, anoObj, voltarParaAnos) {
    if (!conteudoBox) return;
    conteudoBox.classList.remove("hidden");

    setBreadcrumbs([
      { label: "Início", action: () => ativarView("home") },
      { label: "Minhas Aulas", action: () => ativarView("aulas") },
      { label: nivelLabel, action: voltarParaAnos },
      { label: anoObj.titulo }
    ]);

    const unidadesDoAno = (Array.isArray(listaCompleta) ? listaCompleta : []).filter((item) =>
      (item.categoria || "").toLowerCase().includes(anoObj.filtro.toLowerCase())
    );

    const unidadesHtml =
      unidadesDoAno.length > 0
        ? unidadesDoAno.map((item, idx) => renderCardUnidade(item, anoObj.titulo, idx)).join("")
        : `<div class="card"><p class="muted">Conteúdos do ${anoObj.titulo} em preparação.</p></div>`;

    conteudoBox.innerHTML = `
      <div class="section-head" style="margin-bottom: 14px;">
        <div>
          <h3>${anoObj.titulo} — ${nivelLabel}</h3>
          <p class="muted">${anoObj.descricao}</p>
        </div>
      </div>

      <div style="margin-bottom: 18px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <button type="button" class="btn" id="btn-voltar-anos">← Voltar para os Anos (${nivelLabel})</button>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn" id="btn-minimizar-tudo">Minimizar Capítulos</button>
          <button type="button" class="btn" id="btn-expandir-tudo">Expandir Tudo</button>
        </div>
      </div>

      <div class="grid cols-1">
        ${unidadesHtml}
      </div>
    `;

    document.getElementById("btn-voltar-anos")?.addEventListener("click", voltarParaAnos);

    document.getElementById("btn-minimizar-tudo")?.addEventListener("click", () => {
      conteudoBox.querySelectorAll(".chapter-block").forEach((el) => el.classList.add("collapsed"));
    });

    document.getElementById("btn-expandir-tudo")?.addEventListener("click", () => {
      conteudoBox.querySelectorAll(".unit-card, .chapter-block").forEach((el) => el.classList.remove("collapsed"));
    });

    ativarInteracoesUnidades(conteudoBox);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Abre a página intermediária com os links/cartões de cada Ano
  function abrirSeletorDeAnos(conteudoBox, listaCompleta, nivelLabel, anosConfig, colsClass) {
    if (!conteudoBox) return;
    conteudoBox.classList.remove("hidden");

    setBreadcrumbs([
      { label: "Início", action: () => ativarView("home") },
      { label: "Minhas Aulas", action: () => ativarView("aulas") },
      { label: nivelLabel }
    ]);

    const cardsAnosHtml = anosConfig
      .map((ano, idx) => {
        const qtdUnidades = (Array.isArray(listaCompleta) ? listaCompleta : []).filter((item) =>
          (item.categoria || "").toLowerCase().includes(ano.filtro.toLowerCase())
        ).length;

        return `
          <div class="card card-link" data-open-ano="${idx}">
            <span class="tag">${nivelLabel}</span>
            <h3>${ano.titulo}</h3>
            <p>${ano.descricao}</p>
            <div class="card-actions" style="justify-content: space-between; width: 100%;">
              <span class="btn primary">Acessar ${ano.titulo} →</span>
              <span class="meta-pill">${qtdUnidades} ${qtdUnidades === 1 ? "unidade" : "unidades"}</span>
            </div>
          </div>
        `;
      })
      .join("");

    conteudoBox.innerHTML = `
      <div style="margin-bottom: 18px;">
        <button type="button" class="btn" id="btn-voltar-niveis">← Voltar para Níveis Escolares</button>
      </div>

      <div class="section-head">
        <div>
          <h3>Selecione o Ano — ${nivelLabel}</h3>
          <p class="muted">Clique no ano desejado para abrir suas unidades, capítulos e links de estudo.</p>
        </div>
      </div>

      <div class="grid ${colsClass}">
        ${cardsAnosHtml}
      </div>
    `;

    document.getElementById("btn-voltar-niveis")?.addEventListener("click", () => ativarView("aulas"));

    conteudoBox.querySelectorAll("[data-open-ano]").forEach((card) => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.dataset.openAno, 10);
        const anoSelecionado = anosConfig[idx];
        if (anoSelecionado) {
          abrirPaginaDoAno(conteudoBox, listaCompleta, nivelLabel, anoSelecionado, () =>
            abrirSeletorDeAnos(conteudoBox, listaCompleta, nivelLabel, anosConfig, colsClass)
          );
        }
      });
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-go-area]").forEach((card) => {
    card.addEventListener("click", () => {
      const area = card.dataset.goArea;
      const areasBox = document.getElementById("aulas-areas");
      const conteudoBox = document.getElementById("aulas-conteudo");
      areasBox?.classList.add("hidden");

      if (area === "fundamental") {
        abrirSeletorDeAnos(
          conteudoBox,
          db?.fundamental || [],
          "Ensino Fundamental II (6º ao 9º ano)",
          [
            {
              filtro: "6º Ano",
              titulo: "6º Ano",
              descricao: "Sistemas de numeração, operações com números naturais, frações, decimais e geometria básica."
            },
            {
              filtro: "7º Ano",
              titulo: "7º Ano",
              descricao: "Números inteiros e racionais, equações do 1º grau, razão, proporção e regra de três."
            },
            {
              filtro: "8º Ano",
              titulo: "8º Ano",
              descricao: "Expressões algébricas, polinômios, produtos notáveis, sistemas de equações e geometria."
            },
            {
              filtro: "9º Ano",
              titulo: "9º Ano",
              descricao: "Potenciação, radiciação, equações do 2º grau, Teorema de Tales e Teorema de Pitágoras."
            }
          ],
          "cols-2"
        );
      } else {
        abrirSeletorDeAnos(
          conteudoBox,
          db?.medio || [],
          "Ensino Médio (1º ao 3º ano)",
          [
            {
              filtro: "1º Ano",
              titulo: "1º Ano",
              descricao: "Conjuntos numéricos, funções afim, quadrática, modular, exponencial e logarítmica."
            },
            {
              filtro: "2º Ano",
              titulo: "2º Ano",
              descricao: "Trigonometria no ciclo, matrizes, determinantes, sistemas lineares e geometria espacial."
            },
            {
              filtro: "3º Ano",
              titulo: "3º Ano",
              descricao: "Geometria analítica, análise combinatória, probabilidade, estatística e revisão ENEM."
            }
          ],
          "cols-3"
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
    const encontrados = todos.filter((item) => {
      const textoCapitulos = Array.isArray(item.capitulos)
        ? item.capitulos.map((c) => c.titulo).join(" ")
        : "";
      return `${item.titulo || ""} ${item.banca || ""} ${item.categoria || ""} ${item.descricao || ""} ${item.resumo || ""} ${textoCapitulos}`
        .toLowerCase()
        .includes(termo);
    });

    searchResults.classList.remove("hidden");
    searchResults.innerHTML =
      encontrados.length === 0
        ? `<p class="muted">Nenhum resultado encontrado para "<strong>${searchInput.value}</strong>".</p>`
        : `<div class="section-head"><h3>Resultados para "${searchInput.value}" (${encontrados.length})</h3></div>
           <div class="grid cols-1">${encontrados
             .map((item, idx) =>
               Array.isArray(item.capitulos)
                 ? renderCardUnidade(item, item.categoria || "Conteúdo", idx)
                 : `<div class="card">
                      <span class="tag">${item.banca || item.categoria || "Conteúdo"}</span>
                      <h3>${item.titulo}</h3>
                      <p>${item.descricao || item.resumo || ""}</p>
                    </div>`
             )
             .join("")}</div>`;

    ativarInteracoesUnidades(searchResults);
  }

  searchBtn?.addEventListener("click", executarPesquisa);
  searchInput?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") executarPesquisa();
  });
});