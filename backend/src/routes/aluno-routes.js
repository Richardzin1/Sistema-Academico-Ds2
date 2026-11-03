/*
 * Importa o Controller de alunos.
 */
import AlunoController from "../controller/aluno-controller.js";

/*
 * Importa as funções responsáveis pelas
 * respostas HTTP.
 */
import {
    enviarJson,
    enviarSemConteudo
} from "../utils/http.js";

/*
 * Esta função analisa a requisição recebida
 * e decide qual código deverá ser executado.
 */
export async function tratarRotas(req, res) {
    /*
     * Cria um objeto URL a partir do endereço
     * recebido na requisição.
     *
     * req.url contém somente o caminho solicitado.
     * Exemplo: /api/alunos
     */
  const url = new URL(
        req.url,
        `http://${req.headers.host || "localhost"}`
    );

    /*
     * pathname representa somente o caminho da URL.
     */
    const caminho = url.pathname;

    /*
     * req.method informa o método HTTP utilizado.
     *
     * Exemplos:
     * – GET
     * – POST
     * – PUT
     * – DELETE
     */
    const metodo = req.method;

    /*
     * O navegador pode enviar uma requisição OPTIONS
     * antes da requisição principal.
     *
     * Essa verificação permite futuras requisições
     * realizadas pelo frontend.
     */
    if (metodo === "OPTIONS") {
        enviarSemConteudo(res);
        return true;
    }

    /*
     * Endpoint utilizado para verificar
     * se o servidor está funcionando.
     */
    if (metodo === "GET" && caminho === "/api/health") {
        enviarJson(res, 200, {
            status: "ok",
            mensagem: "Servidor funcionando."
        });

        return true;
    }

    /*
     * Encaminha GET /api/alunos para o método listar()
     * do AlunoController.
     */
    if (metodo === "GET" && caminho === "/api/alunos") {
        AlunoController.listar(req, res);
        return true;
    }

    /*
     * Encaminha POST /api/alunos para o método
     * cadastrar() do AlunoController.
     */
    if (metodo === "POST" && caminho === "/api/alunos") {
        await AlunoController.cadastrar(req, res);
        return true;
    }

    /*
     * Retorna false quando nenhuma rota
     * corresponde à requisição recebida.
     */
    return false;
}