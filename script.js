"use strict";

const dados = window.MARCIO_DADOS;
const storageKey = "marcio_educa_360_progresso_v3";
const estadoSalvo = JSON.parse(localStorage.getItem(storageKey) || '{"partes":{},"questoes":{}}');

function salvarEstado() {
  localStorage.setItem(storageKey, JSON.stringify(estadoSalvo));
}

// =====================================================
// NAVEGAÇÃO ENTRE AS PÁGINAS (INÍCIO, MINHAS AULAS, CONCURSOS, QUESTÕES, MATERIAIS, COMO ESTUDAR)
// =====================================================
window.navegarPara = function (abaId) {
  document.querySelectorAll(".view-section").forEach((sec) => sec.classList.remove("active"));
  document.querySelectorAll(".nav-pills .pill").forEach((btn) => btn.classList.remove("active"));

  const alvoSec = document.getElementById(`view-${abaId}`);
  const alvoBtn = document.querySelector(`.nav-pills .pill[data-tab="${abaId}"]`);

  if (alvoSec) alvoSec.classList.add("active");
  if (alvoBtn) alvoBtn.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.abrirTrilha = function (trilhaId) {
  const selectTrilha = document.getElementById("filtro-trilha");
  if (selectTrilha) selectTrilha.value = trilhaId;
  navegarPara("minhas-aulas");
  renderizarMinhasAulas();
};

// Helpers de busca
const getBanca = (id) => dados.bancas.find((b) => b.id === id);
const getConcurso = (id) => dados.concursos.find((c) => c.id === id);
const getCargo = (id) => dados.cargos.find((c) => c.id === id);
const getDisciplina = (id) => dados.disciplinas.find((d) => d.id === id);
const getConteudo = (id) => dados.conteudos.find((c) => c.id === id);
const getVinculo = (id) => dados.vinculos.find((v) => v.id === id);
const getPlataforma = (id) => dados.plataformas.find((p) => p.id === id);

const nomesTrilhas = {
  "fundamental-2": "Ensino Fundamental II (6º ao 9º Ano)",
  "ensino-medio": "Ensino Médio (1º ao 3º Ano)",
  "matematica-basica": "Matemática Básica para Concursos",
  "matematica-especifica": "Matemática Específica (Professor)",
  "concursos-gerais": "Concursos Gerais"
};

// =====================================================
// RENDERIZA CARD DE AULA POR PARTES (REUTILIZÁVEL)
// =====================================================
function criarCardAulaHTML(aula, contextoMeta) {
  const qSalvo = estadoSalvo.questoes[aula.id] || {};
  const qTot = qSalvo.total !== undefined ? qSalvo.total : (aula.questoesTotal || 0);
  const qAce = qSalvo.acertos !== undefined ? qSalvo.acertos : (aula.questoesAcertos || 0);

  const partes = aula.partes || [];
  let htmlPartes = "";

  partes.forEach((parte) => {
    const chave = `${aula.id}-p${parte.numero}`;
    const concluida = estadoSalvo.partes[chave] !== undefined ? estadoSalvo.partes[chave] : parte.concluida;

    let midiaEmbedHtml = "";
    let botoesHtml = "";

    if (parte.imagemLink) {
      if (parte.imagemLink.includes("embed")) {
        midiaEmbedHtml += `<iframe class="midia-iframe" src="${parte.imagemLink}" title="Imagem ${parte.titulo}"></iframe>`;
      } else {
        botoesHtml += `<a href="${parte.imagemLink}" target="_blank" rel="noopener noreferrer" class="btn-link btn-img">Ver Imagem</a>`;
      }
    }

    if (parte.videoLink) {
      if (parte.videoLink.includes("embed")) {
        midiaEmbedHtml += `<iframe class="midia-iframe" src="${parte.videoLink}" allowfullscreen title="Vídeo ${parte.titulo}"></iframe>`;
      } else {
        botoesHtml += `<a href="${parte.videoLink}" target="_blank" rel="noopener noreferrer" class="btn-link btn-video">Assistir Vídeo</a>`;
      }
    }

    if (parte.pdfLink) {
      botoesHtml += `<a href="${parte.pdfLink}" target="_blank" rel="noopener noreferrer" class="btn-link btn-pdf">Abrir PDF</a>`;
    }

    htmlPartes += `
      <div class="parte-item ${concluida ? "concluida" : ""}">
        <div class="parte-header">
          <span class="parte-titulo">${parte.titulo}</span>
          <label class="chk-label">
            <input type="checkbox" data-chave="${chave}" ${concluida ? "checked" : ""} />
            Concluída
          </label>
        </div>
        ${midiaEmbedHtml}
        <div class="links-row">${botoesHtml}</div>
      </div>
    `;
  });

  const box = document.createElement("div");
  box.className = "aula-box";
  box.innerHTML = `
    <div class="aula-box-top">
      <div>
        <div class="aula-meta">${contextoMeta}</div>
        <div class="aula-title">${aula.nome}</div>
      </div>
      <div class="questoes-box">
        <span>Questões:</span>
        <input type="number" min="0" value="${qTot}" data-q-total="${aula.id}" />
        <span>Acertos:</span>
        <input type="number" min="0" value="${qAce}" data-q-acertos="${aula.id}" />
      </div>
    </div>
    <div class="partes-list">${htmlPartes}</div>
  `;
  return box;
}

function vincularEventosProgresso(container) {
  container.querySelectorAll('input[type="checkbox"][data-chave]').forEach((chk) => {
    chk.addEventListener("change", (e) => {
      estadoSalvo.partes[e.target.dataset.chave] = e.target.checked;
      salvarEstado();
      atualizarTudo();
    });
  });

  container.querySelectorAll("input[data-q-total]").forEach((inp) => {
    inp.addEventListener("change", (e) => {
      const id = e.target.dataset.qTotal;
      if (!estadoSalvo.questoes[id]) estadoSalvo.questoes[id] = {};
      estadoSalvo.questoes[id].total = Number(e.target.value);
      salvarEstado();
      atualizarKPIs();
    });
  });

  container.querySelectorAll("input[data-q-acertos]").forEach((inp) => {
    inp.addEventListener("change", (e) => {
      const id = e.target.dataset.qAcertos;
      if (!estadoSalvo.questoes[id]) estadoSalvo.questoes[id] = {};
      estadoSalvo.questoes[id].acertos = Number(e.target.value);
      salvarEstado();
      atualizarKPIs();
    });
  });
}

// =====================================================
// PÁGINA 2: MINHAS AULAS (5 TRILHAS)
// =====================================================
window.renderizarMinhasAulas = function () {
  const container = document.getElementById("container-minhas-aulas");
  const trilhaSel = document.getElementById("filtro-trilha").value;
  const termo = document.getElementById("busca-minhas-aulas").value.trim().toLowerCase();

  const filtradas = dados.aulas.filter((a) => {
    if (trilhaSel && a.trilha !== trilhaSel) return false;
    if (termo && !a.nome.toLowerCase().includes(termo)) return false;
    return true;
  });

  if (filtradas.length === 0) {
    container.innerHTML = '<p class="empty-msg">Nenhuma aula encontrada para esta trilha.</p>';
    return;
  }

  container.innerHTML = "";
  filtradas.forEach((aula) => {
    const labelTrilha = nomesTrilhas[aula.trilha] || "Trilha Geral";
    const plat = getPlataforma(aula.plataformaId);
    const meta = `${labelTrilha} • ${plat ? plat.nome : "OneDrive"}`;
    container.appendChild(criarCardAulaHTML(aula, meta));
  });

  vincularEventosProgresso(container);
};

// =====================================================
// PÁGINA 3: CONCURSOS
// =====================================================
let concursoAtivoId = dados.concursoSelecionado || (dados.concursos[0] && dados.concursos[0].id) || "";

function popularSeletoresConcursos() {
  const selTopo = document.getElementById("select-concurso-topo");
  const fConc = document.getElementById("filtro-concurso");
  const fCargo = document.getElementById("filtro-cargo");
  const fPlat = document.getElementById("filtro-plataforma");

  selTopo.innerHTML = "";
  fConc.innerHTML = '<option value="">Todos os concursos</option>';

  dados.concursos.forEach((c) => {
    const o1 = new Option(c.nome, c.id);
    if (c.id === concursoAtivoId) o1.selected = true;
    selTopo.appendChild(o1);
    fConc.appendChild(new Option(c.nome, c.id));
  });

  fCargo.innerHTML = '<option value="">Todos os cargos</option>';
  dados.cargos.forEach((cg) => {
    const conc = getConcurso(cg.concursoId);
    fCargo.appendChild(new Option(`${cg.nome} (${conc ? conc.nome : ""})`, cg.id));
  });

  fPlat.innerHTML = '<option value="">Todas as plataformas</option>';
  dados.plataformas.forEach((p) => {
    fPlat.appendChild(new Option(p.nome, p.id));
  });
}

function renderizarCadastrosConcursos() {
  document.getElementById("lista-bancas").innerHTML = dados.bancas.map((b) =>
    `<div class="item-card"><span>${b.nome}</span><span class="tag-code">${b.id}</span></div>`
  ).join("") || '<p class="empty-msg">Nenhuma banca.</p>';

  document.getElementById("lista-concursos").innerHTML = dados.concursos.map((c) => {
    const b = getBanca(c.bancaId);
    return `<div class="item-card"><span>${c.nome} | ${b ? b.nome : "-"} | ${c.ativo ? "Ativo" : "Inativo"}</span><span class="tag-code">${c.id}</span></div>`;
  }).join("") || '<p class="empty-msg">Nenhum concurso.</p>';

  document.getElementById("lista-cargos").innerHTML = dados.cargos.map((cg) => {
    const c = getConcurso(cg.concursoId);
    return `<div class="item-card"><span>${cg.nome} | ${c ? c.nome : "-"}</span><span class="tag-code">${cg.id}</span></div>`;
  }).join("") || '<p class="empty-msg">Nenhum cargo.</p>';

  document.getElementById("lista-disciplinas").innerHTML = dados.disciplinas.map((d) =>
    `<div class="item-card"><span>${d.nome}</span><span class="tag-code">${d.id}</span></div>`
  ).join("") || '<p class="empty-msg">Nenhuma disciplina.</p>';

  document.getElementById("lista-conteudos").innerHTML = dados.conteudos.map((ct) => {
    const d = getDisciplina(ct.disciplinaId);
    return `<div class="item-card"><span>${ct.nome} | ${d ? d.nome : "-"}</span><span class="tag-code">${ct.id}</span></div>`;
  }).join("") || '<p class="empty-msg">Nenhum conteúdo.</p>';

  document.getElementById("lista-vinculos").innerHTML = dados.vinculos.map((v) => {
    const cg = getCargo(v.cargoId);
    const ct = getConteudo(v.conteudoId);
    const d = ct ? getDisciplina(ct.disciplinaId) : null;
    return `<div class="item-card"><span><strong>${cg ? cg.nome : "-"}</strong> → ${d ? d.nome : ""} — ${ct ? ct.nome : "-"}</span><span class="tag-code">${v.id}</span></div>`;
  }).join("") || '<p class="empty-msg">Nenhum conteúdo vinculado.</p>';
}

function atualizarKPIs() {
  const concursosAtivos = dados.concursos.filter((c) => c.ativo).length;
  const cargosDoConcurso = dados.cargos.filter((cg) => cg.concursoId === concursoAtivoId);
  const cargoIds = cargosDoConcurso.map((cg) => cg.id);
  const vinculosDoConcurso = dados.vinculos.filter((v) => cargoIds.includes(v.cargoId));
  const vinculoIds = vinculosDoConcurso.map((v) => v.id);
  const aulasDoConcurso = dados.aulas.filter((a) => vinculoIds.includes(a.vinculoId));

  let totalPartes = 0, partesConcluidas = 0, totalQuestoes = 0, totalAcertos = 0;

  aulasDoConcurso.forEach((aula) => {
    (aula.partes || []).forEach((p) => {
      totalPartes++;
      const chave = `${aula.id}-p${p.numero}`;
      const ok = estadoSalvo.partes[chave] !== undefined ? estadoSalvo.partes[chave] : p.concluida;
      if (ok) partesConcluidas++;
    });

    const qSalvo = estadoSalvo.questoes[aula.id] || {};
    totalQuestoes += Number(qSalvo.total !== undefined ? qSalvo.total : (aula.questoesTotal || 0));
    totalAcertos += Number(qSalvo.acertos !== undefined ? qSalvo.acertos : (aula.questoesAcertos || 0));
  });

  document.getElementById("kpi-concursos").textContent = concursosAtivos;
  document.getElementById("kpi-cargos").textContent = cargosDoConcurso.length;
  document.getElementById("kpi-conteudos").textContent = vinculosDoConcurso.length;
  document.getElementById("kpi-teoria").textContent = totalPartes > 0 ? `${Math.round((partesConcluidas / totalPartes) * 100)}%` : "0%";
  document.getElementById("kpi-questoes").textContent = totalQuestoes;
  document.getElementById("kpi-acertos").textContent = totalAcertos;
  document.getElementById("kpi-aproveitamento").textContent = totalQuestoes > 0 ? `${Math.round((totalAcertos / totalQuestoes) * 100)}%` : "0%";
}

function renderizarProgressoConcursos() {
  const container = document.getElementById("lista-progresso-aulas");
  const fConc = document.getElementById("filtro-concurso").value;
  const fCargo = document.getElementById("filtro-cargo").value;
  const fPlat = document.getElementById("filtro-plataforma").value;
  const fTexto = document.getElementById("filtro-busca").value.trim().toLowerCase();

  const aulasConcursos = dados.aulas.filter((aula) => {
    if (!aula.vinculoId) return false;
    const vinc = getVinculo(aula.vinculoId);
    const cargo = vinc ? getCargo(vinc.cargoId) : null;
    const conc = cargo ? getConcurso(cargo.concursoId) : null;
    const cont = vinc ? getConteudo(vinc.conteudoId) : null;
    const disc = cont ? getDisciplina(cont.disciplinaId) : null;

    if (fConc && (!conc || conc.id !== fConc)) return false;
    if (fCargo && (!cargo || cargo.id !== fCargo)) return false;
    if (fPlat && aula.plataformaId !== fPlat) return false;
    if (fTexto) {
      const alvo = `${aula.nome} ${cont ? cont.nome : ""} ${disc ? disc.nome : ""}`.toLowerCase();
      if (!alvo.includes(fTexto)) return false;
    }
    return true;
  });

  if (aulasConcursos.length === 0) {
    container.innerHTML = '<p class="empty-msg">Nenhuma aula encontrada para os filtros.</p>';
    return;
  }

  container.innerHTML = "";
  aulasConcursos.forEach((aula) => {
    const vinc = getVinculo(aula.vinculoId);
    const cargo = vinc ? getCargo(vinc.cargoId) : null;
    const conc = cargo ? getConcurso(cargo.concursoId) : null;
    const cont = vinc ? getConteudo(vinc.conteudoId) : null;
    const disc = cont ? getDisciplina(cont.disciplinaId) : null;
    const plat = getPlataforma(aula.plataformaId);

    const meta = `${conc ? conc.nome : ""} • ${cargo ? cargo.nome : ""} • ${disc ? disc.nome : ""} • ${plat ? plat.nome : ""}`;
    container.appendChild(criarCardAulaHTML(aula, meta));
  });

  vincularEventosProgresso(container);
}

// =====================================================
// PÁGINA 4: QUESTÕES POR BANCAS
// =====================================================
window.renderizarQuestoesBancas = function () {
  const selectBanca = document.getElementById("filtro-banca-questoes");
  if (selectBanca.options.length <= 1) {
    dados.bancas.forEach((b) => selectBanca.appendChild(new Option(b.nome, b.id)));
  }

  const bancaSel = selectBanca.value;
  const container = document.getElementById("container-questoes-bancas");
  const lista = (dados.questoesPorBancas || []).filter((q) => !bancaSel || q.bancaId === bancaSel);

  if (lista.length === 0) {
    container.innerHTML = '<p class="empty-msg">Nenhum caderno de questões cadastrado para esta banca.</p>';
    return;
  }

  container.innerHTML = lista.map((q) => {
    const banca = getBanca(q.bancaId);
    return `
      <div class="sub-box" style="display:flex; flex-direction:column; gap:10px;">
        <span class="tag-code" style="width:fit-content;">BANCA: ${banca ? banca.nome : "GERAL"}</span>
        <h3 style="margin:0;">${q.titulo}</h3>
        <p class="empty-msg">${q.descricao || ""}</p>
        <div class="links-row" style="margin-top:auto;">
          ${q.pdfLink ? `<a href="${q.pdfLink}" target="_blank" rel="noopener noreferrer" class="btn-link btn-pdf">Abrir Caderno (PDF)</a>` : ""}
          ${q.videoLink ? `<a href="${q.videoLink}" target="_blank" rel="noopener noreferrer" class="btn-link btn-video">Resolução em Vídeo</a>` : ""}
          ${q.imagemLink ? `<a href="${q.imagemLink}" target="_blank" rel="noopener noreferrer" class="btn-link btn-img">Ver Gabarito/Imagem</a>` : ""}
        </div>
      </div>
    `;
  }).join("");
};

// =====================================================
// PÁGINA 5: MATERIAIS (ACERVO UNIFICADO ONEDRIVE)
// =====================================================
window.renderizarMateriais = function () {
  const termo = document.getElementById("busca-materiais").value.trim().toLowerCase();
  const container = document.getElementById("container-materiais");
  const itens = [];

  dados.aulas.forEach((aula) => {
    (aula.partes || []).forEach((p) => {
      if (p.pdfLink || p.videoLink || p.imagemLink) {
        itens.push({
          origem: aula.nome,
          titulo: p.titulo,
          pdfLink: p.pdfLink,
          videoLink: p.videoLink,
          imagemLink: p.imagemLink
        });
      }
    });
  });

  (dados.questoesPorBancas || []).forEach((q) => {
    itens.push({
      origem: "Questões por Bancas",
      titulo: q.titulo,
      pdfLink: q.pdfLink,
      videoLink: q.videoLink,
      imagemLink: q.imagemLink
    });
  });

  const filtrados = itens.filter((it) =>
    !termo || it.origem.toLowerCase().includes(termo) || it.titulo.toLowerCase().includes(termo)
  );

  if (filtrados.length === 0) {
    container.innerHTML = '<p class="empty-msg">Nenhum material encontrado.</p>';
    return;
  }

  container.innerHTML = filtrados.map((it) => `
    <div class="sub-box" style="display:flex; flex-direction:column; gap:8px;">
      <span class="tag-code" style="width:fit-content;">${it.origem}</span>
      <h3 style="margin:0;">${it.titulo}</h3>
      <div class="links-row" style="margin-top:auto;">
        ${it.pdfLink ? `<a href="${it.pdfLink}" target="_blank" rel="noopener noreferrer" class="btn-link btn-pdf">Abrir PDF</a>` : ""}
        ${it.videoLink ? `<a href="${it.videoLink}" target="_blank" rel="noopener noreferrer" class="btn-link btn-video">Assistir Vídeo</a>` : ""}
        ${it.imagemLink ? `<a href="${it.imagemLink}" target="_blank" rel="noopener noreferrer" class="btn-link btn-img">Ver Imagem</a>` : ""}
      </div>
    </div>
  `).join("");
};

function atualizarTudo() {
  atualizarKPIs();
  renderizarMinhasAulas();
  renderizarProgressoConcursos();
}

document.addEventListener("DOMContentLoaded", () => {
  popularSeletoresConcursos();
  renderizarCadastrosConcursos();
  atualizarTudo();
  renderizarQuestoesBancas();
  renderizarMateriais();

  document.getElementById("select-concurso-topo").addEventListener("change", (e) => {
    concursoAtivoId = e.target.value;
    atualizarKPIs();
  });

  ["filtro-concurso", "filtro-cargo", "filtro-plataforma"].forEach((id) => {
    document.getElementById(id).addEventListener("change", renderizarProgressoConcursos);
  });

  document.getElementById("filtro-busca").addEventListener("input", renderizarProgressoConcursos);
});
