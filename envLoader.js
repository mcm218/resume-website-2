/* server.js in root directory */
var fs = require('fs');
var path = require('path');

var dir = "src/environments";
var file = "environment.js";
var prodFile = "environment.prod.js"; // For production deployment

var content = process.env.ENVIRONMENT_DETAILS;

fs.access(dir, fs.constants.F_OK, function (err) {
    if (err) {
        // Directory doesn't exist
        console.log("src doesn't exist, creating now", process.cwd());
        // Create /src
        try {
            fs.mkdirSync(dir, { recursive: true });
        }
        catch (error) {
            console.log("Error while creating " + dir + ". Error is " + "error");
            process.exit(1);
        }
    }
    // Now write to file
    try {
        fs.writeFileSync(dir + "/" + file, content);
        fs.writeFileSync(dir + "/" + prodFile, content);
        console.log("Created successfully in", process.cwd());
        if (fs.existsSync(dir + "/" + file)) {
            console.log("File is created", path.resolve(dir + "/" + file));
            var str = fs.readFileSync(dir + "/" + file).toString();
            console.log(str);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});