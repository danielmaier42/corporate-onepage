const md5 = require('js-md5');

module.exports = function (context) {

    let email = context.hash.email.toLowerCase().trim();
    let size = context.hash.size !== undefined ? parseInt(context.hash.size) : 500;

    return 'https://www.gravatar.com/avatar/' + md5(email) + '?s=' + size;
};
