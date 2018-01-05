import React from 'react';
import { Modal, Tabs, List, message as Message } from 'antd';
import * as Actions from '../../actions/actions';

const TabPane = Tabs.TabPane;

export default class ImportConfirmDialog extends React.Component {
  state = {
    visible: false,
    activeKey: '1',
  };

  closeDialog = () => {
    this.warningMessage = [];
    this.errorMessage = [];
    this.setState({
      visible: false,
      activeKey: '1',
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  onOk = () => {
    if (this.errorMessage.length > 0) {
      Message.config({
        top: 200,
        duration: 2,
      });
      Message.error('Fix the errors first and then re-try.');
    } else {
      Actions.importTenant(this.file)
          .then(() => {
            this.loadTenantData();
            Message.info('Imported successfully!');
          });
    }
    this.closeDialog();
  }

  onCancel = () => {
    this.closeDialog();
  }

  parseMessages = (messages) => {
    if (!messages) return undefined;
    const data = [];
    messages.forEach((message) => {
      let s = '';
      if (message.line) {
        s = `[LINE: ${message.line}] `;
      }
      s += message.content;
      data.push(s);
    });
    return (<div style={{ width: '100%', height: '30vh', overflow: 'auto' }}>
      <List
        dataSource={data}
        renderItem={item => (<List.Item>{item}</List.Item>)}
      />
    </div>);
  }
  render() {
    this.file = this.props.file;
    this.loadTenantData = this.props.loadTenantData;
    this.errorMessage = this.props.errorMessage;
    this.warningMessage = this.props.warningMessage;
    return (
      <div>
        <Modal
          width="60%"
          title="Import Checking Result"
          visible={this.state.visible}
          maskClosable={false}
          onOk={this.onOk}
          onCancel={this.onCancel}
        >
          <Tabs defaultActiveKey={this.state.activeKey}>
            <TabPane
              tab={<span style={{ color: 'red' }}>Errors
                {this.errorMessage && this.errorMessage.length > 0 ? `(${this.errorMessage.length})` : ''}</span>}
              key="1"
            >
              {this.parseMessages(this.errorMessage)}
            </TabPane>
            <TabPane
              tab={<span>Warnings{this.warningMessage && this.warningMessage.length > 0 ?
                  `(${this.warningMessage.length})` : ''}</span>}
              key="2"
            >
              {this.parseMessages(this.warningMessage)}
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}

ImportConfirmDialog.propTypes = {
  loadTenantData: React.PropTypes.func,
  file: React.PropTypes.object,
  errorMessage: React.PropTypes.array,
  warningMessage: React.PropTypes.array,
};
