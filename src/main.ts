import environment from "./environment";

import { Analyzer } from "./analyzer/analyzer";
import { DataContext } from "./data/data-context";
import { ConfigEntry } from "./data/models/config-entry.model";

(async () => {
    const dataContext = new DataContext({
        dialect: environment.DATABASE_DIALECT,
        host: environment.DATABASE_HOST,
        database: environment.DATABASE_NAME,
        username: environment.DATABASE_USERNAME,
        password: environment.DATABASE_PASSWORD,
    });
    await dataContext.connect();
    await update();

    const analyzer = new Analyzer(dataContext);
    await analyzer.analyzeAll(environment.LOG_DIRECTORY);

    await dataContext.disconnect();
})().then(() => { });

async function update() {
    await ConfigEntry.findOrCreate({
        where: {
            key: 'version'
        },
        defaults: {
            value: '1.0.0'
        }
    });
}
