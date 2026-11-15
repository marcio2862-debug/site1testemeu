
/* =====================================================
   MÁRCIO EDUCA 360 — CONCURSOS PRO
   ARQUIVO: script.js
   VERSÃO CONSOLIDADA — ETAPAS 01 A 05
===================================================== */

"use strict";

/* =====================================================
   01 — CONFIGURAÇÕES E ARMAZENAMENTO
===================================================== */

const CHAVE_DADOS = "marcio360-etapa03";

const $ = seletor => document.querySelector(seletor);

const COLECOES = [
  "bancas",
  "concursos",
  "cargos",
  "disciplinas",
  "conteudos",
  "vinculos",
  "plataformas",
  "aulas",
  "questoes",
  "revisoes",
  "erros"
];

const TITULOS = {
  bancas: "Banca",
  concursos: "Concurso",
  cargos: "Cargo",
  disciplinas: "Disciplina",
  conteudos: "Conteúdo",
  plataformas: "Plataforma",
  aulas: "Aula"
};

function copiar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function criarId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return (
    "id-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2)
  );
}

function carregarDados() {
  const base = copiar(window.MARCIO_DADOS || {});

  COLECOES.forEach(nome => {
    if (!Array.isArray(base[nome])) {
      base[nome] = [];
    }
  });

  try {
    const salvo = localStorage.getItem(CHAVE_DADOS);

    if (!salvo) {
      return base;
    }

    const objeto = JSON.parse(salvo);

    if (
      !objeto ||
      typeof objeto !== "object" ||
      !Array.isArray(objeto.bancas) ||
      !Array.isArray(objeto.concursos)
    ) {
      return base;
    }

    COLECOES.forEach(nome => {
      if (!Array.isArray(objeto[nome])) {
        objeto[nome] = base[nome];
      }
    });

    objeto.concursoSelecionado ??=
      base.concursoSelecionado || "";

    return objeto;

  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
    return base;
  }
}

let dados = carregarDados();
let edicao = null;

/* =====================================================
   02 — SALVAMENTO E CONSULTAS
===================================================== */

function salvar() {
  try {
    localStorage.setItem(
      CHAVE_DADOS,
      JSON.stringify(dados)
    );

    $("#situacao").textContent = "● Dados salvos";
    return true;

  } catch (erro) {
    console.error("Erro ao salvar dados:", erro);

    $("#situacao").textContent =
      "● Erro ao salvar";

    alert(
      "Não foi possível salvar os dados. " +
      "Verifique o armazenamento do navegador."
    );

    return false;
  }
}

function encontrar(tipo, id) {
  if (!Array.isArray(dados[tipo])) {
    return null;
  }

  return dados[tipo].find(
    item => item.id === id
  ) || null;
}

function nomeRegistro(tipo, id) {
  return encontrar(tipo, id)?.nome || "Não encontrado";
}

function ordenarPorNome(itens) {
  return [...itens].sort((a, b) =>
    String(a.nome || "").localeCompare(
      String(b.nome || ""),
      "pt-BR",
      { numeric: true }
    )
  );
}

function concursoDoVinculo(vinculo) {
  const cargo = encontrar(
    "cargos",
    vinculo?.cargoId
  );

  return cargo?.concursoId || "";
}

function concursoDaAula(aula) {
  const vinculo = encontrar(
    "vinculos",
    aula?.vinculoId
  );

  return concursoDoVinculo(vinculo);
}

/* =====================================================
   03 — CONCURSO SELECIONADO
===================================================== */

function carregarConcursos() {
  const seletor = $("#active-contest");

  seletor.replaceChildren();

  seletor.add(
    new Option("Selecione um concurso", "")
  );

  ordenarPorNome(
    dados.concursos.filter(item => item.ativo)
  ).forEach(concurso => {
    seletor.add(
      new Option(concurso.nome, concurso.id)
    );
  });

  const selecionadoValido = dados.concursos.some(
    concurso =>
      concurso.id === dados.concursoSelecionado &&
      concurso.ativo
  );

  if (!selecionadoValido) {
    dados.concursoSelecionado = "";
  }

  seletor.value = dados.concursoSelecionado;
}

/* =====================================================
   04 — INDICADORES DA CENTRAL
===================================================== */

