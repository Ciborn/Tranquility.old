const fs = require('fs');
const util = require('util');
module.exports = class Cache {
    constructor(subDir) {
        if (typeof subDir == 'undefined') {
            this.subDir = null;
        } else {
            this.subDir = subDir;
        }
    }

    writeData(key, value) {
        if (this.subDir == null) {
            this.writePath(`cache/cache.json`, key, value);
        } else {
            if (fs.existsSync(`cache/${this.subDir}`)) {
                this.writePath(`cache/${this.subDir}/cache.json`, key, value);
            } else {
                fs.mkdirSync(`cache/${this.subDir}`);
                this.writePath(`cache/${this.subDir}/cache.json`, key, value);
            }
        }
    }

    writePath(path, key, value) {
        if (fs.existsSync(path)) {
            let data = JSON.parse(fs.readFileSync(path, {encoding: "utf8"}));
            data[key] = value;
            fs.writeFileSync(path, JSON.stringify(/*util.inspect(*/data/*, false, null)*/));
        } else {
            let data = {};
            data[key] = value;
            fs.writeFileSync(path, JSON.stringify(/*util.inspect(*/data/*, false, null)*/));
        }
    }

    set(key, value) {
        if (fs.existsSync('cache')) {
            this.writeData(key, value);
        } else {
            fs.mkdirSync('cache');
            this.writeData(key, value);
        }
    }

    get(key) {
        if (this.subDir == null) {
            return JSON.parse(fs.readFileSync('cache/cache.json'))[key];
        } else {
            return JSON.parse(fs.readFileSync(`cache/${this.subDir}/cache.json`))[key];
        }
    }
}