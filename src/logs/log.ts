import { LogType } from "./log.data";

export abstract class Log<TLog> {
    abstract get type(): LogType;

    abstract match(content: string): RegExpExecArray | null;
    abstract fetch(match: RegExpExecArray): TLog;
}
