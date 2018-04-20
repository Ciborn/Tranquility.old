const getStringDuration = require('./getStringDuration');
module.exports = function(duration) {
    const remainingTime = getStringDuration(duration, '$d $h $m $s');
    var string = '';
    if (remainingTime[1][0] != 0) {
        string += `$d days, $h hours, $m minutes and $s seconds`;
    } else if (remainingTime[1][1] != 0) {
        string += `$h hours, $m minutes and $s seconds`;
    } else if (remainingTime[1][2] != 0) {
        string += `$m minutes and $s seconds`;
    } else {
        string += `$s seconds`;
    }
    return getStringDuration(new Date(new Date().setHours(0,0,0)+86400000) - new Date().getTime(), string.trim())[0];
}