function atualizarIndicadores() {
  const concursoId = dados.concursoSelecionado;

  const cargos = dados.cargos.filter(
    item => item.concursoId === concursoId
  );

  const vinculos = dados.vinculos.filter(
    item => concursoDoVinculo(item) === concursoId
  );

  const aulas = dados.aulas.filter(
    item => concursoDaAula(item) === concursoId
  );

  const totalPartes = aulas.reduce(
    (soma, aula) =>
      soma + Number(aula.totalPartes || 0),
    0
  );

  const partesConcluidas = aulas.reduce(
    (soma, aula) =>
      soma + Number(aula.partesConcluidas || 0),
    0
  );

  const percentualTeoria = totalPartes > 0
    ? Math.round(
        (partesConcluidas / totalPartes) * 100
      )
    : 0;

  const indicadores = [
    [
      "Concursos ativos",
      dados.concursos.filter(item => item.ativo).length
    ],
    ["Cargos", cargos.length],
    ["Conteúdos", vinculos.length],
    ["Teoria concluída", percentualTeoria + "%"],
    ["Questões", 0],
    ["Acertos", 0],
    ["Aproveitamento", "0%"]
  ];

  const area = $("#stats");
  area.replaceChildren();

  indicadores.forEach(([titulo, valor]) => {
    const cartao = document.createElement("div");
    cartao.className = "indicador";

    const numero = document.createElement("strong");
    numero.textContent = valor;

    const legenda = document.createElement("small");
    legenda.textContent = titulo;

    cartao.append(numero, legenda);
    area.appendChild(cartao);
  });
}

/* =====================================================
   05 — COMPONENTES DAS LISTAS
===================================================== */

function criarBotao(texto, acao, tipo, id) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.textContent = texto;

  botao.className =
    "acao-registro" +
    (acao === "excluir" ? " excluir" : "");

  botao.dataset.acao = acao;
  botao.dataset.tipo = tipo;
  botao.dataset.id = id;

  return botao;
}

function criarRegistro(texto, tipo, id) {
  const registro = document.createElement("div");
  registro.className = "registro";

  const descricao = document.createElement("div");
  descricao.className = "registro-nome";
  descricao.textContent = texto;

  const acoes = document.createElement("div");
  acoes.className = "registro-acoes";

  acoes.append(
    criarBotao("Editar", "editar", tipo, id),
    criarBotao("Excluir", "excluir", tipo, id)
  );

  registro.append(descricao, acoes);
  return registro;
}

function preencherLista(
  seletor,
  itens,
  tipo,
  descricao
) {
  const area = $(seletor);

  if (!area) return;

  area.replaceChildren();

  if (!itens.length) {
    const aviso = document.createElement("p");
    aviso.className = "vazio";
    aviso.textContent = "Nenhum registro cadastrado.";

    area.appendChild(aviso);
    return;
  }

  ordenarPorNome(itens).forEach(item => {
    area.appendChild(
      criarRegistro(
        descricao(item),
        tipo,
        item.id
      )
    );
  });
}

/* =====================================================
   06 — LISTAS DE BANCAS, CONCURSOS E CARGOS
===================================================== */

function renderizarCadastros() {
  preencherLista(
    "#lista-bancas",
    dados.bancas,
    "bancas",
    item => item.nome
  );

  preencherLista(
    "#lista-concursos",
    dados.concursos,
    "concursos",
    item => {
      return [
        item.nome,
        nomeRegistro("bancas", item.bancaId),
        item.ativo ? "Ativo" : "Arquivado"
      ].join(" | ");
    }
  );

  preencherLista(
    "#lista-cargos",
    dados.cargos,
    "cargos",
    item => {
      return [
        item.nome,
        nomeRegistro("concursos", item.concursoId)
      ].join(" | ");
    }
  );
}

/* =====================================================
   07 — BIBLIOTECA PERMANENTE
===================================================== */

function renderizarBiblioteca() {
  preencherLista(
    "#lista-disciplinas",
    dados.disciplinas,
    "disciplinas",
    item => item.nome
  );

  preencherLista(
    "#lista-conteudos",
    dados.conteudos,
    "conteudos",
    item => {
      return [
        item.nome,
        nomeRegistro(
          "disciplinas",
          item.disciplinaId
        )
      ].join(" | ");
    }
  );
}

/* =====================================================
   08 — VÍNCULOS DE CONTEÚDOS
===================================================== */

