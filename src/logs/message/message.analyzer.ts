import { Transaction } from "sequelize/dist";
import { AnalyzerContext } from "../../analyzer/analyzer-context";
import { PlayerMessage } from "../../data/models/player-message.model";
import { LogData } from "../log.data";
import { MessageData } from "./message.data";

export async function messageAnalyzer(context: AnalyzerContext, log: LogData<MessageData>, transaction: Transaction) {
    const playerId = context.connectedPlayers[log.data.player];
    if (!playerId) {
        console.error(`Could not find player ${log.data.player}`);
        return false;
    }
    await PlayerMessage.create({
        time: log.time,
        playerId,
        message: log.data.message
    }, { transaction });
    return true;
}
