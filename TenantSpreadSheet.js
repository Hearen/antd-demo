import React from 'react';
import { Table, Input, Icon, Button, Popconfirm, Menu, Dropdown, Select, } from 'antd';
import EditableCell from './EditableCell';
import {TagAddDialog} from "./TagAddDialog";
import ColumnSelect from "./ColumnSelect";
import {cloneRecordAfterByKey, sorter as mySorter} from './Tools';
const Search = Input.Search;
const Option = Select.Option;

const demo = {"name": '丸一鋼管株式会社 - ', "tenantAccount": "ap-northeast - ", "landscape": "develop - ", "convAppCIDR": "", "convAdminCIDR": "",
    "name - test - ": '丸一鋼管株式会社 - test - ', "tenantAccount - test - ": "ap-northeast - test - ", "landscape - test ": "develop - test - ", "convAppCIDR-test": "", "convAdminCIDR-test": "",
    "index": '77', "zabbixTenantName": "Demo - ", "hueExitIP": "10.101.136.", "hueRemoteClient": "192.168.183.", "password": "r005-yqvs-"};

const LEFT_LIMIT = 2;
const LEFT_FIXED_WIDTH = 200;
const RIGHT_FIXED_WIDTH = 250;
const WIDTH = 200;

export default class TenantSpreadSheet extends React.Component {
    constructor(props) {
        super(props);
        let data = [];
        for (let i = 0; i < 100; ++i) {
            let instance = Object.assign({}, demo);
            for(var key in instance){
                instance[key] = instance[key]+i;
            }
            instance["convAppCIDR"] = '10.101.136.0/22';
            instance["convAdminCIDR"] = '10.200.112.0/24';
            instance["key"] = instance.name+i; //used to uniquely identify the record;
            data.push(instance);
        }
        let columnsShown = [];
        this.allColumns = [];
        for(var key in demo){
            columnsShown.push(key);
        }
        this.allColumns = [].concat(columnsShown);
        let columns = this.getColumnsShown(columnsShown);
        this.cacheData = data.map(item => ({...item}));
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
        columnsShown.forEach((val, i) => {
            columns.push({
                title: val,
                dataIndex: val,
                width: WIDTH, //if the alignment is an issue, set the width;
                sorter: (a, b) => mySorter(a[val], b[val]), //return value is the base for sorting;
                render: (text, record) => this.renderColumns(text, record, val),
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
                columns[i]["width"] = LEFT_FIXED_WIDTH;
            }
        }
        delete columns[columns.length-1].width; //let the last column auto-adjust - very important to properly fit in;
        columns.push({
            title: 'Actions', dataIndex: 'actions', key: 'actions', fixed: 'right', width: RIGHT_FIXED_WIDTH,
            render: (text, record) => {
                const {editable} = record;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                  <a onClick={() => this.saveEdit(record.key)}>Save </a>
                                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancelEdit(record.key)}>
                                    <a> Cancel</a>
                                  </Popconfirm>
                                </span>
                                : <a onClick={() => this.editRecord(record.key)}>
                                    <Icon type="edit"/>
                                    Edit</a>
                        }
                        <span> | </span>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.removeRecord(record.key)}>
                            <a href="#">
                                <Icon type="delete"/>
                                Delete</a>
                        </Popconfirm>
                        <span> | </span>
                        <a onClick={() => { this.cloneRecord(record.key); }}>
                            <Icon type="copy"/>
                            Clone</a>
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

    renderColumns(text, record, column) {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
                parentHandleChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }


    handleChange  = (value, key, column) => { //value -> cell current value, key -> record key, column -> column title;
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ dataSource: newData });
        }
    }


    editRecord = (key) => {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({dataSource: newData}); //used to re-render when edit button clicked;
        }
    }
    saveEdit = (key) => {
        let newData = [...this.state.dataSource]; //get the current real-time data;
        let target = newData.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            this.setState({ dataSource: newData });
            this.cacheData = newData.map(item => ({ ...item }));
        }
    }
    cancelEdit = (key) => {
        let newData = [...this.state.dataSource];
        let target = newData.filter(item => key === item.key)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
            delete target.editable;
            this.setState({ dataSource: newData });
        }
    }

    removeRecord = (key) => {
        const data = this.state.data.filter(item => key!==item.key);
        const dataSource = this.state.dataSource.filter(item => key!==item.key);
        this.setState({
            data,
            dataSource,
        })
    }

    // cloneRecord = (key) => {
    //     console.log(key);
    // }

    cloneRecord = (key) => {
        const newData = cloneRecordAfterByKey(this.state.data, key);
        const newDataSource = cloneRecordAfterByKey(this.state.dataSource, key);
        this.setState({
            data: newData,
            dataSource: newDataSource,
        });
    }

    toggleAdvancedPanel = () => {
        this.setState({
            advancedShown: !this.state.advancedShown,
        });
    }
    render() {
        const scroll_x_width = LEFT_LIMIT*LEFT_FIXED_WIDTH + RIGHT_FIXED_WIDTH + (this.state.columnsShown.length-LEFT_LIMIT)*WIDTH;
        return (
            <div style={{margin: "32px 16px"}}>
                <div style={{textAlign: "left", }}>
                    <Search
                        size="large"
                        onSearch={this.handleSearch}
                        style={{width: "50%", margin: "16px", }} />
                    <a size="large" onClick={() => { this.toggleAdvancedPanel(); }}>{this.state.advancedShown? "Hide" : "Advanced"}</a>
                    <div style={{float: "right", margin: "16px"}}>
                        <Button style={{ margin: "0 5px"}} size="large"  value="default">Export</Button>
                        <Button style={{ margin: "0 5px"}} size="large" value="primary">Import</Button>
                        <Button style={{margin: "0 16px", }} size="large" onClick={()=>{
                            this.tagAddDialog.showModal();
                        }} type="primary" icon="plus"> New Tag</Button>
                    </div>
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
                </div>
                <div
                    style={{margin: "16px"}}
                >
                    <Table
                        scroll={{x: scroll_x_width, y: '90vh'}}
                        bordered
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                    />
                </div>
                <TagAddDialog ref={tagAdd => { this.tagAddDialog = tagAdd; }}/>
            </div>
        )
    }
}
