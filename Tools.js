let isNumeric = (s) => {
    let num = +s; //turn the string to number - strictly checking ('12..' -> NaN);
    if(isNaN(num)) {
        return false;
    }
    return true;
}

let compareString = (a, b) => {
    if(a < b) { //string can compare but not do math calculation;
        return -1;
    } else if(a > b) {
        return 1;
    }
    return 0;
}

function sorter(a, b){
    if(isNumeric(a) && isNumeric(b)){
        return (+a) - (+b);
    } else {
        return compareString(a, b);
    }
}

function cloneRecordAfterByKey(arr, key){
    let index = arr.findIndex((val) => val.key==key);
    let newRecord = Object.assign({}, arr[index]);
    newRecord.key += ''+index+Date.now();
    let newArr = arr.map(item => item);
    newArr.splice(index, 0, newRecord);
    return newArr;
}

function convertMapArrToCSVArr(arr, header){
    if(arr===undefined || arr.length===0) return [[]];
    let csvArr = [];
    if(header === undefined){
        header = [];
        for(let key in arr[0]){
            if(arr[0].hasOwnProperty(key)){
                header.push(key);
            }
        }
    }
    csvArr.push(header);
    arr.forEach((record) => {
        let r = [];
        header.forEach((key) => {
            r.push(record[key])
        });
        csvArr.push(r);
    });
    return csvArr;
}

function saveArrayToCSVFile(arr){
    let csvString = "data:text/csv;charset=utf-8,";
    arr.forEach((row) => {
        let s = '';
        row.forEach((c, i) => {
            c = ''+c;
            if(c.indexOf(',') > -1) {
                c = '"'+c+'"';
            }
            s += (i===0? '' : ',') + c;
        })
        csvString += s+'\r\n';
    })
    let encodedUri = encodeURI(csvString);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tenantDetails - "+Date.now()+".csv");
    document.body.appendChild(link); // Required for FF
    link.click();
}

function generateStableKey(val, i){
    let s = '';
    for(let key in val){
        if(val.hasOwnProperty(key)){
            s += ''+key;
        }
    }
    return s + '-' + i;
}

export { sorter, cloneRecordAfterByKey, convertMapArrToCSVArr, saveArrayToCSVFile, generateStableKey };