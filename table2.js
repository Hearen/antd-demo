import React from 'react';
import './index.css';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({value});
  }
  check = () => {
    this.setState({editable: false});
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({editable: true});
  }

  render() {
    const {value, editable} = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);


    this.columns = [
      {
        title: 'Environment Name',
        dataIndex: 'name',
        key: 'name',
        width: 135,
        fixed: 'left',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'name')}
          />
        ),
      },
      {
        title: 'Aws Region', dataIndex: 'region', key: 'region', width: 100, fixed: 'left',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'region')}
          />
        ),
      },
      {
        title: 'Tenant Account', dataIndex: 'tenantAccount', key: 'tenantAccount', width: 120, fixed: 'left',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'tenantAccount')}
          />
        ),
      },
      {
        title: 'Landscape', dataIndex: 'landscape', key: 'landscape', width: 100, fixed: 'left',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'landscape')}
          />
        ),
      },
      {
        title: 'Index', dataIndex: 'index', key: 'index', width: 300,
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'index')}
          />
        ),
      },
      {
        title: 'Zabbix Tenant Name', dataIndex: 'zabbixTenantName', key: 'zabbixTenantName', width: 300,
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'zabbixTenantName')}
          />
        ),
      },
      {
        title: 'HUE Exit IP', dataIndex: 'hueExitIP', key: 'hueExitIP', width: 300,
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'hueExitIP')}
          />
        ),
      },
      {
        title: 'Conv App CIDR', dataIndex: 'convAppCIDR', key: 'convAppCIDR', width: 300,
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'convAppCIDR')}
          />
        ),
      },
      {
        title: 'Conv Admin CIDR', dataIndex: 'convAdminCIDR', key: 'convAdminCIDR', width: 300,
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'convAdminCIDR')}
          />
        ),
      },
      {
        title: 'HUE Remote Client', dataIndex: 'hueRemoteClient', key: 'hueRemoteClient', width: 300,
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'hueRemoteClient')}
          />
        ),
      },
      {
        title: 'Actions', dataIndex: 'actions', key: 'actions', width: 160, fixed: 'right',
        render: () => <div><a href="#">Copy</a>&nbsp;&nbsp;<a href="#">Delete</a></div>
      }];

    const data = [];
    for (let i = 0; i < 6; i++) {
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

    this.state = {
      dataSource: data,
      count: 6,
    };
  }

  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({dataSource});
      }
    };
  }
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({dataSource: dataSource.filter(item => item.key !== key)});
  }
  handleAdd = () => {
    const {count, dataSource} = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }

  render() {
    const {dataSource} = this.state;
    const columns = this.columns;
    return (
      <div>
        <Table dataSource={dataSource}
               columns={columns}
               bordered
               size="middle"
               scroll={{x: '130%', y: 1240}}/>
      </div>
    );
  }
}

export default EditableTable;