/* =====================================================
   MÁRCIO EDUCA 360 — CONCURSOS PRO
   ARQUIVO ÚNICO DE CONTROLE: dados.js
   Tudo que você adicionar, editar ou excluir aqui
   atualiza automaticamente na tela do site!
===================================================== */

"use strict";

window.MARCIO_DADOS = {
  // 1. BANCAS
  bancas: [
    { id: "banca-001", nome: "IACP" }
  ],

  // 2. CONCURSOS
  concursos: [
    {
      id: "concurso-001",
      nome: "CONCURSO DE SÃO PAULO",
      bancaId: "banca-001",
      ativo: true
    },
    {
      id: "concurso-002",
      nome: "CONCURSO DO RIO DE JANEIRO",
      bancaId: "banca-001",
      ativo: true
    }
  ],

  // 3. CARGOS
  cargos: [
    {
      id: "cargo-001",
      concursoId: "concurso-001",
      nome: "AGENTE ADMINISTRATIVO"
    }
  ],

  // 4. DISCIPLINAS
  disciplinas: [
    { id: "disc-001", nome: "MATEMÁTICA" },
    { id: "disc-002", nome: "PORTUGUÊS" },
    { id: "disc-003", nome: "ADMINISTRAÇÃO PÚBLICA" }
  ],

  // 5. CONTEÚDOS (BIBLIOTECA PERMANENTE)
  conteudos: [
    { id: "cont-001", disciplinaId: "disc-001", nome: "PROGRESSÃO ARITMÉTICA" },
    { id: "cont-002", disciplinaId: "disc-002", nome: "INTERPRETAÇÃO DE TEXTO" },
    { id: "cont-003", disciplinaId: "disc-003", nome: "PRINCÍPIOS DA ADMINISTRAÇÃO" }
  ],

  // 6. VÍNCULOS (CONTEÚDOS DOS CARGOS)
  vinculos: [
    { id: "vinc-001", cargoId: "cargo-001", conteudoId: "cont-001" },
    { id: "vinc-002", cargoId: "cargo-001", conteudoId: "cont-002" },
    { id: "vinc-003", cargoId: "cargo-001", conteudoId: "cont-003" }
  ],

  // 7. PLATAFORMAS
  plataformas: [
    { id: "plat-001", nome: "ONEDRIVE — MATERIAIS E VÍDEOS" }
  ],

  // 8. AULAS POR PARTES (COM LINKS DO ONEDRIVE: PDF, VÍDEO E IMAGEM)
  aulas: [
    {
      id: "aula-001",
      vinculoId: "vinc-001",
      plataformaId: "plat-001",
      nome: "AULA 01 — PROGRESSÃO ARITMÉTICA",
      questoesTotal: 20,
      questoesAcertos: 16,
      partes: [
        {
          numero: 1,
          titulo: "Parte 01 — Apostila Completa em PDF",
          concluida: false,
          pdfLink: "https://1drv.ms/b/c/4d7d1f2d1eb8f266/IQAv_S4EPbbkSLGMnM9Tkut9AfuqBPUFy19M6vpOGWGEAZY?e=eOSwvp",
          videoLink: "",
          imagemLink: ""
        },
        {
          numero: 2,
          titulo: "Parte 02 — Exercícios Resolvidos",
          concluida: false,
          pdfLink: "",
          videoLink: "",
          imagemLink: ""
        }
      ]
    },
    {
      id: "aula-002",
      vinculoId: "vinc-002",
      plataformaId: "plat-001",
      nome: "AULA 02 — INTERPRETAÇÃO DE TEXTO",
      questoesTotal: 15,
      questoesAcertos: 12,
      partes: [
        {
          numero: 1,
          titulo: "Parte 01 — Videoaula Explicativa",
          concluida: false,
          pdfLink: "",
          videoLink: "https://1drv.ms/v/c/4d7d1f2d1eb8f266/IQBYpMYxUpY3QZzLm-yPMvh3AX9Gb6V2G3c5zF8WdVGghlk?e=FIFsu0",
          imagemLink: ""
        }
      ]
    },
    {
      id: "aula-003",
      vinculoId: "vinc-003",
      plataformaId: "plat-001",
      nome: "AULA 03 — PRINCÍPIOS DA ADMINISTRAÇÃO",
      questoesTotal: 10,
      questoesAcertos: 9,
      partes: [
        {
          numero: 1,
          titulo: "Parte 01 — Videoaula LIMPE",
          concluida: false,
          pdfLink: "",
          videoLink: "https://1drv.ms/v/c/4d7d1f2d1eb8f266/IQBYpMYxUpY3QZzLm-yPMvh3AX9Gb6V2G3c5zF8WdVGghlk?e=FIFsu0",
          imagemLink: ""
        }
      ]
    }
  ],

  concursoSelecionado: "concurso-001"
};
