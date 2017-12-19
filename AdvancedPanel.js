import React from 'react';
import { Select, Checkbox, } from 'antd';
const Option = Select.Option;

export default class AdvancedPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fixedColumnsArr: props.fixedColumnsArr,
        }
        this.updateColumns = props.updateColumns;
        this.updateFixedColumns = props.updateFixedColumns;
    }

    handleChange = (value) => {
        this.updateColumns(value);
    }

    handleFixedColumnsChange = (value) => {
        this.updateFixedColumns(value);
    }

    render() {
        const options = [];
        const {columnsShown, allColumns, fixedColumns } = this.props;
        allColumns.forEach((val, i) => {
            if (columnsShown.findIndex(shown => val === shown) === -1) {
                options.push(<Option key={val}>{val}</Option>); //this key is used to cooperate with defaultValue (checked);
            }
        });
        const fixedOptions = [];
        columnsShown.forEach((val) => {
            if (fixedColumns.findIndex(shown => val === shown) === -1) {
                fixedOptions.push(<Option key={val}>{val}</Option>); //this key is used to cooperate with defaultValue (checked);
            }
        });
        return (
            <div>
                <Select
                    mode="multiple"
                    size="large"
                    autoFocus
                    placeholder="Fixed Columns"
                    value={fixedColumns}
                    onChange={this.handleFixedColumnsChange}
                    style={{width: '15vw', }}
                >
                    {fixedOptions}
                </Select>
                <Select
                    mode="multiple"
                    size="large"
                    autoFocus
                    placeholder="Please select columns"
                    value={columnsShown}
                    onChange={this.handleChange}
                    style={{width: '80vw',marginLeft: "16px",}}
                >
                    {options}
                </Select>
            </div>
        );
    }
}