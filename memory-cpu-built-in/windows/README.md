## Built-in Profilers
---

### Azure Web App Windows
Azure Web App Windows uses iisnode handler by default for hosting node.js application within IIS web server. To configure and launch node.js built-in profilers you need the following requirements:

1. Use Node.js >=12 version
2. Choose iisnode.yml or web.config implementation to enable the profiler. 

- Using iisnode.yml inside `d:/home/site/wwwroot` with the specific paramaters/flags to profile CPU or Memory.
    ```
    #nodeProcessCommandLine: node --prof server.js 
    #nodeProcessCommandLine: node --cpu-prof server.js 
    #nodeProcessCommandLine: node --cpu-prof-dir "d:/home/LogFiles/" --cpu-prof-name "NewCPU.cpuprofile" --cpu-prof server.js
    #nodeProcessCommandLine: node --heap-prof server.js 
    #nodeProcessCommandLine: node --heap-prof-dir "d:/home/LogFiles/" --heap-prof-name "NewHeap.cpuprofile" --heap-prof server.js
    #nodeProcessCommandLine: node --prof server.js 
    ```
---
### How to use this app

#### High CPU
- To simulate High CPU you can request the following route: **`/cpu/:id`**
- Example: `/cpu/45`

#### High Memory
- To consume memory you can request the following route: **`/memory`** , this endpoint will consume 200MB in each request.

#### Showing current memory and cpu time with NodeJS
- You can request **`/process`** and will see the memory allocation and cpu in microseconds.

#### Stop Profiler and Recollect data
- You can request **`/end`** to exit node process and create the output either .cpuprofile or .heapprofile.
- If you use `node --prof`, you might need to restart the site to release the file handle in order to download it.
