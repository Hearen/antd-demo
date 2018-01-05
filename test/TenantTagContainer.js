import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Checkbox } from 'antd';
import { TextField } from 'material-ui';
import Table from 'optool-react-components/common/table';
import * as Actions from '../../actions/actions';
import { Toolbar, Button, Dialog } from '../../../common/components';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  operationColumn: {
    display: 'flex',
    flexDirection: 'row',
  },
};

class TenantTagContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    loading: false,
    open: false,
    dialogOpen: false,
    deleteDialogOpen: false,
    dialogTitle: '',
    deleteDialogTitle: '',
    tag: this.tagStructure,
    errorTagNameMessage: '',
  };

  tagStructure = () => {
    return {
      id: null,
      label: '',
      deployment: false,
      hint: '',
    };
  }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    this.setState({ loading: true });
    this.props.dispatch(Actions.fetchTenantTagLabelList()).then(() => {
      this.setState({ tag: this.tagStructure(), loading: false });
    });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false, tag: {}, errorTagNameMessage: '' });
  };
  handleDeleteDialogClose = () => {
    this.setState({ deleteDialogOpen: false, tag: {} });
  };

  handleRefresh = () => {
    this.reload();
  };

  onClickSave = () => {
    const { tag } = this.state;
    this.props.dispatch(Actions.saveTenantTagLabel(tag)).then(() => {
      this.setState({ disableSave: true });
      this.handleClose();
      this.reload();
    }).catch((error) => {
      error.response.json().then((messages) => {
        this.setState({ errorTagNameMessage: messages.label });
      });
    });
  };

  onClickEdit = (event, row) => {
    event.stopPropagation();
    this.setState({
      dialogOpen: true,
      dialogTitle: 'Edit  Tenant  Tag',
      tag: row.toJS(),
    });
  };

  onClickDelete = (event, row) => {
    event.stopPropagation();
    this.setState({
      deleteDialogOpen: true,
      deleteDialogTitle: `Are you sure to delete tenant tag: ${row.get('label')}`,
      tag: row.toJS(),
    });
  };

  onDelete = () => {
    const { tag } = this.state;
    this.props.dispatch(Actions.deleteTenantTagLabel(tag)).then(() => {
      this.setState({ disableSave: true });
      this.handleDeleteDialogClose();
      this.reload();
    });
  };

  onClickAdd = () => {
    this.setState({
      dialogOpen: true,
      dialogTitle: 'Add  Tenant  Tag',
      tag: this.tagStructure(),
    });
  };

  handleChange = (event) => {
    const { tag } = this.state;
    if (!isNaN(event.target.name)) {
      tag.id = event.target.name;
    }
    tag.label = event.target.value;
    this.setState({ tag });
  };

  handleIsDeploymentChange = (event) => {
    const { tag } = this.state;
    if (!event.target.checked) {
      tag.hint = '';
    }
    tag.deployment = event.target.checked;
    this.setState({ tag });
  };

  handleHintChange = (event) => {
    const { tag } = this.state;
    tag.hint = event.target.value;
    this.setState({ tag });
  };

  renderAction = row => (
    <div style={styles.operationColumn}>
      <Button
        label="EDIT"
        table
        onTouchTap={(event) => {
          this.onClickEdit(event, row);
        }}
      />
      <Button
        del
        table
        onTouchTap={(event) => {
          this.onClickDelete(event, row);
        }}
      />
    </div>
  );

  isDeploymentTag = (row) => {
    if (row.get('deployment')) {
      return '√';
    }
    return '';
  };

  render() {
    const { tenantTagLabelList } = this.props;
    const columns = [
      {
        title: 'Tag Name', dataIndex: row => row.get('label'), key: 'label',
      },
      {
        title: 'Is Deployment Tag', dataIndex: row => this.isDeploymentTag(row), key: 'deployment',
      },
      {
        title: 'Operation', dataIndex: row => row.id, render: this.renderAction,
      }];
    const columnMinWidths = [300, 100, 600];
    return (
      <div style={styles.root}>
        <Toolbar
          parentPageLabel={'SETTINGS'}
          pageLabel={'TENANT TAG CONFIGURATION'}
          refreshPage={() => this.handleRefresh()}
        />

        <Table
          columns={columns}
          data={tenantTagLabelList}
          widths={columnMinWidths}
          selectable={false}
          showOnHover
          showCheckboxes={false}
          loading={this.state.loading}
          sortIndex={'label'}
          showPagination={false}
        />

        <Button
          add
          onClick={this.onClickAdd}
        />

        <Dialog
          open={this.state.dialogOpen}
          title={this.state.dialogTitle}
          edit
          onEdit={this.onClickSave}
          onCancel={this.handleClose}
        >
          <div>
            <TextField
              name={this.state.tag && this.state.tag.id}
              type="text"
              key="tagName"
              floatingLabelText="Tag Name"
              value={this.state.tag && this.state.tag.label}
              onChange={this.handleChange}
              errorText={this.state.errorTagNameMessage}
            />
          </div>
          <div>
            <Checkbox
              onChange={this.handleIsDeploymentChange}
              checked={this.state.tag && this.state.tag.deployment}
            >
              <span style={{ fontSize: 14 }} >Is Deployment Tag</span>
            </Checkbox>
          </div>
          {this.state.tag && this.state.tag.deployment &&
          <div>
            <TextField
              type="text"
              key="HintValue"
              floatingLabelText="Hint Value"
              value={this.state.tag && this.state.tag.hint}
              onChange={this.handleHintChange}
            />
          </div>
          }
        </Dialog>
        <Dialog
          open={this.state.deleteDialogOpen}
          title={this.state.deleteDialogTitle}
          confirm
          onConfirm={this.onDelete}
          onCancel={this.handleDeleteDialogClose}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tenantTagLabelList: state.get('settings').get('tenantTagLabelList'),
  };
}

TenantTagContainer.propTypes = {
  tenantTagLabelList: React.PropTypes.Object,
};
TenantTagContainer.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(TenantTagContainer));
