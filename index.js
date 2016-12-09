'use strict';

var readline = require('readline');
var content = require('./data/content.js');
var walk = require("walk");
var fs = require('fs-extra');
var dirname = process.cwd(); //当前路径

var projectName;
var projectVersion;

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * 执行pagium初始化项目工程方法
 */
function run() {
    rl.question('Your project Name? default(pagium-dev)', function (answer) {
        projectName = answer;
        if (!projectName) {
            projectName = 'pagium-dev';
        }
        if (!fs.existsSync(process.cwd() + "/" + projectName)) {
            fs.mkdirSync(process.cwd() + "/" + projectName);
        }
        rl.question('Your project Version? default(v1.0.0)', function (answer) {
            projectVersion = answer;
            if (!projectVersion) {
                projectVersion = 'v1.0.0';
            }
            moveFiles(projectName, function() {
                rl.close();
            });
        });
    });

}

function moveFiles(projectName, callback) {
    var self = this;
    var walker = walk.walk(__dirname + "/demo/");

    /**
     * 检测到文件
     *
     * @event on file
     */ 
    walker.on("file", function(root, fileStats, next) {
        if (fileStats && fileStats.type == "file") {
            var parentPath = __dirname + "/demo/";
            var parentLen = parentPath.length;
            var filePath = root.substr(parentPath.indexOf(parentPath) + parentLen);
            fs.copy(root + "/" + fileStats.name, projectName + filePath + "/" + fileStats.name, function (err) {
                if (err) return console.error(err)
                console.log("create: ".green + projectName + filePath + "/" + fileStats.name);
            });
        }
        next();
    });

    /**
     * 检测到文件夹
     *
     * @event on file
     */ 
    walker.on("directory", function(root, fileStats, next) {
        var parentPath = __dirname + "/demo/";
        var parentLen = parentPath.length;
        var filePath = root.substr(parentPath.indexOf(parentPath) + parentLen);
        if (!fs.existsSync(projectName + filePath)) {
            fs.mkdirSync(projectName + filePath);
        }
        next();
    })

    /**
     * 检测爬虫结束
     *
     * @event on end
     */
    walker.on("end", function() {
        fs.writeJson(projectName + "/package.json", content.getPackage(projectName, projectVersion)); // 写 package js
        callback && callback();
    });
}

module.exports = {
    run: run
}