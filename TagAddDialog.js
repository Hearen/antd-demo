import React from 'react';
import { Form, Modal, Button, Input, Select, } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

export class TagAddDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            tagName: "",
            defaultValue: "",
        };
        this.addTag = props.addTag;
    }

    onTagNameChange = (e) => {
        this.setState({
            tagName: e.target.value,
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
    handleOk = () => { //have to check the duplicates;
        const { tagName, defaultValue } = this.state;
        this.addTag(tagName, defaultValue);
        this.setState({
            visible: false,
        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }
    render() {
        const { visible, } = this.state;
        const types = ["Integer", "Float", "String", "Date", "Number"]
        const children = [];
        types.forEach((val, i) => {
            children.push(<Option key={i.toString(36) + i}>{val}</Option>);
        });
        return (
            <div>
                <Modal
                    visible={visible}
                    title="Add New Tag"
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
                            <Input size="large" value={this.state.tagName} placeholder="Tag Name" onChange={this.onTagNameChange}/>
                        </FormItem>
                        <FormItem>
                            <Input size="large" value={this.state.defaultValue} placeholder="Default Value" onChange={this.onDefaultValueChange}/>
                        </FormItem>
                        <FormItem>
                            <Select
                                mode="multiple"
                                allowClear
                                size="large"
                                placeholder="Select the valid types"
                                onChange={this.handleChange}
                            >
                                {children}
                            </Select>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}