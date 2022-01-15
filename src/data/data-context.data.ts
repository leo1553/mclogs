import { Dialect } from "sequelize/dist";

export interface DataContextConnection {
    dialect: Dialect;
    database: string;
    username: string;
    password: string;
    host: string;
}
