const poolQuery = require('./../functions/database/poolQuery');
module.exports = class User {
    constructor(user) {
        this.id = user.id;
        this.discordUser = user;
        
        this.fetchStats(this.id);
        this.fetchProfile(this.id);

        this.admin = User.isAdmin(this.id);
    }

    async fetchStats(id) {
        var result = await poolQuery(`SELECT * FROM activity WHERE userId='${id}'`);
        this.stats = result[0];
    }

    async fetchProfile(id) {
        var result = await poolQuery(`SELECT * FROM profiles WHERE userId='${id}'`);
        console.log(result[0]);
        this.profile = result[0];
    }

    static isAdmin(id) {
        const admins = [
            '310296184436817930', // Nightmare#1234
            '320933389513523220' // Ciborn#2844
        ];
        return admins.indexOf(id) != -1 ? true : false;
    }
}