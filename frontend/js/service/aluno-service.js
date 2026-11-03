/*
 * O AlunoService é responsável pela comunicação
 * entre o frontend e a API.
 *
 * O Controller não precisa conhecer os detalhes
 * do fetch(), dos cabeçalhos ou da conversão do JSON.
 */
const AlunoService = {
    /*
     * Endereço base dos endpoints relacionados
     * aos alunos.
     */
    URL_API: "http://localhost:3000/api/alunos",

    /*
     * Processa uma resposta recebida da API.
     */
    async processarResposta(resposta) {
        let resultado;

        try {
            /*
             * Converte o JSON recebido em
             * um objeto JavaScript.
             */
            resultado = await resposta.json();
        } catch (erro) {
            /*
             * Este erro ocorrerá se o servidor não
             * devolver uma resposta JSON válida.
             */
            throw new Error(
                "O servidor retornou uma resposta inválida."
            );
        }

        /*
         * A propriedade ok será verdadeira para
         * respostas entre 200 e 299.
         */
        if (!resposta.ok) {
            /*
             * Utiliza a mensagem enviada pela API.
             *
             * Se ela não existir, utiliza uma
             * mensagem genérica.
             */
            throw new Error(
                resultado.mensagem ||
                "Não foi possível concluir a operação."
            );
        }

        /*
         * Devolve o objeto JavaScript para quem
         * chamou o Service.
         */
        return resultado;
    },

    /*
     * Executa uma requisição e trata possíveis
     * problemas de conexão com o backend.
     */
    async requisitar(opcoes = {}) {
        let resposta;

        try {
            /*
             * fetch() envia a requisição para a API.
             *
             * O segundo argumento contém as opções,
             * como método, cabeçalhos e corpo.
             */
            resposta = await fetch(
                AlunoService.URL_API,
                opcoes
            );
        } catch (erro) {
            /*
             * Esse bloco será executado quando não for
             * possível estabelecer comunicação.
             *
             * Exemplos:
             *
             * – servidor desligado;
             * – endereço incorreto;
             * – problema de rede;
             * – bloqueio de CORS.
             */
            throw new Error(
                "Não foi possível conectar ao servidor."
            );
        }

        /*
         * Depois de receber a resposta, encaminhamos
         * seu processamento para outro método.
         */
        return AlunoService.processarResposta(resposta);
    },

    /*
     * Solicita a lista de alunos.
     *
     * Como GET é o método padrão do fetch(),
     * poderíamos omitir a propriedade method.
     * Ela foi mantida para deixar o código explícito.
     */
    async listar() {
        const resultado = await AlunoService.requisitar({
            method: "GET",

            /*
             * Informa que o cliente espera receber JSON.
             */
            headers: {
                "Accept": "application/json"
            }
        });

        /*
         * A API retorna:
         *
         * {
         *      total: 1,
         *      dados: [...]
         * }
         *
         * O Service devolve somente o array.
         */
        return resultado.dados;
    },

    /*
     * Envia os dados de um novo aluno para a API.
     */
    async cadastrar(aluno) {
        return AlunoService.requisitar({
            /*
             * POST indica a criação de um recurso.
             */
            method: "POST",

            /*
             * O Content-Type informa que o corpo
             * da requisição está em JSON.
             */
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },

            /*
             * JSON.stringify() converte o objeto
             * JavaScript para texto JSON.
             */
            body: JSON.stringify(aluno)
        });
    }
};