var fs = require('node:fs');
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
// Load node modules
const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
console.log(process.env.NODE_ENV, envFile);
dotenv.config({ path: envFile });
// `environment.ts` file structure
const envConfigFile = `export const environment = {
    apiUrl: '${process.env.API_URL}',
    production: ${process.env.PRODUCTION},
};`;

console.log('The file `environment.ts` will be written with the following content: \n');
console.log(envConfigFile);
fs.writeFile(targetPath, envConfigFile, function (err: any) {
    if (err) {
        throw console.error(err);
    } else {
        console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
    }
});