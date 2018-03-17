const poolQuery = require('./../database/poolQuery');
module.exports = function(userId, callback) {
    var allMembers = new Map();
    var embedMembersList = '';
    var userIndex = 0;
    
    poolQuery(`SELECT * FROM activity`).then(dbData => {
        dbData.forEach(element => {
            allMembers.set(element.userId, JSON.parse(element.msgCount).total);
        });
        
        allMembers[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        }
    
        var allMembersIndex = 0;
        for (let [key, value] of allMembers) {
            allMembersIndex++;
            if (key == userId) {
                callback(allMembersIndex);
            }
        }
    })
}