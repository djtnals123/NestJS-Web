import { IsNotEmpty } from "class-validator";

export class BoardDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;
}