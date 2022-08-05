/*
 * @Author: pym
 * @Date: 2022-07-24 21:38:44
 * @LastEditors: ympang && 995637308@qq.com
 * @Description: Description
 * @LastEditTime: 2022-07-25 11:45:17
 * @FilePath: \one_web\lib\create.js
 */
const downloadGitRepo = require("download-git-repo");
const inquirer = require("inquirer");
const ora = require("ora");
const util = require("util");
const path = require("path");

const { getTagsByRepo } = require('./api')
// create.js
// 当前函数中可能存在很多异步操作，因此我们将其包装为 async
module.exports = async function (projectName, options) {
    const tag = await getRepoInfo()
    const downloadGitRepoPromise = util.promisify(downloadGitRepo);
    console.log(tag)
    download(projectName, 'v0.0.1', downloadGitRepoPromise)
};

async function download(projectName, tag, downloadGitRepo) {
    // 模板下载地址
    const templateUrl = `PangYiMing/react-frame${tag ? "#" + tag : ""}`;
    const targetPath = path.join(process.cwd(), projectName)
    console.log(targetPath)
    // 调用 downloadGitRepo 方法将对应模板下载到指定目录
    await loading(
        "downloading template, please wait",
        downloadGitRepo,
        templateUrl,
        targetPath // 项目创建位置
    );
}
/**
 * 睡觉函数
 * @param {Number} n 睡眠时间
 */
function sleep(n) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, n);
    });
}

async function loading(message, fn, ...args) {
    const spinner = ora(message);
    spinner.start(); // 开启加载
    try {
        let executeRes = await fn(...args);
        // 加载成功
        spinner.succeed();
        return executeRes;
    } catch (error) {
        // 加载失败
        spinner.fail("request fail, refetching");
        await sleep(1000);
        // 重新拉取
        return loading(message, fn, ...args);
    }
}

// 获取模板信息及用户最终选择的模板
async function getRepoInfo() {

    // 获取组织下的仓库信息
    let tags = await getTagsByRepo();
    // 提取仓库名
    const taglist = tags.map((item) => item.name);
    // 选取模板信息
    let { tag } = await new inquirer.prompt([
        {
            name: "tag",
            type: "list",
            message: "Please choose a template",
            choices: taglist,
        },
    ]);


    return tag;
}


