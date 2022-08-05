/*
 * @Author: pym
 * @Date: 2022-07-25 09:47:00
 * @LastEditors: ympang && 995637308@qq.com
 * @Description: Description
 * @LastEditTime: 2022-07-25 11:38:48
 * @FilePath: \one_web\lib\api.js
 */
const axios = require("axios");

// 拦截全局请求响应
axios.interceptors.response.use((res) => {
    return res.data;
});

/**
 * 获取模板
 * @returns Promise 仓库信息
 */
async function getZhuRongRepo() {
    return axios.get("https://api.github.com/orgs/zhurong-cli/repos");
}

/**
 * 获取仓库下的版本
 * @param {string} repo 模板名称
 * @returns Promise 版本信息
 */
async function getTagsByRepo(repo) {
    return axios.get(`https://api.github.com/repos/PangYiMing/react-frame/tags`);
}

module.exports = {
    getZhuRongRepo,
    getTagsByRepo,
};