import React from 'react';
import { Menu, Dropdown, Icon, Button, Popconfirm, } from 'antd';
const SubMenu = Menu.SubMenu;

export default class TagManagementMenu extends React.Component {

    render() {
        const { columnsShown, showTagAddDialog, removeColumn } = this.props;
        const menu = (
            <Menu size='large'>
                <Menu.Item>
                    <a style={{margin: "0 5px", }} size="large" onClick={()=>{ showTagAddDialog(); }}
                       type="default" >Add Column </a>
                </Menu.Item>
                <SubMenu title="Delete Column"  style={{color: 'red'}}>
                    {
                        columnsShown.map((val, i) => {
                            return (<Menu.Item style={{color: 'red'}} key={i}>
                                    <Popconfirm placement="left"
                                                title="Sure to delete?"
                                                onConfirm={() => removeColumn(val)}>
                                        <a style={{color: "red"}} href="#">
                                            <Icon type="delete"/> {val}</a>
                                    </Popconfirm>
                                </Menu.Item>);
                        })
                    }
                </SubMenu>
            </Menu>
        );
        return (
            <Dropdown overlay={menu} size="large" >
                <Button size='large' style={{ margin: "0 5px"}} >
                    Column Management <Icon type="down" />
                </Button>
            </Dropdown>
        );
    }
}