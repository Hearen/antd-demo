import React from 'react';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
const TextArea = Input;

export default class EditableCell extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: this.props.value,
            editable: this.props.editable,
        }
        this.recordHandleChange = props.parentHandleChange;
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
        this.recordHandleChange(value);
    }

    check = () => {
        this.setState({ editable: false });
    }

    edit = () => {
        this.setState({ editable: true });
    }

    render() {
        let { value, editable } = { ...this.state, ...this.props };
        editable = this.state.editable || this.props.editable;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                                ref={t => { t && t.focus(); }}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div onDoubleClick={this.edit} className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}
