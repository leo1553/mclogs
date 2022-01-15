export enum LogType {
    UNKNOWN = 'unknown',
    DEATH = 'death',
    JOIN = 'join',
    LEAVE = 'leave',
    MESSAGE = 'message',
    SERVER_STARTING = 'server-starting',
}

export interface LogData<T> {
    time: Date;
    content: string;
    type: LogType;
    data: T;
}
