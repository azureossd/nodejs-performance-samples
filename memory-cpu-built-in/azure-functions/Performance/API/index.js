var scenarios = require('performance-samples');
const fs = require("fs");
const fsp = fs.promises;
const path = require('path');
var os = require('os');
const convertTime = require('microseconds');
const v8 = require('v8');

async function fibonacci(n){
    if(n < 1){return 0;}
    else if(n == 1 || n == 2){return 1;}
    else if(n > 2){return await fibonacci(n - 1) + await fibonacci(n-2);}
}

function ReadFile(context){
    var path = context.executionContext.functionDirectory;
    return fs.readFileSync(path + "/content.txt", "utf8");
}

async function ReadFileAsync(context){
    var path = context.executionContext.functionDirectory;
    fs.readFile(path + "/content.txt", "utf8", (error, data) => {
        if (error) throw error;
        return data;
    });
}

function saveObjects (objectID) {
    const numbers = objectID / 8;
    const arr = []
    arr.length = numbers;
    for (let i = 0; i < numbers; i++) {
        arr[i] = i;
    }
    return arr;
};



async function ReadFilesFromPath(dirname) {
    const data = {};
    const files = await fsp.readdir(dirname);
    await Promise.all(files.map(async filename => {
        const full = path.join(dirname, filename);
        data[filename] = full;
    }));
    return data;
}


let objectList = [];

module.exports = async function (context, req) {

    var category = context.bindingData.category;

    switch(category){
        case 'cpu':
            context.log('Reproducing High CPU using async function...');
            await fibonacci(35);
            break;
        case 'sync':
            context.log('Calling a Sync function...');
            var data = ReadFile(context);
            context.log(data);
            break;
        case 'async':
            context.log('Calling a Async function...');
            var data2 = await ReadFileAsync(context);
            context.log(data2);
            break;
        case 'memory':
            debugger;
            context.log('Reproducing High Memory...');
            let id = 200000 * 1024;
            const objectId = saveObjects(id);
            objectList.push(objectId);
            break;
        case 'statistics':
            const memory= process.memoryUsage();
            context.log(memory);
            context.log({
                rss: `${Math.round(memory['rss'] / 1024 / 1024 * 100) / 100} MB`, //Resident set size (RSS) is the portion of memory occupied by a process that is held in main memory (RAM)
                heapTotal:`${Math.round(memory['heapTotal'] / 1024 / 1024 * 100) / 100} MB`, //Total Size of the Heap
                heapUsed:`${Math.round(memory['heapUsed'] / 1024 / 1024 * 100) / 100} MB`, //Heap actually Used
                external:`${Math.round(memory['external'] / 1024 / 1024 * 100) / 100} MB`,
                max_heap_size:`${Math.round(v8.getHeapStatistics()['heap_size_limit'] / 1024 / 1024 * 100) / 100} MB`,
                v8: v8.getHeapStatistics(),
                memory_raw: process.memoryUsage(),
                cpu_user: convertTime.parse(process.cpuUsage().user), //return the system and user cpu time in microseconds
                cpu_system: convertTime.parse(process.cpuUsage().system),
                cpu_raw: process.cpuUsage(),
                load_avarage: os.loadavg()
                });
            break;
        case 'blocking-eventloop':
            context.log('Blocking the Event Loop...');
            scenarios.jsonblock(45);
        case 'sleep':
            context.log("Sleeping request...");
            setTimeout(function() {}, 10000);
            break;
        case 'list':
            context.log("Querying from /test");
            let files =  await ReadFilesFromPath('/test');
            context.log(files);
        break;
        case 'end':
            context.log("Ending process");
            process.exit(0);
            break;
        default:
            context.log("No category defined");
            break;
    }
    
    if(category){
        context.res = {
            body: { msg: "Running command: " + category }
        };
    } else {
        context.res = {
            body: { msg: "No command specified" }
        };
    }
}