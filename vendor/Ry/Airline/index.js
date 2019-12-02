import React, {Component} from 'react';
import Cardit from './Cardit';
import Resdit from './Resdit';
import Pricing from './Pricing';
import List from '../../../app/Air/Cart/List';
import Detail from '../../../app/Manager/Cardit/List';
import Organisation from './Organisation';

class Invoice extends Component
{
    render() {
        return <div className="col-md-12">
        <div className="card">
            <div className="card-body">
                <List data={{data:this.props.data.row.carts}} store={this.props.store}/>
            </div>
        </div>
    </div>
    }
}

const Components = {
    Cardit : Cardit,
    Resdit : Resdit,
    Pricing : Pricing,
    Cart : {
        Detail : Detail,
        List : Invoice
    },
    Organisation : Organisation
}

export default Components;