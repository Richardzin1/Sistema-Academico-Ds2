/*
 * Importa o módulo HTTP nativo do Node.js.
 *
 * Não precisamos instalar esse módulo,
 * pois ele já acompanha o Node.js.
 */
import http from "node:http";

/*
 * Importa a função responsável por analisar
 * as rotas da aplicação.
 */
import { tratarRotas } from "./routes/aluno-routes.js";

/*
 * Importa a função utilizada para enviar
 * respostas no formato JSON.
 */
import { enviarJson } from "./utils/http.js";

/*
 * Define a porta em que o servidor será executado.
 *
 * process.env.PORT verifica se o ambiente informou
 * uma porta.
 *
 * Isso será importante quando fizermos o deploy
 * no Render.
 *
 * Durante o desenvolvimento local, será usada
 * a porta 3000.
 */
const PORTA = Number(process.env.PORT) || 3000;

/*
 * Define o endereço em que o servidor aceitará conexões.
 *
 * 0.0.0.0 permite que o servidor seja acessível
 * pelo ambiente de hospedagem.
 */
const HOST = "0.0.0.0";

/*
 * createServer() cria o servidor HTTP.
 *
 * A função será executada toda vez que o servidor
 * receber uma nova requisição.
 */
const servidor = http.createServer(async (req, res) => {
    try {
        /*
         * Encaminha a requisição para o arquivo de rotas.
         *
         * A função retornará true se uma rota
         * correspondente for encontrada.
         */
        const rotaEncontrada = await tratarRotas(req, res);

        /*
         * Se nenhuma rota for encontrada,
         * o servidor responderá com status 404.
         */
        if (!rotaEncontrada) {
            enviarJson(res, 404, {
                sucesso: false,
                mensagem: "Rota não encontrada."
            });
        }
    } catch (erro) {
        /*
         * Exibe o erro no terminal do servidor.
         *
         * Em uma aplicação real, detalhes internos
         * não devem ser enviados ao usuário.
         */
        console.error("Erro interno do servidor:", erro);

        /*
         * O status 500 representa um erro interno
         * inesperado no servidor.
         */
        enviarJson(res, 500, {
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

/*
 * listen() inicia o servidor.
 *
 * O servidor permanecerá aguardando requisições
 * na porta configurada.
 */
servidor.listen(PORTA, HOST, () => {
    /*
     * Esta mensagem será exibida quando o servidor
     * for iniciado corretamente.
     */
    console.log(
        `Servidor disponível em http://localhost:${PORTA}`
    );
});