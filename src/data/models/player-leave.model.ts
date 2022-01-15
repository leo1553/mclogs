import { Sequelize, Model, DataTypes } from "sequelize";
import { CommonModel, initCommonModel } from "./common.model";
import { Player } from "./player.model";

export class PlayerLeave extends Model implements CommonModel {
    declare id: number;
    time!: Date;
    playerId!: number;
    reason?: string;
}

export function initPlayerLeaveModel(sequelize: Sequelize) {
    PlayerLeave.init({
        ...initCommonModel(),
        playerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Player,
                key: 'id'
            }
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, { sequelize });
}
