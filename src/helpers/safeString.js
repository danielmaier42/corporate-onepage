const Handlebars = require('handlebars');

module.exports = function (value) {
    return new Handlebars.SafeString(value);
};
