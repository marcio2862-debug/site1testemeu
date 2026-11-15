"use strict";

const dados = window.MARCIO_DADOS;
const storageKey = "marcio_educa_360_v3_progresso";
const estadoConcluido = JSON.parse(localStorage.getItem(storageKey) || "{}");

function salvarProgresso() {
  localStorage.setItem(storageKey, JSON.stringify(estadoConcluido));
}

// =====================================================
// NAVEGAÇÃO PRINCIPAL ENTRE AS PÁGINAS
// =====================================================
window.navegarPara = function (paginaId) {
  document.querySelectorAll(".view-section").forEach((sec) => sec.classList.remove("active"));
  document.querySelectorAll(".nav-pills .pill").forEach((btn) => btn.classList.remove("active"));

  const secAlvo = document.getElementById(`view-${paginaId}`);
  if (secAlvo) secAlvo.classList.add("active");

  // Destaca a pílula correspondente no menu superior
  let tabMenu = paginaId;
  if (paginaId === "fundamental-2" || paginaId === "ensino-medio") tabMenu = "minhas-aulas";
  if (paginaId === "matematica-basica" || paginaId === "matematica-especifica") tabMenu = "concursos";

  const btnMenu = document.querySelector(`.nav-pills .pill[data-tab="${tabMenu}"]`);
  if (btnMenu) btnMenu.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// =====================================================
// RENDERIZA O BLOCO DE 3 ETAPAS (DEFINIÇÕES, EXERCÍCIOS, RESOLUÇÕES)
// IGUAL ÀS IMAGENS 2 E 3
// =====================================================
function gerarCardEtapaHTML(etapa, classeCor, iconePadrao) {
  const temLink = etapa && etapa.link && etapa.link.trim() !== "";
  const isVideo = temLink && (etapa.link.includes("/v/") || etapa.link.includes("video"));

  const statusHtml = temLink
    ? `<div class="etapa-status status-pronto">✔ Link disponível no OneDrive</div>`
    : `<div class="etapa-status status-aguardando">⏳ Aguardando link</div>`;

  const botaoHtml = temLink
    ? `<a href="${etapa.link}" target="_blank" rel="noopener noreferrer" class="btn-etapa ${isVideo ? "btn-etapa-ativo-vid" : "btn-etapa-ativo-pdf"}">
         ${isVideo ? "▶ Assistir Vídeo (OneDrive)" : "📄 Abrir PDF A4 (OneDrive)"}
       </a>`
    : `<span class="btn-etapa btn-etapa-aguardando">Aguardando link do PDF A4</span>`;

  return `
    <div class="etapa-card ${classeCor}">
      <div class="etapa-top">
        <div class="etapa-icon">${iconePadrao}</div>
        <div>
          <div class="etapa-titulo">${etapa.titulo}</div>
          <div class="etapa-desc">${etapa.descricao}</div>
          ${statusHtml}
        </div>
      </div>
      <div class="etapa-actions">
        ${botaoHtml}
      </div>
    </div>
  `;
}

function renderizarListaBlocos(listaItens, containerElement) {
  if (!listaItens || listaItens.length === 0) {
    containerElement.innerHTML = '<p class="empty-msg">Nenhum conteúdo cadastrado para esta seleção.</p>';
    return;
  }

  containerElement.innerHTML = listaItens.map((item) => {
    const concluido = !!estadoConcluido[item.id];
    return `
      <div class="bloco-assunto">
        <div class="bloco-assunto-header">
          <div class="bloco-assunto-title">
            <span>📘</span>
            <span>${item.categoriaTitulo || "Conteúdo"}</span>
          </div>
          <label class="chk-concluido">
            <input type="checkbox" data-item-id="${item.id}" ${concluido ? "checked" : ""} />
            ${concluido ? "Concluído ✔" : "Marcar como concluído"}
          </label>
        </div>

        <div class="bloco-subtitulo">${item.titulo}</div>

        <div class="tres-etapas-grid">
          ${gerarCardEtapaHTML(item.etapa1, "etapa-1", "📘")}
          ${gerarCardEtapaHTML(item.etapa2, "etapa-2", "✏️")}
          ${gerarCardEtapaHTML(item.etapa3, "etapa-3", "✅")}
        </div>
      </div>
    `;
  }).join("");

  containerElement.querySelectorAll('input[type="checkbox"][data-item-id]').forEach((chk) => {
    chk.addEventListener("change", (e) => {
      estadoConcluido[e.target.dataset.itemId] = e.target.checked;
      salvarProgresso();
      atualizarKPIsConcursos();
      renderizarListaBlocos(listaItens, containerElement);
    });
  });
}

// =====================================================
// PÁGINA 1 -> ENSINO FUNDAMENTAL II (6º AO 9º ANO)
// =====================================================
window.filtrarAnoEscolar = function (subnivel, tituloLabel) {
  const painel = document.getElementById("painel-conteudos-fund2");
  document.getElementById("titulo-ano-fund2").textContent = tituloLabel;
  painel.style.display = "block";

  const filtrados = dados.conteudos.filter((c) => c.area === "fundamental-2" && c.subnivel === subnivel);
  renderizarListaBlocos(filtrados, document.getElementById("lista-conteudos-fund2"));
  painel.scrollIntoView({ behavior: "smooth" });
};

// =====================================================
// PÁGINA 2 -> ENSINO MÉDIO (1º AO 3º ANO)
// =====================================================
window.filtrarSerieMedio = function (subnivel, tituloLabel) {
  const painel = document.getElementById("painel-conteudos-medio");
  document.getElementById("titulo-serie-medio").textContent = tituloLabel;
  painel.style.display = "block";

  const filtrados = dados.conteudos.filter((c) => c.area === "ensino-medio" && c.subnivel === subnivel);
  renderizarListaBlocos(filtrados, document.getElementById("lista-conteudos-medio"));
  painel.scrollIntoView({ behavior: "smooth" });
};

// =====================================================
// PÁGINA 3 & 4 -> MATEMÁTICA BÁSICA & ESPECÍFICA
// =====================================================
function renderizarAreasConcursos() {
  const basica = dados.conteudos.filter((c) => c.area === "matematica-basica");
  renderizarListaBlocos(basica, document.getElementById("container-mat-basica"));

  const especifica = dados.conteudos.filter((c) => c.area === "matematica-especifica");
  renderizarListaBlocos(especifica, document.getElementById("container-mat-especifica"));
}

// =====================================================
// PÁGINA 5 -> QUESTÕES POR BANCAS (CARDS COLORIDOS IGUAL À IMAGEM 4)
// =====================================================
function renderizarCardsBancas() {
  const grid = document.getElementById("grid-cards-bancas");
  grid.innerHTML = dados.bancas.map((b) => `
    <div class="portal-card ${b.cor || "card-blue"}" style="min-height: 225px;">
      <div class="portal-icon-badge">🎯</div>
      <div class="portal-body">
        <h2>${b.nome}</h2>
        <span class="portal-tag">Questões por conteúdo</span>
      </div>
      <div class="portal-footer">
        <button class="btn-acessar" onclick="selecionarBancaCard('${b.id}')">Escolher banca →</button>
      </div>
    </div>
  `).join("");
}

window.selecionarBancaCard = function (bancaId) {
  const tituloEl = document.getElementById("titulo-banca-selecionada");
  const container = document.getElementById("lista-cadernos-banca");

  const filtrados = (dados.questoesPorBancas || []).filter((q) => !bancaId || q.bancaId === bancaId);

  if (bancaId) {
    const bancaObj = dados.bancas.find((b) => b.id === bancaId);
    tituloEl.textContent = `Cadernos de Questões — Banca ${bancaObj ? bancaObj.nome : ""}`;
  } else {
    tituloEl.textContent = "Todos os Cadernos de Questões por Banca";
  }

  const formatados = filtrados.map((q) => {
    const bancaObj = dados.bancas.find((b) => b.id === q.bancaId);
    return {
      ...q,
      categoriaTitulo: `Banca ${bancaObj ? bancaObj.nome : "Concursos"}`
    };
  });

  renderizarListaBlocos(formatados, container);
  if (bancaId) {
    document.getElementById("painel-cadernos-banca").scrollIntoView({ behavior: "smooth" });
  }
};

// =====================================================
// ABA MENU -> MINHAS AULAS (TODAS AS ÁREAS)
// =====================================================
window.renderizarMinhasAulasGeral = function () {
  const area = document.getElementById("filtro-area-geral").value;
  const termo = document.getElementById("busca-geral-aulas").value.trim().toLowerCase();

  const filtrados = dados.conteudos.filter((c) => {
    if (area && c.area !== area) return false;
    if (termo && !c.titulo.toLowerCase().includes(termo) && !(c.categoriaTitulo || "").toLowerCase().includes(termo)) return false;
    return true;
  });

  renderizarListaBlocos(filtrados, document.getElementById("container-todas-aulas"));
};

// =====================================================
// ABA MENU -> MATERIAIS (3 CARDS GRANDES + LISTA PDF A4)
// =====================================================
window.filtrarMateriaisArea = function (areaFiltro, tituloLabel) {
  document.getElementById("titulo-materiais-area").textContent = tituloLabel;
  let filtrados = dados.conteudos;

  if (areaFiltro === "fundamental-2") {
    filtrados = dados.conteudos.filter((c) => c.area === "fundamental-2");
  } else if (areaFiltro === "ensino-medio") {
    filtrados = dados.conteudos.filter((c) => c.area === "ensino-medio");
  } else if (areaFiltro === "concursos") {
    filtrados = dados.conteudos.filter((c) => c.area === "matematica-basica" || c.area === "matematica-especifica");
  }

  renderizarListaBlocos(filtrados, document.getElementById("lista-materiais-area"));
  if (areaFiltro) {
    document.getElementById("painel-materiais-filtrados").scrollIntoView({ behavior: "smooth" });
  }
};

// =====================================================
// ABA MENU -> CONCURSOS (KPIs & ESTRUTURA DO dados.js)
// =====================================================
function atualizarKPIsConcursos() {
  const totalConteudos = dados.conteudos.length;
  const concluidos = dados.conteudos.filter((c) => !!estadoConcluido[c.id]).length;
  const percTeoria = totalConteudos > 0 ? Math.round((concluidos / totalConteudos) * 100) : 0;

  let qTotal = 0;
  let qAcertos = 0;
  dados.conteudos.forEach((c) => {
    qTotal += Number(c.questoesTotal || 0);
    qAcertos += Number(c.questoesAcertos || 0);
  });

  const percAprov = qTotal > 0 ? Math.round((qAcertos / qTotal) * 100) : 0;

  document.getElementById("kpi-concursos").textContent = dados.concursos.filter((c) => c.ativo).length;
  document.getElementById("kpi-cargos").textContent = dados.cargos.length;
  document.getElementById("kpi-conteudos").textContent = totalConteudos;
  document.getElementById("kpi-teoria").textContent = `${percTeoria}%`;
  document.getElementById("kpi-questoes").textContent = qTotal;
  document.getElementById("kpi-acertos").textContent = qAcertos;
  document.getElementById("kpi-aproveitamento").textContent = `${percAprov}%`;
}

function renderizarPainelConcursos() {
  const sel = document.getElementById("select-concurso-topo");
  sel.innerHTML = dados.concursos.map((c) => `<option value="${c.id}">${c.nome}</option>`).join("");

  document.getElementById("lista-bancas").innerHTML = dados.bancas.map((b) =>
    `<div class="item-card"><span>${b.nome}</span><span class="tag-code">${b.id}</span></div>`
  ).join("");

  document.getElementById("lista-concursos").innerHTML = dados.concursos.map((c) =>
    `<div class="item-card"><span>${c.nome}</span><span class="tag-code">${c.ativo ? "Ativo" : "Inativo"}</span></div>`
  ).join("");

  document.getElementById("lista-cargos").innerHTML = dados.cargos.map((cg) =>
    `<div class="item-card"><span>${cg.nome}</span><span class="tag-code">${cg.id}</span></div>`
  ).join("");
}

// INICIALIZAÇÃO GERAL
document.addEventListener("DOMContentLoaded", () => {
  renderizarAreasConcursos();
  renderizarCardsBancas();
  selecionarBancaCard("");
  renderizarMinhasAulasGeral();
  filtrarMateriaisArea("", "Todos os Materiais PDF A4 e Vídeos");
  renderizarPainelConcursos();
  atualizarKPIsConcursos();
});
