import { InvalidPasswordErrorEnum } from '../enums/InvalidPasswordErrorEnum'

export class InvalidPasswordError extends Error {
    key: string

    constructor(message: InvalidPasswordErrorEnum) {
        super(message.toString())
        this.key = Object.keys(InvalidPasswordErrorEnum)[
            Object.values(InvalidPasswordErrorEnum).indexOf(message)
        ]
    }
}
