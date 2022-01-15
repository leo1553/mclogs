import { STRING } from "sequelize";
import { Sequelize, DataTypes } from "sequelize";
import { Model } from "sequelize";

export class ConfigEntry extends Model {
    key!: string;
    value!: string;
}

export function initConfigEntryModel(sequelize: Sequelize) {
    ConfigEntry.init({
        key: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        value: {
            type: STRING('MAX'),
            allowNull: false
        }
    }, { sequelize });
}
