import React from 'react';
import { Select, Tooltip } from 'antd';
import * as Const from './Const';

const Option = Select.Option;

export default class AdvancedPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allColumns: props.allColumns,
      columnsShown: props.columnsShown,
      fixedColumns: props.fixedColumns,
    };
    this.updateFixedColumns = props.updateFixedColumns;
    this.updateColumns = props.updateColumns;
  }

  handleColumnsShownChange = (value) => {
    if (value.length === 0) {
      value = [...Const.ESSENTIAL_FILEDS];
    }
    this.setState({
      columnsShown: value,
    });
    this.updateColumns(value);
  }

  handleFixedColumnsChange = (value) => {
    this.setState({
      fixedColumns: value,
    });
    this.updateFixedColumns(value);
  }

  componentWillReceiveProps() {
    this.setState({
      allCollumns: this.props.allColumns,
      columnsShown: this.props.columnsShown,
    });
  }

  render() {
    const { fixedColumns, columnsShown, allColumns } = this.state;
    const options = [];
    allColumns.forEach((val) => {
      if (columnsShown.findIndex(shown => val === shown) === -1) {
        options.push(<Option key={val}>{val}</Option>); // this key is used to cooperate with defaultValue (checked);
      }
    });
    const fixedOptions = [];
    columnsShown.forEach((val) => {
      if (fixedColumns.findIndex(shown => val === shown) === -1) {
        fixedOptions.push(<Option key={val}>{val}</Option>);
      }
    });
    return (
      <div style={{ width: '100%' }}>
        <Tooltip placement="topRight" text="Fix columns to left">
          <Select
            mode="multiple"
            autoFocus
            placeholder="Fixed Columns"
            value={fixedColumns}
            onChange={this.handleFixedColumnsChange}
            style={{ width: '25%' }}
          >
            {fixedOptions}
          </Select>
        </Tooltip>
        <Tooltip placement="topRight" text="Select columns to show">
          <Select
            mode="multiple"
            allowClear
            autoFocus
            placeholder="Please select columns"
            value={columnsShown}
            onChange={this.handleColumnsShownChange}
            style={{ width: '60%', marginLeft: '45px' }}
          >
            {options}
          </Select>
        </Tooltip>
      </div>
    );
  }
}

AdvancedPanel.propTypes = {
  updateColumns: React.PropTypes.func,
  updateFixedColumns: React.PropTypes.func,
  allColumns: React.PropTypes.array,
  columnsShown: React.PropTypes.array,
  fixedColumns: React.PropTypes.array,
};
