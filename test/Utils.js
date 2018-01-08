import * as Const from './Const';

const isNumeric = (s) => {
  const num = +s; // turn the string to number - strictly checking ('12..' -> NaN);
  if (isNaN(num)) {
    return false;
  }
  return true;
};

const compareString = (a0, b0) => {
  a0 = a0 || '';
  b0 = b0 || '';
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

function adjustCSVHeader(header) {
  const prefix = [];
  const suffix = [];
  header.forEach((col) => {
    if (Const.ESSENTIAL_FILEDS.findIndex(field => field === col) > -1) {
      prefix.push(col);
    } else {
      suffix.push(col);
    }
  });
  header.splice(0, header.length, ...prefix, ...suffix);
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
  adjustCSVHeader(header);
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
  for (let j = 0; j < Const.UNIQUE_CONTRAINT.length; ++j) {
    const key = Const.UNIQUE_CONTRAINT[j];
    if (record[key]) {
      s += `${s ? '#' : ''}${record[key]}`;
    }
  }
  return s;
}

export function checkRecordValidity(record, records) {
  for (let i = 0; i < Const.ESSENTIAL_FILEDS.length; ++i) {
    const val = record[Const.ESSENTIAL_FILEDS[i]];
    if (val === undefined || val.trim().length === 0) {
      return { isValid: false, message: 'Tenant Account, Landscape and Environment Name cannot be empty!' };
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

function updateTags(record, response){
  record.tags = [...response.tags];
}

export function updateOrigin(origin, record, response) {
  for (const key in record) {
    if (record[key] && Object.prototype.toString.apply(record[key]) === '[object String]') {
      origin[key] = record[key];
    }
  }
  updateTags(record, response);
  updateTags(origin, response);
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

export function loadData(tenantList, tagList, tenantDict) {
  const header = [...Const.ESSENTIAL_FILEDS];
  const data = [];
  if (tenantList === undefined || tenantList.length === 0) {
    return { header, data };
  }
  tagList.forEach((tag) => {
    const column = tag.label;
    if (header.indexOf(column) === -1) {
      header.push(column);
    }
  });
  tenantList.forEach((tenant) => {
    tenantDict[tenant.id] = tenant;
    const t = {};
    const tags = tenant.tags;
    tags.forEach((tag) => {
      const label = tag.label.label;
      t[label] = tag.value;
    });
    const envUsageList = tenant.envUsageList;
    t.canDelete = (envUsageList === null || envUsageList.length === 0);
    t.id = t.key = tenant.id;
    t.tags = tenant.tags;
    data.push(t);
  });
  return { header, data };
}


export function buildTarget(tenant) {
  const t = {};
  const tags = tenant.tags;
  tags.forEach((tag) => {
    const label = tag.label.label;
    t[label] = tag.value;
  });
  const envUsageList = tenant.envUsageList;
  t.canDelete = (envUsageList === null || envUsageList.length === 0);
  t.id = t.key = tenant.id;
  t.tags = tenant.tags;
  return t;
}

export function updateTenant(tenant, target, labelList) {
  const newTags = [];
  tenant.id = target.id;
  const tags = target.tags;
  for (let i = 0; i < labelList.length; ++i) {
    const column = labelList[i].label;
    const index = tags.findIndex(tag => tag.label.label === column && tag.id !== null);
    if (index > -1) {
      const tag = { ...tags[index] };
      tag.value = target[column];
      newTags.push(tag);
    } else if (target[column] && target[column].trim().length > 0) {
      const t = {};
      t.id = null;
      t.label = { id: labelList[i].id, label: labelList[i].label };
      t.value = target[column];
      t.tenant = { id: tenant.id };
      newTags.push(t);
    }
  }
  tenant.tags = newTags;
}

