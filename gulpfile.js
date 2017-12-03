"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp        = require("gulp"),
    gulpTslint  = require("gulp-tslint"),
    tslint      = require("tslint"),
    tsc         = require("gulp-typescript"),
    sourcemaps  = require("gulp-sourcemaps"),
    runSequence = require("run-sequence"),
    mocha       = require("gulp-mocha"),
    istanbul    = require("gulp-istanbul"),
    del         = require('del');

//******************************************************************************
//* CLEAN
//******************************************************************************
gulp.task("clean", function() {
    return del([
        "src/**/*.js",
        "test/**/*.test.js",
        "src/*.js",
        "test/*.test.js",
        "lib",
        "es",
        "amd"
    ]);
});

//******************************************************************************
//* LINT
//******************************************************************************
gulp.task("lint", function() {
    
    var program = tslint.Linter.createProgram("./tsconfig.json");
    
    return gulp.src([
        "src/**/**.ts",
        "test/**/**.test.ts"
    ])
    .pipe(gulpTslint({ program }))
    .pipe(gulpTslint.report());

});

//******************************************************************************
//* BUILD
//******************************************************************************
var tsLibProject = tsc.createProject("tsconfig.json", { module : "commonjs", typescript: require("typescript") });

gulp.task("build-lib", function() {
    return gulp.src([
        "src/**/*.ts"
    ])
    .pipe(tsLibProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(gulp.dest("lib/"));
});

var tsAmdProject = tsc.createProject("tsconfig.json", { module : "amd", typescript: require("typescript") });

gulp.task("build-amd", function() {
    return gulp.src([
        "src/**/*.ts"
    ])
    .pipe(tsAmdProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(gulp.dest("amd/"));
});

var tsEsProject = tsc.createProject("tsconfig.json", { module : "es2015", typescript: require("typescript") });

gulp.task("build-es", function() {
    return gulp.src([
        "src/**/*.ts"
    ])
    .pipe(tsEsProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(gulp.dest("es/"));
});

var tsDtsProject = tsc.createProject("tsconfig.json", {
    declaration: true,
    noResolve: false,
    typescript: require("typescript") 
});

gulp.task("build-dts", function() {
    return gulp.src([
        "src/**/*.ts"
    ])
    .pipe(tsDtsProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .dts.pipe(gulp.dest("dts"));

});

//******************************************************************************
//* TESTS
//******************************************************************************
var tstProject = tsc.createProject("tsconfig.json", { typescript: require("typescript") });

gulp.task("build-src", function() {
    return gulp.src([
        "src/**/*.ts"
    ])
    .pipe(sourcemaps.init())
    .pipe(tstProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(sourcemaps.write(".", {
        sourceRoot: function(file) {
            return file.cwd + '/src';
        }
    }))
    .pipe(gulp.dest("src/"));
});

var tsTestProject = tsc.createProject("tsconfig.json", { typescript: require("typescript") });

gulp.task("build-test", function() {
    return gulp.src([
        "src/**/*.ts",
        "test/**/*.ts"
    ])
    .pipe(sourcemaps.init())
    .pipe(tsTestProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(sourcemaps.write(".", {
        sourceRoot: function(file) {
            return file.cwd + '/test';
        }
    }))
    .pipe(gulp.dest("test/"));
});

gulp.task("test", [ "istanbul:hook" ], function() {
  return gulp.src([
      "node_modules/reflect-metadata/Reflect.js",
      "test/**/*.test.js"
    ])
    .pipe(mocha({ui: "bdd"}))
    .on("error", function (err) {
        process.exit(1);
    })
    .pipe(istanbul.writeReports());
});

gulp.task("istanbul:hook", function() {
  return gulp.src(["src/**/*.js"])
      .pipe(istanbul())
      .pipe(sourcemaps.write("."))
      .pipe(istanbul.hookRequire());
});

//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task("build", function(cb) {
    runSequence(
        "lint", 
        [
            "build-src",
            "build-es",
            "build-lib",
            "build-amd",
            "build-dts"
        ],
        "build-test", cb
    );
});

gulp.task("default", function (cb) {
  runSequence(
    "clean",
    "build",
    "test",
    cb);
});