import { DataTypes } from 'sequelize';

export interface CommonModel {
    id: number;
    time: Date;
}

export function initCommonModel() {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    };
}
