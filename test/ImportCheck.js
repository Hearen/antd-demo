import React from 'react';
import { Upload, Button, Icon, Tooltip } from 'antd';
import * as Actions from '../../actions/actions';
import ImportConfirmDialog from './ImportConfirmDialog';

export default class UploadFile extends React.Component {

  state = {
    checkingResults: {},
    dialogOpen: false,
  }

  handleImportCheck = (file) => {
    Actions.checkImportedTenant(file)
        .then((response) => {
          this.setState({
            checkingResults: response,
            file,
          }, () => { this.confirmDialog.showModal(); });
        });
  }

  render() {
    this.loadTenantData = this.props.loadTenantData;
    const props = {
      name: 'file',
      accept: '.csv',
      multiple: false,
      showUploadList: false,
      beforeUpload: (file) => {
        this.handleImportCheck(file);
        this.setState({
          file,
        });
        return false;
      },
    };
    return (
      <Upload {...props}>
        <Tooltip placement="topRight" title="Add more data">
          <Button>
            <Icon type="upload" /> Import
          </Button>
        </Tooltip>
        <ImportConfirmDialog
          ref={(t) => { this.confirmDialog = t; }}
          visible={this.state.dialogOpen}
          file={this.state.file}
          loadTenantData={this.loadTenantData}
          errorMessage={this.state.checkingResults.errorResults}
          warningMessage={this.state.checkingResults.warningResults}
        />
      </Upload>
    );
  }
}

UploadFile.propTypes = {
  loadTenantData: React.PropTypes.func,
};
