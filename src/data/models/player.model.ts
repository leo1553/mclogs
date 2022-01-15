import { Sequelize, DataTypes } from "sequelize";
import { Model } from "sequelize";
import { CommonModel, initCommonModel } from "./common.model";

export class Player extends Model implements CommonModel {
    declare id: number;
    time!: Date;
    name!: string;
}

export function initPlayerModel(sequelize: Sequelize) {
    Player.init({
        ...initCommonModel(),
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { sequelize });
}
