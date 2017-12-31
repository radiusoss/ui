'use strict'

var gulp = require('gulp')
var concat = require('gulp-concat')
var sass = require('gulp-sass')

let build = require('@microsoft/web-library-build')
let serial = build.serial

build.tslint.isEnabled = () => false
build.karma.isEnabled = () => process.argv.indexOf('--test') > -1
// build.karma.autoWatch = true

/* Configure TypeScript 2.0. */
build.typescript.setConfig({ 
  typescript: require('typescript'),
  staticMatch: [
    'src/**/*.csv',
    'src/**/*.tsv',
    'src/**/*.json',
    'src/**/*.svg'
  ],
  sourceMatch: [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.js',
    'src/**/*.jsx',
    'typings/main/**/*.ts',
    'typings/main.d.ts',
    'typings/tsd.d.ts',
    'typings/index.d.ts'
  ]
});

// Use css modules.
build.sass.setConfig({
  useCSSModules: true,
  moduleExportName: ''
});

// Set up a "rushBuild" subTask that will spawn rush build
let fs = require('fs');
let spawn = require('child_process').spawn;
let rawStdout = new fs.SyncWriteStream(1, { autoClose: false });
/*
let rushBuild = build.subTask('rushbuild', (gulp, options, done) => {
  let child = spawn(
    'rush',
    ['build', '--to', 'datalayer-pilot']
  );
  child.stdout.on('data', data => rawStdout.write(data));
  child.on('close', done);
});
*/
let rushBuild = build.subTask('rushbuild', (gulp, options, done) => {
  let child = spawn(
    'gulp'
  );
  child.stdout.on('data', data => rawStdout.write(data));
  child.on('close', done);
});

const sourceMatch = [
  'src/**/*.{ts,tsx,scss,js,jsx,txt,html}',
  '!src/**/*.scss.ts'
];

build.task('serve', serial(
  build.serve,
  build.watch(sourceMatch, serial(
    rushBuild,
    build.reload
  ))));

build.serve.setConfig({
  api: null,
  initialPage: '/?kuberRest=http://localhost:9091',
  port: 4326,
  https: false,
  tryCreateDevCertificate: false,
  keyPath: undefined,
  certPath: undefined,
  pfxPath: undefined
});
  
gulp.task('scss', function () {
  return gulp.src('./scss/kuber-plane.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('kuber-plane.css'))
  .pipe(gulp.dest('./css'))
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(concat('kuber-plane.min.css'))
  .pipe(gulp.dest('./css'));
});

// Watching SCSS files
gulp.task('scss:watch', function () {
  gulp.watch('./scss/**/*.scss', ['sass']);
});

build.initialize(gulp);