function renderizarVinculos() {
  const area = $("#lista-vinculos");
  area.replaceChildren();

  if (!dados.vinculos.length) {
    const aviso = document.createElement("p");
    aviso.className = "vazio";
    aviso.textContent =
      "Nenhum conteúdo vinculado a um cargo.";

    area.appendChild(aviso);
    return;
  }

  const ordenados = [...dados.vinculos].sort(
    (a, b) => {
      const nomeA = nomeRegistro(
        "conteudos",
        a.conteudoId
      );

      const nomeB = nomeRegistro(
        "conteudos",
        b.conteudoId
      );

      return nomeA.localeCompare(
        nomeB,
        "pt-BR",
        { numeric: true }
      );
    }
  );

  ordenados.forEach(vinculo => {
    const cargo = encontrar(
      "cargos",
      vinculo.cargoId
    );

    const conteudo = encontrar(
      "conteudos",
      vinculo.conteudoId
    );

    const disciplina = conteudo
      ? encontrar(
          "disciplinas",
          conteudo.disciplinaId
        )
      : null;

    const concurso = cargo
      ? encontrar(
          "concursos",
          cargo.concursoId
        )
      : null;

    const registro = document.createElement("div");
    registro.className = "vinculo-registro";

    const info = document.createElement("div");
    info.className = "vinculo-info";

    const titulo = document.createElement("strong");
    titulo.textContent =
      conteudo?.nome || "Conteúdo não encontrado";

    const detalhes = document.createElement("small");
    detalhes.textContent = [
      disciplina?.nome,
      cargo?.nome,
      concurso?.nome
    ].filter(Boolean).join(" | ");

    info.append(titulo, detalhes);

    const botao = criarBotao(
      "Desvincular",
      "excluir",
      "vinculos",
      vinculo.id
    );

    registro.append(info, botao);
    area.appendChild(registro);
  });
}

/* =====================================================
   09 — CAMPOS DOS FORMULÁRIOS
===================================================== */

function criarCampo(
  nome,
  rotulo,
  valor = "",
  tipo = "text"
) {
  const label = document.createElement("label");
  label.textContent = rotulo;

  const input = document.createElement("input");

  input.type = tipo;
  input.name = nome;
  input.value = valor ?? "";
  input.required = true;

  if (tipo === "number") {
    input.min = "0";
    input.step = "1";
  }

  label.appendChild(input);
  return label;
}

function criarSelecao(
  nome,
  rotulo,
  opcoes,
  valor = ""
) {
  const label = document.createElement("label");
  label.textContent = rotulo;

  const select = document.createElement("select");
  select.name = nome;
  select.required = true;

  select.add(new Option("Selecione...", ""));

  ordenarPorNome(opcoes).forEach(item => {
    select.add(
      new Option(item.nome, item.id)
    );
  });

  select.value = valor || "";

  label.appendChild(select);
  return label;
}

function criarSelecaoSimples(
  nome,
  rotulo,
  opcoes,
  valor = ""
) {
  const label = document.createElement("label");
  label.textContent = rotulo;

  const select = document.createElement("select");
  select.name = nome;
  select.required = true;

  opcoes.forEach(item => {
    select.add(
      new Option(item.texto, item.valor)
    );
  });

  select.value = String(valor);

  label.appendChild(select);
  return label;
}

/* =====================================================
   10 — OPÇÕES PARA CARGOS E CONTEÚDOS
===================================================== */

function opcoesCargos() {
  return dados.cargos.map(cargo => {
    const concurso = encontrar(
      "concursos",
      cargo.concursoId
    );

    return {
      id: cargo.id,
      nome:
        cargo.nome +
        " — " +
        (concurso?.nome || "Sem concurso")
    };
  });
}

function opcoesConteudos() {
  return dados.conteudos.map(conteudo => {
    const disciplina = encontrar(
      "disciplinas",
      conteudo.disciplinaId
    );

    return {
      id: conteudo.id,
      nome:
        (disciplina?.nome || "Sem disciplina") +
        " — " +
        conteudo.nome
    };
  });
}

function opcoesVinculos() {
  return dados.vinculos.map(vinculo => {
    const cargo = encontrar(
      "cargos",
      vinculo.cargoId
    );

    const conteudo = encontrar(
      "conteudos",
      vinculo.conteudoId
    );

    const concurso = cargo
      ? encontrar(
          "concursos",
          cargo.concursoId
        )
      : null;

    return {
      id: vinculo.id,
      nome: [
        concurso?.nome,
        cargo?.nome,
        conteudo?.nome
      ].filter(Boolean).join(" — ")
    };
  });
}

