var fs = require('node:fs');

// Dev environment.ts
// Configure Angular `environment.ts` file path
let targetPath = './src/environments/environment.ts';
// Load node modules
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
// `environment.ts` file structure
let envConfigFile = `export const environment = {
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

// Prod environment.prod.ts
targetPath = './src/environments/environment.prod.ts';
dotenv.config({ path: '.env.prod' });
envConfigFile = `export const environment = {
    apiUrl: '${process.env.API_URL}',
    production: ${process.env.PRODUCTION},
};`;

console.log('The file `environment.prod.ts` will be written with the following content: \n');
console.log(envConfigFile);
fs.writeFile(targetPath, envConfigFile, function (err: any) {
    if (err) {
        throw console.error(err);
    } else {
        console.log(`Angular environment.prod.ts file generated correctly at ${targetPath} \n`);
    }
});