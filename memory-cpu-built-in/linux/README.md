## Built-in Profilers
---

### Azure Web App Linux
Azure Web App Linux uses PM2 as process manager for handling node.js applications, or can execute if you have defined any start script inside package.json as `npm start`. To configure and launch node.js built-in profilers you need the following requirements:

1. Use Node.js >=12 version
2. Update the startup command from Azure Portal -> Select your web app -> Click on **Configuration** -> Then **General Settings** -> Update the **Startup Command** textbox with any of the next configurations:

    ```
        node --prof server.js 
        node --cpu-prof server.js 
        node --cpu-prof-dir "/home/LogFiles/" --cpu-prof-name "NewCPU.cpuprofile" --cpu-prof server.js
        node --heap-prof server.js 
        node --heap-prof-dir "/home/LogFiles/" --heap-prof-name "NewHeap.cpuprofile" --heap-prof server.js
        node --prof server.js 
        node --heapsnapshot-signal=SIGUSR2 server.js
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
- If you are using `node --heapsnapshot-signal=SIGUSR2`, you need to SSH and get the node.js process id with `ps auxw | grep node` and then send the signal with `kill -USR2 <pid>`
- If you use `node --prof`, you might need to restart the site to release the file handle in order to download it.


