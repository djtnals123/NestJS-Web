import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class BoardValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log(22222222)
        console.log(value)
        // throw new BadRequestException(`${value}`);
        return value;
    }
    
}