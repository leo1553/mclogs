import { Log } from "../log";
import { LogType } from "../log.data";

import { DeathData, KeyDeathData } from "./death.data";

import { DeathMessage, deathMessages } from "./death-messages";

export class DeathLog extends Log<DeathData> {
    get type(): LogType {
        return LogType.DEATH;
    }

    match(content: string): RegExpExecArray | null {
        for (const deathMessage of deathMessages) {
            const match = deathMessage.regex.exec(content);
            if (match)
                return match;
        }
        return null;
    }

    fetch(match: RegExpExecArray): DeathData {
        const deathMessage = this.findDeathMessage(match[0])!;
        return {
            ...deathMessage.groups.reduce(
                (groups, x, i) => ({ ...groups, [x]: match[i + 2] }),
                {} as KeyDeathData),
            message: match[1],
        };
    }

    private findDeathMessage(content: string): DeathMessage | null {
        for (const deathMessage of deathMessages)
            if (deathMessage.regex.test(content))
                return deathMessage;
        return null;
    }
}
