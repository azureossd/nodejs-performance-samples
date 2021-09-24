
function fibonacci(n){
    if(n < 1){return 0;}
    else if(n == 1 || n == 2){return 1;}
    else if(n > 2){return fibonacci(n - 1) + fibonacci(n-2);}
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

let objectList = [];

module.exports = async function (context, req) {

    var category = context.bindingData.category;
    var id = context.bindingData.id;

    if(category){

        if(category =="cpu"){
            fibonacci(id);
        }

        if(category =="memory"){
            let id = 200000 * 1024;
            const objectId = saveObjects(id);
            objectList.push(objectId);
        }

        if(category =="end"){
            context.log("Ending process");
            process.exit(0);
        }
    }

    context.res = {
        body: { msg: "Command received..."}
    };
}