/* =====================================================
   MÁRCIO EDUCA 360 — ARQUIVO ÚNICO DE LINKS E DADOS (dados.js)
   Tudo funciona por links do OneDrive (PDF A4, Vídeos e Imagens).
   Basta colar seus links entre as aspas "" e salvar!
===================================================== */

"use strict";

window.MARCIO_DADOS = {
  // 1. BANCAS ORGANIZADORAS (COM CORES DOS CARDS DA PÁGINA QUESTÕES POR BANCAS)
  bancas: [
    { id: "cebraspe", nome: "CEBRASPE", cor: "card-blue" },
    { id: "fcc", nome: "FCC", cor: "card-purple" },
    { id: "fgv", nome: "FGV", cor: "card-green" },
    { id: "vunesp", nome: "VUNESP", cor: "card-red" },
    { id: "ibfc", nome: "IBFC", cor: "card-blue" },
    { id: "aocp", nome: "AOCP", cor: "card-blue" },
    { id: "consulplan", nome: "Instituto Consulplan", cor: "card-purple" },
    { id: "iacp", nome: "IACP", cor: "card-green" }
  ],

  // 2. CONCURSOS E CARGOS (PARA A ABA CONCURSOS)
  concursos: [
    { id: "conc-01", nome: "CONCURSO DE SÃO PAULO", bancaId: "iacp", ativo: true },
    { id: "conc-02", nome: "CONCURSO DO RIO DE JANEIRO", bancaId: "cebraspe", ativo: true }
  ],

  cargos: [
    { id: "cargo-01", concursoId: "conc-01", nome: "AGENTE ADMINISTRATIVO" },
    { id: "cargo-02", concursoId: "conc-01", nome: "PROFESSOR DE MATEMÁTICA" }
  ],

  /* ===================================================
     3. CONTEÚDOS POR ÁREA (COM AS 3 ETAPAS DE CADA AULA)
     Cada conteúdo tem:
       - area: "fundamental-2" | "ensino-medio" | "matematica-basica" | "matematica-especifica"
       - subnivel: "6-ano" | "7-ano" | "8-ano" | "9-ano" | "1-serie" | "2-serie" | "3-serie" | ""
       - etapa1: IMAGEM 01 — DEFINIÇÕES E EXEMPLOS (PDF A4 / Imagem)
       - etapa2: IMAGEM 02 — EXERCÍCIOS (PDF A4 sem gabarito)
       - etapa3: IMAGEM 03 — RESOLUÇÕES DO PROFESSOR (PDF A4 ou Vídeo OneDrive)
  =================================================== */
  conteudos: [
    // --- MATEMÁTICA BÁSICA PARA CONCURSOS (CARD 3) ---
    {
      id: "mb-01",
      area: "matematica-basica",
      subnivel: "",
      categoriaTitulo: "Matemática Básica",
      titulo: "Conteúdo 01 — Progressão Aritmética (P.A.)",
      questoesTotal: 20,
      questoesAcertos: 16,
      etapa1: {
        titulo: "IMAGEM 01 — DEFINIÇÕES E EXEMPLOS",
        descricao: "Conceitos, propriedades, fórmulas e exemplos resolvidos",
        link: "https://1drv.ms/b/c/4d7d1f2d1eb8f266/IQAv_S4EPbbkSLGMnM9Tkut9AfuqBPUFy19M6vpOGWGEAZY?e=eOSwvp"
      },
      etapa2: {
        titulo: "IMAGEM 02 — EXERCÍCIOS",
        descricao: "Questões abertas e numeradas, sem gabarito",
        link: "" // Cole aqui o link do PDF A4 de Exercícios quando estiver pronto
      },
      etapa3: {
        titulo: "IMAGEM 03 — RESOLUÇÕES DO PROFESSOR",
        descricao: "Resoluções detalhadas passo a passo",
        link: "https://1drv.ms/v/c/4d7d1f2d1eb8f266/IQBYpMYxUpY3QZzLm-yPMvh3AX9Gb6V2G3c5zF8WdVGghlk?e=FIFsu0"
      }
    },
    {
      id: "mb-02",
      area: "matematica-basica",
      subnivel: "",
      categoriaTitulo: "Matemática Básica",
      titulo: "Conteúdo 02 — Porcentagem e Regra de Três",
      questoesTotal: 15,
      questoesAcertos: 12,
      etapa1: {
        titulo: "IMAGEM 01 — DEFINIÇÕES E EXEMPLOS",
        descricao: "Conceitos, propriedades, fórmulas e exemplos resolvidos",
        link: ""
      },
      etapa2: {
        titulo: "IMAGEM 02 — EXERCÍCIOS",
        descricao: "Questões abertas e numeradas, sem gabarito",
        link: ""
      },
      etapa3: {
        titulo: "IMAGEM 03 — RESOLUÇÕES DO PROFESSOR",
        descricao: "Resoluções detalhadas após autorização",
        link: ""
      }
    },

    // --- MATEMÁTICA ESPECÍFICA PARA PROFESSOR (CARD 4) ---
    {
      id: "me-01",
      area: "matematica-especifica",
      subnivel: "",
      categoriaTitulo: "Conhecimentos Específicos de Matemática",
      titulo: "Conteúdo 01 — Análise Combinatória e Probabilidade",
      questoesTotal: 10,
      questoesAcertos: 9,
      etapa1: {
        titulo: "IMAGEM 01 — DEFINIÇÕES E EXEMPLOS",
        descricao: "Conceitos, propriedades, fórmulas e exemplos resolvidos",
        link: "https://1drv.ms/b/c/4d7d1f2d1eb8f266/IQAv_S4EPbbkSLGMnM9Tkut9AfuqBPUFy19M6vpOGWGEAZY?e=eOSwvp"
      },
      etapa2: {
        titulo: "IMAGEM 02 — EXERCÍCIOS",
        descricao: "Questões abertas e numeradas, sem gabarito",
        link: ""
      },
      etapa3: {
        titulo: "IMAGEM 03 — RESOLUÇÕES DO PROFESSOR",
        descricao: "Resoluções detalhadas passo a passo",
        link: ""
      }
    },

    // --- ENSINO FUNDAMENTAL II (CARD 1: 6º AO 9º ANO) ---
    {
      id: "ef-6-01",
      area: "fundamental-2",
      subnivel: "6-ano",
      categoriaTitulo: "6º Ano — Ensino Fundamental II",
      titulo: "Conteúdo 01 — Números Naturais, Frações e Decimais",
      questoesTotal: 0,
      questoesAcertos: 0,
      etapa1: {
        titulo: "IMAGEM 01 — DEFINIÇÕES E EXEMPLOS",
        descricao: "Conceitos, propriedades, fórmulas e exemplos resolvidos",
        link: "https://1drv.ms/b/c/4d7d1f2d1eb8f266/IQAv_S4EPbbkSLGMnM9Tkut9AfuqBPUFy19M6vpOGWGEAZY?e=eOSwvp"
      },
      etapa2: {
        titulo: "IMAGEM 02 — EXERCÍCIOS",
        descricao: "Questões abertas e numeradas, sem gabarito",
        link: ""
      },
      etapa3: {
        titulo: "IMAGEM 03 — RESOLUÇÕES DO PROFESSOR",
        descricao: "Resoluções detalhadas passo a passo",
        link: ""
      }
    },
    {
      id: "ef-7-01",
      area: "fundamental-2",
      subnivel: "7-ano",
      categoriaTitulo: "7º Ano — Ensino Fundamental II",
      titulo: "Conteúdo 01 — Números Inteiros e Equações do 1º Grau",
      questoesTotal: 0,
      questoesAcertos: 0,
      etapa1: {
        titulo: "IMAGEM 01 — DEFINIÇÕES E EXEMPLOS",
        descricao: "Conceitos, propriedades, fórmulas e exemplos resolvidos",
        link: ""
      },
      etapa2: {
        titulo: "IMAGEM 02 — EXERCÍCIOS",
        descricao: "Questões abertas e numeradas, sem gabarito",
        link: ""
      },
      etapa3: {
        titulo: "IMAGEM 03 — RESOLUÇÕES DO PROFESSOR",
        descricao: "Resoluções detalhadas passo a passo",
        link: ""
      }
    },
    {
      id: "ef-8-01",
      area: "fundamental-2",
      subnivel: "8-ano",
      categoriaTitulo: "8º Ano — Ensino Fundamental II",
      titulo: "Conteúdo 01 — Produtos Notáveis, Fatoração e Geometria Plana",
      questoesTotal: 0,
      questoesAcertos: 0,
      etapa1: {
        titulo: "IMAGEM 01 — DEFINIÇÕES E EXEMPLOS",
        descricao: "Conceitos, propriedades, fórmulas e exemplos resolvidos",
        link: ""
      },
      etapa2: {
        titulo: "IMAGEM 02 — EXERCÍCIOS",
        descricao: "Questões abertas e numeradas, sem gabarito",
        link: ""
      },
      etapa3: {
        titulo: "IMAGEM 03 — RESOLUÇÕES DO PROFESSOR",
        descricao: "Resoluções detalhadas passo a passo",
        link: ""
      }
    },
    {
      id: "ef-9-01",
      area: "fundamental-2",
      subnivel: "9-ano",
      categoriaTitulo: "9º Ano — Ensino Fundamental II",
      titulo: "Conteúdo 01 — Equação do 2º Grau e Teorema de Pitágoras",
      questoesTotal: 0,
      questoesAcertos: 0,
      etapa1: {
        titulo: "IMAGEM 01 — DEFINIÇÕES E EXEMPLOS",
        descricao: "Conceitos, propriedades, fórmulas e exemplos resolvidos",
        link: ""
      },
      etapa2: {
        titulo: "IMAGEM 02 — EXERCÍCIOS",
        descricao: "Questões abertas e numeradas, sem gabarito",
        link: ""
      },
      etapa3: {
        titulo: "IMAGEM 03 — RESOLUÇÕES DO PROFESSOR",
        descricao: "Resoluções detalhadas passo a passo",
        link: ""
      }
    },

    // --- ENSINO MÉDIO (CARD 2: 1º AO 3º ANO) ---
    {
      id: "em-1-01",
      area: "ensino-medio",
      subnivel: "1-serie",
      categoriaTitulo: "1º Ano — Ensino Médio",
      titulo: "Conteúdo 01 — Conjuntos, Função Afim e Função Quadrática",
      questoesTotal: 0,
      questoesAcertos: 0,
      etapa1: {
        titulo: "IMAGEM 01 — DEFINIÇÕES E EXEMPLOS",
        descricao: "Conceitos, propriedades, fórmulas e exemplos resolvidos",
        link: ""
      },
      etapa2: {
        titulo: "IMAGEM 02 — EXERCÍCIOS",
        descricao: "Questões abertas e numeradas, sem gabarito",
        link: ""
      },
      etapa3: {
        titulo: "IMAGEM 03 — RESOLUÇÕES DO PROFESSOR",
        descricao: "Resoluções detalhadas passo a passo",
        link: "https://1drv.ms/v/c/4d7d1f2d1eb8f266/IQBYpMYxUpY3QZzLm-yPMvh3AX9Gb6V2G3c5zF8WdVGghlk?e=FIFsu0"
      }
    },
    {
      id: "em-2-01",
      area: "ensino-medio",
      subnivel: "2-serie",
      categoriaTitulo: "2º Ano — Ensino Médio",
      titulo: "Conteúdo 01 — Trigonometria, Matrizes e Sistemas Lineares",
      questoesTotal: 0,
      questoesAcertos: 0,
      etapa1: {
        titulo: "IMAGEM 01 — DEFINIÇÕES E EXEMPLOS",
        descricao: "Conceitos, propriedades, fórmulas e exemplos resolvidos",
        link: ""
      },
      etapa2: {
        titulo: "IMAGEM 02 — EXERCÍCIOS",
        descricao: "Questões abertas e numeradas, sem gabarito",
        link: ""
      },
      etapa3: {
        titulo: "IMAGEM 03 — RESOLUÇÕES DO PROFESSOR",
        descricao: "Resoluções detalhadas passo a passo",
        link: ""
      }
    },
    {
      id: "em-3-01",
      area: "ensino-medio",
      subnivel: "3-serie",
      categoriaTitulo: "3º Ano — Ensino Médio",
      titulo: "Conteúdo 01 — Geometria Analítica, Polinômios e Estatística",
      questoesTotal: 0,
      questoesAcertos: 0,
      etapa1: {
        titulo: "IMAGEM 01 — DEFINIÇÕES E EXEMPLOS",
        descricao: "Conceitos, propriedades, fórmulas e exemplos resolvidos",
        link: ""
      },
      etapa2: {
        titulo: "IMAGEM 02 — EXERCÍCIOS",
        descricao: "Questões abertas e numeradas, sem gabarito",
        link: ""
      },
      etapa3: {
        titulo: "IMAGEM 03 — RESOLUÇÕES DO PROFESSOR",
        descricao: "Resoluções detalhadas passo a passo",
        link: ""
      }
    }
  ],

  /* ===================================================
     4. CADERNOS DE QUESTÕES POR BANCAS (CARD 5)
  =================================================== */
  questoesPorBancas: [
    {
      id: "qb-01",
      bancaId: "iacp",
      titulo: "Caderno IACP — Matemática e Raciocínio Lógico",
      etapa1: {
        titulo: "CADERNO DE QUESTÕES (PDF A4)",
        descricao: "Questões selecionadas da banca IACP",
        link: "https://1drv.ms/b/c/4d7d1f2d1eb8f266/IQAv_S4EPbbkSLGMnM9Tkut9AfuqBPUFy19M6vpOGWGEAZY?e=eOSwvp"
      },
      etapa2: {
        titulo: "SIMULADO CRONOMETRADO",
        descricao: "Lista para treino sem consulta",
        link: ""
      },
      etapa3: {
        titulo: "RESOLUÇÃO COMENTADA EM VÍDEO",
        descricao: "Correção questão por questão pelo professor",
        link: "https://1drv.ms/v/c/4d7d1f2d1eb8f266/IQBYpMYxUpY3QZzLm-yPMvh3AX9Gb6V2G3c5zF8WdVGghlk?e=FIFsu0"
      }
    },
    {
      id: "qb-02",
      bancaId: "cebraspe",
      titulo: "Caderno CEBRASPE — Estilo Certo ou Errado",
      etapa1: {
        titulo: "CADERNO DE QUESTÕES (PDF A4)",
        descricao: "Itens estilo Cebraspe organizados por assunto",
        link: ""
      },
      etapa2: {
        titulo: "SIMULADO CRONOMETRADO",
        descricao: "Lista para treino sem consulta",
        link: ""
      },
      etapa3: {
        titulo: "RESOLUÇÃO COMENTADA",
        descricao: "Gabarito justificado pelo professor",
        link: ""
      }
    },
    {
      id: "qb-03",
      bancaId: "fgv",
      titulo: "Caderno FGV — Matemática e Raciocínio Lógico-Matemático",
      etapa1: {
        titulo: "CADERNO DE QUESTÕES (PDF A4)",
        descricao: "Questões recentes da Fundação Getulio Vargas",
        link: ""
      },
      etapa2: {
        titulo: "SIMULADO CRONOMETRADO",
        descricao: "Lista para treino sem consulta",
        link: ""
      },
      etapa3: {
        titulo: "RESOLUÇÃO COMENTADA",
        descricao: "Gabarito justificado pelo professor",
        link: ""
      }
    }
  ],

  concursoSelecionado: "conc-01"
};
