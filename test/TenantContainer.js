import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Input, Menu, Dropdown, Icon, Button, Popconfirm, Alert, message as Message, Spin } from 'antd';
import * as Actions from '../../actions/actions';
import { Toolbar } from '../../../common/components';
import EditableCell from './EditableCell';
import TagAddDialog from './TagAddDialog';
import RevisionAllFieldDialog from '../../../revision/components/RevisionAllFieldDialog';
import { Tenant } from '../../../revision/const/RevisionAllMetaData';
import AdvancedPanel from './AdvancedPanel';
import {
    getClonedKey, cloneRecordAfterByKey, convertMapArrToCSVArr, initFilterRecord, isRecordEmpty, saveArrayToCSVFile,
    sorter as mySorter, checkRecordValidity, restoreRecordValue, updateOrigin, getKey, hasEditable, restoreTarget,
    updateTenant, loadData, buildTarget,
} from './Utils';
import UploadFile from './ImportCheck';
import * as Const from './Const';

const Search = Input.Search;

class TenantSpreadSheet extends React.Component {
  constructor(props) {
    super(props);
    this.filterInputs = {};
    this.data = [];
    this.tenantDict = {};
    this.state = {
      dataSource: [],
      columns: [],
      searchValue: '',
      columnsShownArr: [],
      allColumnsArr: [],
      advancedShown: false,
      leftFixedNum: 0,
      fixedColumnsArr: [...Const.UNIQUE_CONTRAINT],
      isRecordValid: true,
      recordErrorDetail: '',
      filterRecord: {},
      isLoading: true,
      showRevision: false,
      selectedTenantId: -1,
    };
    this.loadTenantData();
    Message.config({ top: 80, duration: 3 });
  }

  loadTenantData = () => {
    this.props.dispatch(Actions.fetchTenantWithTags())
        .then((received) => {
          received = received.data;
          const tenantList = received.tenantList;
          this.tagList = received.tagList;
          const { header, data } = loadData(tenantList, this.tagList, this.tenantDict);
          this.updateTheWholeTable(header, data);
        });
  }

  updateTheWholeTable = (header, data) => {
    const columnsShownArr = [...header];
    const allColumnsArr = [...header];
    const columns = this.initTableColumns(columnsShownArr);
    this.data = data;
    this.cacheData = data.map(item => ({ ...item }));
    this.setState({
      dataSource: data.map(item => ({ ...item })),
      columns,
      columnsShownArr,
      allColumnsArr,
      isRecordValid: true,
      isLoading: false,
    });
  }

  addColumn = (newTag, defaultValue) => {
    this.props.dispatch(Actions.saveTenantTagLabel({ label: newTag }))
          .then((response) => {
            this.tagList.push(response); // ToDo: update by this way might not correct - consistent with db;
            const columnsShownArr = [...this.state.columnsShownArr, newTag];
            const allColumnsArr = [...this.state.allColumnsArr, newTag];
            const columns = this.initTableColumns(columnsShownArr);
            this.data.forEach((val) => {
              val[newTag] = defaultValue;
            });
            const dataSource = [...this.state.dataSource];
            dataSource.forEach((val) => {
              val[newTag] = defaultValue;
            });
            this.setState({
              columns,
              columnsShownArr,
              allColumnsArr,
              dataSource,
            });
          });
  }

  removeColumn = (tag) => {
    const columnsShownArr = this.state.columnsShownArr.filter(val => val !== tag);
    const allColumnsArr = this.state.allColumnsArr.filter(val => val !== tag);
    const columns = this.initTableColumns(columnsShownArr);
    this.data.forEach((val) => {
      delete val[tag];
    });
    const dataSource = [...this.state.dataSource];
    dataSource.forEach((val) => {
      delete val[tag];
    });
    this.setState({
      columns,
      columnsShownArr,
      allColumnsArr,
      dataSource,
    });
  }

  updateColumns = (columnsShownArr) => {
    if (columnsShownArr.length === 0) { // when there is no column show previous state;
      columnsShownArr = this.state.columnsShownArr;
    }
    const columns = this.initTableColumns(columnsShownArr);
    const dataSource = [].concat(this.state.dataSource); // update the dataSource along with columns to bind data;
    this.setState({
      columns,
      columnsShownArr,
      dataSource,
    });
  }

