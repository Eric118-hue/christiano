import React, {Component} from 'react';
import NavigableModel from '../../Core/NavigableModel';
import trans from '../../../../app/translations';
import moment from 'moment';
import numeral from 'numeral';
import Modelizer from '../../Core/Modelizer';
import Detail from './Detail';

const TYPES = {
    marketplace : trans('MP'),
    opportunites : trans('AO'),
    opnegocies : trans('ON')
}

class MarketplaceItem extends Component
{
    render() {
        let total = 0
        if(this.props.type=='supplier')
            this.props.data.items.map(item=>{
                total += item.nsetup.unit_price*item.quantity
            })
        else
            this.props.data.items.map(item=>{
                total += parseFloat(item.price)
            })
        return <tr>
            <td>
                {this.models('props.data.nsetup.serial')}
            </td>
            <td>
                {moment(this.cast(this.props.data.operation, 'created_at', this.props.data.created_at)).format('DD/MM/YYYY')}
            </td>
            <td>
                {moment(this.props.data.nsetup.delivery_at).format('DD/MM/YYYY')}
            </td>
            <td>
                {this.props.data.buyer.name}
            </td>
            <td>
                {TYPES[this.models('props.data.nsetup.type', 'marketplace')]}
            </td>
            <td>
                {numeral(total).format('0,0.00$')} {trans('HT')}
            </td>
            <td>
                <strong>{trans('Validée')}</strong> {trans('le')} {moment.utc(this.props.data.created_at).local().format('DD/MM/YYYY [à] HH:mm')}
            </td>
            <td>
                <i className="fa fa-circle text-success"></i>
            </td>
            <td>
                <a href={trans(this.props.type=='supplier'?`/supplier_order?id=:id`:`/affiliate_order?id=:id`, {id:this.props.data.id})} className="text-blue"><i className="fa fa-edit"></i></a>
            </td>
        </tr>
    }
}

Modelizer(MarketplaceItem)

class OpnegocieItem extends Component
{
    render() {
        let total = 0
        let serial = this.models('props.data.nsetup.serial')
        let deliveries = []
        if(this.props.type=='supplier') {
            serial = this.models('props.data.nsetup.serial', this.models('props.data.nsetup.supplier_serial'))
            this.props.data.items.map(item=>{
                total += parseFloat(this.cast(item.nsetup, 'unit_price'))*parseFloat(item.quantity)
                deliveries.push(moment(item.nsetup.delivery_at))
            })
        } 
        else {
            serial = this.models('props.data.nsetup.serial', this.models('props.data.nsetup.affiliate_serial'))
            this.props.data.items.map(item=>{
                total += parseFloat(item.price)
                deliveries.push(moment(item.nsetup.delivery_at))
            })
        }  
        return <tr>
            <td>
                {serial}
            </td>
            <td>
                {moment(this.cast(this.props.data.operation, 'created_at')).format('DD/MM/YYYY')}
            </td>
            <td>
                {moment.max(deliveries).format('DD/MM/YYYY')}
            </td>
            <td>
                {this.models('props.data.buyer.name', this.models('props.data.realbuyer.name'))}
            </td>
            <td>
                {trans(`ON`)}
            </td>
            <td>
                {numeral(total).format('0,0.00$')} {trans('HT')}
            </td>
            <td>
                <strong>{trans('Validée')}</strong> {trans('le')} {moment.utc(this.props.data.created_at).local().format('DD/MM/YYYY [à] HH:mm')}
            </td>
            <td>
                <i className="fa fa-circle text-success"></i>
            </td>
            <td>
                <a href={trans(this.props.type=='supplier'?`/supplier_order?id=:id`:`/affiliate_order?id=:id`, {id:this.props.data.id})} className="text-blue"><i className="fa fa-edit"></i></a>
            </td>
        </tr>
    }
}

Modelizer(OpnegocieItem)

class OpportuniteItem extends Component
{
    render() {
        let total = 0
        let deliveries = []
        if(this.props.type=='supplier') {
            this.props.data.items.map(item=>{
                total += parseFloat(item.nsetup.unit_price)*item.quantity
                deliveries.push(moment(item.nsetup.delivery_at))
            })
        }
        else
            this.props.data.items.map(item=>{
                total += parseFloat(item.nsetup.unit_price_commissionned)*item.quantity
                deliveries.push(moment(item.nsetup.delivery_at))
            })
        return <tr>
            <td>
                {this.props.type=='supplier'?this.models('props.data.nsetup.supplier_serial'):this.models('props.data.nsetup.affiliate_serial')}
            </td>
            <td>
                {moment(this.cast(this.props.data.operation, 'created_at', this.props.data.created_at)).format('DD/MM/YYYY')}
            </td>
            <td>
                {moment.max(deliveries).format('DD/MM/YYYY')}
            </td>
            <td>
                {this.props.data.buyer.name}
            </td>
            <td>
                {TYPES[this.models('props.data.nsetup.type', 'marketplace')]}
            </td>
            <td>
                {numeral(total).format('0,0.00$')} {trans('HT')}
            </td>
            <td>
                <strong>{trans('Validée')}</strong> {trans('le')} {moment.utc(this.props.data.created_at).local().format('DD/MM/YYYY [à] HH:mm')}
            </td>
            <td>
                <i className="fa fa-circle text-success"></i>
            </td>
            <td>
                <a href={trans(this.props.type=='supplier'?`/supplier_order?id=:id`:`/affiliate_order?id=:id`, {id:this.props.data.id})} className="text-blue"><i className="fa fa-edit"></i></a>
            </td>
        </tr>
    }
}

Modelizer(OpportuniteItem)

class List extends NavigableModel
{
    constructor(props) {
        super(props)
        this.model = 'orders'
        this.endpoint = this.props.type=='supplier' ? trans('/supplier_orders') : trans('/affiliate_orders')
    }

    item(order, key) {
        if(order.nsetup.type=='opnegocies')
            return <OpnegocieItem key={`order-${order.id}`} data={order} type={this.props.type}/>
        else if(order.nsetup.type=='opportunites')
            return <OpportuniteItem key={`order-${order.id}`} data={order} type={this.props.type}/>
        return <MarketplaceItem key={`order-${order.id}`} data={order} type={this.props.type}/>
    }

    render() {
        let pagination = <ul className={`list-inline m-0 ${this.props.data.per_page>=this.props.data.total?'d-none':''}`}>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toFirst}><i className="fa fa-angle-double-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toPrevious}><i className="fa fa-angle-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toNext}><i className="fa fa-angle-right"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toEnd}><i className="fa fa-angle-double-right"></i></a>
            </li>
        </ul>

        return <div className="col-md-12">            
            <div className="justify-content-between m-0 row">
                {this.beforelist()}
                {this.nopaginate?null:pagination}
            </div>
            {this.searchEngine()}
            <div className="card mt-3">
                <div className="card-body">
                    <table className="table table-centerall">
                        <thead>
                            <tr>
                                <th>{trans('Commande #')}</th>
                                <th>{trans('Date')}</th>
                                <th>{trans('Date de livraison')}</th>
                                <th>{trans('Affilié')}</th>
                                <th>{trans('Type de commande')}</th>
                                <th>{trans('Total HT')}</th>
                                <th>{trans('État')}</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((item, key)=>this.item(item, key))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="justify-content-between m-0 row">
                {this.afterlist()}
                {this.nopaginate?null:pagination}
            </div>
        </div>
    }
}

Modelizer(List);

class Order extends Component
{
    render() {
        return <List data={this.props.data.data} store={this.props.store} type={this.props.data.type}/>
    }
}

Order.Detail = Detail

export default Order;