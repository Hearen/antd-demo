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

let sorter = (a, b) => {
    if(isNumeric(a) && isNumeric(b)){
        return (+a) - (+b);
    } else {
        return compareString(a, b);
    }
}

function cloneRecordAfterByKey(arr, key){
    let index = arr.findIndex((val) => val.key==key);
    let newRecord = Object.assign({}, arr[index]);
    newRecord.key += ''+index;
    let newArr = arr.map(item => item);
    newArr.splice(index, 0, newRecord);
    return newArr;
}

export { sorter, cloneRecordAfterByKey };