  initTableColumns = (columnsShownArr) => {
    const columns = [];
    columnsShownArr.forEach((column, i) => {
      columns.push({
        title: (
                (<div style={{ height: Const.HEADER_HEIGHT }}>
                  <div
                    style={{ cursor: 'pointer',
                      width: Const.WIDTH,
                      height: Const.TEXT_HEIGHT,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => { this.sortBy(column); }}
                  >{column}</div>
                  <div style={{ marginTop: '4px' }}>
                    <Input
                      tabIndex={i + 1}
                      ref={(filter) => { this.filterInputs[column] = filter; }}
                      onChange={(e) => { this.handleFilterInputChange(column, e); }}
                    />
                  </div>
                </div>)
          ),
        dataIndex: column,
        key: column,
        render: (text, record) => this.renderColumns(text, record, column),
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
    Message.info('Coming soon!');
    // window.console.log(key);
    // this.setState({ showRevision: true, selectedTenantId: key });
  }

    // Memo: width, fixed attribute in column and scroll attribute in table is the key to enable fixing sides;
    // the width is essential to make the alignment acceptable;
  adjustColumns = (columns) => {
    const { fixedColumnsArr } = this.state;
    const fixedColumns = [];
    const unFixedColumns = [];
    for (let i = 0; i < fixedColumnsArr.length; ++i) {
      const fixed = fixedColumnsArr[i];
      columns.forEach((val) => {
        if (val.dataIndex === fixed) {
          val.fixed = 'left';
          val.width = Const.LEFT_FIXED_WIDTH;
          fixedColumns.push(val);
        }
      });
    }
    for (let i = 0; i < columns.length; ++i) {
      if (fixedColumnsArr.findIndex(fixed => fixed === columns[i].dataIndex) === -1) {
        columns[i].width = Const.WIDTH; // if the alignment is an issue, set the width;
        unFixedColumns.push(columns[i]);
      }
    }
    if (unFixedColumns.length > 0) {
      delete unFixedColumns[unFixedColumns.length - 1].width;
    }
    columns.splice(0, columns.length, ...fixedColumns, ...unFixedColumns);
    columns.push({
      title: (
        <div style={{ height: Const.HEADER_HEIGHT }}>
          <div>Actions </div>
          <div style={{ marginTop: '4px' }}>
            <Button onClick={this.resetFilter}>
                  Clear Filters
            </Button>
          </div>
        </div>
      ),
      dataIndex: 'actions',
      key: 'actions',
      fixed: 'right',
      width: Const.RIGHT_FIXED_WIDTH,
      render: (text, record) => {
        const actionMenu = (
          <Menu>
            <Menu.Item key="1">
              <span onClick={() => { this.cloneRecord(record.key); }}><Icon type="copy" />Copy</span>
            </Menu.Item>
            <Menu.Item key="2">
              <span onClick={() => { this.showRevisionDialog(record.key); }}><Icon type="calendar" />Revision</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Popconfirm title="Sure to delete?" onConfirm={() => this.removeRecord(record.key)}>
                <span style={{ color: 'red' }}><Icon type="delete" />Delete</span>
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );
        const { editable, isSavior } = record;
        return (
            isSavior ?
              <div />
                : <div style={{ height: Const.CELL_HEIGHT }}>
                  {
                    <div className="editable-row-operations">
                      {
                        editable ?
                          <span>
                            <Button
                              style={{ marginLeft: '4px' }}
                              size="small"
                              icon="save"
                              onClick={() => this.saveEdit(record.key)}
                            >Save</Button>
                            <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancelEdit(record.key)}>
                              <Button
                                style={{ marginLeft: '4px', color: 'red' }}
                                size="small"
                                icon="delete"
                              >Cancel</Button>
                            </Popconfirm>
                          </span>
                            :
                              <Button
                                style={{ marginLeft: '4px' }}
                                size="small"
                                icon="edit"
                                type="primary"
                                onClick={() => this.editRecord(record.key)}
                              >Edit</Button>
                        }
                      <Dropdown style={{ display: editable ? 'none' : 'inline' }} overlay={actionMenu}>
                        <Button size="small" style={{ display: editable ? 'none' : 'inline', marginLeft: 8 }}>
                          More <Icon type="down" />
                        </Button>
                      </Dropdown>
                    </div>
                  }
                </div>
        );
      },
    });
  }

  sortBy = (() => {
    let isAscending = true;
    return (column) => {
      const dataSource = [...this.state.dataSource];
      dataSource.sort((a, b) => mySorter(a[column], b[column]));
      if (isAscending) {
        dataSource.reverse();
      }
      isAscending = !isAscending;
      this.setState({
        dataSource,
      });
    };
  })();

  handleFilterInputChange = (column, e) => {
    const filterRecord = { ...this.state.filterRecord };
    filterRecord[column] = e.target.value;
    this.setState({
      filterRecord,
    }, this.handleColumnSearch);
  }

  resetFilter = () => {
    this.state.columnsShownArr.forEach((key) => {
      this.filterInputs[key].input.value = '';
    });
    this.setState({
      filterRecord: initFilterRecord(this.state.allColumnsArr),
    }, this.handleColumnSearch);
  }

  handleSearch = (value) => {
    if (hasEditable(this.state.dataSource)) {
      Message.error('Save the edited before search!');
      return;
    }
    value = value || '';
    value = value.trim();
    this.searchText = value;
    const searchText = value;
    let newDataSource;
    if (!searchText || searchText.length === 0) {
      newDataSource = this.data.map(record => record);
    } else {
      const reg = new RegExp(searchText, 'gi');
      const { columnsShownArr } = this.state;
      newDataSource = this.data.map((item) => {
        const record = Object.assign({}, item);
        let matchCount = 0;
        for (let i = 0; i < columnsShownArr.length; ++i) {
          const key = columnsShownArr[i];
          if (record[key]) {
            const match = (`${record[key]}`).match(reg);
            if (match) {
              matchCount++;
              record[key] = (<span> {record[key].split(reg).map((text, j) => (
                      j > 0 ? [<span style={{ color: 'red' }}>{match[0]}</span>, text] : text))} </span>);
            }
          }
        }
        return matchCount > 0 ? record : null;
      }).filter(item => !!item);
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

  handleColumnSearch = () => { // if all is empty, reset dataSource using data;
    if (hasEditable(this.state.dataSource)) {
      Message.error('Save the edited before search!');
      return;
    }
    const { columnsShownArr, filterRecord } = this.state;
    const newDataSource = this.data.map((item) => {
      const record = Object.assign({}, item);
      for (let i = 0; i < columnsShownArr.length; ++i) {
        const column = columnsShownArr[i];
        const value = filterRecord[column];
        if (value && value.trim().length > 0) {
          const reg = new RegExp(value, 'gi');
          const match = (`${record[column]}`).match(reg);
          if (!match) {
            return null;
          }
          if (!record[column]) {
            return null;
          }
          record[column] = (<span> {record[column].split(reg).map((text, j) => (
                  j > 0 ? [<span style={{ color: 'red' }}>{match[0]}</span>, text] : text))} </span>);
        }
      }
      return record;
    }).filter(record => !!record);
    if (newDataSource.length === 0) {
      newDataSource.push({ key: 't', isSavior: true });
    }
    this.setState({
      dataSource: newDataSource,
    });
  }


  handleChange = (value, key, column) => { // value -> cell current value, key -> record key, column -> column title;
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      if (target.isFilterRecord) {
        if (isRecordEmpty(target, this.state.columnsShownArr)) {
          this.setState({
            dataSource: [target, ...this.data],
          });
        } else {
          this.handleColumnSearch();
        }
      }
    }
  }


  editRecord = (key) => {
    const newDataSource = [...this.state.dataSource];
    const target = newDataSource.filter(item => key === item.key)[0];
    const origin = this.data.filter(item => key === item.key)[0];
    if (target) {
      restoreRecordValue(target, origin);
      target.editable = true;
      this.setState({ dataSource: newDataSource }); // used to re-render when edit button clicked;
    }
  }
  saveEdit = (key) => { // Todo: create a new tenant;
    const target = this.state.dataSource.filter(item => key === item.key)[0];
    const { isValid, message } = checkRecordValidity(target, this.data);
    this.setState({
      isRecordValid: isValid,
      recordErrorDetail: message,
    });
    if (!isValid) {
      return;
    }
    const tenant = {};
    if (target.isCloned) {
      target.id = null;
      target.tags = [];
    }
    updateTenant(tenant, target, this.tagList);
    this.setState({
      isLoading: true,
    }, () => {
      this.saveTenantToDB(tenant, target);
    });
  }

  saveTenantToDB = (tenant, target) => {
    this.props.dispatch(Actions.saveTenant(tenant))
          .then((response) => {
            if (target) {
              const newData = [...this.data];
              if (target.isCloned) {
                target.key = target.id = response.id;
                delete target.isCloned;
                const key = getKey(target.key);
                let insertIndex = newData.findIndex(item => item.key === key);
                if (insertIndex === -1) { // ToDo: not accurate;
                  insertIndex = 0;
                } else {
                  insertIndex += 1;
                }
                const origin = buildTarget(response);
                newData.splice(insertIndex, 0, origin);
              } else {
                const origin = newData.filter(item => item.key === target.key)[0];
                updateOrigin(origin, target, response);
              }
              delete target.editable;
              this.data = newData;
              this.cacheData = this.state.dataSource.map(item => ({ ...item }));
            }
            this.setState({
              isLoading: false,
            });
          });
  }

  cancelEdit = (key) => { // ToDo: remove the newly added;
    let newDataSource = [...this.state.dataSource];
    const target = newDataSource.filter(item => key === item.key)[0];
    if (target) {
      if (target.isCloned) {
        newDataSource = this.state.dataSource.filter(item => item.key !== key);
      } else {
        restoreTarget(target, this.cacheData.filter(item => key === item.key)[0]);
      }
      this.setState({
        dataSource: newDataSource,
        isRecordValid: true,
      });
    }
  }

  removeRecord = (key) => {
    const record = this.state.dataSource.filter(item => key === item.key)[0];
    if (record.canDelete && !record.canDelete) {
      Message.error('Connected to envUsage, cannot be deleted!');
      return;
    }
    this.props.dispatch(Actions.deleteTenant(record.id))
          .then((response) => {
            const { Status, Description } = response;
            if (Status === 'error') {
              Message.error(Description);
              return;
            }
            this.data = this.data.filter(item => key !== item.key);
            const dataSource = this.state.dataSource.filter(item => key !== item.key);
            Message.info('Record Deleted!');
            this.setState({
              dataSource,
            });
          }).catch((error) => {
            Message.error(`Tenant cannot be deleted!   ${error}`);
          });
  }

  addNewRecord = () => {
    const newRecord = { tags: [] };
    const { dataSource } = this.state;
    if (dataSource.findIndex(record => record.isCloned) > -1) {
      Message.error('Save the editing record first');
      return;
    }
    newRecord.key = Date.now();
    newRecord.isCloned = true;
    newRecord.editable = true;
    dataSource.splice(0, 0, newRecord);
    const newDataSource = [...dataSource];
    this.setState({
      dataSource: newDataSource,
    });
  }

  cloneRecord = (key) => {
    const { dataSource } = this.state;
    if (dataSource.findIndex(val => val.key === getClonedKey(key)) > -1) {
      Message.info('Already copied! Please save it first!');
      return;
    }
    const clonedRecord = {};
    const newDataSource = cloneRecordAfterByKey(clonedRecord, dataSource, key);
    this.setState({
      dataSource: newDataSource,
    });
  }

  toggleAdvancedPanel = () => {
    this.setState({
      advancedShown: !this.state.advancedShown,
    });
  }

  showTagAddDialog = () => { // do not ever forget the arrow function to bind `this`;
    this.tagAddDialog.showModal();
  }

  exportSelected = () => {
    const selectedRows = this.selectedRows;
    if (selectedRows === undefined || selectedRows.length === 0) {
      Message.error('Please select first');
    } else {
      const arr = convertMapArrToCSVArr(this.selectedRows, this.state.columnsShownArr);
      saveArrayToCSVFile(arr);
    }
  };

  handleRevisonClose = () => {
    this.setState({
      showRevision: false,
      selectedTenantId: -1,
    });
    // const { location } = this.props;
    // const query = location.query;
    // this.reload(query);
  }

  render() {
    const { advancedShown, fixedColumnsArr, allColumnsArr, columnsShownArr, isRecordValid, recordErrorDetail,
        isLoading, dataSource, columns } = this.state;
    const leftFixedNum = fixedColumnsArr.length;
    const scrollXWidth = Const.EXTRA_FOR_CHECKBOX + (leftFixedNum * (Const.LEFT_FIXED_WIDTH + Const.PADDING)) +
        Const.RIGHT_FIXED_WIDTH + ((this.state.columnsShownArr.length - leftFixedNum) * (Const.WIDTH + Const.PADDING));
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => { // all columns will be selected even the hidden;
        this.selectedRows = selectedRows;
      },
    };
    let advancedPanelHeight = 0;
    if (this.advancedPanelDiv) {
      advancedPanelHeight = this.advancedPanelDiv.offsetHeight;
    }
    const verticalOffset = 190 + (advancedShown ? advancedPanelHeight : 0);
    return (
      <div>
        <Spin spinning={isLoading}>
          <Toolbar pageLabel="Tenant Management" refreshPage={this.loadTenantData} />
          <div style={{ textAlign: 'left' }}>
            <Search
              onSearch={this.handleSearch}
              style={{ width: 'calc(90% - 520px)', margin: '16px' }}
              enterButton
            />
            <a onClick={() => { this.toggleAdvancedPanel(); }}>{this.state.advancedShown ? 'Hide' : 'Columns'}</a>
            <div style={{ float: 'right', margin: '16px', display: 'flex' }}>
              <div>
                <Button
                  style={{ margin: '0 5px' }}
                  onClick={this.exportSelected}
                  icon="download"
                  value="default"
                >Export</Button>
                <UploadFile
                  loadTenantData={this.loadTenantData}
                />
              </div>
              <div style={{ marginLeft: '16px' }}>
                <Button
                  style={{ margin: '0 5px' }}
                  onClick={this.showTagAddDialog}
                  type="default"
                  icon="plus"
                > Column</Button>
                <Button
                  style={{ margin: '0 5px' }}
                  onClick={this.addNewRecord}
                  type="primary"
                  icon="plus"
                > Row</Button>
              </div>
            </div>
          </div>
          {
              advancedShown ?
                <div
                  ref={(d) => { this.advancedPanelDiv = d; }}
                  style={{ margin: '0 16px' }}
                >
                  <AdvancedPanel
                    key={Date.now()}
                    allColumns={allColumnsArr}
                    columnsShown={columnsShownArr}
                    fixedColumns={fixedColumnsArr}
                    updateColumns={this.updateColumns}
                    updateFixedColumns={this.updateFixedColumns}
                  />
                </div>
                  :
                  null
          }
          <div
            style={{
              display: isRecordValid ? 'none' : 'block',
              textAlign: 'center',
            }}
          >
            <Alert message={`Invalid Record: ${recordErrorDetail}`} type="error" showIcon />
          </div>
          <div
            style={{ margin: '16px' }}
          >
            <Table
              scroll={{ x: scrollXWidth, y: `calc(80vh - ${verticalOffset}px)` }}
              pagination={false}
              rowSelection={rowSelection}
              dataSource={dataSource}
              columns={columns}
            />
          </div>
          <TagAddDialog
            ref={(t) => { this.tagAddDialog = t; }}
            existedColumns={allColumnsArr}
            addTag={this.addColumn}
          />
          <RevisionAllFieldDialog
            visible={this.state.showRevision}
            title="Tenant Revisions"
            metaData={Tenant}
            entityId={this.state.selectedTenantId}
            afterClose={this.handleRevisonClose}
          />
        </Spin>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tenantWithTags: state.get('settings').get('tenantWithTags'),
  };
}

export default withRouter(connect(mapStateToProps)(TenantSpreadSheet));

