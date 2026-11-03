/*
 * Importa o framework Express.
 */
import express from "express";

/*
 * Importa o middleware responsável pela
 * configuração dos cabeçalhos CORS.
 */
import cors from "cors";

/*
 * Importa as rotas relacionadas aos alunos.
 */
import alunoRoutes from "./routes/aluno-routes.js";

/*
 * Cria a aplicação Express.
 *
 * app será o objeto principal de configuração
 * da nossa API.
 */
const app = express();

/*
 * Configura o CORS da aplicação.
 *
 * Nesta fase, permitiremos requisições
 * originadas de qualquer endereço.
 */
app.use(
    cors({
        /*
         * O asterisco permite qualquer origem.
         *
         * Posteriormente, no deploy, poderemos
         * restringir para o endereço do Netlify.
         */
        origin: "*",

        /*
         * Métodos HTTP autorizados.
         */
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        /*
         * Cabeçalhos que poderão ser enviados
         * pelo frontend.
         *
         * Authorization será utilizado futuramente
         * no envio do token JWT.
         */
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

/*
 * Middleware responsável por interpretar
 * corpos de requisição no formato JSON.
 *
 * Quando recebermos:
 *
 * {
 *      "nome": "Ana"
 * }
 *
 * o Express transformará o JSON em um objeto
 * e disponibilizará o resultado em req.body.
 */
app.use(express.json());

/*
 * Rota responsável por verificar se a API
 * está funcionando.
 */
app.get("/api/health", (req, res) => {
    /*
     * res.status(200) define o status HTTP.
     *
     * json() converte o objeto para JSON
     * e finaliza a resposta.
     */
    return res.status(200).json({
        status: "ok",
        mensagem: "Servidor Express funcionando."
    });
});

/*
 * Registra as rotas dos alunos.
 *
 * Todas as rotas existentes em alunoRoutes
 * receberão o prefixo /api/alunos.
 */
app.use("/api/alunos", alunoRoutes);

/*
 * Middleware executado quando nenhuma rota
 * anterior corresponde à requisição.
 */
app.use((req, res) => {
    return res.status(404).json({
        sucesso: false,
        mensagem: "Rota não encontrada."
    });
});

/*
 * Middleware global para tratamento de erros.
 *
 * Um middleware de erro possui quatro parâmetros:
 *
 * erro, req, res e next.
 */
app.use((erro, req, res, next) => {
    /*
     * O express.json() gera o tipo
     * entity.parse.failed quando recebe
     * um JSON inválido.
     */
    if (erro.type === "entity.parse.failed") {
        return res.status(400).json({
            sucesso: false,
            mensagem:
                "O corpo da requisição contém um JSON inválido."
        });
    }

    /*
     * Registra os detalhes no terminal.
     */
    console.error("Erro interno do servidor:", erro);

    /*
     * Envia uma mensagem genérica ao cliente.
     */
    return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno do servidor."
    });
});

/*
 * Exporta a aplicação para o server.js.
 */
export default app;