/* =====================================================
   11 — ABRIR FORMULÁRIO UNIVERSAL
===================================================== */

function abrirCadastro(tipo, id = null) {
  if (!TITULOS[tipo]) return;

  const registro = id
    ? encontrar(tipo, id)
    : null;

  if (id && !registro) {
    alert("Registro não encontrado.");
    return;
  }

  if (
    tipo === "concursos" &&
    !dados.bancas.length
  ) {
    alert("Cadastre uma banca primeiro.");
    return;
  }

  if (
    tipo === "cargos" &&
    !dados.concursos.length
  ) {
    alert("Cadastre um concurso primeiro.");
    return;
  }

  if (
    tipo === "conteudos" &&
    !dados.disciplinas.length
  ) {
    alert("Cadastre uma disciplina primeiro.");
    return;
  }

  if (tipo === "aulas") {
    if (!dados.vinculos.length) {
      alert(
        "Vincule um conteúdo a um cargo primeiro."
      );
      return;
    }

    if (!dados.plataformas.length) {
      alert("Cadastre uma plataforma primeiro.");
      return;
    }
  }

  edicao = { tipo, id };

  const campos = $("#campos-modal");
  campos.replaceChildren();

  $("#titulo-modal").textContent =
    (id ? "Editar " : "Cadastrar ") +
    TITULOS[tipo];

  if (tipo === "bancas") {
    campos.append(
      criarCampo(
        "nome",
        "Nome da banca",
        registro?.nome
      )
    );
  }

  if (tipo === "concursos") {
    campos.append(
      criarCampo(
        "nome",
        "Nome do concurso",
        registro?.nome
      ),

      criarSelecao(
        "bancaId",
        "Banca organizadora",
        dados.bancas,
        registro?.bancaId
      ),

      criarSelecaoSimples(
        "ativo",
        "Situação",
        [
          { texto: "Ativo", valor: "true" },
          { texto: "Arquivado", valor: "false" }
        ],
        String(registro?.ativo ?? true)
      )
    );
  }

  if (tipo === "cargos") {
    campos.append(
      criarCampo(
        "nome",
        "Nome do cargo",
        registro?.nome
      ),

      criarSelecao(
        "concursoId",
        "Concurso",
        dados.concursos,
        registro?.concursoId ||
          dados.concursoSelecionado
      )
    );
  }

  if (tipo === "disciplinas") {
    campos.append(
      criarCampo(
        "nome",
        "Nome da disciplina",
        registro?.nome
      )
    );
  }

  if (tipo === "conteudos") {
    campos.append(
      criarCampo(
        "nome",
        "Nome do conteúdo",
        registro?.nome
      ),

      criarSelecao(
        "disciplinaId",
        "Disciplina",
        dados.disciplinas,
        registro?.disciplinaId
      )
    );
  }

  if (tipo === "plataformas") {
    campos.append(
      criarCampo(
        "nome",
        "Nome da plataforma",
        registro?.nome
      )
    );
  }

  if (tipo === "aulas") {
    campos.append(
      criarCampo(
        "nome",
        "Nome da aula",
        registro?.nome
      ),

      criarSelecao(
        "vinculoId",
        "Concurso / Cargo / Conteúdo",
        opcoesVinculos(),
        registro?.vinculoId
      ),

      criarSelecao(
        "plataformaId",
        "Plataforma",
        dados.plataformas,
        registro?.plataformaId
      ),

      criarCampo(
        "totalPartes",
        "Total de partes de teoria",
        registro?.totalPartes ?? 1,
        "number"
      )
    );
  }

  $("#modal-cadastro").showModal();
}

/* =====================================================
   12 — ABRIR FORMULÁRIO DE VINCULAÇÃO
===================================================== */

function abrirVinculacao() {
  if (!dados.cargos.length) {
    alert("Cadastre um cargo primeiro.");
    return;
  }

  if (!dados.conteudos.length) {
    alert("Cadastre um conteúdo primeiro.");
    return;
  }

  edicao = {
    tipo: "vinculos",
    id: null
  };

  $("#titulo-modal").textContent =
    "Vincular Conteúdo ao Cargo";

  const campos = $("#campos-modal");
  campos.replaceChildren();

  campos.append(
    criarSelecao(
      "cargoId",
      "Cargo",
      opcoesCargos()
    ),

    criarSelecao(
      "conteudoId",
      "Conteúdo",
      opcoesConteudos()
    )
  );

  $("#modal-cadastro").showModal();
}

