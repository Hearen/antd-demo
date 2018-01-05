import React from 'react';
import Papa from 'papaparse';
import { Upload, Button, Icon, message } from 'antd';
import {convertMapArrToCSVArr} from "./Tools";

export class LoadLocalFile extends React.Component{
    constructor(props) {
        super(props);
        this.updateTable = props.updateTable;
        this.test = props.test;
    }

    importTenant = (request) => {
        const formData = new FormData();
        formData.append('file', request);

        return () => window.fetch(`./tenant/import`, {
            method: 'POST',
            headers: 'Content-Type=multipart/*',
            body: formData,
        });
    }

    handleFileUpload = (file, callback) => {
        let data;
        this.importTenant(file);
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function(results, file) {
                data = results.data;
                console.log(data);
                let arr = convertMapArrToCSVArr(data);
                callback(arr);
            },
            error: () => { console.log("parsing failed!"); }
        });
    }

    render() {
        const props = {
            action:'',
            accept: '.csv',
            showUploadList: false,
            onChange : (e)  => {
                console.log(e.target);
                let file = e.file.originFileObj;
                this.handleFileUpload(file, this.updateTable);
            },
        };
        return (
            <Upload {...props}>
                <Button size="large">
                    <Icon type="upload" /> Import
                </Button>
            </Upload>
        );
    }
}
