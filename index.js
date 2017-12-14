import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Table, Tabs, Button } from 'antd';
import EditableTable from './table2';
import SpreadSheet from './spread_sheet';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import FilterTable from "./FilterTable";
import ExpandableTable from "./table3";
import TenantSpreadSheet from "./TenantSpreadSheet";
const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}

ReactDOM.render(
    <LocaleProvider locale={enUS}>
  <div>
      <TenantSpreadSheet/>
    {/*<Tabs defaultActiveKey="5" onChange={callback}>*/}
      {/*<TabPane tab="Extendable Table 2" key="1">*/}
        {/*<ul>*/}
          {/*<li><h1> * table is horizontally extendable</h1></li>*/}
          {/*<li><h1> * details are in the extendable cells</h1></li>*/}
          {/*<li><h1> * edit in place (shown on mouse hover)</h1></li>*/}
        {/*</ul>*/}
        {/*<EditableTable/>*/}
        {/*<br/>*/}
      {/*</TabPane>*/}
      {/*<TabPane tab="Spread Sheet" key="2">*/}
        {/*<SpreadSheet/>*/}
        {/*<br/>*/}
      {/*</TabPane>*/}
      {/*<TabPane tab="Tenant Spread Sheet" key="5">*/}
        {/*<TenantSpreadSheet/>*/}
        {/*<br/>*/}
      {/*</TabPane>*/}
      {/*<TabPane tab="Filter Table" key="3">*/}
        {/*<ul>*/}
          {/*<li><h1>Filter in two different ways</h1></li>*/}
        {/*</ul>*/}
        {/*<FilterTable/>*/}
        {/*<br/>*/}
      {/*</TabPane>*/}
      {/*<TabPane tab="ExpandableTable" key="4">*/}
        {/*<ExpandableTable/>*/}
        {/*<br/>*/}
      {/*</TabPane>*/}
    {/*</Tabs>*/}
      <h2 style={{margin: "48px 16px"}}>Demo for Tenant Tag Management</h2>
  </div >
    </LocaleProvider>
  , document.getElementById('root'));

