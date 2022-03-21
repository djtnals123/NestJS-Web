import { Equals } from "class-validator";


export class AgreeDto {
    @Equals('on', {message: '동의해주세요.'})
    agree: string;
}
