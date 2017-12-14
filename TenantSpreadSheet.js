import React from 'react';
import { Table, Input, Icon, Button, Popconfirm, Menu, Dropdown, Select, } from 'antd';
import EditableCell from './EditableCell';
import {TagAddDialog} from "./TagAddDialog";
import ColumnSelect from "./ColumnSelect";
const Search = Input.Search;
const Option = Select.Option;

const demo = {"name": '丸一鋼管株式会社 - ', "tenantAccount": "ap-northeast - ", "landscape": "develop - ", "convAppCIDR": "", "convAdminCIDR": "",
    "index": '77', "zabbixTenantName": "Demo - ", "hueExitIP": "10.101.136.", "hueRemoteClient": "192.168.183.", "password": "r005-yqvs-"};

const LEFT_LIMIT = 2;

export default class TenantSpreadSheet extends React.Component {
    constructor(props) {
        super(props);
        let data = [];
        for (let i = 0; i < 200; ++i) {
            let instance = Object.assign({}, demo);
            for(var key in instance){
                instance[key] = instance[key]+i;
            }
            instance["convAppCIDR"] = '10.101.136.0/22';
            instance["convAdminCIDR"] = '10.200.112.0/24';
            instance["key"] = instance.name+i;
            data.push(instance);
        }
        let columnsShown = [];
        this.allColumns = [];
        for(var key in demo){
            columnsShown.push(key);
        }
        this.allColumns = [].concat(columnsShown);
        let columns = this.getColumnsShown(columnsShown);
        this.state = {
            data,
            dataSource: data,
            columns,
            searchValue: "",
            columnsShown,
            advancedShown: false,
        };
    }

    addActions = () => {
        let newColumns = Object.assign({}, ...this.state.columns);
    }

    updateColumns = (columnsShown) => {
        const columns = this.getColumnsShown(columnsShown);
        const dataSource = [].concat(this.state.dataSource); //update the dataSource along with columns to bind data;
        this.setState({
            columns,
            dataSource,
        });
    }

    getColumnsShown = (columnsShown) => {
        let columns = [];
        columnsShown.forEach((val) => {
            columns.push({
                title: val,
                dataIndex: val,
            })
        });
        this.adjustColumns(columns);
        return columns;
    }

    //Memo: width, fixed attribute in column and scroll attribute in table is the key to enable fixing sides;
    adjustColumns = (columns) => {
        if(columns.length > LEFT_LIMIT){
            for(var i = 0; i < LEFT_LIMIT; ++i){
                columns[i]["fixed"] = "left";
                columns[i]["width"] = "200px";
            }
        }
        columns.push({
            title: 'Actions', dataIndex: 'actions', key: 'actions', fixed: 'right', width: "250px",
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
            },
        })
    }

    handleSearch = (value) => {
        let searchText = value;
        let newDataSource;
        if(searchText.length === 0){
            newDataSource  = this.state.data.map((record) => record );
        }
        else {
            const reg = new RegExp(searchText, 'gi');
            newDataSource = this.state.data.map((record) => {
                let newRecord = Object.assign({}, record);
                let matchCount = 0;
                for(let key in record){
                    console.log(record[key]);
                    let match = (record[key]+"").match(reg);
                    if(!match) {
                        continue;
                    }
                    matchCount++;
                    newRecord[key] = (
                        <span>
                          {(record[key]+'').split(reg).map((text, i) => (
                              i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
                          ))}
                        </span>
                    );
                }
                return matchCount===0? null : newRecord;
            }).filter(record => !!record);
        }
        this.setState({
            dataSource: newDataSource,
        });
    }

    toggleAdvancedPanel = () => {
        this.setState({
            advancedShown: !this.state.advancedShown,
        });
    }
    render() {
        return (
            <div>
                <div style={{textAlign: "left", }}>
                    <Search
                        size="large"
                        onSearch={this.handleSearch}
                        style={{width: "50%", margin: "16px", }} />
                    <a onClick={() => { this.toggleAdvancedPanel(); }}>{this.state.advancedShown? "Hide" : "Advanced"}</a>
                </div>
                <div
                    style={{
                        display: this.state.advancedShown? 'block' : 'none',
                        margin: "0 16px"
                    }}

                >
                    <ColumnSelect
                        allColumns={this.allColumns}
                        columnsShown={this.state.columnsShown}
                        updateColumns={this.updateColumns}
                    />
                    <Button style={{margin: "0 16px", }} size="large" onClick={()=>{
                        this.tagAddDialog.showModal();
                    }} type="primary" icon="plus"> New Tag</Button>
                </div>
                <div style={{textAlign: "right"}}>
                    <Button style={{ margin: "0 5px"}} size="large"  value="default">Export</Button>
                    <Button style={{ margin: "0 5px"}} size="large" value="primary">Import</Button>
                </div>
                <div
                    style={{margin: "16px"}}
                >
                    <Table
                        scroll={{x: '180%', y: 1240}}
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                    />
                </div>
                <TagAddDialog ref={tagAdd => { this.tagAddDialog = tagAdd; }}/>
            </div>
        )
    }
}
