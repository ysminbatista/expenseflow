import { BadRequestException, type ValidationError } from '@nestjs/common';

// Nome do campo como o usuario o conhece
const FIELDS: Record<string, string> = {
  name: 'nome',
  email: 'e-mail',
  password: 'senha',
  type: 'tipo',
  description: 'descrição',
  amount: 'valor',
  date: 'data',
  categoryId: 'categoria',
  from: 'data inicial',
  to: 'data final',
};

// Traduz a regra violada (chave do class-validator) para uma mensagem.
// `original` e a mensagem em ingles, usada so para ler numeros como o limite.
function translate(
  rule: string,
  field: string,
  property: string,
  original: string,
): string {
  const limit = original.match(/\d+(\.\d+)?/)?.[0];
  switch (rule) {
    case 'isEmail':
      return 'Informe um e-mail válido';
    case 'minLength':
      if (limit === '1') return `Informe o campo ${field}`;
      return `O campo ${field} deve ter no mínimo ${limit} caracteres`;
    case 'maxLength':
      return `O campo ${field} deve ter no máximo ${limit} caracteres`;
    case 'isString':
    case 'isNotEmpty':
      return `Informe o campo ${field}`;
    case 'isPositive':
      return `O campo ${field} deve ser maior que zero`;
    case 'isNumber':
      return property === 'amount'
        ? 'O valor deve ser um número com no máximo 2 casas decimais'
        : `O campo ${field} deve ser um número`;
    case 'max':
      return `O campo ${field} deve ser no máximo ${limit}`;
    case 'isInt':
      return `O campo ${field} é inválido`;
    case 'isEnum':
      return `O campo ${field} é inválido`;
    case 'isDateString':
      return `O campo ${field} deve ser uma data válida`;
    case 'whitelistValidation':
      return `O campo ${property} não é permitido`;
    default:
      return `O campo ${field} é inválido`;
  }
}

function collect(errors: ValidationError[], messages: string[] = []) {
  for (const error of errors) {
    const field = FIELDS[error.property] ?? error.property;
    for (const [rule, original] of Object.entries(error.constraints ?? {})) {
      messages.push(translate(rule, field, error.property, original));
    }
    if (error.children?.length) collect(error.children, messages);
  }
  return messages;
}

// Usado em ValidationPipe({ exceptionFactory })
export function validationExceptionFactory(errors: ValidationError[]) {
  return new BadRequestException(collect(errors));
}
