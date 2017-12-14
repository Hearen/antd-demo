import React from 'react';
import { Select } from 'antd';
const Option = Select.Option;

export default class ColumnSelect extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            allColumns: props.allColumns,
            columnsShown: props.columnsShownArr, //update the columnsShown to columnsShownArr;
        };
        this.updateColumns = props.updateColumns;
    }

    handleChange = (value) => {
        this.updateColumns(value);
    }

    render(){
        const options = [];
        this.state.allColumns.forEach((val, i) => {
            options.push(<Option key={val}>{val}</Option>); //this key is used to cooperate with defaultValue (checked);
        });
        return (
            <Select
                mode="multiple"
                size="large"
                allowClear
                autoFocus
                placeholder="Please select columns"
                defaultValue={this.state.columnsShown}
                onChange={this.handleChange}
                style={{ width: '100%', }}
            >
                {options}
            </Select>
        );
    }
}