import { Sequelize } from "sequelize";
import { DataContextConnection } from "./data-context.data";
import { ConfigEntry, initConfigEntryModel } from "./models/config-entry.model";
import { PlayerDeath, initPlayerDeathModel } from "./models/player-death.model.";
import { initPlayerJoinModel, PlayerJoin } from "./models/player-join.model";
import { initPlayerKillModel, PlayerKill } from "./models/player-kill.model";
import { initPlayerLeaveModel, PlayerLeave } from "./models/player-leave.model";
import { initPlayerMessageModel, PlayerMessage } from "./models/player-message.model";
import { initPlayerModel, Player } from "./models/player.model";

const dataModels = [
    ConfigEntry,
    Player,
    PlayerDeath,
    PlayerJoin,
    PlayerKill,
    PlayerLeave,
    PlayerMessage
];

const dataModelInitializers = [
    initConfigEntryModel,
    initPlayerModel,
    initPlayerDeathModel,
    initPlayerJoinModel,
    initPlayerKillModel,
    initPlayerLeaveModel,
    initPlayerMessageModel
];

export class DataContext {
    sequelize: Sequelize;

    constructor(connection: DataContextConnection) {
        this.sequelize = new Sequelize(connection.database, connection.username, connection.password, {
            dialect: connection.dialect,
            host: connection.host,
            logging: false
            // logging: console.log
        });
        for (const initializer of dataModelInitializers)
            initializer(this.sequelize);
    }

    async connect() {
        await this.sequelize.authenticate();
        // await this.dropAll();
        await this.syncAll();
    }

    async disconnect() {
        await this.sequelize.close();
    }

    private async dropAll() {
        for (const dataModel of dataModels.slice().reverse())
            await dataModel.drop();
    }

    private async syncAll() {
        for (const dataModel of dataModels)
            await dataModel.sync();
    }
}
