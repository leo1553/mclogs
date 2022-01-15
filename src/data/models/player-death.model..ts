import { Sequelize, Model, DataTypes } from "sequelize";
import { CommonModel, initCommonModel } from "./common.model";
import { Player } from "./player.model";

export class PlayerDeath extends Model implements CommonModel {
    declare id: number;
    time!: Date;
    playerId!: number;
    message!: string;
    killer?: string;
    item?: string;
}

export function initPlayerDeathModel(sequelize: Sequelize) {
    PlayerDeath.init({
        ...initCommonModel(),
        playerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Player,
                key: 'id'
            }
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        killer: {
            type: DataTypes.STRING,
            allowNull: true
        },
        item: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, { sequelize });
}
