import React from 'react';
import { Select } from 'antd';
const Option = Select.Option;

export default class AdvancedPanel extends React.Component {
    constructor(props){
        super(props);
        this.updateColumns = props.updateColumns;
    }

    handleChange = (value) => {
        this.updateColumns(value);
    }

    render(){
        const options = [];
        const { columnsShown, allColumns } = this.props;
        allColumns.forEach((val, i) => {
            if(columnsShown.findIndex( shown => val===shown ) === -1){
                options.push(<Option key={val}>{val}</Option>); //this key is used to cooperate with defaultValue (checked);
            }
        });
        return (
            <Select
                mode="multiple"
                size="large"
                autoFocus
                placeholder="Please select columns"
                value={columnsShown}
                onChange={this.handleChange}
                style={{ width: '100%', }}
            >
                {options}
            </Select>
        );
    }
}