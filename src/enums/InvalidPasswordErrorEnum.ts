export enum InvalidPasswordErrorEnum {
    MINIMUM_LENGTH = 'A senha deve conter no mínimo 8 caracteres',
    MAXIMUM_LENGTH = 'A senha deve conter no máximo 64 caracteres',
    MISSING_NUMBER = 'A senha deve conter pelo menos um número',
    MISSING_LOWERCASE_CHAR = 'A senha deve conter pelo menos uma letra minúscula',
    MISSING_UPPERCASE_CHAR = 'A senha deve conter pelo menos uma letra maiúscula',
    PASSWORDS_SHOULD_MATCH = 'As senhas devem ser iguais',
    NEW_AND_OLD_MUST_DIFFER = 'A nova senha deve ser diferente da antiga',
}
