const gulp = require('gulp');
const ts = require("gulp-typescript");
const gnf = require('gulp-npm-files');
const open = require('gulp-open');
const nodemon = require('gulp-nodemon');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');

const paths = {
    src: "src/",
    srcFiles: ["src/public/**/*.ts", "src/public/**/*.html", "src/public/**/*.css"],
    srcTsFiles: "src/public/**/*.ts",
    srcHtmlFiles: "src/public/**/*.html",
    srcCssFiles: "src/public/**/*.css",
    srcServerFiles: "src/**/*.css",
    srcImages : './src/public/images/**/*.*',
    index: "src/index.html",
    dist: "dist/",
    tmp: "tmp/",
    server : 'dist/server.js'
};


var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    // Copy NPM dependencies
    gulp
        .src(gnf(null, './package.json'), {base:'./'})
        .pipe(gulp.dest(paths.dist));

    // Compile Typescript
    tsProject.src(paths.srcTsFiles, {base:'./'})
        .pipe(ts(tsProject)).js
        .pipe(gulp.dest(paths.dist));

    // Copy CSS
    gulp.src(paths.srcCssFiles, {base:'./src/'})
        .pipe(gulp.dest(paths.dist));

    // Copy Images
    gulp.src(paths.srcImages, {base:'./src/'})
        .pipe(gulp.dest(paths.dist));

    // Copy HTML
    return gulp.src(paths.srcHtmlFiles, {base:'./src/'})
        .pipe(gulp.dest(paths.dist))

});

gulp.task('clean', function(){
    return gulp.src([paths.distAll, paths.buildAll], {read:false})
    .pipe(clean());
});

gulp.task("watch", function() {
    gulp.watch(paths.srcFiles, ['build']);
});

gulp.task('node', [], function(){
    runSequence('build', 'watch', function(){
        nodemon({
            script: paths.server
            , ext: 'js html'
            //, env: { 'NODE_ENV': 'development' }
        });
    });
});

gulp.task("default", ["build", "node"]);
