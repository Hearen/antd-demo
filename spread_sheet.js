import React from 'react';
import { Table, Input, Icon, Button, Popconfirm, Menu, Dropdown, Select, } from 'antd';
import EditableCell from './EditableCell';
import {TagAddDialog} from "./TagAddDialog";
const Option = Select.Option;

const types = ["Tenant EN Name", "Tenant JP Name", "Tenant Account", "VPCs", "remark", ];
const data = [];
for (let i = 0; i < 100; i++) {
    let record = {};
    types.forEach((val)=>{
        record[val] = val+i;
    });
    data.push(record);
}

export default class SpreadSheet extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          filterDropdownVisible: false,
          data,
          searchText: '',
          filtered: false,
      };

      this.cacheData = data.map(item => ({...item}));
      this.columns = [];
      types.forEach((val, i) => {
          this.columns.push({
              title: val,
              dataIndex: val,
              width: '100px',
              key: val,
              render: (text, record) => this.renderColumns(text, record, val),
          })
      });
      this.columns.push({
          title: 'operation',
          dataIndex: 'operation',
          fixed: 'right',
          render: (text, record) => {
              const {editable} = record;
              const menu = (
                  <Menu>
                      <Menu.Item>
                          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">Insert Above</a>
                      </Menu.Item>
                      <Menu.Item>
                          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">Insert Below</a>
                      </Menu.Item>
                      <Menu.Item>
                          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">Clone</a>
                      </Menu.Item>
                  </Menu>
              );
              return (
                  <div className="editable-row-operations">
                      {
                          editable ?
                              <span>
                  <a onClick={() => this.save(record.key)}>Save</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                              : <a onClick={() => this.edit(record.key)}>
                                  <Icon type="edit"/>
                                  Edit</a>
                      }
                      <span> | </span>
                      <a href="#">
                          <Icon type="delete"/>
                          Delete</a>
                      <span> | </span>
                      <Dropdown overlay={menu}>
                          <a className="ant-dropdown-link" href="#">
                              More Options <Icon type="down"/>
                          </a>
                      </Dropdown>
                  </div>
              );
          }
      });
  }
  //   this.columns = [{
  //     title: 'name',
  //     dataIndex: 'name',
  //       key: 'name',
  //       sorter: (a, b) => a.name.length - b.name.length,
  //     render: (text, record) => this.renderColumns(text, record, 'name'),
  //   }, {
  //     title: 'age',
  //     dataIndex: 'age',
  //       key: 'age',
  //     render: (text, record) => this.renderColumns(text, record, 'age'),
  //   }, {
  //     title: 'address',
  //     dataIndex: 'address',
  //       key: 'address',
  //     render: (text, record) => this.renderColumns(text, record, 'address'),
  //   }, {
  //     title: 'operation',
  //     dataIndex: 'operation',
  //     render: (text, record) => {
  //       const { editable } = record;
  //       const menu = (
  //           <Menu>
  //               <Menu.Item>
  //                   <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">Insert Above</a>
  //               </Menu.Item>
  //               <Menu.Item>
  //                   <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">Insert Below</a>
  //               </Menu.Item>
  //               <Menu.Item>
  //                   <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">Clone</a>
  //               </Menu.Item>
  //           </Menu>
  //       );
  //       return (
  //         <div className="editable-row-operations">
  //             {
  //                 editable ?
  //                     <span>
  //                 <a onClick={() => this.save(record.key)}>Save</a>
  //                 <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
  //                   <a>Cancel</a>
  //                 </Popconfirm>
  //               </span>
  //                     : <a onClick={() => this.edit(record.key)} >
  //                           <Icon type="edit"/>
  //                         Edit</a>
  //             }
  //             <span> | </span>
  //             <a href="#" >
  //                 <Icon type="delete"/>
  //                 Delete</a>
  //             <span> | </span>
  //             <Dropdown overlay={menu}>
  //                 <a className="ant-dropdown-link" href="#">
  //                     More Options <Icon type="down" />
  //                 </a>
  //             </Dropdown>
  //         </div>
  //       );
  //     },
  //   }];
  // }
    columnSorter = (a, b, key) => {
        return a[key].length - b[key].length;
    }

    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            data: data.map((record) => {
                const match = record.name.match(reg);
                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.name.split(reg).map((text, i) => (
                  i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        parentHandleChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = false;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }
    handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    render() {
      const children = [];
      types.forEach((val, i) => {
            children.push(<Option key={i.toString(36) + i}>{val}</Option>);
      });
    return (
        <div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{textAlign: "right"}}>
                    <Button icon="export"  value="default">Export</Button>
                    <Button icon="import" value="primary">Import</Button>
                </div>
                <div>
                    <Select
                        mode="multiple"
                        style={{ width: '80%', margin: "5px" }}
                        placeholder="Please select columns you want to check"
                        defaultValue={types}
                        onChange={this.handleChange}
                    >
                        {children}
                    </Select>
                    <Button style={{display: "block", float: "right", margin: "5px"}} onClick={()=>{
                        this.tagAdd.showModal();
                    }} type="primary" icon="plus"> New Tag</Button>
                    <Button style={{display: "block", float: "right", margin: "5px"}} type="default" icon="step-forward">Forward</Button>
                    <Button style={{display: "block", float: "right", margin: "5px"}} type="default"  icon="step-backward">Backward</Button>
                </div>
                <div>
                    <Table bordered
                           scroll={{x: '130%', y: 1240}}
                           dataSource={this.state.data}
                           columns={this.columns} />
                </div>
            </div>
            <TagAddDialog ref={tagAdd => { this.tagAdd = tagAdd; }}/>
        </div>
    );
  }
}