/* =====================================================
   13 — GRAVAR FORMULÁRIO
===================================================== */

function gravarCadastro(evento) {
  evento.preventDefault();

  if (!edicao) return;

  const { tipo, id } = edicao;

  const formularioDados = new FormData(
    evento.currentTarget
  );

  /* VINCULAÇÕES */

  if (tipo === "vinculos") {
    const cargoId = String(
      formularioDados.get("cargoId") || ""
    );

    const conteudoId = String(
      formularioDados.get("conteudoId") || ""
    );

    if (
      !encontrar("cargos", cargoId) ||
      !encontrar("conteudos", conteudoId)
    ) {
      alert("Selecione um cargo e um conteúdo válidos.");
      return;
    }

    const duplicado = dados.vinculos.some(
      item =>
        item.cargoId === cargoId &&
        item.conteudoId === conteudoId
    );

    if (duplicado) {
      alert(
        "Este conteúdo já está vinculado ao cargo."
      );
      return;
    }

    const anterior = copiar(dados);

    dados.vinculos.push({
      id: criarId(),
      cargoId,
      conteudoId
    });

    if (!salvar()) {
      dados = anterior;
      return;
    }

    renderizar();
    fecharModal();
    return;
  }

  /* CADASTROS GERAIS */

  const nome = String(
    formularioDados.get("nome") || ""
  ).trim();

  if (!nome) {
    alert("Informe o nome do registro.");
    return;
  }

  const anterior = copiar(dados);

  let registro = id
    ? encontrar(tipo, id)
    : null;

  if (!registro) {
    registro = { id: criarId() };
    dados[tipo].push(registro);
  }

  registro.nome = nome;

  if (tipo === "concursos") {
    registro.bancaId = String(
      formularioDados.get("bancaId") || ""
    );

    registro.ativo =
      formularioDados.get("ativo") === "true";
  }

  if (tipo === "cargos") {
    registro.concursoId = String(
      formularioDados.get("concursoId") || ""
    );
  }

  if (tipo === "conteudos") {
    registro.disciplinaId = String(
      formularioDados.get("disciplinaId") || ""
    );
  }

  if (tipo === "aulas") {
    const vinculoId = String(
      formularioDados.get("vinculoId") || ""
    );

    const plataformaId = String(
      formularioDados.get("plataformaId") || ""
    );

    const totalPartes = Number(
      formularioDados.get("totalPartes")
    );

    if (
      !encontrar("vinculos", vinculoId) ||
      !encontrar("plataformas", plataformaId)
    ) {
      alert("Selecione vínculo e plataforma válidos.");
      dados = anterior;
      return;
    }

    if (
      !Number.isInteger(totalPartes) ||
      totalPartes < 0
    ) {
      alert("Informe um total de partes válido.");
      dados = anterior;
      return;
    }

    registro.vinculoId = vinculoId;
    registro.plataformaId = plataformaId;
    registro.totalPartes = totalPartes;

    registro.partesConcluidas = Math.min(
      Number(registro.partesConcluidas || 0),
      totalPartes
    );
  }

  if (!salvar()) {
    dados = anterior;
    return;
  }

  renderizar();
  fecharModal();
}

/* =====================================================
   14 — FECHAR MODAL
===================================================== */

function fecharModal() {
  $("#modal-cadastro").close();
  $("#form-cadastro").reset();
  edicao = null;
}

/* =====================================================
   15 — EXCLUSÃO COM PROTEÇÃO DE VÍNCULOS
===================================================== */

