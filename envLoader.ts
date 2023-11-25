const fs = require('node:fs');
const dotenv = require('dotenv');
const targetPath = __dirname + '/src/environments/environment.json';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'prod'}` });
const envConfigFile = `{
    "apiUrl": "${process.env.API_URL}",
    "production": ${process.env.PRODUCTION},
    "clerk": "${process.env.CLERK_PUBLIC_KEY}"
}`;

fs.writeFile(targetPath, envConfigFile, function (err: any) {
    if (err) {
        throw console.error(err);
    } else {
        console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
        fs.writeFile(targetPath, envConfigFile, function (err: any) {
            if (err) {
                throw console.error(err);
            } else {
                console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
            }
        });
    }
});
