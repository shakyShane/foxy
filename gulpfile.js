"use strict";

var gulp    = require("gulp");
var traceur = require("gulp-traceur");
var beeper    = require("beeper");
var combiner = require("stream-combiner2");
var testSrc = "test/src/**";

gulp.task("es6", function () {

    var combined = combiner.obj([
        gulp.src(testSrc),
        traceur(),
        gulp.dest("test/specs")
    ]);

    // any errors in the above streams will get caught
    // by this listener, instead of being thrown:
    combined.on("error", function (err) {
        beeper();
        console.log(err);
    });

    return combined;
});

gulp.task("default", function () {
    gulp.watch(testSrc, ["es6"]);
});