function excluirCadastro(tipo, id) {
  const registro = encontrar(tipo, id);

  if (!registro) {
    alert("Registro não encontrado.");
    return;
  }

  if (
    tipo === "bancas" &&
    dados.concursos.some(
      item => item.bancaId === id
    )
  ) {
    alert(
      "Esta banca possui concursos vinculados."
    );
    return;
  }

  if (
    tipo === "concursos" &&
    dados.cargos.some(
      item => item.concursoId === id
    )
  ) {
    alert(
      "Este concurso possui cargos vinculados."
    );
    return;
  }

  if (
    tipo === "disciplinas" &&
    dados.conteudos.some(
      item => item.disciplinaId === id
    )
  ) {
    alert(
      "Esta disciplina possui conteúdos vinculados."
    );
    return;
  }

  if (
    tipo === "cargos" &&
    dados.vinculos.some(
      item => item.cargoId === id
    )
  ) {
    alert(
      "Este cargo possui conteúdos vinculados."
    );
    return;
  }

  if (
    tipo === "conteudos" &&
    dados.vinculos.some(
      item => item.conteudoId === id
    )
  ) {
    alert(
      "Este conteúdo está vinculado a um cargo."
    );
    return;
  }

  if (
    tipo === "vinculos" &&
    dados.aulas.some(
      item => item.vinculoId === id
    )
  ) {
    alert(
      "Este vínculo possui aulas cadastradas."
    );
    return;
  }

  if (
    tipo === "plataformas" &&
    dados.aulas.some(
      item => item.plataformaId === id
    )
  ) {
    alert(
      "Esta plataforma possui aulas vinculadas."
    );
    return;
  }

  const confirmado = confirm(
    "Deseja realmente excluir este registro?"
  );

  if (!confirmado) return;

  const anterior = copiar(dados);

  dados[tipo] = dados[tipo].filter(
    item => item.id !== id
  );

  if (
    tipo === "concursos" &&
    dados.concursoSelecionado === id
  ) {
    dados.concursoSelecionado = "";
  }

  if (!salvar()) {
    dados = anterior;
    return;
  }

  renderizar();
}

/* =====================================================
   16 — FILTROS DO CONTROLE GERAL
===================================================== */

function preencherFiltro(
  seletor,
  itens,
  textoPadrao,
  valorAtual = ""
) {
  const campo = $(seletor);
  campo.replaceChildren();

  campo.add(new Option(textoPadrao, ""));

  ordenarPorNome(itens).forEach(item => {
    campo.add(
      new Option(item.nome, item.id)
    );
  });

  campo.value = valorAtual;

  if (campo.value !== valorAtual) {
    campo.value = "";
  }
}

function atualizarFiltros() {
  const filtroConcurso = $("#filtro-concurso");
  const filtroCargo = $("#filtro-cargo");
  const filtroPlataforma = $("#filtro-plataforma");

  const concursoAtual = filtroConcurso.value;
  const cargoAtual = filtroCargo.value;
  const plataformaAtual = filtroPlataforma.value;

  preencherFiltro(
    "#filtro-concurso",
    dados.concursos,
    "Todos os concursos",
    concursoAtual
  );

  const concursoId = filtroConcurso.value;

  const cargos = concursoId
    ? dados.cargos.filter(
        item => item.concursoId === concursoId
      )
    : dados.cargos;

  preencherFiltro(
    "#filtro-cargo",
    cargos,
    "Todos os cargos",
    cargoAtual
  );

  preencherFiltro(
    "#filtro-plataforma",
    dados.plataformas,
    "Todas as plataformas",
    plataformaAtual
  );
}

