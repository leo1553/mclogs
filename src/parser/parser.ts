import { LogData, LogType } from "../logs/log.data";
import { DeathLog } from "../logs/death/death.log";
import { JoinLog } from "../logs/join/join.log";
import { LeaveLog } from "../logs/leave/leave.log";
import { MessageLog } from "../logs/message/message.log";
import { ServerStartingLog } from "../logs/server-starting/server-starting.log";

export const logParsers = [
    new DeathLog(),
    new JoinLog(),
    new LeaveLog(),
    new MessageLog(),
    new ServerStartingLog()
];

export class Parser {
    static regex = /^\[(\d{2}):(\d{2}):(\d{2})\] (.*)$/;

    date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    private getTime(match: RegExpMatchArray): Date {
        const [, hour, minute, second] = match;
        const date = new Date(this.date);
        date.setUTCHours(
            parseInt(hour, 10),
            parseInt(minute, 10),
            parseInt(second, 10),
            0);
        return date;
    }

    private getData(content: string): [LogType, any] {
        for (const logParser of logParsers) {
            const match = logParser.match(content);
            if (match) {
                return [
                    logParser.type,
                    logParser.fetch(match)
                ];
            }
        }
        return [LogType.UNKNOWN, null];
    }

    parseLogTime(log: string): Date | null {
        const match = Parser.regex.exec(log);
        if (!match)
            return null;

        const time = this.getTime(match);
        return time;
    }

    parse(log: string): LogData<any> | null {
        const match = Parser.regex.exec(log);
        if (!match)
            return null;

        const time = this.getTime(match);
        const content = match[4];
        const [type, data] = this.getData(content);

        return {
            time,
            content,
            type,
            data
        };
    }
}
