import { ValueTransformer } from "typeorm";

export class LocalDateTransformer implements ValueTransformer {
    constructor(private type: string) {}

    to(entityValue) {
        return entityValue;
    }

    from(databaseValue: Date): string {
        switch(this.type) {
            case 'date':
                return databaseValue.toLocaleDateString();
            case 'time':
                return databaseValue.toLocaleTimeString();
            case 'datetime':
                return databaseValue.toLocaleString();
            default:
                return 'Error';
        }
    }
}