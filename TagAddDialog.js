import React from 'react';
import { Form, Modal, Button, Input, Select, Alert, } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

export class TagAddDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            tagName: "",
            isTagDuplicated: false,
            isTagEmpty: true,
            defaultValue: "",
        };
        this.existedColumns = props.existedColumns;
        this.addTag = props.addTag;
    }

    isTagEqual = (a, b) => {
        return a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();
    }


    onTagNameChange = (e) => {
        let tagName = e.target.value;
        let isTagEmpty = tagName.length === 0;
        let index = this.existedColumns.findIndex( val => this.isTagEqual(val, tagName));
        console.log(this.existedColumns);
        let isTagDuplicated = index > -1;
        this.setState({
            tagName,
            isTagDuplicated,
            isTagEmpty,
        });
    }

    onDefaultValueChange = (e) => {
        this.setState({
            defaultValue: e.target.value,
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => { //ToDo: have to make sure the tag is valid;
        if(this.isTagValid()){
            const { tagName, defaultValue } = this.state;
            this.addTag(tagName, defaultValue);
            this.resetDialog();
        }
    }

    isTagValid = () => {
        const { isTagEmpty, isTagDuplicated } = this.state;
        return !isTagEmpty && !isTagDuplicated;
    }

    resetDialog = () => {
        this.setState({
            visible: false,
            tagName: "",
            defaultValue: "",
            isTagDuplicated: false,
            isTagEmpty: true,
        });
    }

    handleCancel = () => {
        this.resetDialog();
    }

    render() {
        this.existedColumns = this.props.existedColumns;
        const {tagName, defaultValue, visible, isTagDuplicated, isTagEmpty} = this.state;
        return (
            <div>
                <Modal
                    visible={visible}
                    title="Add New Column"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>Cancel</Button>,
                        <Button key="submit" size="large" type="primary"  onClick={this.handleOk}>
                            Confirm
                        </Button>,
                    ]}
                >
                    <Form>
                        <FormItem>
                            <Input size="large" value={tagName} placeholder="Column Name"
                                   onChange={this.onTagNameChange}/>
                            {
                                visible && isTagEmpty?
                                    <Alert
                                        size="small"
                                        style={{
                                            margin: "5px 0px"
                                        }}
                                        message="Column name cannot be empty" type="warning" showIcon />
                                    :
                                    <Alert
                                        size="small"
                                        style={{
                                            display: isTagDuplicated? 'block' : 'none',
                                            margin: "5px 0px 0px 0px"
                                        }}
                                        message="Duplicated! This column name already exists!" type="error" showIcon />
                            }
                        </FormItem>
                        <FormItem>
                            <Input size="large" value={defaultValue} placeholder="Default Value"
                                   onChange={this.onDefaultValueChange}/>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}