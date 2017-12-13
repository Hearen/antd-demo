import React from 'react';
import { Form, Modal, Button, Input, Select, } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

export class TagAddDialog extends React.Component {
    state = {
        loading: false,
        visible: false,
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 1000);
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    render() {
        const { visible, loading } = this.state;
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
                        <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            Confirm
                        </Button>,
                    ]}
                >
                    <Form>
                        <FormItem>
                            <Input placeholder="Tag Name" />
                        </FormItem>
                        <FormItem>
                            <Select
                                mode="multiple"
                                allowClear
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