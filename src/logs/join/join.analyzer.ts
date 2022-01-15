import { Transaction } from "sequelize/dist";
import { AnalyzerContext } from "../../analyzer/analyzer-context";
import { PlayerJoin } from "../../data/models/player-join.model";
import { Player } from "../../data/models/player.model";
import { LogData } from "../log.data";
import { JoinData } from "./join.data";

export async function joinAnalyzer(context: AnalyzerContext, log: LogData<JoinData>, transaction: Transaction) {
    const [player] = await Player.findOrCreate({
        where: {
            name: log.data.player
        },
        defaults: {
            time: log.time
        },
        transaction
    });
    await PlayerJoin.create({
        time: log.time,
        playerId: player.id
    }, { transaction });
    context.connectedPlayers[log.data.player] = player.id;
    return true;
}
