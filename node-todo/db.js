const fs = require('fs');
const path = require('path')


// 获取系统默认的home目录（~/）：
const homedir = require('os').homedir();
// 获取用户设置的home目录：mac、linux下使用：process.env.HOME;windows下使用:process.env.USERPROFILE
// eslint-disable-next-line no-undef
const home = process.env.HOME || homedir;
// 数据储存在这里
const dbPath = path.join(home, 'myData.json')

const db = {
    read: (path = dbPath) => {
        return new Promise((resolve, reject) => {
            // flag为a+，文件在当前路径不存在时会自动创建，相关文档：https://devdocs.io/node/fs#file-system-flags
            fs.readFile(path, {
                flag: 'a+'
            }, (err, data) => {
                if (err) return reject(`读取数据失败：${err}`)
                let list;
                try {
                    list = JSON.parse(data.toString())
                } catch (error) {
                    list = []
                }
                resolve(list)
            })
        })
    },
    write: (list, path = dbPath) => {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(list) + '\n';
            fs.writeFile(path, data, 'utf8', (err) => {
                if (err) return reject(`写入数据失败：${err}`)
                resolve()
            })
        })
    }
}

module.exports = db;