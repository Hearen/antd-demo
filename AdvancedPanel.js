import React from 'react';
import { Select, Checkbox, } from 'antd';
const Option = Select.Option;

export default class AdvancedPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fixFirstChecked: props.leftFixedNum>0,
        }
        this.updateColumns = props.updateColumns;
        this.updateFixedNum = props.updateFixedNum;
    }

    handleChange = (value) => {
        this.updateColumns(value);
    }

    handleFixedColumnChange = (e) => {
        let fixFirstChecked = e.target.checked;
        console.log(fixFirstChecked);
        this.setState({
            fixFirstChecked,
        }, this.updateFixedNum(fixFirstChecked? 1 : 0));

    }

    render() {
        const options = [];
        const {columnsShown, allColumns} = this.props;
        allColumns.forEach((val, i) => {
            if (columnsShown.findIndex(shown => val === shown) === -1) {
                options.push(<Option key={val}>{val}</Option>); //this key is used to cooperate with defaultValue (checked);
            }
        });
        return (
            <div>
                <Checkbox
                    checked={this.state.fixFirstChecked}
                    style={{width: "15vw" }}
                    onChange={this.handleFixedColumnChange}>
                    Fix First Column</Checkbox>
                <Select
                    mode="multiple"
                    size="large"
                    autoFocus
                    placeholder="Please select columns"
                    value={columnsShown}
                    onChange={this.handleChange}
                    style={{width: '80vw',}}
                >
                    {options}
                </Select>
            </div>
        );
    }
}