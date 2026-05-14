import type { KeymapContext } from "../types";

/**
 * Evaluate a "when" clause against the current context map.
 * Supports `&&`, `||`, `!`, `==`, `!=`, parens, and string/boolean literals.
 */
export function evaluateWhenClause(
    whenClause: string | undefined,
    context: Partial<KeymapContext>
): boolean {
    if (!whenClause) return true;

    const tokens = tokenize(whenClause);
    return evaluateTokens(tokens, context);
}

type Token =
    | { type: "identifier"; value: string }
    | { type: "operator"; value: "&&" | "||" | "!" | "==" | "!=" }
    | { type: "literal"; value: string | boolean }
    | { type: "paren"; value: "(" | ")" };

function tokenize(expr: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < expr.length) {
        const char = expr[i];

        if (/\s/.test(char)) {
            i++;
            continue;
        }

        if (char === "(") {
            tokens.push({ type: "paren", value: "(" });
            i++;
            continue;
        }

        if (char === ")") {
            tokens.push({ type: "paren", value: ")" });
            i++;
            continue;
        }

        if (char === "!") {
            if (expr[i + 1] === "=") {
                tokens.push({ type: "operator", value: "!=" });
                i += 2;
            } else {
                tokens.push({ type: "operator", value: "!" });
                i++;
            }
            continue;
        }

        if (char === "&" && expr[i + 1] === "&") {
            tokens.push({ type: "operator", value: "&&" });
            i += 2;
            continue;
        }

        if (char === "|" && expr[i + 1] === "|") {
            tokens.push({ type: "operator", value: "||" });
            i += 2;
            continue;
        }

        if (char === "=" && expr[i + 1] === "=") {
            tokens.push({ type: "operator", value: "==" });
            i += 2;
            continue;
        }

        if (char === "'" || char === '"') {
            const quote = char;
            let value = "";
            i++;
            while (i < expr.length && expr[i] !== quote) {
                value += expr[i];
                i++;
            }
            i++;
            tokens.push({ type: "literal", value });
            continue;
        }

        let identifier = "";
        while (i < expr.length && /[a-zA-Z0-9_.]/.test(expr[i])) {
            identifier += expr[i];
            i++;
        }

        if (identifier === "true") {
            tokens.push({ type: "literal", value: true });
        } else if (identifier === "false") {
            tokens.push({ type: "literal", value: false });
        } else if (identifier) {
            tokens.push({ type: "identifier", value: identifier });
        }
    }

    return tokens;
}

interface EvalResult {
    value: boolean;
    consumed: number;
    /**
     * Raw underlying value, kept so equality compares booleans to booleans
     * and strings to strings rather than coercing one side to boolean first.
     */
    raw: string | boolean;
}

function evaluateTokens(
    tokens: Token[],
    context: Partial<KeymapContext>
): boolean {
    if (tokens.length === 0) return true;
    return evaluateOr(tokens, context).value;
}

function evaluateOr(
    tokens: Token[],
    context: Partial<KeymapContext>
): EvalResult {
    const result = evaluateAnd(tokens, context);
    let consumed = result.consumed;
    let value = result.value;

    while (consumed < tokens.length) {
        const token = tokens[consumed];
        if (token.type === "operator" && token.value === "||") {
            consumed++;
            const right = evaluateAnd(tokens.slice(consumed), context);
            value = value || right.value;
            consumed += right.consumed;
        } else {
            break;
        }
    }

    return { value, consumed, raw: value };
}

function evaluateAnd(
    tokens: Token[],
    context: Partial<KeymapContext>
): EvalResult {
    const result = evaluateEquality(tokens, context);
    let consumed = result.consumed;
    let value = result.value;

    while (consumed < tokens.length) {
        const token = tokens[consumed];
        if (token.type === "operator" && token.value === "&&") {
            consumed++;
            const right = evaluateEquality(tokens.slice(consumed), context);
            value = value && right.value;
            consumed += right.consumed;
        } else {
            break;
        }
    }

    return { value, consumed, raw: value };
}

function evaluateEquality(
    tokens: Token[],
    context: Partial<KeymapContext>
): EvalResult {
    const result = evaluateUnary(tokens, context);
    let consumed = result.consumed;
    let raw: string | boolean = result.raw;
    let value = result.value;

    while (consumed < tokens.length) {
        const token = tokens[consumed];
        if (
            token.type === "operator" &&
            (token.value === "==" || token.value === "!=")
        ) {
            const op = token.value;
            consumed++;
            const right = evaluateUnary(tokens.slice(consumed), context);
            const equal = raw === right.raw;
            value = op === "==" ? equal : !equal;
            raw = value;
            consumed += right.consumed;
        } else {
            break;
        }
    }

    return { value, consumed, raw };
}

function evaluateUnary(
    tokens: Token[],
    context: Partial<KeymapContext>
): EvalResult {
    if (tokens.length === 0) return { value: true, consumed: 0, raw: true };

    const token = tokens[0];

    if (token.type === "operator" && token.value === "!") {
        const result = evaluateUnary(tokens.slice(1), context);
        const value = !result.value;
        return { value, consumed: result.consumed + 1, raw: value };
    }

    return evaluatePrimary(tokens, context);
}

function evaluatePrimary(
    tokens: Token[],
    context: Partial<KeymapContext>
): EvalResult {
    if (tokens.length === 0) return { value: true, consumed: 0, raw: true };

    const token = tokens[0];

    if (token.type === "paren" && token.value === "(") {
        const inner = evaluateOr(tokens.slice(1), context);
        const closeParen = tokens[inner.consumed + 1];
        if (closeParen?.type === "paren" && closeParen.value === ")") {
            return {
                value: inner.value,
                consumed: inner.consumed + 2,
                raw: inner.raw
            };
        }
        return inner;
    }

    if (token.type === "literal") {
        return {
            value: Boolean(token.value),
            consumed: 1,
            raw: token.value
        };
    }

    if (token.type === "identifier") {
        const raw = context[token.value as keyof KeymapContext];
        const resolved = raw ?? false;
        return {
            value: Boolean(resolved),
            consumed: 1,
            raw: resolved
        };
    }

    return { value: true, consumed: 1, raw: true };
}
