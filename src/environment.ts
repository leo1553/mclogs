import path from "path";
import yenv from "yenv";

const currentEnv = process.env.NODE_ENV;

const rootDir = path.join(__dirname, '..');
const envDir = path.join(rootDir, 'env');
const envPath = path.join(envDir, `${currentEnv}.yml`);

const environment = yenv(envPath, { env: currentEnv });

export default environment;
