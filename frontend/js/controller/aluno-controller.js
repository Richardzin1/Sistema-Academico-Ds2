/*
 * CONTROLLER DE ALUNOS – VERSÃO COM DOM
 *
 * O Controller:
 * – inicia a aplicação;
 * – conecta o formulário à operação de cadastro;
 * – envia os dados ao Model;
 * – analisa o resultado;
 * – solicita a atualização da View.
 */
const AlunoController = {

    /*
     * Inicia a aplicação.
     */
    iniciar() {

        /*
         * Solicita que a View localize os elementos HTML.
         */
        AlunoView.inicializar();

        /*
         * Entrega uma função para a View executar
         * quando o formulário for enviado.
         */
        AlunoView.configurarFormulario(
            function (dados) {
                AlunoController.cadastrar(dados);
            }
        );

        /*
         * Apresenta o estado inicial da aplicação.
         *
         * Como ainda não existem alunos, a tabela mostrará
         * a mensagem "Nenhum aluno foi cadastrado".
         */
        AlunoController.atualizarVisualizacao();

    },

    /*
     * Coordena o cadastro de um aluno.
     */
    cadastrar(dados) {

        /*
         * Envia os dados para o Model.
         */
        const resultado = AlunoModel.cadastrar(dados);

        /*
         * Se o Model identificar algum problema,
         * apresenta o erro e encerra este método.
         */
        if (!resultado.sucesso) {
            AlunoView.exibirErro(resultado.mensagem);
            return;
        }

        /*
         * Apresenta a confirmação do cadastro.
         */
        AlunoView.exibirSucesso(
            `Aluno ${resultado.aluno.nome} cadastrado com sucesso.`
        );

        /*
         * Limpa o formulário.
         */
        AlunoView.limparFormulario();

        /*
         * Atualiza a tabela e o JSON.
         */
        AlunoController.atualizarVisualizacao();

    },

    /*
     * Atualiza todas as representações da lista de alunos.
     */
    atualizarVisualizacao() {

        /*
         * Solicita ao Model a lista atual.
         */
        const alunos = AlunoModel.listar();

        /*
         * Solicita que a View monte a tabela.
         */
        AlunoView.exibirLista(alunos);

        /*
         * Converte o array para texto JSON formatado.
         */
        const textoJson = JSON.stringify(alunos, null, 2);

        /*
         * Solicita que a View apresente o JSON.
         */
        AlunoView.exibirJson(textoJson);

    }
};

/*
 * Inicia a aplicação depois que os scripts forem carregados.
 */
AlunoController.iniciar();