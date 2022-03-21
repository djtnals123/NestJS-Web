import { ValueTransformer } from "typeorm";

export class HospitalTransformer implements ValueTransformer {
    to(entityValue) {
        return entityValue;
    }

    from(databaseValue: string): string {
        switch(databaseValue) {
            case 'S':
                return '서울대병원';
            case 'K':
                return '고려대병원';
            default:
                return 'Error';
        }
    }
}