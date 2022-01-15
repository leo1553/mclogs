import { Transaction } from "sequelize/dist";
import { AnalyzerContext } from "../../analyzer/analyzer-context";
import { PlayerLeave } from "../../data/models/player-leave.model";
import { JoinData } from "../join/join.data";
import { LogData, LogType } from "../log.data";
import { LeaveData } from "./leave.data";

export async function leaveAnalyzer(context: AnalyzerContext, log: LogData<LeaveData>, transaction: Transaction) {
    const playerId = context.connectedPlayers[log.data.player];
    if (!playerId) {
        for (const l of context.latestLogs)
            if (l.type == LogType.LEAVE && (l as LogData<LeaveData>).data.player === log.data.player)
                return true;
        console.error(`Could not find player ${log.data.player}`);
        return false;
    }
    for (const l of context.latestLogs) {
        if (l.type == LogType.LEAVE && (l as LogData<LeaveData>).data.player === log.data.player)
            return true;
        else if (l.type === LogType.JOIN && (l as LogData<JoinData>).data.player === log.data.player)
            break;
    }
    await PlayerLeave.create({
        time: log.time,
        playerId,
        reason: log.data.reason
    }, { transaction });
    delete context.connectedPlayers[log.data.player];
    return true;
}
