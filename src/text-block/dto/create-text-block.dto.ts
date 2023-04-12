// Схема для ввода данных для текстового блока
export class CreateTextBlockDto {
    readonly uniqueName: string;
    
    readonly title: string;

    readonly text: string;

    readonly group: string;
}