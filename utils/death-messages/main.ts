import fs from 'fs';
import path from 'path';

// Taken from:
//     https://minecraft.fandom.com/wiki/Death_messages
// Script: 
//     $x("//ul/li/b[text()]").map(x => x.innerText)
import deathMessages from './death-messages.json';

function indexOrUndefined(message: string, key: string | string[], position?: number): number | undefined {
    if (typeof key === 'string')
        key = [key];
    for (const k of key) {
        const index = message.indexOf(k, position);
        if (index !== -1)
            return index;
    }
    return undefined;
}

const distinctDeathMessages = [...new Set(deathMessages)];
const messages = [];

for (const deathMessage of distinctDeathMessages) {
    const playerIndex = indexOrUndefined(deathMessage, '<player>');
    if (playerIndex === undefined)
        continue;

    const killerIndex = indexOrUndefined(deathMessage, ['<player/mob>', '<player>'], playerIndex + 1);
    const itemIndex = indexOrUndefined(deathMessage, '<item>');

    const indexes = [
        { key: 'player', value: playerIndex },
        { key: 'killer', value: killerIndex },
        { key: 'item', value: itemIndex }
    ]
        .filter(x => x.value !== undefined)
        .sort((a, b) => a.value! - b.value!);
    /*  .map((x, i) => ({ key: x.key, value: (i + 1) }));
    
    const groups = indexes.reduce((groups: any, x) => {
        groups[x.key] = x.value;
        return groups;
    }, {} as { [key: string]: number });
    */
    const groups = indexes.map(x => x.key);

    const obj = {
        pattern: deathMessage
            .replace('<player>', '([^ ]+)')
            .replace('<player>', '([^ ]+)')
            .replace('<player/mob>', '(.+)')
            .replace('<item>', '(.+)'),
        groups
    };
    messages.push(obj);
}

//------------
// Write file
//------------
const outputDir = path.join(__dirname, '..', 'generated');
const outputFile = path.join(outputDir, 'death-messages.json');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.writeFileSync(outputFile, JSON.stringify(messages, null, '\t'));
