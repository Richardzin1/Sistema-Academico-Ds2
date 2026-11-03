/*
 * A View é responsável pela interface.
 *
 * Ela lê o formulário, apresenta mensagens,
 * atualiza a tabela e exibe o JSON.
 */
const AlunoView = {
    /*
     * Armazena referências aos elementos HTML.
     */
    elementos: {},

    /*
     * Localiza os elementos da página.
     *
     * Este método deve ser executado somente
     * depois que o HTML estiver carregado.
     */
    iniciar() {
        AlunoView.elementos.formulario =
            document.querySelector("#form-aluno");

        AlunoView.elementos.ra =
            document.querySelector("#ra");

        AlunoView.elementos.nome =
            document.querySelector("#nome");

        AlunoView.elementos.email =
            document.querySelector("#email");

        AlunoView.elementos.curso =
            document.querySelector("#curso");

        AlunoView.elementos.turma =
            document.querySelector("#turma");

        AlunoView.elementos.mensagem =
            document.querySelector("#mensagem");

        AlunoView.elementos.corpoTabela =
            document.querySelector("#corpo-tabela-alunos");

        AlunoView.elementos.saidaJson =
            document.querySelector("#saida-json");

        AlunoView.elementos.botaoSalvar =
            document.querySelector("#botao-salvar");
    },

    /*
     * Registra a função que será executada
     * quando o formulário for enviado.
     */
    configurarFormulario(aoEnviar) {
        AlunoView.elementos.formulario.addEventListener(
            "submit",
            aoEnviar
        );
    },

    /*
     * Lê os valores digitados no formulário.
     */
    lerDados() {
        return {
            ra: AlunoView.elementos.ra.value,
            nome: AlunoView.elementos.nome.value,
            email: AlunoView.elementos.email.value,
            curso: AlunoView.elementos.curso.value,
            turma: AlunoView.elementos.turma.value
        };
    },

    /*
     * Apresenta uma mensagem na interface.
     *
     * O tipo pode ser:
     *
     * – sucesso;
     * – erro;
     * – informacao.
     */
    exibirMensagem(mensagem, tipo) {
        AlunoView.elementos.mensagem.textContent = mensagem;

        AlunoView.elementos.mensagem.className =
            `mensagem ${tipo}`;
    },

    /*
     * Cria uma célula da tabela.
     *
     * textContent é utilizado para inserir o texto
     * de forma segura, sem interpretá-lo como HTML.
     */
    criarCelula(valor) {
        const celula = document.createElement("td");

        celula.textContent = valor;

        return celula;
    },

    /*
     * Exibe a lista de alunos na tabela.
     */
    exibirLista(alunos) {
        /*
         * Remove as linhas exibidas anteriormente.
         */
        AlunoView.elementos.corpoTabela.innerHTML = "";

        /*
         * Se o array estiver vazio, cria uma linha
         * informando que não existem alunos.
         */
        if (alunos.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");

            celula.colSpan = 7;
            celula.textContent =
                "Nenhum aluno foi cadastrado.";

            linha.appendChild(celula);

            AlunoView.elementos.corpoTabela.appendChild(
                linha
            );

            return;
        }

        /*
         * Cria uma linha para cada aluno recebido.
         */
        alunos.forEach(aluno => {
            const linha = document.createElement("tr");

            linha.appendChild(
                AlunoView.criarCelula(aluno.id)
            );

            linha.appendChild(
                AlunoView.criarCelula(aluno.ra)
            );

            linha.appendChild(
                AlunoView.criarCelula(aluno.nome)
            );

            linha.appendChild(
                AlunoView.criarCelula(aluno.email)
            );

            linha.appendChild(
                AlunoView.criarCelula(aluno.curso)
            );

            linha.appendChild(
                AlunoView.criarCelula(aluno.turma)
            );

            linha.appendChild(
                AlunoView.criarCelula(
                    aluno.ativo ? "Sim" : "Não"
                )
            );

            AlunoView.elementos.corpoTabela.appendChild(
                linha
            );
        });
    },

    /*
     * Exibe os alunos no formato JSON.
     */
    exibirJson(alunos) {
        AlunoView.elementos.saidaJson.textContent =
            JSON.stringify(alunos, null, 2);
    },

    /*
     * Limpa os campos depois de um cadastro.
     */
    limparFormulario() {
        AlunoView.elementos.formulario.reset();

        /*
         * Devolve o foco para o campo RA.
         */
        AlunoView.elementos.ra.focus();
    },

    /*
     * Altera o estado do formulário durante
     * uma operação assíncrona.
     */
    alterarEstadoFormulario(processando) {
        /*
         * Impede vários envios enquanto a requisição
         * estiver em andamento.
         */
        AlunoView.elementos.botaoSalvar.disabled =
            processando;
    }
};
/*
 * O Controller coordena:
 *
 * – Model;
 * – View;
 * – Service.
 */
