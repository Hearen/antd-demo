import React from 'react';
import { Table, Input, Icon, Button, Popconfirm, Menu, Dropdown, Select, } from 'antd';
import EditableCell from './EditableCell';
import {TagAddDialog} from "./TagAddDialog";
import AdvancedPanel from './AdvancedPanel';
import {cloneRecordAfterByKey, sorter as mySorter} from './Tools';
import { data as DATA, header as HEADER } from './Data';
import Papa from 'papaparse';
const Search = Input.Search;
const Option = Select.Option;

const LEFT_LIMIT = 2;
const LEFT_FIXED_WIDTH = 300;
const RIGHT_FIXED_WIDTH = 250;
const WIDTH = 250;

export default class TenantSpreadSheet extends React.Component {
    constructor(props) {
        super(props);
        let data = DATA;
        data.forEach((val, i) => {
            val["key"] = i;
        });
        let columnsShownArr = [...HEADER]
        let allColumnsArr = [...HEADER];
        let columns = this.initTableColumns(columnsShownArr);

        this.cacheData = data.map(item => ({...item}));
        this.state = {
            data,
            dataSource: data,
            columns,
            searchValue: "",
            columnsShownArr,
            allColumnsArr,
            advancedShown: false,
        };
    }

    addColumn = (newTag, defaultValue) => {
        let columnsShownArr = [...this.state.columnsShownArr, newTag];
        let allColumnsArr = [...this.state.allColumnsArr, newTag];
        const columns = this.initTableColumns(columnsShownArr);
        let data = [ ...this.state.data ];
        data.forEach((val) => {
            val[newTag] = defaultValue;
        });
        let dataSource = [ ...this.state.dataSource ];
        dataSource.forEach((val) => {
            val[newTag] = defaultValue;
        });
        this.setState({
            columns,
            columnsShownArr,
            allColumnsArr,
            data,
            dataSource,
        });
        if(this.rightMostDiv) {
            this.rightMostDiv.scrollIntoView('smooth');
        }
    }

    updateColumns = (columnsShownArr) => {
        if(columnsShownArr.length === 0) { //when there is no column show previous state;
            columnsShownArr = this.state.columnsShownArr;
        }
        const columns = this.initTableColumns(columnsShownArr);
        const dataSource = [].concat(this.state.dataSource); //update the dataSource along with columns to bind data;
        this.setState({
            columns,
            columnsShownArr,
            dataSource,
        });
    }

    initTableColumns = (columnsShownArr) => {
        let columns = [];
        columnsShownArr.forEach((val, i) => {
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
        if(columns.length > 0){
            delete columns[columns.length-1].width; //let the last column auto-adjust - very important to properly fit in;
        }
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
                        <a onClick={() => { this.cloneRecord(record.key); }}>
                            <Icon type="copy"/>
                            Copy</a>
                        <span> | </span>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.removeRecord(record.key)}>
                            <a style={{color: "red"}} href="#">
                                <Icon type="delete"/>
                                Delete</a>
                        </Popconfirm>
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
            const { columnsShownArr } = this.state;
            newDataSource = this.state.data.map((record) => {
                let newRecord = Object.assign({}, record);
                let matchCount = 0;
                for(let i = 0; i < columnsShownArr.length; ++i) {
                    let key = columnsShownArr[i];
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
        const { columnsShownArr } = this.state;
        return (
            <div ref={t => {
                if(column === columnsShownArr[columnsShownArr.length-1]){
                    this.rightMostDiv = t;
                }}}>
                <EditableCell
                    editable={record.editable}
                    value={text}
                    parentHandleChange={value => this.handleChange(value, record.key, column)}
                />
            </div>
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

    addNewRecord = () => {
        let newRecord = {};
        const { allColumnsArr, data, dataSource } = this.state;
        allColumnsArr.forEach((val) => {
            newRecord[val] = "";
        });
        newRecord["key"] = data.length+Date.now();
        let newData = [newRecord, ...data,];
        let newDataSource = [newRecord, ...dataSource,];
        this.setState({
            data: newData,
            dataSource: newDataSource,
        }, ()=>{newRecord.editable = true;});
    }

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

    handleFileUpload = (e) => {
        console.log(e);
        console.log(e.target.files[0]);
        let file = e.target.files[0];
        let data;
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function(results, file) {
                data = results;
                console.log(data);
            },
            error: () => { console.log("parsing failed!"); }
        });
    }
    render() {
        const scroll_x_width = LEFT_LIMIT*LEFT_FIXED_WIDTH + RIGHT_FIXED_WIDTH + (this.state.columnsShownArr.length-LEFT_LIMIT)*WIDTH;
        const { allColumnsArr, columnsShownArr} = this.state;
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
                        <Button style={{ margin: "0 5px"}} size="large" value="default">Import</Button>
                        <Button style={{margin: "0 5px", }} size="large" onClick={()=>{
                            this.tagAddDialog.showModal();
                        }} type="default" icon="plus">Add Column</Button>
                        <Button style={{margin: "0 5px", }} size="large" onClick={this.addNewRecord} type="primary" icon="plus">Add Row</Button>
                    </div>
                </div>
                <div
                    style={{
                        display: this.state.advancedShown? 'block' : 'none',
                        margin: "0 16px"
                    }}

                >
                    <AdvancedPanel
                        allColumns={allColumnsArr}
                        columnsShown={columnsShownArr}
                        updateColumns={this.updateColumns}
                    />
                </div>
                <div
                    style={{margin: "16px"}}
                >
                    <Table
                        scroll={{x: scroll_x_width, y: '65vh'}}
                        pagination={false}
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                    />
                </div>
                <TagAddDialog
                    existedColumns={allColumnsArr}
                    addTag={this.addColumn}
                    ref={tagAdd => { this.tagAddDialog = tagAdd; }}/>
                <input style={{margin: "32px"}} type="file" id="csv-file" name="files" onChange={this.handleFileUpload}/>
            </div>
        )
    }
}
