"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const dados = window.MARCIO_DADOS;

  // Salva apenas o progresso de partes marcadas e questões no navegador
  const storageKey = "marcio_educa_360_progresso_v2";
  const estadoSalvo = JSON.parse(localStorage.getItem(storageKey) || '{"partes":{},"questoes":{}}');

  function salvarEstado() {
    localStorage.setItem(storageKey, JSON.stringify(estadoSalvo));
  }

  // Elementos do DOM
  const selectConcursoTopo = document.getElementById("select-concurso-topo");
  const filtroConcurso = document.getElementById("filtro-concurso");
  const filtroCargo = document.getElementById("filtro-cargo");
  const filtroPlataforma = document.getElementById("filtro-plataforma");
  const filtroBusca = document.getElementById("filtro-busca");

  let concursoAtivoId = dados.concursoSelecionado || (dados.concursos[0] && dados.concursos[0].id) || "";

  // Helpers de busca por ID
  const getBanca = (id) => dados.bancas.find((b) => b.id === id);
  const getConcurso = (id) => dados.concursos.find((c) => c.id === id);
  const getCargo = (id) => dados.cargos.find((c) => c.id === id);
  const getDisciplina = (id) => dados.disciplinas.find((d) => d.id === id);
  const getConteudo = (id) => dados.conteudos.find((c) => c.id === id);
  const getVinculo = (id) => dados.vinculos.find((v) => v.id === id);
  const getPlataforma = (id) => dados.plataformas.find((p) => p.id === id);

  // Preenche seletores
  function popularSeletores() {
    selectConcursoTopo.innerHTML = "";
    filtroConcurso.innerHTML = '<option value="">Todos os concursos</option>';

    dados.concursos.forEach((c) => {
      const opt1 = new Option(c.nome, c.id);
      if (c.id === concursoAtivoId) opt1.selected = true;
      selectConcursoTopo.appendChild(opt1);

      const opt2 = new Option(c.nome, c.id);
      filtroConcurso.appendChild(opt2);
    });

    filtroCargo.innerHTML = '<option value="">Todos os cargos</option>';
    dados.cargos.forEach((cg) => {
      const conc = getConcurso(cg.concursoId);
      filtroCargo.appendChild(new Option(`${cg.nome} (${conc ? conc.nome : ""})`, cg.id));
    });

    filtroPlataforma.innerHTML = '<option value="">Todas as plataformas</option>';
    dados.plataformas.forEach((p) => {
      filtroPlataforma.appendChild(new Option(p.nome, p.id));
    });
  }

  // Renderiza listas estruturais (lidas direto do dados.js)
  function renderizarCadastros() {
    // Bancas
    const elBancas = document.getElementById("lista-bancas");
    elBancas.innerHTML = dados.bancas.length
      ? dados.bancas.map((b) => `<div class="item-card"><span>${b.nome}</span><span class="tag-code">${b.id}</span></div>`).join("")
      : '<p class="empty-msg">Nenhuma banca cadastrada.</p>';

    // Concursos
    const elConcursos = document.getElementById("lista-concursos");
    elConcursos.innerHTML = dados.concursos.length
      ? dados.concursos.map((c) => {
          const banca = getBanca(c.bancaId);
          return `<div class="item-card"><span>${c.nome} | ${banca ? banca.nome : "-"} | ${c.ativo ? "Ativo" : "Inativo"}</span><span class="tag-code">${c.id}</span></div>`;
        }).join("")
      : '<p class="empty-msg">Nenhum concurso cadastrado.</p>';

    // Cargos
    const elCargos = document.getElementById("lista-cargos");
    elCargos.innerHTML = dados.cargos.length
      ? dados.cargos.map((cg) => {
          const conc = getConcurso(cg.concursoId);
          return `<div class="item-card"><span>${cg.nome} | ${conc ? conc.nome : "-"}</span><span class="tag-code">${cg.id}</span></div>`;
        }).join("")
      : '<p class="empty-msg">Nenhum cargo cadastrado.</p>';

    // Disciplinas
    const elDisc = document.getElementById("lista-disciplinas");
    elDisc.innerHTML = dados.disciplinas.length
      ? dados.disciplinas.map((d) => `<div class="item-card"><span>${d.nome}</span><span class="tag-code">${d.id}</span></div>`).join("")
      : '<p class="empty-msg">Nenhuma disciplina cadastrada.</p>';

    // Conteúdos
    const elCont = document.getElementById("lista-conteudos");
    elCont.innerHTML = dados.conteudos.length
      ? dados.conteudos.map((ct) => {
          const disc = getDisciplina(ct.disciplinaId);
          return `<div class="item-card"><span>${ct.nome} | ${disc ? disc.nome : "-"}</span><span class="tag-code">${ct.id}</span></div>`;
        }).join("")
      : '<p class="empty-msg">Nenhum conteúdo cadastrado.</p>';

    // Vínculos
    const elVinc = document.getElementById("lista-vinculos");
    elVinc.innerHTML = dados.vinculos.length
      ? dados.vinculos.map((v) => {
          const cg = getCargo(v.cargoId);
          const ct = getConteudo(v.conteudoId);
          const disc = ct ? getDisciplina(ct.disciplinaId) : null;
          return `<div class="item-card"><span><strong>${cg ? cg.nome : "-"}</strong> → ${disc ? disc.nome : ""} — ${ct ? ct.nome : "-"}</span><span class="tag-code">${v.id}</span></div>`;
        }).join("")
      : '<p class="empty-msg">Nenhum conteúdo vinculado a um cargo.</p>';

    // Plataformas
    const elPlat = document.getElementById("lista-plataformas");
    elPlat.innerHTML = dados.plataformas.length
      ? dados.plataformas.map((p) => `<div class="item-card"><span>${p.nome}</span><span class="tag-code">${p.id}</span></div>`).join("")
      : '<p class="empty-msg">Nenhum registro cadastrado.</p>';

    // Aulas resumo
    const elAulasRes = document.getElementById("lista-aulas-resumo");
    elAulasRes.innerHTML = dados.aulas.length
      ? dados.aulas.map((a) => `<div class="item-card"><span>${a.nome} (${(a.partes || []).length} partes)</span><span class="tag-code">${a.id}</span></div>`).join("")
      : '<p class="empty-msg">Nenhum registro cadastrado.</p>';
  }

  // Atualiza os KPIs do topo com base no Concurso Selecionado
  function atualizarKPIs() {
    const concursosAtivos = dados.concursos.filter((c) => c.ativo).length;
    const cargosDoConcurso = dados.cargos.filter((cg) => cg.concursoId === concursoAtivoId);
    const cargoIds = cargosDoConcurso.map((cg) => cg.id);
    const vinculosDoConcurso = dados.vinculos.filter((v) => cargoIds.includes(v.cargoId));
    const vinculoIds = vinculosDoConcurso.map((v) => v.id);
    const aulasDoConcurso = dados.aulas.filter((a) => vinculoIds.includes(a.vinculoId));

    let totalPartes = 0;
    let partesConcluidas = 0;
    let totalQuestoes = 0;
    let totalAcertos = 0;

    aulasDoConcurso.forEach((aula) => {
      const partes = aula.partes || [];
      totalPartes += partes.length;
      partes.forEach((p) => {
        const chave = `${aula.id}-p${p.numero}`;
        const ok = estadoSalvo.partes[chave] !== undefined ? estadoSalvo.partes[chave] : p.concluida;
        if (ok) partesConcluidas++;
      });

      const qSalvo = estadoSalvo.questoes[aula.id];
      const qTot = qSalvo && qSalvo.total !== undefined ? Number(qSalvo.total) : Number(aula.questoesTotal || 0);
      const qAce = qSalvo && qSalvo.acertos !== undefined ? Number(qSalvo.acertos) : Number(aula.questoesAcertos || 0);
      totalQuestoes += qTot;
      totalAcertos += qAce;
    });

    const percTeoria = totalPartes > 0 ? Math.round((partesConcluidas / totalPartes) * 100) : 0;
    const percAprov = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;

    document.getElementById("kpi-concursos").textContent = concursosAtivos;
    document.getElementById("kpi-cargos").textContent = cargosDoConcurso.length;
    document.getElementById("kpi-conteudos").textContent = vinculosDoConcurso.length;
    document.getElementById("kpi-teoria").textContent = `${percTeoria}%`;
    document.getElementById("kpi-questoes").textContent = totalQuestoes;
    document.getElementById("kpi-acertos").textContent = totalAcertos;
    document.getElementById("kpi-aproveitamento").textContent = `${percAprov}%`;
  }

  // Renderiza as aulas e partes com links do OneDrive
  function renderizarProgressoAulas() {
    const container = document.getElementById("lista-progresso-aulas");
    const fConc = filtroConcurso.value;
    const fCargo = filtroCargo.value;
    const fPlat = filtroPlataforma.value;
    const fTexto = filtroBusca.value.trim().toLowerCase();

    const aulasFiltradas = dados.aulas.filter((aula) => {
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

    if (aulasFiltradas.length === 0) {
      container.innerHTML = '<p class="empty-msg">Nenhuma aula encontrada para os filtros.</p>';
      return;
    }

    container.innerHTML = "";

    aulasFiltradas.forEach((aula) => {
      const vinc = getVinculo(aula.vinculoId);
      const cargo = vinc ? getCargo(vinc.cargoId) : null;
      const conc = cargo ? getConcurso(cargo.concursoId) : null;
      const cont = vinc ? getConteudo(vinc.conteudoId) : null;
      const disc = cont ? getDisciplina(cont.disciplinaId) : null;
      const plat = getPlataforma(aula.plataformaId);

      const qSalvo = estadoSalvo.questoes[aula.id] || {};
      const qTot = qSalvo.total !== undefined ? qSalvo.total : (aula.questoesTotal || 0);
      const qAce = qSalvo.acertos !== undefined ? qSalvo.acertos : (aula.questoesAcertos || 0);

      const partes = aula.partes || [];
      let htmlPartes = "";

      partes.forEach((parte) => {
        const chave = `${aula.id}-p${parte.numero}`;
        const concluida = estadoSalvo.partes[chave] !== undefined ? estadoSalvo.partes[chave] : parte.concluida;

        // Renderiza mídias (embed direto ou botão externo OneDrive)
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
            <div class="aula-meta">${conc ? conc.nome : ""} • ${cargo ? cargo.nome : ""} • ${disc ? disc.nome : ""} • ${plat ? plat.nome : ""}</div>
            <div class="aula-title">${aula.nome}</div>
          </div>
          <div class="questoes-box">
            <span>Questões:</span>
            <input type="number" min="0" value="${qTot}" data-q-total="${aula.id}" title="Total de questões" />
            <span>Acertos:</span>
            <input type="number" min="0" value="${qAce}" data-q-acertos="${aula.id}" title="Acertos" />
          </div>
        </div>
        <div class="partes-list">${htmlPartes}</div>
      `;

      container.appendChild(box);
    });

    // Eventos dos checkboxes de partes
    container.querySelectorAll('input[type="checkbox"][data-chave]').forEach((chk) => {
      chk.addEventListener("change", (e) => {
        estadoSalvo.partes[e.target.dataset.chave] = e.target.checked;
        salvarEstado();
        atualizarKPIs();
        renderizarProgressoAulas();
      });
    });

    // Eventos de questões/acertos
    container.querySelectorAll('input[data-q-total]').forEach((inp) => {
      inp.addEventListener("change", (e) => {
        const id = e.target.dataset.qTotal;
        if (!estadoSalvo.questoes[id]) estadoSalvo.questoes[id] = {};
        estadoSalvo.questoes[id].total = Number(e.target.value);
        salvarEstado();
        atualizarKPIs();
      });
    });

    container.querySelectorAll('input[data-q-acertos]').forEach((inp) => {
      inp.addEventListener("change", (e) => {
        const id = e.target.dataset.qAcertos;
        if (!estadoSalvo.questoes[id]) estadoSalvo.questoes[id] = {};
        estadoSalvo.questoes[id].acertos = Number(e.target.value);
        salvarEstado();
        atualizarKPIs();
      });
    });
  }

  // Eventos de filtros
  selectConcursoTopo.addEventListener("change", (e) => {
    concursoAtivoId = e.target.value;
    atualizarKPIs();
  });

  [filtroConcurso, filtroCargo, filtroPlataforma].forEach((el) => {
    el.addEventListener("change", renderizarProgressoAulas);
  });

  filtroBusca.addEventListener("input", renderizarProgressoAulas);

  // Inicialização
  popularSeletores();
  renderizarCadastros();
  atualizarKPIs();
  renderizarProgressoAulas();
});
