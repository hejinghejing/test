/**
 * jest测试node模块功能：https://jestjs.io/docs/manual-mocks，
 * UT原则：1、不能依赖外部环境，因此读取/写入文件必须用createMockFromModule来模拟；2、为防止重复的入参影响到测试结果，最好清理mock
 */

// mock的fs模块
const fs = jest.createMockFromModule('fs')
// 实际引用的fs模块
const _fs = jest.requireActual('fs')

// 将_fs的所有属性（值）传给fs
Object.assign(fs, _fs);

let readMocks = {}
let writeMocks = {}

fs.setReadMock = (path, error, data) => {
    readMocks[path] = [error, data]
}

fs.setWriteMock = (path, callback) => {
    writeMocks[path] = callback
}

fs.readFile = (path, options, callback) => {
    // 如果只传了两个参数
    if (callback === undefined) {
        callback = options;
        options = undefined;
    }
    // 如果是mock的path
    if (path in readMocks) {
        callback(...readMocks[path])
        // 等同于callback(mocks[path][0], mocks[path][1])
    } else {
        _fs.readFile(path, options, callback)
    }
}

fs.writeFile = (path, data, options, callback) => {
    if (callback === undefined) {
        callback = options;
        options = undefined;
    }
    if (path in writeMocks) {
        writeMocks[path](path, data, options, callback);
    } else {
        _fs.writeFile(path, data, options, callback)
    }
}

fs.clearMock = () => {
    readMocks = {};
    writeMocks = {};
}

module.exports = fs;