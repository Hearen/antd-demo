import React from 'react';
import { Table, Input, Icon, Upload, Button, Popconfirm, Alert, message, Select, } from 'antd';
import EditableCell from './EditableCell';
import {TagAddDialog} from "./TagAddDialog";
import AdvancedPanel from './AdvancedPanel';
import {
    cloneRecordAfterByKey, convertMapArrToCSVArr, generateStableKey, saveArrayToCSVFile,
    sorter as mySorter
} from './Tools';
import { loadData } from './Data';
import Papa from 'papaparse';
import TagManagementMenu from "./TagManagementMenu";
import {LoadLocalFile} from "./LoadLocalFile";
const Search = Input.Search;
const Option = Select.Option;

const LEFT_FIXED_WIDTH = 250;
const RIGHT_FIXED_WIDTH = 250;
const WIDTH = 200;

export default class TenantSpreadSheet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataSource: [],
            columns: [],
            searchValue: "",
            columnsShownArr: [],
            allColumnsArr: [],
            advancedShown: false,
            leftFixedNum: 0,
            fixedColumnsArr: [],
            isRecordValid: true,
            recordErrorDetail: "",
        };
    }

    componentDidMount() {
        this.updateTableData();
    }

    updateTableData = (arr) => {
        const { header, data } = loadData(arr);
        this.updateTheWholeTable(header, data);
    }

    updateTheWholeTable = (header, data) => {
        data.forEach((val, i) => {
            val["key"] = generateStableKey('#', val.id);
        });
        let columnsShownArr = [...header]
        let allColumnsArr = [...header];
        let columns = this.initTableColumns(columnsShownArr);
        this.cacheData = data.map(item => ({...item}));
        this.setState({
            data,
            dataSource: data,
            columns,
            columnsShownArr,
            allColumnsArr,
            isRecordValid: true,
            recordErrorDetail: "",
        });

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
    }

    removeColumn = (tag) => {
        let columnsShownArr = this.state.columnsShownArr.filter(val => val!==tag);
        let allColumnsArr = this.state.allColumnsArr.filter(val => val!==tag);
        const columns = this.initTableColumns(columnsShownArr);
        let data = [ ...this.state.data ];
        data.forEach((val) => {
            delete val[tag];
        });
        let dataSource = [ ...this.state.dataSource ];
        dataSource.forEach((val) => {
            delete val[tag];
        });
        this.setState({
            columns,
            columnsShownArr,
            allColumnsArr,
            data,
            dataSource,
        });
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
        const columns = [];
        columnsShownArr.forEach((val, i) => {
            columns.push({
                title: val,
                dataIndex: val,
                key: val,
                sorter: (a, b) => mySorter(a[val], b[val]), //return value is the base for sorting;
                render: (text, record) => this.renderColumns(text, record, val),
            });
        });
        this.adjustColumns(columns);
        return columns;
    }

    updateFixedColumns = (fixedColumnsArr) => {
        this.setState({
            fixedColumnsArr,
        }, () => { this.updateColumns(this.state.columnsShownArr); });
    }

    showRevisionDialog = () => {
        message.config({top: 200, duration: 3});
        message.info("Waiting to merge with revision");
    }

    //Memo: width, fixed attribute in column and scroll attribute in table is the key to enable fixing sides;
    //the width is essential to make the alignment acceptable;
    adjustColumns = (columns) => {
        const { fixedColumnsArr } = this.state;
        let fixedColumns = [], unFixedColumns = [];
        for(let i = 0; i < fixedColumnsArr.length; ++i){
            let fixed = fixedColumnsArr[i];
            columns.forEach((val) => {
                if(val.dataIndex === fixed){
                    val["fixed"] = "left";
                    val["width"] = LEFT_FIXED_WIDTH;
                    fixedColumns.push(val)
                }
            })
        }
        for(let i = 0; i < columns.length; ++i){
            if(fixedColumnsArr.findIndex(fixed => fixed===columns[i].dataIndex) === -1){
                columns[i]["width"] = WIDTH; //if the alignment is an issue, set the width;
                unFixedColumns.push(columns[i]);
            }
        }
        if(columns.length > 0){
            delete columns[columns.length-1].width; //let the last column auto-adjust - very important to properly fit in;
        }
        columns.splice(0, columns.length, ...fixedColumns, ...unFixedColumns);
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
                        <a style={{color: 'red'}} onClick={() => { this.removeRecord(record.key); }}>
                            <Icon type="delete"/>
                            Delete</a>
                        <span> | </span>
                        <a onClick={this.showRevisionDialog}>
                            <Icon type="calendar"/>
                            Revision</a>
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

    isRecordValid = (record) => {
        const { allColumnsArr } = this.state;
        for(let i = 0; i < allColumnsArr.length; ++i){
            let key = allColumnsArr[i];
            if(record.hasOwnProperty(key)){
                if(record[key] !== undefined && record[key].toString().trim() !== ''){
                    return true;
                }
            }
        }
        return false;
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
        let isRecordValid = this.isRecordValid(target);
        this.setState({
            isRecordValid,
        });
        if(!isRecordValid) {
            return ;
        }
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
            let isRecordValid = this.isRecordValid(target);
            this.setState({
                isRecordValid,
            });
            if(!isRecordValid) {
                return ;
            }
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
        newRecord["key"] = generateStableKey('#', data.length+10000);
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
        }, () => { this.editRecord(key); });
    }

    toggleAdvancedPanel = () => {
        this.setState({
            advancedShown: !this.state.advancedShown,
        });
    }

    showTagAddDialog = () => { //do not ever forget the arrow function to bind `this`;
        this.tagAddDialog.showModal();
    }

    exportSelected = () => {
        const selectedRows = this.selectedRows;
        if(selectedRows===undefined || selectedRows.length===0){
            message.error("Please select first");
        } else {
            let arr = convertMapArrToCSVArr(this.selectedRows, this.state.columnsShownArr);
            saveArrayToCSVFile(arr);
        }
    }

    render() {
        const { fixedColumnsArr, allColumnsArr, columnsShownArr, isRecordValid, recordErrorDetail,  } = this.state;
        const leftFixedNum = fixedColumnsArr.length;
        const scroll_x_width = leftFixedNum*LEFT_FIXED_WIDTH + RIGHT_FIXED_WIDTH + (this.state.columnsShownArr.length-leftFixedNum)*WIDTH;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => { //all columns will be selected even the hidden;
                this.selectedRows = selectedRows;
            },
        };
        return (
            <div style={{margin: "32px 16px"}}>
                <div style={{textAlign: "left", }}>
                    <Search
                        size="large"
                        onSearch={this.handleSearch}
                        style={{width: "50%", margin: "16px", }} />
                    <a size="large" onClick={() => { this.toggleAdvancedPanel(); }}>{this.state.advancedShown? "Hide" : "Advanced"}</a>
                    <div style={{float: "right", margin: "16px", display: 'flex'}}>
                        <div>
                            <Button style={{  margin: "0 5px"}}
                                    onClick={this.exportSelected}
                                    size="large"
                                    icon='download'
                                    value="default">Export</Button>
                            <LoadLocalFile
                                updateTable={this.updateTableData}
                                test={() => alert("test")}
                            />
                        </div>
                        <div style={{margin: "0 16px"}}>
                            <TagManagementMenu
                                style={{ margin: '0 5px'}}
                                columnsShown={columnsShownArr}
                                removeColumn={this.removeColumn}
                                showTagAddDialog={this.showTagAddDialog}
                            />
                            <Button style={{ margin: "0 5px", }} size="large" onClick={this.addNewRecord} type="primary" icon="plus">Add Row</Button>
                        </div>
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
                        fixedColumns={fixedColumnsArr}
                        updateColumns={this.updateColumns}
                        updateFixedColumns={this.updateFixedColumns}
                    />
                </div>
                <div style={{
                    display: isRecordValid? 'none' : 'block',
                    textAlign: 'center',
                }}>
                    <Alert message={"Invalid record"+(recordErrorDetail? ':':'')+recordErrorDetail} type="error" showIcon />
                </div>
                <div
                    style={{margin: "16px"}}
                >
                    <Table
                        scroll={{x: scroll_x_width, y: '70vh'}}
                        pagination={false}
                        rowSelection={rowSelection}
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                    />
                </div>
                <TagAddDialog
                    ref = { t => { this.tagAddDialog = t; }}
                    existedColumns={allColumnsArr}
                    addTag={this.addColumn} />
            </div>
        )
    }
}
