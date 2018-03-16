const pool = require('./returnPool.js');
module.exports = function(query) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query(query, function(err, result) {
                    connection.release();
                    resolve(result);
                });
            }
        });
    });
}