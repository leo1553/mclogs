import { Log } from "../log";
import { LogType } from "../log.data";
import { LeaveData } from "./leave.data";

export class LeaveLog extends Log<LeaveData> {
    static regexes = [
        /^\[Server thread\/INFO\]: (.+) lost connection: (.+)$/,
        /^\[Server thread\/INFO\]: (.+) left the game$/
    ];

    get type(): LogType {
        return LogType.LEAVE;
    }

    match(content: string): RegExpExecArray | null {
        for (const regex of LeaveLog.regexes) {
            const match = regex.exec(content);
            if (match)
                return match;
        }
        return null;
    }

    fetch(match: RegExpExecArray): LeaveData {
        return {
            player: match[1],
            reason: match[2]
        };
    }
}