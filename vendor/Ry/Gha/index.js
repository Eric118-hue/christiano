import React, {Component} from 'react';
import Cardit from './Cardit';
import Resdit from './Resdit';
import Pricing from './Pricing';
import List from '../../../app/Air/Cart/List';
import Detail from '../../../app/Manager/Cardit/List';
import Organisation from './Organisation';
import Dashboard from './Dashboard';

class Invoice extends Component
{
    render() {
        return <div className="col-md-12">
        <div className="card">
            <div className="card-body">
                <List data={{data:this.props.data.row.carts}} companies={this.props.data.row.companies} customerId={this.props.data.row.id} store={this.props.store} me={this.props.data.user}/>
            </div>
        </div>
    </div>
    }
}

const Components = {
    CarditExport : Cardit,
    Resdit : Resdit,
    Pricing : Pricing,
    Dashboard,
    Cart : {
        Detail : Detail,
        List : Invoice
    },
    Organisation : Organisation
}

export default Components;