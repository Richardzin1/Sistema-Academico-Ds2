/*
 * Importa o Model responsável pelos dados
 * e pelas regras relacionadas aos alunos.
 */
import AlunoModel from "../model/aluno-model.js";

/*
 * Importa as funções utilizadas para trabalhar
 * com requisições e respostas HTTP.
 */
import {
    enviarJson,
    lerCorpoJson
} from "../utils/http.js";

/*
 * O Controller recebe as solicitações encaminhadas
 * pelas rotas e coordena a execução da aplicação.
 *
 * Ele faz a ligação entre:
 *
 * – requisição HTTP;
 * – Model;
 * – resposta JSON.
 */
const AlunoController = {

    /*
     * Lista todos os alunos cadastrados.
     *
     * Essa função será executada quando o servidor
     * receber GET /api/alunos.
     */
    listar(req, res) {
        /*
         * Solicita os dados ao Model.
         */
        const alunos = AlunoModel.listar();

        /*
         * Envia uma resposta com status 200.
         *
         * O status 200 significa que a requisição
         * foi processada com sucesso.
         */
        enviarJson(res, 200, {
            total: alunos.length,
            dados: alunos
        });
    },

    /*
     * Cadastra um novo aluno.
     *
     * async indica que a função possui uma
     * operação assíncrona.
     */
    async cadastrar(req, res) {
        try {
            /*
             * Aguarda a leitura e a conversão
             * do JSON recebido na requisição.
             */
            const dados = await lerCorpoJson(req);

            /*
             * Encaminha os dados para o Model.
             */
            const resultado = AlunoModel.cadastrar(dados);

            /*
             * Verifica se o Model encontrou
             * algum problema de validação.
             */
            if (!resultado.sucesso) {
                enviarJson(res, resultado.status, {
                    sucesso: false,
                    mensagem: resultado.mensagem
                });

                return;
            }

            /*
             * Se o cadastro foi realizado,
             * responde com status 201.
             *
             * O status 201 significa que um novo
             * recurso foi criado com sucesso.
             */
            enviarJson(res, resultado.status, {
                sucesso: true,
                mensagem: "Aluno cadastrado com sucesso.",
                dados: resultado.aluno
            });

        } catch (erro) {
            /*
             * Este bloco será executado, por exemplo,
             * quando o cliente enviar um JSON inválido.
             */
            enviarJson(res, 400, {
                sucesso: false,
                mensagem: "O corpo da requisição contém um JSON inválido."
            });
        }
    }
};

/*
 * Exporta o Controller para que ele seja
 * utilizado pelo arquivo de rotas.
 */
export default AlunoController;