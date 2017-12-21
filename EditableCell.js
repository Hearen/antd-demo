import React from 'react';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
const TextArea = Input;

export default class EditableCell extends React.Component {
    constructor(props){
        super(props);
        this.recordHandleChange = props.parentHandleChange;
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
        this.recordHandleChange(value);
    }

    render() {
        let { value, editable } =  this.props;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                            />
                        </div>
                        :
                        <div  className="editable-cell-text-wrapper">
                            {value || ' '}
                        </div>
                }
            </div>
        );
    }
}
