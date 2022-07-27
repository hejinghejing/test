const db = require('../db.js');
const fs = require('fs')
jest.mock('fs');

describe('db', () => {
    afterEach(() => {
        // 每次运行完一个it就执行afterEach里的内容
        fs.clearMock()
    })
    it('read file data success', async () => {
        const data = [{ task: 'work', done:true }]
        fs.setReadMock('/xxx', null, JSON.stringify(data))
        const readData = await db.read('/xxx');
        expect(readData).toStrictEqual(data);
    })
    it('write file data success', async () => {
        const writeData = [{ task: 'run', done: false }];
        let fakeFile;
        fs.setWriteMock('/yyy', (path, data, options, callback) => {
            fakeFile = data;
            // 不屌用callback不会走到resolve,测试会超时
            callback(null);
        })
        await db.write(writeData, '/yyy');
        expect(fakeFile).toBe(JSON.stringify(writeData)+'\n')
    })
})