const AlunoController = {
    /*
     * Inicializa a aplicação.
     *
     * A função é assíncrona porque, ao abrir a página,
     * consultaremos os alunos no backend.
     */
    async iniciar() {
        /*
         * Localiza os elementos HTML.
         */
        AlunoView.iniciar();

        /*
         * Configura o evento de envio do formulário.
         */
        AlunoView.configurarFormulario(
            AlunoController.cadastrar
        );

        /*
         * Informa que os dados estão sendo carregados.
         */
        AlunoView.exibirMensagem(
            "Carregando alunos...",
            "informacao"
        );

        try {
            /*
             * Consulta os alunos existentes no servidor.
             */
            await AlunoController.atualizarVisualizacao();

            AlunoView.exibirMensagem(
                "Dados carregados com sucesso.",
                "sucesso"
            );
        } catch (erro) {
            AlunoView.exibirMensagem(
                erro.message,
                "erro"
            );
        }
    },

    /*
     * Executa o cadastro do aluno.
     */
    async cadastrar(evento) {
        /*
         * Evita o recarregamento da página.
         */
        evento.preventDefault();

        /*
         * Solicita à View os valores do formulário.
         */
        const dadosInformados = AlunoView.lerDados();

        /*
         * Encaminha os dados para a validação inicial.
         */
        const validacao = AlunoModel.validar(
            dadosInformados
        );

        /*
         * Interrompe o processo caso a validação
         * do frontend encontre um problema.
         */
        if (!validacao.sucesso) {
            AlunoView.exibirMensagem(
                validacao.mensagem,
                "erro"
            );

            return;
        }

        /*
         * Desabilita temporariamente o botão.
         */
        AlunoView.alterarEstadoFormulario(true);

        AlunoView.exibirMensagem(
            "Enviando dados para o servidor...",
            "informacao"
        );

        try {
            /*
             * Envia o aluno para o backend.
             */
            const resultado =
                await AlunoService.cadastrar(
                    validacao.dados
                );

            /*
             * Consulta novamente a lista do servidor.
             */
            await AlunoController.atualizarVisualizacao();

            /*
             * Limpa o formulário depois do sucesso.
             */
            AlunoView.limparFormulario();

            /*
             * Apresenta a mensagem devolvida pela API.
             */
            AlunoView.exibirMensagem(
                resultado.mensagem,
                "sucesso"
            );
        } catch (erro) {
            /*
             * Apresenta erros de validação da API,
             * RA duplicado ou falha de conexão.
             */
            AlunoView.exibirMensagem(
                erro.message,
                "erro"
            );
        } finally {
            /*
             * O bloco finally sempre será executado,
             * independentemente do sucesso ou do erro.
             */
            AlunoView.alterarEstadoFormulario(false);
        }
    },

    /*
     * Consulta os alunos na API e atualiza a View.
     */
    async atualizarVisualizacao() {
        /*
         * Aguarda o Service consultar o backend.
         */
        const alunos = await AlunoService.listar();

        /*
         * Atualiza a tabela.
         */
        AlunoView.exibirLista(alunos);

        /*
         * Atualiza a apresentação em JSON.
         */
        AlunoView.exibirJson(alunos);
    }
};

/*
 * Inicia a aplicação.
 */
AlunoController.iniciar();