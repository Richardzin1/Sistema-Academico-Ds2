/*
 * Este array representa temporariamente
 * o armazenamento dos alunos.
 *
 * Ele está em memória, dentro do servidor.
 *
 * Quando o servidor for encerrado, todos os
 * alunos cadastrados serão apagados.
 *
 * Futuramente esse array será substituído
 * por uma tabela no banco de dados MySQL.
*/
const alunos = [];

/*
 * O AlunoModel representa o Model da arquitetura MVC.
 *
 * Suas responsabilidades são:
 *
 * – representar os dados dos alunos;
 * – normalizar os valores recebidos;
 * – validar as regras do cadastro;
 * – impedir RA duplicado;
 * – criar um novo aluno;
 * – fornecer a lista de alunos.
*/
const AlunoModel = {
    /*
     * Remove espaços extras do início e do final.
     *
     * También evita problemas quando o valor recebido
     * é null ou undefined.
     */
    normalizarTexto(valor) {
        /*
         * Verifica se o valor não foi informado.
         */
        if (valor === null || valor === undefined) {
            return "";
        }

        /*
         * String() converte o valor para texto.
         *
         * trim() remove os espaços do início e do final.
         */
        return String(valor).trim();
    },

    /*
     * Realiza uma validação simples do e-mail.
     *
     * Essa validação será melhorada em versões futuras.
     */
    validarEmail(email) {
        return email.includes("@") && email.includes(".");
    },

    /*
     * Procura um aluno pelo RA.
     *
     * find() percorre o array e devolve o primeiro
     * aluno que satisfizer a condição.
     *
     * Se nenhum aluno for encontrado, o resultado
     * será undefined.
     */
    localizarPorRa(ra) {
        return alunos.find(aluno => aluno.ra === ra);
    },

    /*
     * Gera o próximo identificador do aluno.
     *
     * Nesta versão, como ainda não existe banco de dados,
     * o identificador será calculado a partir do maior ID.
     */
    gerarProximoId() {
        /*
         * Se não existem alunos, o primeiro ID será 1.
         */
        if (alunos.length === 0) {
            return 1;
        }

        /*
         * map() cria um novo array contendo somente
         * os IDs dos alunos.
         */
        const ids = alunos.map(aluno => aluno.id);

        /*
         * Math.max() encontra o maior ID.
         *
         * O operador ... espalha os valores do array
         * como argumentos da função.
         */
        const maiorId = Math.max(...ids);

        /*
         * O próximo ID será o maior ID mais 1.
         */
        return maiorId + 1;
    },

    /*
     * Cadastra um novo aluno.
     *
     * O parâmetro dados deverá conter:
     *
     * – ra;
     * – nome;
     * – email;
     * – curso;
     * – turma.
     */
    cadastrar(dados) {
        /*
         * O operador ?. é chamado de encadeamento opcional.
         *
         * Ele evita um erro caso o objeto dados
         * não tenha sido informado.
         */
        const ra = AlunoModel.normalizarTexto(dados?.ra);
        const nome = AlunoModel.normalizarTexto(dados?.nome);
        const email = AlunoModel.normalizarTexto(dados?.email);
        const curso = AlunoModel.normalizarTexto(dados?.curso);
        const turma = AlunoModel.normalizarTexto(dados?.turma);

        /*
         * Valida se todos os campos obrigatórios
         * foram preenchidos.
         */
        if (
            ra === "" ||
            nome === "" ||
            email === "" ||
            curso === "" ||
            turma === ""
        ) {
            return {
                sucesso: false,
                status: 400,
                mensagem: "Todos os campos são obrigatórios."
            };
        }

        /*
         * Valida o formato básico do e-mail.
         */
        if (!AlunoModel.validarEmail(email)) {
            return {
                sucesso: false,
                status: 400,
                mensagem: "Informe um e-mail válido."
            };
        }

        /*
         * Verifica se já existe um aluno com o mesmo RA.
         */
        if (AlunoModel.localizarPorRa(ra)) {
            return {
                sucesso: false,
                status: 409,
                mensagem: "Já existe um aluno com esse RA."
            };
        }

        /*
         * Cria o objeto que representa o novo aluno.
         */
        const aluno = {
            id: AlunoModel.gerarProximoId(),
            ra,
            nome,
            email,
            curso,
            turma,
            ativo: true
        };

        /*
         * Adiciona o aluno ao array armazenado em memória.
         */
        alunos.push(aluno);

        /*
         * Retorna o resultado positivo do cadastro.
         */
        return {
            sucesso: true,
            status: 201,
            aluno
        };
    },

    /*
     * Devolve todos os alunos cadastrados.
     *
     * O operador ... cria uma cópia do array.
     *
     * Dessa forma, quem chamar listar() não receberá
     * diretamente o array interno do Model.
     */
    listar() {
        return [...alunos];
    }
};

/*
 * Exporta o Model para que ele possa ser importado
 * pelo Controller.
*/
export default AlunoModel;