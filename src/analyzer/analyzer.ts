import { DataContext } from "../data/data-context";
import { ConfigEntry } from "../data/models/config-entry.model";
import { LogFiles } from "../files/log-files";
import { deathAnalyzer } from "../logs/death/death.analyzer";
import { joinAnalyzer } from "../logs/join/join.analyzer";
import { leaveAnalyzer } from "../logs/leave/leave.analyzer";
import { LogType } from "../logs/log.data";
import { messageAnalyzer } from "../logs/message/message.analyzer";
import { serverStartingAnalyzer } from "../logs/server-starting/server-starting.analyzer";
import { Parser } from "../parser/parser";
import { AnalyzerContext } from "./analyzer-context";

const analyzers: { [key in LogType]: any } = {
    'unknown': async () => true,
    'death': deathAnalyzer,
    'join': joinAnalyzer,
    'leave': leaveAnalyzer,
    'message': messageAnalyzer,
    'server-starting': serverStartingAnalyzer
};

export class Analyzer {
    parser: Parser;
    dataContext: DataContext;

    context: AnalyzerContext;

    private _date: Date;
    get date(): Date {
        return this._date;
    }
    set date(date: Date) {
        this._date = date;
        this._date.setUTCHours(12, 0, 0, 0);
        this.parser.date = this._date;
    }

    private lastSessionChecked = false;
    private hasLastSession = false;
    private lastAnalyzedLogTime?: Date;

    constructor(dataContext: DataContext) {
        this.dataContext = dataContext;

        this._date = new Date();

        this.parser = new Parser(this._date);
        this.context = new AnalyzerContext(this.dataContext);
    }

    async analyzeAll(logsDirectory: string) {
        const logFiles = new LogFiles(logsDirectory);

        for (const logFile of logFiles.getLogFiles()) {
            const logs = await logFiles.readLogFile(logFile);
            console.log(`Analyzing ${logFile}`);
            const date = logFiles.parseFileDate(logFile);
            await this.analyze(logs, date);
        }
    }

    async analyze(logs: string[], date?: Date) {
        if (!date) {
            console.log(`Could not find date for log.`);
            return;
        }
        this.date = date;

        const lastSession = await this.getLastSession();
        const [shouldSkip, shouldCheck] = this.shouldParseLog(logs, lastSession);
        if (shouldSkip) {
            console.log('Skipping log from the past: ' + this.date.toLocaleDateString());
            return;
        }
        console.log('Analyzing log from ' + this.date.toLocaleDateString());

        if (shouldCheck)
            await this.analyzeLogsCheck(logs);
        else
            await this.analyzeLogs(logs);

        if (this.context.latestLogs.length > 0) {
            this.lastAnalyzedLogTime = this.context.latestLogs[0].time;
            await this.saveSession();
        }
    }

    private async analyzeLogs(logs: string[]) {
        for (const log of logs)
            await this.analizeLog(log);
    }

    private async analyzeLogsCheck(logs: string[]) {
        if (logs.length == 0)
            return;

        const firstLogIndex = logs.findIndex(log => {
            const logTime = this.parser.parseLogTime(log)
            return logTime && logTime > this.lastAnalyzedLogTime!;
        });
        if (firstLogIndex == -1) {
            console.warn('No new logs found.');
            return;
        }

        for (let i = firstLogIndex; i < logs.length; i++)
            await this.analizeLog(logs[i]);
    }

    private async analizeLog(log: string) {
        const parsedLog = this.parser.parse(log);
        if (parsedLog) {
            const analysisResult = await analyzers[parsedLog.type](this.context, parsedLog);
            if (!analysisResult)
                throw new Error(`Could not parse log: ${this.date} ${log}`);
            this.context.registerLog(parsedLog);
        }
        else {
            console.warn(`Could not parse log: ${log}`);
        }
    }

    private shouldParseLog(logs: string[], lastSession?: Date): [boolean, boolean] {
        if (!lastSession)
            return [false, false];

        // Past dates
        if (this.date < lastSession)
            return [true, false];

        // Same date
        if (this.date.getTime() == lastSession.getTime()) {
            if (logs.length > 0) {
                // Check for last log time
                for (let i = logs.length - 1; i >= 0; i--) {
                    const lastLogTime = this.parser.parseLogTime(logs[i]);
                    if (lastLogTime) {
                        if (lastLogTime <= this.lastAnalyzedLogTime!)
                            return [true, true];
                        else
                            break;
                    }
                }
            }
            return [false, true];
        }

        // Future dates
        return [false, false];
    }

    private async getLastSession(): Promise<Date | undefined> {
        if (!this.lastSessionChecked) {
            const lastAnalizedLogTime = (await ConfigEntry.findOne({
                where: {
                    key: 'lastAnalyzedLogTime'
                }
            }))?.value;
            if (lastAnalizedLogTime) {
                this.context.fromJSON((await ConfigEntry.findOne({
                    where: {
                        key: 'lastContext'
                    }
                }))!.value);
                this.lastAnalyzedLogTime = new Date(parseInt(lastAnalizedLogTime));
                this.hasLastSession = true;
            }
            this.lastSessionChecked = true;
        }

        if (this.lastAnalyzedLogTime) {
            const lastAnalyzedDate = new Date(this.lastAnalyzedLogTime.getTime());
            lastAnalyzedDate?.setUTCHours(12, 0, 0, 0);
            return lastAnalyzedDate;
        }
        return undefined;
    }

    private async saveSession() {
        if (!this.hasLastSession) {
            await ConfigEntry.create({
                key: 'lastAnalyzedLogTime',
                value: this.lastAnalyzedLogTime!.getTime()
            });
            await ConfigEntry.create({
                key: 'lastContext',
                value: this.context.toJSON()
            });
            this.hasLastSession = true;
        }
        else {
            await ConfigEntry.update({
                value: this.lastAnalyzedLogTime!.getTime().toString()
            }, {
                where: {
                    key: 'lastAnalyzedLogTime'
                }
            });
            await ConfigEntry.update({
                value: this.context.toJSON()
            }, {
                where: {
                    key: 'lastContext'
                }
            });
        }
    }
}
