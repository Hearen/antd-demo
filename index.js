import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Table, Tabs, Button } from 'antd';
import SpreadSheet from './spread_sheet';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import TenantSpreadSheet from "./TenantSpreadSheet";
const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}

ReactDOM.render(
    <LocaleProvider locale={enUS}>
      <div>
          <h2 style={{margin: "32px"}}></h2>
          <TenantSpreadSheet/>
      </div >
    </LocaleProvider>
  , document.getElementById('root'));

