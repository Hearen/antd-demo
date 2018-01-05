import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Table from 'optool-react-components/common/table';
import { IconButton } from 'material-ui';
import Timer from 'material-ui/svg-icons/image/timer';
import * as Actions from '../../actions/actions';
import TenantInformationEditDialog from '../../components/tenant/tenantInformationEditDialog';
import TenantDashboardPanel from '../../components/tenant/tenantDashboardPanel';
import TenantUploadPanel from '../../components/tenant/TenantUploadPanel';
import TenantTagView from '../../components/tenant/TenantTagView';
import RevisionDialog from '../../../revision/components/RevisionDialog';
import { Tenant } from '../../../revision/const/RevisionMetaData';
import { Toolbar, Button } from '../../../common/components';
import { UNDERSCOREJS } from '../../../common/utils';

const ImmutablePropTypes = require('react-immutable-proptypes');

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

class TenantDashboardPage extends React.Component {

  constructor(props) {
    super(props);
    this.closeUploadDialog = this.closeUploadDialog.bind(this);
  }

  state = {
    loading: false,
    dialogOpen: false,
    uploadDialogOpen: false,
    dialogTitle: '',
    tenantId: -1,
    currentPage: 0,
    showRevision: false,
  };

  componentDidMount() {
    const query = this.getQuery();
    const { router } = this.context;
    router.push({
      pathname: this.props.location.pathname, query,
    });
    this.reload(query);
  }

  getQuery = () => {
    const defaultQuery = {
      size: 12, page: 0,
    };
    return Object.assign(defaultQuery, this.props.location.query);
  };

  reload = (query) => {
    query = { page: 0, size: 100000 };
    this.setState({ loading: true });
    this.props.dispatch(Actions.fetchTenantEnvUsageList(query)).then(() => {
      this.setState({ row: null, loading: false });
    });
  };

  handleClose = () => {
    const { location } = this.props;
    this.setState({ dialogOpen: false });
    const query = location.query;
    this.reload(query);
  }

  handleRefresh = () => {
    const { location } = this.props;
    const query = location.query;
    this.reload(query);
  }

  paginationHandler = (p) => {
    const { location } = this.props;
    const query = location.query;
    query.page = p;
    const { router } = this.context;
    router.push({
      pathname: location.pathname, query,
    });
    this.reload(query);
  }

  handleRevisonClose = () => {
    this.setState({
      showRevision: false,
      tenantId: -1,
    });
    const { location } = this.props;
    const query = location.query;
    this.reload(query);
  }

  revisionTenant = (event, row) => {
    event.stopPropagation();
    this.setState({
      showRevision: true,
      tenantId: row.get('id'),
    });
  }

  editTenant = (event, row) => {
    event.stopPropagation();
    this.setState({
      dialogOpen: true,
      dialogTitle: 'Edit  Tenant  Information',
      tenantId: row.get('id'),
    });
  }

  redirectDeployment = (row) => {
    const { router } = this.context;
    const query = {
      id: row.get('id'),
    };
    router.push({
      pathname: 'settings/deploymentscript', query,
    });
  };

  createTenant = (event) => {
    event.preventDefault();
    this.setState({
      dialogOpen: true,
      dialogTitle: 'Add  Tenant  Information',
      tenantId: -1,
    });
  }

  renderToggleContent = (row) => {
    if (UNDERSCOREJS.isEmpty(row.get('envUsageList'))) {
      return (<div />);
    }
    return (<div> <br />
      <div> <strong> Tenant Tags </strong> </div>
      <TenantTagView row={row} />
      <div> <strong> Tenant Licenses </strong> </div>
      <TenantDashboardPanel
        licensesLinkedWithEnvironments={this.props.licensesLinkedWithEnvironments}
        row={row}
        dispatch={this.props.dispatch}
      /> </div>);
  };
  openUploadDialog = (event) => {
    event.preventDefault();
    this.setState({
      uploadDialogOpen: true,
    });
  };
  closeUploadDialog = () => {
    this.setState({
      uploadDialogOpen: false,
    });
    this.handleRefresh();
  };


  renderAction = row => (
    <div>
      <Button
        label="EDIT"
        table
        onTouchTap={(event) => {
          this.editTenant(event, row);
        }}
      />
      <Button
        label="DEPLOYMENT"
        table
        onTouchTap={() => {
          this.redirectDeployment(row);
        }}
      />
      <IconButton
        tooltip="History"
        tooltipPosition="left"
        style={{ position: 'relative', top: 7 }}
        onTouchTap={(event) => {
          this.revisionTenant(event, row);
        }}
      >
        <Timer color="#00bcd4" />
      </IconButton>
    </div>
  );

  renderVPCs = row => (
    <div>
      {row.get('envUsageList') && row.get('envUsageList').size !== 0 &&
        row.get('envUsageList').map(item => <div> {item.get('awsVpc').get('name')} </div>)
      }
    </div>
  );

  render() {
    const { tenantList } = this.props;
    const {
      tenantId,
      showRevision,
    } = this.state;
    const columns = [
      {
        title: 'Tenant EN Name', dataIndex: row => row.get('displayName'), key: 'displayName',
      },
      {
        title: 'Tenant JP Name', dataIndex: row => row.get('jpDisplayName'), key: 'jpDisplayName',
      },
      {
        title: 'Tenant Account', dataIndex: row => row.get('name'), key: 'name',
      },
      {
        title: 'VPCs', dataIndex: row => row.id, render: this.renderVPCs,
      },
      {
        title: 'Operation', dataIndex: row => row.id, render: this.renderAction,
      }];
    const {
        query,
      } = this.props.location;
    const columnMinWidths = [100, 100, 100, 150, 150];
    return (
      <div style={styles.root}>
        <Toolbar
          parentPageLabel={'SETTINGS'}
          pageLabel={'TENANT CONFIGURATION'}
          refreshPage={() => this.handleRefresh()}
        >
          <Button
            label="Import"
            onTouchTap={this.openUploadDialog}
          />
        </Toolbar>

        <Table
          columns={columns}
          data={tenantList.get('content')}
          widths={columnMinWidths}
          selectable={false}
          showOnHover
          showCheckboxes={false}
          loading={this.state.loading}
          paginationHandler={this.paginationHandler}
          numberPerPage={10}
          sortIndex={'name'}
          showToggle
          renderToggleContent={row => this.renderToggleContent(row)}
          query={query}
          showPagination
          backendPagination
          backendMaxPage={!tenantList ? 0 : tenantList.get('totalPages')}
        />

        <Button
          add
          onTouchTap={this.createTenant}
        />

        <TenantInformationEditDialog
          open={this.state.dialogOpen}
          dialogTitle={this.state.dialogTitle}
          tenantId={this.state.tenantId}
          dispatch={this.props.dispatch}
          afterClose={this.handleClose}
        />
        <TenantUploadPanel
          dispatch={this.props.dispatch}
          open={this.state.uploadDialogOpen}
          onClose={this.closeUploadDialog}
        />
        <RevisionDialog
          visible={showRevision}
          title="Tenant Revisions"
          metaData={Tenant}
          entityId={tenantId}
          afterClose={this.handleRevisonClose}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tenantList: state.get('settings').get('tenantEnvUsageList'),
    licensesLinkedWithEnvironments: state.get('settings').get('licensesLinkedWithEnvironments'),
  };
}

TenantDashboardPage.propTypes = {
  tenantList: ImmutablePropTypes.map,
  licensesLinkedWithEnvironments: ImmutablePropTypes.map,
};

TenantDashboardPage.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(TenantDashboardPage));
