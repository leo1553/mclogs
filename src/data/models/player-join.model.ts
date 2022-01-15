import { Sequelize, Model, DataTypes } from "sequelize";
import { CommonModel, initCommonModel } from "./common.model";
import { Player } from "./player.model";

export class PlayerJoin extends Model implements CommonModel {
    declare id: number;
    time!: Date;
    playerId!: number;
}

export function initPlayerJoinModel(sequelize: Sequelize) {
    PlayerJoin.init({
        ...initCommonModel(),
        playerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Player,
                key: 'id'
            }
        }
    }, { sequelize });
}
