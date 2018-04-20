module.exports = function(userId) {
    const admins = [
        '310296184436817930', // Nightmare#1234
        '320933389513523220' // Ciborn#2844
    ];
    return admins.indexOf(userId) != -1 ? true : false;
}