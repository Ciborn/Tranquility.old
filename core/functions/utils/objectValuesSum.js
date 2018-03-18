module.exports = function(object) {
    var total = 0;
    Object.values(object).forEach(element => {
        total += element;
    })
    return total;
}