module.exports = function(totalXp) {
    var foundLevel = 0;
    var rest = 0;
    var computingLevel = 1000;
    var computingXp = Math.floor(totalXp);
    if (totalXp > 153) {
        do {
            if (computingXp - Math.floor(50 + Math.pow(computingLevel * 20, 1.55)) >= 0) {
                foundLevel = computingLevel;
                rest = (computingXp - Math.floor(50 + Math.pow((computingLevel+1) * 20, 1.55))) * -1;
            } else {
                computingLevel--;
            }
        } while (foundLevel == 0);
    } else {
        foundLevel = 0;
    }
    return [foundLevel, Math.floor(50 + Math.pow((foundLevel+1) * 20, 1.55)) - Math.floor(50 + Math.pow(foundLevel * 20, 1.55)), rest];
}