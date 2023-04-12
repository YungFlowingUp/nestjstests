import { HttpException, HttpStatus } from "@nestjs/common";

// Класс, позволяющий лучше выводить ошибки при валидации
export class ValidationException extends HttpException {
    messages;

    constructor (response) {
        super(response, HttpStatus.BAD_REQUEST);
        this.messages = response;
    }
}