export const specialFields = ['Tenant Account', 'Tenant EN Name', 'Tenant JP Name'];


function convertKeyForTable(key) {
  switch (key) {
    case 'name': return 'Tenant Account';
    case 'display_name': return 'Tenant EN Name';
    case 'jp_display_name': return 'Tenant JP Name';
    default: return key;
  }
}

function convertKeyForDB(key) {
  switch (key) {
    case 'Tenant Account': return 'name';
    case 'Tenant EN Name': return 'display_name';
    case 'Tenant JP Name': return 'jp_display_name';
    default: return key;
  }
}

export function loadData(tenantList, tagList, tenantDict) {
  const header = [...specialFields];
  const data = [];
  if (tenantList === undefined || tenantList.length === 0) {
    return { header, data };
  }

  tagList.forEach((tag) => {
    const column = convertKeyForTable(tag.label);
    if (specialFields.indexOf(column) === -1) {
      header.push(column);
    }
  });
  tenantList.forEach((tenant) => {
    tenantDict[tenant.id] = tenant;
    const t = {};
    const tags = tenant.tags;
    tags.forEach((tag) => {
      const label = convertKeyForTable(tag.label.label);
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
    const label = convertKeyForTable(tag.label.label);
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
    const label = labelList[i].label;
    const column = convertKeyForTable(label);
    const index = tags.findIndex(tag => tag.label.label === label && tag.id !== null);
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

