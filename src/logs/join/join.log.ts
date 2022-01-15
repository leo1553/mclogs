import { Log } from "../log";
import { LogType } from "../log.data";
import { JoinData } from "./join.data";

export class JoinLog extends Log<JoinData> {
    static regex = /^\[Server thread\/INFO\]: (.+) joined the game$/;

    get type(): LogType {
        return LogType.JOIN;
    }

    match(content: string): RegExpExecArray | null {
        return JoinLog.regex.exec(content);
    }

    fetch(match: RegExpExecArray): JoinData {
        return {
            player: match[1]
        };
    }
}
