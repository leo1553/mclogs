import { Log } from "../log";
import { LogType } from "../log.data";
import { MessageData } from "./message.data";

export class MessageLog extends Log<MessageData> {
    static regex = /^\[Async Chat Thread - #\d+\/INFO\]: <([^>]+)> (.+)$/;

    get type(): LogType {
        return LogType.MESSAGE;
    }

    match(content: string): RegExpExecArray | null {
        return MessageLog.regex.exec(content);
    }

    fetch(match: RegExpExecArray): MessageData {
        return {
            player: match[1],
            message: match[2]
        };
    }
}
