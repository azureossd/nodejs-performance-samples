# Profilers
---

## Azure Function Apps
This is a JavaScript Function app that generates High CPU and Memory and it is intended for testing and profiling scenarios.

---
## How to use this function app


**High CPU**
- To simulate High CPU you can request the following route: **`/api/profile/cpu/:id`**
- Example: `/cpu/45`

**High Memory**
- To consume memory you can request the following route: **`/api/profile/memory`** , this endpoint will consume 200MB in each request.

**Ending nodejs process**

- To end nodejs process you can request the following route : **`/api/profile/end`**. Then you need to restart the function.

---
### Profiling locally vs azure

- If you are profiling locally in your computer, then open `local.settings.json` and add this line `"languageWorkers__node__arguments": "<value>"` inside Values array, as example:

    ```
        {
        "IsEncrypted": false,
        "Values": {
            "FUNCTIONS_WORKER_RUNTIME": "node",
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "languageWorkers__node__arguments": "--cpu-prof"
            }
        }
    ```

- If you are profiling in Azure, add this app setting `languageWorkers:node:arguments` with value `--cpu-prof`.

### Profiling CPU

You have two options to profile high CPU:

#### `--prof`:
- Reproduce the issue and then restart the function. This will generate a file `isolate-0xnnnnnnnnnnnn-v8.log`. Then you can process this file offline with:
```
    node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```
- If you want to generate flamegraphs, you can use speedscope or flambearer.

    Speedscope: 

    ```
        npm install -g speedscope
        node --prof-process --preprocess -j isolate*.log | speedscope -
    ```

    Flamegraph:

    ```
        npm install -g flamebearer
        node --prof-process --preprocess -j isolate*.log | flamebearer -
    ```

#### `--cpu-prof`:
- If you select this option, then you will need to exit nodejs process from code, since restarting or killing the process doesn't work. As example:

    ```
        if(category =="end"){
            context.log("Ending process");
            process.exit(0);
        }
    ```

- Then download the `.cpuprofile` through Kudu and use `chrome://inspect` and `Open dedicated DevTools for Node` then click on `Profiler` tab to analyze it.


#### Profiling Memory


#### `--heap-prof`:
- If you select this option, then you will need to exit nodejs process from code, since restarting or killing the process doesn't work. As example:

    ```
        if(category =="end"){
            context.log("Ending process");
            process.exit(0);
        }
    ```

- Then download the `.heapprofile` through Kudu and use `chrome://inspect` and `Open dedicated DevTools for Node` then click on `Memory` tab to analyze it.

