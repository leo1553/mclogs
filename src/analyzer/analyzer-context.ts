import { DataContext } from "../data/data-context";
import { LogData, LogType } from "../logs/log.data";

export class AnalyzerContext {
    static maxLogs = 16;

    latestLogs: LogData<any>[];
    connectedPlayers: { [key: string]: number };
    dataContext: DataContext;

    constructor(dataContext: DataContext) {
        this.latestLogs = [];
        this.connectedPlayers = {};
        this.dataContext = dataContext;
    }

    registerLog(log: LogData<any>) {
        this.latestLogs.unshift(log);
        if (this.latestLogs.length > AnalyzerContext.maxLogs)
            this.latestLogs.pop();
    }

    seekLog<T>(logType: LogType, selector: (log: LogData<T>) => boolean) {
        return this.latestLogs.find(log => log.type === logType && selector(log));
    }

    toJSON() {
        return JSON.stringify({
            latestLogs: this.latestLogs,
            connectedPlayers: this.connectedPlayers
        });
    }

    fromJSON(json: string) {
        const object = JSON.parse(json);

        object.latestLogs.forEach((log: LogData<any>) => log.time = new Date(log.time));

        this.latestLogs = object.latestLogs;
        this.connectedPlayers = object.connectedPlayers;
    }
}
