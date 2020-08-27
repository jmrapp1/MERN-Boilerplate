const readline = require("readline");
const fs = require("fs");
const path = require("path");

const WORKSPACE_PATH = './workspace-template';

function isValidDirName(name) {
    const rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
    const rg2=/^\./; // cannot start with dot (.)
    const rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
    return rg1.test(name) && !rg2.test(name) && !rg3.test(name);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function copyWorkspace(from, to) {
    try {
        fs.mkdirSync(to);
    } catch(e) {}

    fs.readdirSync(from).forEach((element) => {
        const stat = fs.lstatSync(path.join(from, element));
        if (stat.isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else if (stat.isSymbolicLink()) {
            fs.symlinkSync(fs.readlinkSync(path.join(from, element)), path.join(to, element));
        } else if (stat.isDirectory() && element.toLowerCase() !== 'node_modules' && element.toLowerCase() !== 'dist') {
            copyWorkspace(path.join(from, element), path.join(to, element));
        }
    });
}

rl.question("What would you like to name the workspace? ", function (name) {
    if (!isValidDirName(name)) {
        console.log('Given name is not a valid directory name.');
        return rl.close();
    }
    console.log(`Copying contents from '${WORKSPACE_PATH}' to ./${name}`);
    copyWorkspace(WORKSPACE_PATH, name);
    console.log(`New workspace created in ./${name}.`);
    rl.close();
});

rl.on("close", function () {
    process.exit(0);
});