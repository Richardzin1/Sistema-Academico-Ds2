/*
 * Importa a aplicação Express configurada
 * no arquivo app.js.
 */
import app from "./app.js";

/*
 * Utiliza a porta definida pelo ambiente
 * ou a porta 3000 durante o desenvolvimento.
 */
const PORTA = Number(process.env.PORT) || 3000;

/*
 * Permite conexões externas.
 *
 * Essa configuração também será útil
 * durante o deploy no Render.
 */
const HOST = "0.0.0.0";

/*
 * Inicia a aplicação Express.
 */
app.listen(PORTA, HOST, () => {
    console.log(
        'Servidor Express disponível em ' +
        `http://localhost:${PORTA}`
    );
});