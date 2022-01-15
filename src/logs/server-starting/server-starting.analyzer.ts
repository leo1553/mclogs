import { Transaction } from "sequelize/dist";
import { AnalyzerContext } from "../../analyzer/analyzer-context";
import { PlayerLeave } from "../../data/models/player-leave.model";
import { LogData } from "../log.data";
import { ServerStartingData } from "./server-starting.data";

export async function serverStartingAnalyzer(context: AnalyzerContext, log: LogData<ServerStartingData>, transaction: Transaction) {
    for (const playerId of Object.values(context.connectedPlayers)) {
        await PlayerLeave.create({
            time: context.latestLogs.length > 0 ? context.latestLogs[0].time : log.time,
            playerId,
            reason: "Server restart"
        }, { transaction });
    }
    context.connectedPlayers = {};
    return true;
}
