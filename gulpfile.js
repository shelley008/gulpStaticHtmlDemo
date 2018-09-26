//引入gulp模块
var gulp = require('gulp');
//1引入实时刷新插件
var browserSync = require('browser-sync').create();
//2引入js压缩插件
var uglify = require('gulp-uglify');
//3引入html压缩插件
var htmlmin = require('gulp-htmlmin');
//4引入模板复用插件
var fileinclude = require('gulp-file-include');
//5引入sass 预处理器插件
var sass = require('gulp-sass');
//6引入自动处理浏览器前缀插件
var autoprefixer = require('gulp-autoprefixer');
//7引入css压缩插件
var cssnano = require('gulp-cssnano');
//8引入更名挺件
var rename = require('gulp-rename');
//9引入压缩图片挺件
var imagemin = require('gulp-rename');
//10引入js转码器 将ES6代码转为ES5代码
var babel = require('gulp-babel');


// gulp.task('default',function(){
//     console.log('gulp启动成功');
// })


//配置html打包
gulp.task('html',function(){
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src("src/view/**/*.html")
        .pipe(htmlmin(options))
        .pipe(fileinclude())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
})

//配置js打包
gulp.task('js',function(){
    gulp.src('src/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream())
        .pipe(uglify())
        .pipe(rename({
            suffix:'.min'
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
})

//配置css
gulp.task('css',function(){
    gulp.src('src/style/entry.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(autoprefixer(['last 4 version','last 2 Explorer versions']))
        .pipe(gulp.dest('dist/style'))
        .pipe(browserSync.stream())
        .pipe(cssnano())
        .pipe(rename({
            suffix:'.min'
        }))
        .pipe(gulp.dest('dist/style'))
        .pipe(browserSync.stream());
})


//配置image
gulp.task('images',function(){
    //要处理的图片目录为images目录下的所有的.jpg .png .gif 格式的图片;
    return gulp.src('src/images/**/*.{jpg,png,gif,svg,ico}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.stream());
})





// 设置任务---架设静态服务器
// gulp.task('serve',['css', 'images','html', 'js'],function(){
//     browserSync.init({
//         files:['**'],
//         watch:true,
//         server:{
//             baseDir:'dist',       //设置服务器的根目录
//             index:'index.html'    // 指定默认打开的文件
//         },
//         port:8050,                 // 指定访问服务器的端口号
//         callbacks:{
//            ready:function(){
//                console.log('22222')
//            }
//         },
//        // browser:['chrome','firefox']
//         browser:['chrome']
//
//     });
//     gulp.watch("src/style/**/*.scss", ['css']);
//     gulp.watch("src/view/**/*.html", ['html']);
//     gulp.watch("src/images/**/*.*", ['images']);
//     gulp.watch("src/js/*.js", ['scripts']);
// })




//静态服务器 + 监听 scss/images/html/js 文件
gulp.task('serve',['css', 'images','html', 'js'],function(){
    browserSync.init({
        server:"dist"
    });
    gulp.watch("src/style/**/*.scss", ['css']);
    gulp.watch("src/view/**/*.html", ['html']);
    gulp.watch("src/images/**/*.*", ['images']);
    gulp.watch("src/js/*.js", ['scripts']);
})




//配置启动方式
// gulp.task('default', ['sass', 'images', 'html', 'js'], () => {
//     gulp.start("serve","html","sass","images","js")
// })
gulp.task('default', ['serve'])