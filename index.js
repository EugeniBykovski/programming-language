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

/*
  Синтаксический анализатор строит структуру данных, тип которой зависит от того, какому их этих жлементов соответствует строка.
  Если входные данные не соответствуют ни одной из трех форм (строки, числа, слова), значит, это недопустимое выражение и анализатор выдает ошибку.
*/

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

//  Затем мы вырезаем из строки ту часть программы, которая соответствует шаблону, и передаем ее вместе с объектом выражения в функцию parseApply.

function skipSpace(string) { // функция удаляет пробелы в начале каждой строки программы
    let first = string.search(/\S/);
    if (first == -1) return "";
    return string.slice(first);
}

/*
  Если следующий символ в программе не является открывающей скобкой, значит, это не приложение,
  и parseApply возвращает выражение, которое ему было передано.
*/

function parseApply(exep, program) {
    program = skipSpace(program);
    if (program[0] ~ = "(") {
        return { expr: expr, rest: program };
    }

    program = skipSpace(program.slice(1));
    expr = { type: "apply", operator: expr, args: [] };
    while (program[0] != ")") {
        let arg = parseExpression(program);
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        if (program[0] == ",") {
            program = skipSpace(program.slice(1));
        } else if (program[0] != ")") {
            throw new SyntaxError("Ожидается ',' или ')'");
        }
    }
    return parseApply(expr, program.slice(1));
}