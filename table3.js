import React from 'react';
import './index.css';
import { Table } from 'antd';


class ExpandableTable extends React.Component {

  render() {
    const columns = [
      {title: 'Environment Name', dataIndex: 'name', key: 'name', width: 135, fixed: 'left'},
      {title: 'Aws Region', dataIndex: 'region', key: 'region', width: 100, fixed: 'left'},
      {title: 'Tenant Account', dataIndex: 'tenantAccount', key: 'tenantAccount', width: 120, fixed: 'left',},
      {title: 'Landscape', dataIndex: 'landscape', key: 'landscape', width: 100, fixed: 'left',},
      {title: 'Index', dataIndex: 'index', key: 'index', width: 300,},
      {title: 'Zabbix Tenant Name', dataIndex: 'zabbixTenantName', key: 'zabbixTenantName', width: 300,},
      {title: 'HUE Exit IP', dataIndex: 'hueExitIP', key: 'hueExitIP', width: 300,},
      {title: 'Conv App CIDR', dataIndex: 'convAppCIDR', key: 'convAppCIDR', width: 300,},
      {title: 'Conv Admin CIDR', dataIndex: 'convAdminCIDR', key: 'convAdminCIDR', width: 300,},
      {title: 'HUE Remote Client', dataIndex: 'hueRemoteClient', key: 'hueRemoteClient', width: 300,},
      {
        title: 'Actions', dataIndex: 'actions', key: 'actions', width: 160, fixed: 'right',
        render: () => <div><a href="#">Edit</a>&nbsp;&nbsp;<a href="#">Copy</a>&nbsp;&nbsp;<a href="#">Delete</a></div>
      }];

    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        key: i,
        name: '丸一鋼管株式会社 - ' + (i + 1),
        region: 'ap-northeast-1',
        tenantAccount: 'jill' + (i + 1),
        landscape: 'develop',
        index: 77 + (i + 1),
        zabbixTenantName: 'Seibuholdings',
        hueExitIP: '52.69.184.' + (i + 1),
        convAppCIDR: '10.101.136.0/22',
        convAdminCIDR: '10.200.112.0/24',
        hueRemoteClient: '192.168.183.' + (i + 1),
        password: '14-r00t_ygsv' + ( i + 1),
      });
    }

    return <Table
      columns={columns}
      dataSource={data}
      bordered
      size="middle"
      scroll={{x: '130%', y: 1240}}
    />
  }

}


export default ExpandableTable;
