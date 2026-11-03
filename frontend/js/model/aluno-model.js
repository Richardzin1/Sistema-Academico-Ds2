/*
 * O Model do frontend representa e valida os dados
 * que serão enviados para a API.
 *
 * A validação do frontend melhora a experiência
 * do usuário, mas não substitui a validação realizada
 * pelo backend.
 */
const AlunoModel = {
    /*
     * Converte o valor para texto e remove
     * os espaços do início e do final.
     */
    normalizarTexto(valor) {
        /*
         * Se o valor não existir, retornamos
         * uma string vazia.
         */
        if (valor === null || valor === undefined) {
            return "";
        }

        return String(valor).trim();
    },

    /*
     * Realiza uma validação inicial do e-mail.
     */
    validarEmail(email) {
        return email.includes("@") && email.includes(".");
    },

    /*
     * Normaliza e valida os dados informados
     * no formulário.
     */
validar(dados) {
        /*
         * Cria um novo objeto com os valores
         * normalizados.
         */
        const aluno = {
            ra: AlunoModel.normalizarTexto(dados.ra),
            nome: AlunoModel.normalizarTexto(dados.nome),
            /*
             * O e-mail também será convertido
             * para letras minúsculas.
             */
            email: AlunoModel
                .normalizarTexto(dados.email)
                .toLowerCase(),
            curso: AlunoModel.normalizarTexto(dados.curso),
            turma: AlunoModel.normalizarTexto(dados.turma)
        };

        /*
         * Verifica se todos os campos foram preenchidos.
         */
        if (
            aluno.ra === "" ||
            aluno.nome === "" ||
            aluno.email === "" ||
            aluno.curso === "" ||
            aluno.turma === ""
        ) {
            return {
                sucesso: false,
                mensagem: "Todos os campos são obrigatórios."
            };
        }

        /*
         * Verifica o formato inicial do e-mail.
         */
        if (!AlunoModel.validarEmail(aluno.email)) {
            return {
                sucesso: false,
                mensagem: "Informe um e-mail válido."
            };
        }

        /*
         * Se os dados forem válidos, devolvemos
         * o objeto preparado para ser enviado à API.
         */
        return {
            sucesso: true,
            dados: aluno
        };
    }
};