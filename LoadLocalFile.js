import React from 'react';
import Papa from 'papaparse';
import { Upload, Button, Icon, message } from 'antd';

export class LoadLocalFile extends React.Component{

    handleFileUpload = (file) => {
        let data;
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function(results, file) {
                data = results;
                console.log(data);
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
                this.handleFileUpload(file);
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
