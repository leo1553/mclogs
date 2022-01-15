import { Log } from "../log"
import { LogType } from "../log.data";
import { ServerStartingData } from "./server-starting.data";

export class ServerStartingLog extends Log<ServerStartingData> {
    static regex = /^\[Server thread\/INFO\]: Starting minecraft server version (.+)$/;

    get type(): LogType {
        return LogType.SERVER_STARTING;
    }

    match(content: string): RegExpExecArray | null {
        return ServerStartingLog.regex.exec(content);
    }

    fetch(match: RegExpExecArray): ServerStartingData {
        return {
            version: match[1]
        };
    }
}
