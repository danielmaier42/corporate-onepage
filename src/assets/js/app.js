import 'bootstrap';

let App = function () {
	this.initializeEventListeners();

	setTimeout(this.loadInitialPage.bind(this), 500);
};

App.prototype.initializeEventListeners = function () {
	let self = this;

	$('.nav-link').click(function () {
		self.onNavLinkClicked($(this));
	});

	$('.foot-link').click(function () {
		self.onFootLinkClicked($(this));
	});

	$('.modal').on('hidden.bs.modal', function () {
		self.onModalWasHidden($(this));
	});

	$('a').click(function () {
		self.onAnchorClicked($(this));
	});
};

App.prototype.loadInitialPage = function () {
	let windowHash = window.location.hash;

	if (windowHash.length > 0) {
		let targetSelector =  'a[href="' + windowHash + '"]';
		let $targetElement = $(targetSelector);

		if ($targetElement.length > 0) {
			$targetElement.click();
		}
	}
};

App.prototype.onNavLinkClicked = function ($navLink) {
	$navLink.parent().find('.active').removeClass('active');
	$navLink.addClass('active');
};

App.prototype.onFootLinkClicked = function ($footLink) {
	$footLink.parent().find('.active').removeClass('active');
	$footLink.addClass('active');
};

App.prototype.onModalWasHidden = function ($modal) {
	$('a.active').removeClass('active');
	window.location.hash = 'home';
};

App.prototype.onAnchorClicked = function ($anchor) {
	let href = $anchor.attr('href');

	if (href.charAt(0) === '#') {
		window.location.hash = href;
	}
};

$(document).ready(function () {
	let _app = new App();
});
