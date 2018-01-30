var gulp = require('gulp');
var cfg = require('./conf/config');
var zip = require('gulp-zip');
var fs = require('fs');
var serverConfig = cfg.serverConfig;
var publishConfig = cfg.publishConfig;

function errHandle(err) {
    console.log(err);
    util.log(err.fileName + '文件编译出错，出错行数为' + err.lineNumber + '，具体错误信息为：' + err.message);
    this.end();
};



gulp.task("package", function () {
    gulp.src(['currency/**', "!currency/**/*.map"]).pipe(zip('dist.war')).pipe(gulp.dest('./'));
    console.info('package ok!');
});
//安装到maven中
gulp.task("install", function () {

    if (!publishConfig) {
        console.console.error("can't find publishConfig in config.js");
    }
    var targetPath = fs.realpathSync('.');
    var installCommandStr = publishConfig.command + " install:install-file -Dfile=" + targetPath + "/dist.war   -DgroupId=" + publishConfig.groupId + " -DartifactId=" + publishConfig.artifactId + "  -Dversion=" + publishConfig.version + " -Dpackaging=war";
    console.log("=========");
    console.log("targetPath" + targetPath);
    console.log(installCommandStr);
    var process = require('child_process');
    var installWarProcess = process.exec(installCommandStr, function (err, stdout, stderr) {
        if (err) {
            console.log('install war error:' + stderr);
        }
    });
    installWarProcess.stdout.on('data', function (data) {
        console.info(data);
    });
    installWarProcess.on('exit', function (data) {
        console.info('install war success');
    })
})
//发布到maven仓库中
gulp.task("deploy", function () {
    if (!publishConfig) {
        console.console.error("can't find publishConfig in config.js");
    }
    var process = require('child_process');
    var targetPath = fs.realpathSync('.');
    var publishCommandStr = publishConfig.command + " deploy:deploy-file  -Dfile=" + targetPath + "/dist.war   -DgroupId=" + publishConfig.groupId + " -DartifactId=" + publishConfig.artifactId + "  -Dversion=" + publishConfig.version + " -Dpackaging=war  -DrepositoryId=" + publishConfig.repositoryId + " -Durl=" + publishConfig.repositoryURL;
    console.info(publishCommandStr);
    var publishWarProcess = process.exec(publishCommandStr, function (err, stdout, stderr) {
        if (err) {
            console.log('publish war error:' + stderr);
        }
    });

    publishWarProcess.stdout.on('data', function (data) {
        console.info(data);
    });
    publishWarProcess.on('exit', function (data) {
        console.info('publish  war success');
    });

});



gulp.task('copy', ['copy:fonts']);
gulp.task('before', ['copy', 'copy:static', 'less']);
gulp.task('default', ['before', 'dev-server', 'watch']);
gulp.task('deploys',['package','install','deploy']);
//gulp.task('trans-test', ['translate', 'dev-server','watch']);
