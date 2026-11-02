const AlunoModel = {
  alunos: [],

  normalizarTexto(valor) {
    if (valor === null || valor === undefined) {
      return "";
    }
    return String(valor).trim();
  },

  ValidarEmail(email) {
    return email.includes("@") && email.includes(".");
  },

  localizarPorRa(ra) {
    return AlunoModel.alunos.find((aluno) => aluno.ra === ra);
  },

  cadastrar(dados) {
    const ra = AlunoModel.normalizarTexto(dados.ra);
    const nome = AlunoModel.normalizarTexto(dados.nome);
    const email = AlunoModel.normalizarTexto(dados.email);
    const curso = AlunoModel.normalizarTexto(dados.curso);
    const turma = AlunoModel.normalizarTexto(dados.turma);

    if (
      ra === "" ||
      email === "" ||
      nome === "" ||
      curso === "" ||
      turma === ""
    ) {
      return {
        sucesso: false,
        mensagem: "Todos os campos são obrigatórios.",
      };
    }

    if (!AlunoModel.ValidarEmail(email)) {
      return {
        sucesso: false,
        mensagem: "Informe um email válido.",
      };
    }

    if (AlunoModel.localizarPorRa(ra)) {
      return { sucesso: false, mensagem: " Já existe um aluno com esse RA." };
    }

    const aluno = {
      id: AlunoModel.alunos.length + 1,
      ra: ra,
      nome: nome,
      email: email,
      curso: curso,
      turma: turma,

      ativo: true,
    };
    AlunoModel.alunos.push(aluno);

    return {
      sucesso: true,
      aluno: aluno,
    };
  },

  listar() {
    return [...AlunoModel.alunos];
  },
};
