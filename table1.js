import React from 'react';
import './index.css';
import { Table, Badge, Menu, Dropdown, Icon } from 'antd';

function NestedTable() {
  const expandedRowRender = () => {

    return (
        <table>
          <tr>
            <td width='200px'><strong>Zabbix Tenant Name:</strong></td>
            <td>77</td>
          </tr>
          <tr>
            <td><strong>HUE Exit IP:</strong></td>
            <td>52.69.184.11</td>
          </tr>
          <tr>
            <td><strong>Conv App CIDR:</strong></td>
            <td>10.101.136.0/22</td>
          </tr>
          <tr>
            <td><strong>Conv Admin CIDR:</strong></td>
            <td>10.200.112.0/24</td>
          </tr>
          <tr>
            <td><strong>HUE Remote Client:</strong></td>
            <td>192.168.183.111</td>
          </tr>

        </table>
    );
  };


  const columns = [
    {title: 'Environment Name', dataIndex: 'name', key: 'name'},
    {title: 'Aws Region', dataIndex: 'region', key: 'region'},
    {title: 'Tenant Account', dataIndex: 'tenantAccount', key: 'tenantAccount'},
    {title: 'Landscape', dataIndex: 'landscape', key: 'landscape',},
    {title: 'Index', dataIndex: 'index', key: 'index',},
    { title: 'Actions', dataIndex: 'actions', key: 'actions',
      render: () => <div><a href="#">Edit</a>&nbsp;&nbsp;<a href="#">Copy</a>&nbsp;&nbsp;<a href="#">Delete</a></div>
    }];

  const data = [];
  for (let i = 0; i < 3; ++i) {
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

  return (
      <Table
          className="components-table-demo-nested"
          columns={columns}
          expandedRowRender={expandedRowRender}
          dataSource={data}
      />
  );
}

export default NestedTable;