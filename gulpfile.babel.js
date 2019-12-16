'use strict';

import plugins from 'gulp-load-plugins';
import yargs from 'yargs';
import browser from 'browser-sync';
import gulp from 'gulp';
import panini from 'panini';
import rimraf from 'rimraf';
import yaml from 'js-yaml';
import fs from 'fs';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import path from 'path';

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Check for --server flag
const SERVER = !!(yargs.argv.server);

// Define stats for server and javascript task
const WEBPACK_STATS = {
	modules: false,
	colors: true
};

// Set node envirmoment by reference to PRODUCTION
const ENV = PRODUCTION ? 'production' : 'development';

// Load settings from config.yml
const {COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS} = loadConfig();

function loadConfig() {
	let ymlFile = fs.readFileSync('config.yml', 'utf8');
	return yaml.load(ymlFile);
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
	gulp.series(clean, gulp.parallel(pages, images, copy, sprite, sass, javascript)));

// Build the site  and watch for file changes
gulp.task('default',
	gulp.series('build', watch));

// Build the site, run the server, and watch for file changes
gulp.task('default:server',
	gulp.series('build', server, watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
	rimraf(PATHS.dist.dist, done);
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
	return gulp.src(PATHS.assets)
		.pipe(gulp.dest(PATHS.dist.assets));
}

// Copy page templates into finished HTML files
function pages() {
	return gulp.src(PATHS.src.src + '/pages/**/*.{html,hbs,handlebars}')
		.pipe(panini({
			root: PATHS.src.src + '/pages/',
			layouts: PATHS.src.src + '/layouts/',
			partials: PATHS.src.src + '/partials/',
			data: PATHS.src.src + '/data/',
			helpers: PATHS.src.src + '/helpers/'
		}))
		.pipe(gulp.dest(PATHS.dist.dist));
}

// Load updated HTML templates and partials into Panini
function resetPages(done) {
	panini.refresh();
	done();
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
	return gulp.src(PATHS.src.css + '/app.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			includePaths: PATHS.sass
		})
			.on('error', $.sass.logError))
		.pipe($.autoprefixer({
			browsers: COMPATIBILITY
		}))
		// Comment in the pipe below to run UnCSS in production
		//.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
		.pipe($.if(PRODUCTION, $.cleanCss({compatibility: 'ie9'})))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe(gulp.dest(PATHS.dist.css))
}

let webpackConfig = {
	mode: 'production',
	entry: {
		app: [
			'./' + PATHS.src.js + '/app.js'
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					chunks: "initial",
					name: "vendor",
					enforce: true
				}
			}
		}
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, PATHS.dist.js),
		publicPath: PATHS.js.publicPath
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					presets: [
						['es2015', {modules: false}]
					]
				}
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(ENV)
			}
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			Popper: ['popper.js', 'default'],
			bootstrap: 'bootstrap'
		})
	]
};

if (!PRODUCTION) {
	if (SERVER) {
		webpackConfig.entry.app.push(
			`webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr&noInfo=true`
		);

		webpackConfig.plugins.push(
			new webpack.HotModuleReplacementPlugin(),
		)
	} else {
		webpackConfig.watch = true
	}

	webpackConfig.plugins.push(
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.SourceMapDevToolPlugin({
			filename: '[name].js.map',
			exclude: [
				'vendor.js'
			]
		})
	)
} else {
	webpackConfig.plugins.push(
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),

		new UglifyJsPlugin({
			beautify: false,
			mangle: {
				screw_ie8: true,
				keep_fnames: true
			},
			compress: {
				screw_ie8: true
			},
			comments: false
		})
	);
}



function javascript() {
	const TASK_NAME = 'JavaScript (Webpack)';

	return new Promise(resolve => webpack(webpackConfig, (err, stats) => {
		if (err) {
			throw new $.util.PluginError({
				plugin: TASK_NAME,
				message: err
			});
		}

		$.util.log(TASK_NAME, stats.toString(WEBPACK_STATS));

		resolve()
	}))
}

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
	return gulp.src(PATHS.src.img + '/**/*')
		.pipe(gulp.dest(PATHS.dist.img));
}

// Start a server with BrowserSync to preview the site in
function server(done) {
	let compiler = webpack(webpackConfig);

	browser.init({
		server: {
			baseDir: PATHS.dist.dist,
			middleware: [
				webpackDevMiddleware(compiler, {
					publicPath: webpackConfig.output.publicPath,
					stats: WEBPACK_STATS
				}),
				webpackHotMiddleware(compiler)
			]
		},
		files: [
			PATHS.dist.css + '/*.css',
			PATHS.dist.dist + '/**/*.html'
		],
		open: false,
		port: PORT
	});

	done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
    gulp.watch(PATHS.assets, copy);
    gulp.watch(PATHS.src.src + '/pages/**/*.html', pages);
    gulp.watch(PATHS.src.src + '/{layouts,partials}/**/*.html').on('all', gulp.series(resetPages, pages));
    gulp.watch(PATHS.src.src + '/data/**/*.{js,json,yml}').on('all', gulp.series(resetPages, pages));
    gulp.watch(PATHS.src.src + '/helpers/**/*.js').on('all', gulp.series(resetPages, pages));
    gulp.watch(PATHS.src.css + '/**/*.scss', sass);
    gulp.watch(PATHS.src.img + '/**/*', images);
    gulp.watch(PATHS.src.sprite + '/*.svg', sprite);
}

// Build an svg sprite
function sprite() {
	return gulp.src(PATHS.src.sprite + '/*.svg')
		.pipe($.svgstore())
		.pipe(gulp.dest(PATHS.dist.sprite))
}

function iconfont() {
	return gulp.src(PATHS.src.iconfont + '/*.svg')
		.pipe($.iconfont({
			fontName: 'icon',
			prependUnicode: true,
			fontFormats: ['ttf', 'eot', 'woff'],
			timestamp: Math.round(Date.now() / 1000)
		}))
		.on('glyphs', function (glyphs, options) {
			gulp.src('.build/iconFontTemplate.txt')
				.pipe($.consolidate('lodash', {
					fontName: 'icon',
					glyphs: glyphs,
					fontPath: '../fonts/iconfont/',
					className: 'icon'
				}))
				.pipe($.rename('_iconfont.scss'))
				.pipe(gulp.dest(PATHS.src.css + '/_generated'))
		})
		.pipe(gulp.dest(PATHS.dist.iconfont))
}

export {iconfont as iconfont};
