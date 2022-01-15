import { Sequelize, Model, DataTypes } from "sequelize";
import { CommonModel, initCommonModel } from "./common.model";
import { PlayerDeath } from "./player-death.model.";
import { Player } from "./player.model";

export class PlayerKill extends Model implements CommonModel {
    declare id: number;
    time!: Date;
    playerDeathId!: number;
    killerId!: number;
    killedId!: number;
}

export function initPlayerKillModel(sequelize: Sequelize) {
    PlayerKill.init({
        ...initCommonModel(),
        playerDeathId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: PlayerDeath,
                key: 'id'
            }
        },
        killerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Player,
                key: 'id'
            }
        },
        killedId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Player,
                key: 'id'
            }
        }
    }, { sequelize });
}
