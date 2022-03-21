import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';


export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'sumin_nest',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    migrations: ["migration/*.js"], 
    cli: { migrationsDir: "migration" },
    namingStrategy: new SnakeNamingStrategy(),

}