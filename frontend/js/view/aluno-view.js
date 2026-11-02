/*
 * VIEW DE ALUNOS – VERSÃO COM DOM
 *
 * Esta View é responsável por:
 * – localizar elementos HTML;
 * – ler os campos do formulário;
 * – observar o evento submit;
 * – apresentar mensagens;
 * – montar a tabela;
 * – apresentar o JSON.
*/
const AlunoView = {

    /*
     * Objeto que armazenará referências aos elementos HTML.
     *
     * Isso evita repetir document.getElementById()
     * várias vezes durante a execução.
     */
    elementos: {},

    /*
     * Localiza e armazena os elementos da página.
     *
     * Este método deve ser executado antes dos demais.
     */
inicializar() {
        AlunoView.elementos.formulario =
            document.getElementById("form-aluno");

        AlunoView.elementos.ra =
            document.getElementById("ra");

        AlunoView.elementos.nome =
            document.getElementById("nome");

        AlunoView.elementos.email =
            document.getElementById("email");

        AlunoView.elementos.curso =
            document.getElementById("curso");

        AlunoView.elementos.turma =
            document.getElementById("turma");

        AlunoView.elementos.mensagem =
            document.getElementById("mensagem");

        AlunoView.elementos.corpoTabela =
            document.getElementById("corpo-tabela-alunos");

        AlunoView.elementos.totalAlunos =
            document.getElementById("total-alunos");

        AlunoView.elementos.saidaJson =
            document.getElementById("saida-json");
    },

    /*
     * Registra uma função que será executada quando
     * o formulário for enviado.
     *
     * O parâmetro aoEnviar é uma função recebida
     * do Controller.
     */
    configurarFormulario(aoEnviar) {
        AlunoView.elementos.formulario.addEventListener(
            "submit",
            function (evento) {
                /*
                 * Impede o comportamento padrão do formulário,
                 * que seria recarregar a página.
                 */
                evento.preventDefault();

                /*
                 * Lê os valores atuais do formulário.
                 */
                const dados = AlunoView.lerDados();

                /*
                 * Envia os dados para a função fornecida
                 * pelo Controller.
                 */
                aoEnviar(dados);
            }
        );
    },

    /*
     * Lê a propriedade value de cada campo.
     *
     * A View apenas coleta os valores.
     * A normalização e a validação pertencem ao Model.
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
     * Apresenta uma mensagem de sucesso.
     */
    exibirSucesso(mensagem) {
        AlunoView.elementos.mensagem.textContent = mensagem;

        /*
         * Define as classes utilizadas pelo CSS.
         */
        AlunoView.elementos.mensagem.className =
            "mensagem sucesso";
    },

    /*
     * Apresenta uma mensagem de erro.
     */
    exibirErro(mensagem) {
        AlunoView.elementos.mensagem.textContent = mensagem;

        AlunoView.elementos.mensagem.className =
            "mensagem erro";
    },

    /*
     * Limpa os campos depois de um cadastro bem-sucedido.
     */
    limparFormulario() {
        AlunoView.elementos.formulario.reset();

        /*
         * Devolve o foco ao campo RA para facilitar
         * o próximo cadastro.
         */
        AlunoView.elementos.ra.focus();
    },

    /*
     * Apresenta a lista de alunos na tabela.
     */
    exibirLista(alunos) {
        const corpoTabela = AlunoView.elementos.corpoTabela;

        /*
         * Remove as linhas apresentadas anteriormente.
         */
        corpoTabela.textContent = "";

        /*
         * Atualiza a quantidade de alunos.
         */
        AlunoView.elementos.totalAlunos.textContent =
            `Total: ${alunos.length}`;

        /*
         * Se não houver alunos, cria uma linha informativa.
         */
        if (alunos.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");

            celula.colSpan = 7;
            celula.textContent = "Nenhum aluno foi cadastrado.";

            linha.appendChild(celula);
            corpoTabela.appendChild(linha);

            return;
        }

        /*
         * Percorre o array e cria uma linha para cada aluno.
         */
        alunos.forEach(function (aluno) {
            const linha = document.createElement("tr");

            /*
             * Organiza os valores na mesma ordem
             * das colunas existentes no HTML.
             */
            const valores = [
                aluno.id,
                aluno.ra,
                aluno.nome,
                aluno.email,
                aluno.curso,
                aluno.turma,

                /*
                 * Operador ternário:
                 * – se ativo for true, apresenta "Ativo";
                 * – caso contrário, apresenta "Inativo".
                 */
                aluno.ativo ? "Ativo" : "Inativo"
            ];

            /*
             * Cria uma célula para cada valor.
             */
            valores.forEach(function (valor) {
                const celula = document.createElement("td");

                /*
                 * textContent insere o valor como texto.
                 *
                 * Não utilizamos innerHTML com dados fornecidos
                 * pelo usuário.
                 */
                celula.textContent = valor;

                linha.appendChild(celula);
            });

            corpoTabela.appendChild(linha);
        });
    },

    /*
     * Apresenta o texto JSON dentro da tag pre.
     */
    exibirJson(textoJson) {
        AlunoView.elementos.saidaJson.textContent = textoJson;
    }
};