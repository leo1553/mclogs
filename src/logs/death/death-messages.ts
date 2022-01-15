import { KeyDeathData } from './death.data';

import rawDeathMessages from '../../static/death-messages.json';

interface RawDeathMessage {
    pattern: string;
    groups: string[];
}

export interface DeathMessage {
    regex: RegExp;
    groups: (keyof KeyDeathData)[];
}

export const deathMessages = (rawDeathMessages as RawDeathMessage[])
    .map(deathMessage => ({
        regex: new RegExp(`^\\[Server thread\\/INFO\\]: (${deathMessage.pattern})$`),
        groups: deathMessage.groups.filter(group => !group.startsWith('_'))
    } as DeathMessage))
    .filter(deathMessage => deathMessage.groups.includes('player'));
