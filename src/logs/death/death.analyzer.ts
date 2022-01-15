import { Transaction } from "sequelize/dist";
import { AnalyzerContext } from "../../analyzer/analyzer-context";
import { PlayerDeath } from "../../data/models/player-death.model.";
import { PlayerKill } from "../../data/models/player-kill.model";
import { Player } from "../../data/models/player.model";
import { LogData } from "../log.data";
import { DeathData } from "./death.data";

export async function deathAnalyzer(context: AnalyzerContext, log: LogData<DeathData>, transaction: Transaction) {
    const playerId = context.connectedPlayers[log.data.player];
    if (!playerId) {
        console.error(`Could not find player ${log.data.player}`);
        return false;
    }
    const playerDeath = await PlayerDeath.create({
        time: log.time,
        playerId: playerId,
        message: log.data.message,
        killer: log.data.killer,
        item: log.data.item
    }, { transaction });
    if (playerDeath.killer) {
        const killerId = context.connectedPlayers[playerDeath.killer]
            ?? (await Player.findOne({ where: { name: playerDeath.killer }, transaction }))?.id;
        if (!!killerId) {
            await PlayerKill.create({
                time: log.time,
                playerDeathId: playerDeath.id,
                killerId: killerId,
                killedId: playerId
            }, { transaction });
        }
    }
    return true;
}
