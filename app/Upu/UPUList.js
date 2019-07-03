import React, {Component} from 'react';
import List from './List';
import Modelizer from '../../vendor/Ry/Core/Modelizer';

class UPUList extends Component
{
    render() {
        return <List data={this.props.data.data} title={this.props.data.title} headers={this.models('props.data.list.nsetup.headers', [])} endpoint={this.props.data.endpoint} store={this.props.store} type={this.props.data.type}/>
    }
}

export default Modelizer(UPUList);