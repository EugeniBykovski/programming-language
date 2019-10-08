/*
  Синтаксический анализатор
    Мы определим функцию parseExpression, которая принимает на входе строку и возвращает объект,
    содержащий структуру данных для выражения, содержащегося в начале строки, а также часть строки,
    оставшуюся после синтаксического анализа этого выражения. При синтаксическом анализе подвыражений (например, аргумента приложения)
    данную функцию можно вызвать снова и получить на выходе выражение аргумента, а также оставшийся текст. Этот текст
    может, в свою очередь, содержать другие аргументы или же быть закрывающей скобкой,
    заканчивающей список аргументов.
*/

// Первая часть синтаксического анализатора
function parseExpression(program) {
    program = skipSpace(program);
    let match, expr;
    if (match = /^"([^"]*)"/.exec(program)) {
        expr = { type: "value", value: match[1] };
    } else if (match = /^\d+\b/.exec(program)) {
        expr = { type: "value", value: Number(match[0]) };
    } else if (match = /^[^\s(),#"]+/.exec(program)) {
        expr = { type: "word", name: match[0] };
    } else {
        throw new SyntaxError("Неожиданный синтаксис: " + program);
    }

    return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
    let first = string.search(/\S/);
    if (first == -1) return "";
    return string.slice(first);
}