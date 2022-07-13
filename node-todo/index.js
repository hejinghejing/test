const db = require('./db');
const inquirer = require('inquirer');

const add = async (task) => {
    const list = await db.read();
    list.push({ task: task.join(' '), done: false });
    await db.write(list);
}

const clear = async () => {
    await db.write([]);
}

const updateTask = (list, say = '操作成功！') => {
    db.write(list)
    console.log(say);
}

const updateTaskName = (list, index) => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newTask',
            message: '请输入新的任务名称',
            default: list[index].task
        },
    ]).then(inputNewTask => {
        list[index].task = inputNewTask.newTask;
        updateTask(list)
    })
}

const markAsDone = (list, index) => {
    list[index].done = true;
    updateTask(list)
}

const markAsUndone = (list, index) => {
    list[index].done = false;
    updateTask(list)
}

const deleteTask = (list, index) => {
    list.splice(index, 1)
    updateTask(list)
}

const showAllTask = (list, index) => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'operation',
                message: '请选择操作',
                choices: [
                    { name: '修改任务名称', value: 'updateTaskName' },
                    { name: '已完成', value: 'markAsDone' },
                    { name: '未完成', value: 'markAsUndone' },
                    { name: '删除', value: 'deleteTask' },
                    new inquirer.Separator(),
                    { name: '退出', value: 'quit' }
                ]
            },
        ]).then(async (choiceOperation) => {
            const operationFunction = {
                updateTaskName,
                markAsDone,
                markAsUndone,
                deleteTask
            }
            if(operationFunction[choiceOperation.operation]) operationFunction[choiceOperation.operation](list, index)
        }).catch((error) => {
            console.log('error', error);
        });
}

const addTask = (list) => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newTask',
            message: '请输入任务名称',
        },
    ]).then(inputNewTask => {
        list.push({ task: inputNewTask.newTask, done: false })
        updateTask(list, '添加任务成功');
    })
}

const showAll = async () => {
    const list = await db.read();
    const choiceList = list.map(({ task, done }, index) => ({ name: `${done ? '✔' : '✖'} ${index + 1}.${task}`, value: index.toString() }))

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'task',
                message: '请选择你想操作的任务：',
                choices: [
                    ...choiceList,
                    new inquirer.Separator(),
                    { name: '添加任务', value: '-2' },
                    { name: '退出', value: '-1' }
                ]
            },
        ])
        .then((choiceTask) => {
            const index = parseInt(choiceTask.task);
            if (index >= 0) {
                showAllTask(list, index)
            }
            if (index === -2) {
                addTask(list);

            }
        })
        .catch((error) => {
            console.log('error', error);
        });

}

module.exports = {
    add,
    clear,
    showAll
}
