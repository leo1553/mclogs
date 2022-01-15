import fs from 'fs';
import path from 'path';
import os from 'os';
import zlib from 'zlib';
import stream from 'stream';
import util from 'util';

import moment from 'moment';
import naturalSort from 'natural-sort';

const tempDir = path.join(os.tmpdir(), 'minecraft-logs-analyzer');

export class LogFiles {
    static datedFileNameRegex = /^(\d{4}-\d{2}-\d{2})/;

    directory: string;

    constructor(directory: string) {
        if (path.isAbsolute(directory))
            this.directory = directory;
        else
            this.directory = path.join(__dirname, '../../', directory);
    }

    getLogFiles(): string[] {
        const files = fs.readdirSync(this.directory)
            .sort(naturalSort());
        return files.map(file => path.join(this.directory, file));
    }

    async readLogFile(file: string): Promise<string[]> {
        if (file.endsWith('.gz'))
            file = await this.extractGzip(file);
        return fs.readFileSync(file, 'utf8').split('\n').filter(line => line.length > 0);
    }

    parseFileDate(filePath: string): Date | undefined {
        const file = path.basename(filePath);
        const match = LogFiles.datedFileNameRegex.exec(file);
        if (match)
            return moment(match[1], 'YYYY-MM-DD').toDate();
        return undefined;
    }

    private async extractGzip(file: string): Promise<string> {
        const baseName = path.basename(file);
        const filePath = path.join(tempDir, baseName.substring(0, baseName.length - 3));
        if (!fs.existsSync(filePath))
            fs.mkdirSync(tempDir, { recursive: true });
        const pipeline = util.promisify(stream.pipeline);
        await pipeline(
            fs.createReadStream(file),
            zlib.createGunzip(),
            fs.createWriteStream(filePath));
        return filePath;
    }
}