function aulasFiltradas() {
  const concursoId = $("#filtro-concurso").value;
  const cargoId = $("#filtro-cargo").value;
  const plataformaId = $("#filtro-plataforma").value;

  const pesquisa = $("#pesquisa-aulas")
    .value.trim()
    .toLocaleLowerCase("pt-BR");

  return dados.aulas.filter(aula => {
    const vinculo = encontrar(
      "vinculos",
      aula.vinculoId
    );

    const cargo = vinculo
      ? encontrar("cargos", vinculo.cargoId)
      : null;

    const conteudo = vinculo
      ? encontrar(
          "conteudos",
          vinculo.conteudoId
        )
      : null;

    const disciplina = conteudo
      ? encontrar(
          "disciplinas",
          conteudo.disciplinaId
        )
      : null;

    const concurso = cargo
      ? encontrar(
          "concursos",
          cargo.concursoId
        )
      : null;

    const plataforma = encontrar(
      "plataformas",
      aula.plataformaId
    );

    if (
      concursoId &&
      cargo?.concursoId !== concursoId
    ) {
      return false;
    }

    if (
      cargoId &&
      cargo?.id !== cargoId
    ) {
      return false;
    }

    if (
      plataformaId &&
      aula.plataformaId !== plataformaId
    ) {
      return false;
    }

    const texto = [
      aula.nome,
      concurso?.nome,
      cargo?.nome,
      disciplina?.nome,
      conteudo?.nome,
      plataforma?.nome
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    return texto.includes(pesquisa);
  });
}

/* =====================================================
   17 — LISTAS DE PLATAFORMAS E AULAS
===================================================== */

function renderizarControle() {
  preencherLista(
    "#lista-plataformas",
    dados.plataformas,
    "plataformas",
    item => item.nome
  );

  preencherLista(
    "#lista-aulas",
    dados.aulas,
    "aulas",
    item => {
      const vinculo = encontrar(
        "vinculos",
        item.vinculoId
      );

      const conteudo = vinculo
        ? encontrar(
            "conteudos",
            vinculo.conteudoId
          )
        : null;

      return [
        item.nome,
        conteudo?.nome || "Sem conteúdo"
      ].join(" | ");
    }
  );

  atualizarFiltros();
  renderizarProgressoAulas();
}

/* =====================================================
   18 — PROGRESSO DAS AULAS
===================================================== */

function renderizarProgressoAulas() {
  const area = $("#progresso-aulas");
  area.replaceChildren();

  const aulas = aulasFiltradas().sort(
    (a, b) =>
      a.nome.localeCompare(
        b.nome,
        "pt-BR",
        { numeric: true }
      )
  );

  if (!aulas.length) {
    const aviso = document.createElement("p");
    aviso.className = "vazio";
    aviso.textContent =
      "Nenhuma aula encontrada para os filtros.";

    area.appendChild(aviso);
    return;
  }

  aulas.forEach(aula => {
    const vinculo = encontrar(
      "vinculos",
      aula.vinculoId
    );

    const cargo = vinculo
      ? encontrar(
          "cargos",
          vinculo.cargoId
        )
      : null;

    const conteudo = vinculo
      ? encontrar(
          "conteudos",
          vinculo.conteudoId
        )
      : null;

    const disciplina = conteudo
      ? encontrar(
          "disciplinas",
          conteudo.disciplinaId
        )
      : null;

    const concurso = cargo
      ? encontrar(
          "concursos",
          cargo.concursoId
        )
      : null;

    const plataforma = encontrar(
      "plataformas",
      aula.plataformaId
    );

    const total = Math.max(
      0,
      Number(aula.totalPartes || 0)
    );

    const concluidas = Math.max(
      0,
      Math.min(
        total,
        Number(aula.partesConcluidas || 0)
      )
    );

    const percentual = total > 0
      ? Math.round(
          (concluidas / total) * 100
        )
      : 0;

    const cartao = document.createElement("div");
    cartao.className = "aula-progresso";

    const titulo = document.createElement("h4");
    titulo.textContent = aula.nome;

    const detalhes = document.createElement("div");
    detalhes.className = "aula-detalhes";

    detalhes.textContent = [
      concurso?.nome,
      cargo?.nome,
      disciplina?.nome,
      conteudo?.nome,
      plataforma?.nome
    ].filter(Boolean).join(" | ");

    const linha = document.createElement("div");
    linha.className = "progresso-linha";

    const partes = document.createElement("span");
    partes.textContent =
      `Teoria: ${concluidas}/${total} partes`;

    const porcentagem = document.createElement("strong");
    porcentagem.textContent = percentual + "%";

    linha.append(partes, porcentagem);

    const barra = document.createElement("div");
    barra.className = "barra-progresso";

    const preenchimento = document.createElement("span");
    preenchimento.style.width = percentual + "%";

    barra.appendChild(preenchimento);

    const acoes = document.createElement("div");
    acoes.className = "acoes-progresso";

    const menos = document.createElement("button");
    menos.type = "button";
    menos.className = "btn-parte";
    menos.textContent = "− Parte";
    menos.disabled = concluidas <= 0;

    menos.addEventListener("click", () => {
      alterarProgressoAula(aula.id, -1);
    });

    const mais = document.createElement("button");
    mais.type = "button";
    mais.className = "btn-parte";
    mais.textContent = "+ Parte";
    mais.disabled = concluidas >= total;

    mais.addEventListener("click", () => {
      alterarProgressoAula(aula.id, 1);
    });

    const editar = document.createElement("button");
    editar.type = "button";
    editar.className = "btn-parte";
    editar.textContent = "Editar aula";

    editar.addEventListener("click", () => {
      abrirCadastro("aulas", aula.id);
    });

    acoes.append(menos, mais, editar);

    cartao.append(
      titulo,
      detalhes,
      linha,
      barra,
      acoes
    );

    area.appendChild(cartao);
  });
}

/* =====================================================
   19 — ALTERAR PROGRESSO DA TEORIA
===================================================== */

function alterarProgressoAula(id, diferenca) {
  const aula = encontrar("aulas", id);

  if (!aula) return;

  const anterior = copiar(dados);

  const total = Math.max(
    0,
    Number(aula.totalPartes || 0)
  );

  const atual = Number(
    aula.partesConcluidas || 0
  );

  aula.partesConcluidas = Math.max(
    0,
    Math.min(
      total,
      atual + diferenca
    )
  );

  if (!salvar()) {
    dados = anterior;
    return;
  }

  atualizarIndicadores();
  renderizarProgressoAulas();
}

/* =====================================================
   20 — RENDERIZAÇÃO GERAL
===================================================== */

function renderizar() {
  carregarConcursos();
  atualizarIndicadores();
  renderizarCadastros();
  renderizarBiblioteca();
  renderizarVinculos();
  renderizarControle();
}

/* =====================================================
   21 — EVENTOS DE CADASTRO, EDIÇÃO E EXCLUSÃO
===================================================== */

document.addEventListener("click", evento => {
  const cadastro = evento.target.closest(
    "[data-cadastro]"
  );

  if (cadastro) {
    abrirCadastro(
      cadastro.dataset.cadastro
    );
    return;
  }

  const botao = evento.target.closest(
    "[data-acao]"
  );

  if (!botao) return;

  const { acao, tipo, id } = botao.dataset;

  if (acao === "editar") {
    abrirCadastro(tipo, id);
  }

  if (acao === "excluir") {
    excluirCadastro(tipo, id);
  }
});

/* =====================================================
   22 — EVENTOS DOS FORMULÁRIOS
===================================================== */

$("#form-cadastro").addEventListener(
  "submit",
  gravarCadastro
);

$("#cancelar-modal").addEventListener(
  "click",
  fecharModal
);

$("#modal-cadastro").addEventListener(
  "close",
  () => {
    edicao = null;
  }
);

/* =====================================================
   23 — EVENTOS DA CENTRAL DE CONCURSOS
===================================================== */

$("#active-contest").addEventListener(
  "change",
  evento => {
    const anterior = dados.concursoSelecionado;

    dados.concursoSelecionado =
      evento.target.value;

    if (!salvar()) {
      dados.concursoSelecionado = anterior;
    }

    atualizarIndicadores();
  }
);

/* =====================================================
   24 — EVENTOS DE VINCULAÇÃO
===================================================== */

$("#btn-vincular-conteudo").addEventListener(
  "click",
  abrirVinculacao
);

/* =====================================================
   25 — EVENTOS DO CONTROLE GERAL
===================================================== */

$("#btn-plataforma").addEventListener(
  "click",
  () => abrirCadastro("plataformas")
);

$("#btn-aula").addEventListener(
  "click",
  () => abrirCadastro("aulas")
);

/* =====================================================
   26 — EVENTOS DOS FILTROS
===================================================== */

$("#filtro-concurso").addEventListener(
  "change",
  () => {
    atualizarFiltros();
    renderizarProgressoAulas();
  }
);

$("#filtro-cargo").addEventListener(
  "change",
  renderizarProgressoAulas
);

$("#filtro-plataforma").addEventListener(
  "change",
  renderizarProgressoAulas
);

$("#pesquisa-aulas").addEventListener(
  "input",
  renderizarProgressoAulas
);

/* =====================================================
   27 — EXPORTAR BACKUP
===================================================== */

function exportarBackup() {
  const conteudo = JSON.stringify(
    dados,
    null,
    2
  );

  const arquivo = new Blob(
    [conteudo],
    { type: "application/json;charset=utf-8" }
  );

  const url = URL.createObjectURL(arquivo);

  const link = document.createElement("a");

  link.href = url;

  const data = new Date()
    .toISOString()
    .slice(0, 10);

  link.download =
    `marcio360-backup-${data}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

$("#btn-backup").addEventListener(
  "click",
  exportarBackup
);

/* =====================================================
   28 — INICIALIZAÇÃO
===================================================== */

function iniciarSistema() {
  renderizar();

  $("#situacao").textContent =
    "● Sistema pronto";
}

iniciarSistema();

/* =====================================================
   FIM DO ARQUIVO SCRIPT.JS
   MÁRCIO EDUCA 360 — CONCURSOS PRO
===================================================== */
