import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const Search = Input.Search;


export default class IntelliSearch extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            options: '',
        }
        this.data = props.data;
        this.handleSearch = props.handleSearch;
    }

    render() {
        return (
            <div style={{display: 'inline'}}>
                <Search
                    size="large"
                    onSearch={this.handleSearch}
                    style={{width: "50vw", margin: "16px", }}
                />
            </div>
        );
    }
}

IntelliSearch.protoTypes = {
    handleSearch: PropTypes.func,
}
