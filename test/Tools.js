import { ESSENTIAL_FILEDS, UNIQUE_CONTRAINT } from './Const';

const isNumeric = (s) => {
  const num = +s; // turn the string to number - strictly checking ('12..' -> NaN);
  if (isNaN(num)) {
    return false;
  }
  return true;
};

const compareString = (a0, b0) => {
  const a = `${a0}`.toLowerCase();
  const b = `${b0}`.toLowerCase();
  if (a < b) { // string can compare but not do math calculation;
    return -1;
  } else if (a > b) {
    return 1;
  }
  return 0;
};

export function sorter(a, b) {
  if (isNumeric(a) && isNumeric(b)) {
    return (+a) - (+b);
  } else {
    return compareString(a, b);
  }
}

export function getClonedKey(key) {
  return `${key}-${key}`;
}

export function getKey(key) {
  key = `${key}`;
  if (key.indexOf('-') > -1) {
    return key.split('-')[0];
  }
  return key;
}

export function cloneRecordAfterByKey(newRecord, arr, key) { // id and key will be retrieved from backend;
  const index = arr.findIndex(val => val.key === key);
  newRecord = Object.assign({}, arr[index]);
  newRecord.key = getClonedKey(key);
  newRecord.isCloned = true;
  newRecord.editable = true;
  const newArr = arr.map(item => item);
  newArr.splice(index + 1, 0, newRecord);
  return newArr;
}

export function convertMapArrToCSVArr(arr, header) {
  if (arr === undefined || arr.length === 0) return [[]];
  const csvArr = [];
  if (header === undefined) {
    header = [];
    for (const key in arr[0]) {
      if (arr[0].hasOwnProperty(key)) {
        header.push(key);
      }
    }
  }
  csvArr.push(header);
  arr.forEach((record) => {
    const r = [];
    header.forEach((key) => {
      r.push(record[key] || '');
    });
    csvArr.push(r);
  });
  return csvArr;
}

export function saveArrayToCSVFile(arr) {
  let csvString = 'data:text/csv;charset=utf-8,';
  arr.forEach((row) => {
    let s = '';
    row.forEach((c, i) => {
      if (c.indexOf(',') > -1) {
        c = `"${c}"`;
      }
      s += (i === 0 ? '' : ',') + c;
    });
    s = s.replace(/[\r\n|\n|\r]+/gm, '');
    csvString += `${s}\r\n`;
  });
  const encodedUri = encodeURI(csvString);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `tenantDetails - ${Date.now()}.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
}


export function isRecordEmpty(record, keyArr) {
  for (let i = 0; i < keyArr.length; ++i) {
    const key = keyArr[i];
    if (record[key].trim().length > 0) {
      return false;
    }
  }
  return true;
}

export function initFilterRecord(keyArr) {
  const filterRecord = {};
  keyArr.forEach((key) => {
    filterRecord[key] = '';
  });
  return filterRecord;
}

export function hasEditable(dataSource) {
  let has = false;
  for (let i = 0; i < dataSource.length; ++i) {
    if (dataSource[i].editable) {
      has = true;
    }
  }
  return has;
}

function getUniqueKey(record) {
  let s = '';
  for (let j = 0; j < UNIQUE_CONTRAINT.length; ++j) {
    const key = UNIQUE_CONTRAINT[j];
    if (record[key]) {
      s += `${s ? '#' : ''}${record[key]}`;
    }
  }
  return s;
}

export function checkRecordValidity(record, records) {
  for (let i = 0; i < ESSENTIAL_FILEDS.length; ++i) {
    const val = record[ESSENTIAL_FILEDS[i]];
    if (val === undefined || val.trim().length === 0) {
      return { isValid: false, message: 'Tenant Account, Tenant EN Name and Landscape cannot be empty!' };
    }
  }
  if (record.isCloned) {
    const key = getUniqueKey(record);
    for (let i = 0; i < records.length; ++i) {
      const cur = getUniqueKey(records[i]);
      if (key === cur) {
        return { isValid: false, message: 'Tenant Account and Landscape should be unique!' };
      }
    }
  } else {
    const key = getUniqueKey(record);
    for (let i = 0; i < records.length; ++i) {
      if (records[i].key !== record.key) {
        const cur = getUniqueKey(records[i]);
        if (key === cur) {
          return { isValid: false, message: 'Tenant Account and Landscape should be unique!' };
        }
      }
    }
  }
  return { isValid: true, message: null };
}

export function restoreRecordValue(record, origin) {
  for (const key in record) {
    if (record[key] && record[key].type === 'span') {
      record[key] = origin[key];
    }
  }
}

export function updateOrigin(origin, record) {
  for (const key in record) {
    if (record[key] && Object.prototype.toString.apply(record[key]) === '[object String]') {
      origin[key] = record[key];
    }
  }
}

export function restoreTarget(target, cache) {
  for (const key in target) {
    if (!cache[key]) {
      delete target[key];
    } else {
      target[key] = cache[key];
    }
  }
}
