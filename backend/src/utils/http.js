/*
 * Este objeto contém os cabeçalhos relacionados ao CORS.
 *
 * CORS significa Cross-Origin Resource Sharing.
 *
 * Esses cabeçalhos permitem que um frontend executado
 * em outro endereço faça requisições para o backend.
 *
 * Exemplo:
 * Frontend: http://127.0.0.1:5500
 * Backend: http://localhost:3000
 */
const cabecalhosCors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

/*
 * Envia uma resposta no formato JSON.
 *
 * Parâmetros:
 *
 * res:
 * representa a resposta HTTP que será enviada ao cliente.
 *
 * status:
 * código de estado da resposta.
 * Exemplos: 200, 201, 400, 404 e 500.
 *
 * dados:
 * objeto ou array que será convertido para JSON.
 */
export function enviarJson(res, status, dados) {
    /*
     * JSON.stringify() converte um valor JavaScript
     * para uma string no formato JSON.
     *
     * O valor null representa a função de substituição,
     * que não será utilizada neste momento.
     *
     * O número 2 cria uma indentação no JSON,
     * facilitando sua leitura.
     */
    const textoJson = JSON.stringify(dados, null, 2);

    /*
     * writeHead() define:
     *
     * 1. O código de status da resposta;
     * 2. Os cabeçalhos HTTP.
     */
    res.writeHead(status, {
        /*
         * Informa que o conteúdo enviado é JSON
         * e utiliza a codificação UTF-8.
         */
        "Content-Type": "application/json; charset=utf-8",

        /*
         * O operador de espalhamento adiciona
         * os cabeçalhos CORS ao objeto.
         */
        ...cabecalhosCors
    });

    /*
     * end() finaliza a resposta e envia o conteúdo
     * para quem realizou a requisição.
     */
    res.end(textoJson);
}

/*
 * Envia uma resposta sem conteúdo.
 *
 * Essa função será utilizada nas requisições OPTIONS,
 * realizadas automaticamente pelo navegador em
 * determinadas situações envolvendo CORS.
 */
export function enviarSemConteudo(res) {
    /*
     * O status 204 significa:
     *
     * "A requisição foi processada com sucesso,
     * mas não existe conteúdo para retornar."
     */
    res.writeHead(204, cabecalhosCors);

    /*
     * Finaliza a resposta sem enviar um corpo.
     */
    res.end();
}

/*
 * Lê o corpo de uma requisição HTTP e transforma
 * o JSON recebido em um objeto JavaScript.
 *
 * A função é assíncrona porque o conteúdo da requisição
 * pode chegar ao servidor dividido em várias partes.
 */
export function lerCorpoJson(req) {
    /*
     * Criamos e retornamos uma Promise.
     *
     * A Promise representa uma operação que será
     * concluída no futuro.
     */
    return new Promise((resolve, reject) => {
        /*
         * Esta variável armazenará as partes recebidas
         * durante a leitura da requisição.
         */
        let corpo = "";

        /*
         * O evento "data" é executado sempre que uma
         * nova parte dos dados chega ao servidor.
         */
        req.on("data", parte => {
            /*
             * Cada parte recebida é acrescentada
             * à variável corpo.
             */
            corpo += parte;
        });

        /*
         * O evento "end" é executado quando o servidor
         * termina de receber todo o corpo da requisição.
         */
        req.on("end", () => {
            /*
             * Se o corpo estiver vazio, consideramos
             * que foi recebido um objeto vazio.
             */
            if (corpo.trim() === "") {
                resolve({});
                return;
            }

            try {
                /*
                 * JSON.parse() transforma o texto JSON
                 * em um objeto JavaScript.
                 */
                const dados = JSON.parse(corpo);

                /*
                 * A Promise é concluída com sucesso
                 * e devolve os dados convertidos.
                 */
                resolve(dados);
            } catch (erro) {
                /*
                 * Se o JSON estiver incorreto,
                 * a Promise será rejeitada.
                 */
                reject(erro);
            }
        });

        /*
         * Esse evento é executado caso aconteça algum
         * problema durante a leitura da requisição.
         */
        req.on("error", erro => {
            reject(erro);
        });
    });
}