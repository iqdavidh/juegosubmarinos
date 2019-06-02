const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const getCodeFecha = require("./codeFecha");


function crearScript() {

    let code = getCodeFecha();

    let buildTS = `\n/*FBUILD*/ console.log( 'FBUILD-${code}');  /*FBUILD*/\n`;

    console.log(`app - creando script ******************* ${code}`);
    return gulp
        .src("./src/*.js")
        .pipe($.sourcemaps.init())
        .pipe($.concat("app.js"))
        .pipe($.flowtype({all:false }))
        .pipe($.insert.append(buildTS))
        .pipe($.sourcemaps.write("."))
        .pipe(gulp.dest("public"))
        ;
}

gulp.task("default", () => {
    gulp.watch("./src", {delay: 2000}, crearScript);
});

gulp.task("crear", crearScript);
