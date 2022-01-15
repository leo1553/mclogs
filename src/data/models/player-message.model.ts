import { STRING, Sequelize, Model, DataTypes } from "sequelize";
import { CommonModel, initCommonModel } from "./common.model";
import { Player } from "./player.model";

export class PlayerMessage extends Model implements CommonModel {
    declare id: number;
    time!: Date;
    playerId!: number;
    message!: string;
}

export function initPlayerMessageModel(sequelize: Sequelize) {
    PlayerMessage.init({
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
            type: STRING(1024),
            allowNull: false,

        }
    }, { sequelize });
}
