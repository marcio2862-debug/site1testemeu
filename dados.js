
/* =====================================================
   MÁRCIO EDUCA 360 — CONCURSOS PRO
   ARQUIVO: dados.js
   VERSÃO CONSOLIDADA — ETAPAS 01 A 05
===================================================== */

"use strict";

/* =====================================================
   BASE INICIAL DO SISTEMA
===================================================== */

window.MARCIO_DADOS = {

  /* ===================================================
     01 — BANCAS ORGANIZADORAS
  =================================================== */

  bancas: [
    {
      id: "banca-001",
      nome: "IACP"
    }
  ],

  /* ===================================================
     02 — CONCURSOS PÚBLICOS
  =================================================== */

  concursos: [
    {
      id: "concurso-001",
      nome: "CONCURSO DE EXEMPLO",
      bancaId: "banca-001",
      ativo: true
    }
  ],

  /* ===================================================
     03 — CARGOS DOS CONCURSOS

     Cada cargo pertence a um concurso.

     Estrutura:
     {
       id: "cargo-001",
       nome: "PROFESSOR DE MATEMÁTICA",
       concursoId: "concurso-001"
     }
  =================================================== */

  cargos: [],

  /* ===================================================
     04 — BIBLIOTECA DE DISCIPLINAS

     As disciplinas são cadastradas uma única vez
     na Biblioteca Permanente.
  =================================================== */

  disciplinas: [
    {
      id: "disciplina-001",
      nome: "MATEMÁTICA"
    }
  ],

  /* ===================================================
     05 — BIBLIOTECA DE CONTEÚDOS

     Cada conteúdo pertence a uma disciplina.
  =================================================== */

  conteudos: [
    {
      id: "conteudo-001",
      disciplinaId: "disciplina-001",
      nome: "PROGRESSÃO ARITMÉTICA"
    }
  ],

  /* ===================================================
     06 — VÍNCULOS ENTRE CARGOS E CONTEÚDOS

     O mesmo conteúdo pode ser vinculado a cargos
     diferentes, sem duplicar seu cadastro.

     Estrutura:
     {
       id: "vinculo-001",
       cargoId: "cargo-001",
       conteudoId: "conteudo-001"
     }
  =================================================== */

  vinculos: [],

  /* ===================================================
     07 — PLATAFORMAS DE ESTUDOS

     Exemplos de plataformas:
     - Gran Cursos
     - Estratégia Concursos
     - YouTube
     - Material próprio

     Os nomes serão cadastrados pelo sistema.

     Estrutura:
     {
       id: "plataforma-001",
       nome: "PLATAFORMA DE EXEMPLO"
     }
  =================================================== */

  plataformas: [],

  /* ===================================================
     08 — AULAS E CONTROLE DE TEORIA

     Cada aula pertence a um vínculo de conteúdo
     com cargo e a uma plataforma de estudos.

     Estrutura:
     {
       id: "aula-001",
       vinculoId: "vinculo-001",
       plataformaId: "plataforma-001",
       nome: "AULA 01 — INTRODUÇÃO",
       totalPartes: 3,
       partesConcluidas: 0
     }

     totalPartes:
       Quantidade total de partes da teoria.

     partesConcluidas:
       Quantidade de partes já estudadas.
  =================================================== */

  aulas: [],

  /* ===================================================
     09 — QUESTÕES

     Estrutura reservada para a próxima etapa:
     Controle de Questões.

     Os registros serão implementados na Etapa 06.
  =================================================== */

  questoes: [],

  /* ===================================================
     10 — REVISÕES

     Estrutura reservada para o controle de revisões.

     Programação prevista:
     +1 dia, +7 dias, +15 dias e +30 dias.
  =================================================== */

  revisoes: [],

  /* ===================================================
     11 — CADERNO DE ERROS

     Estrutura reservada para registrar questões
     efetivamente respondidas de forma incorreta.
  =================================================== */

  erros: [],

  /* ===================================================
     12 — CONCURSO SELECIONADO

     Guarda o identificador do concurso inicialmente
     selecionado na Central de Concursos.
  =================================================== */

  concursoSelecionado: "concurso-001"

};

/* =====================================================
   FIM DO ARQUIVO DADOS.JS
   MÁRCIO EDUCA 360 — CONCURSOS PRO
===================================================== */
