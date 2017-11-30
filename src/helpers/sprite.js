const Handlebars = require('handlebars');

module.exports = function (symbol) {

	let html = `
		<svg class="sprite sprite--${symbol}">
			<use xlink:href='assets/sprite/sprite.svg#${symbol}'></use>
		</svg>
	`;

	return new Handlebars.SafeString(html);
};
