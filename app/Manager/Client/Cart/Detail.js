import React, {Component} from 'react';
import Modelizer from '../../../../vendor/Ry/Core/Modelizer';
import trans from '../../../translations';
import moment from 'moment';
import $ from 'jquery';
import {Popup, PopupHeader, PopupBody} from '../../../../vendor/bs/bootstrap';
import numeral from 'numeral';
import Ry from '../../../../vendor/Ry/Core/Ry';

class ReceptacleItem extends Component
{
    render() {
        const disabled = this.models('props.data.statuses.reception', 82)==74?{}:{disabled:true}
        return <tr >
        <td className="text-left">
            {this.props.data.nsetup.receptacle_id}
        </td>
        <td>{this.props.data.nsetup.handling}</td>
        <td>{this.props.data.nsetup.nesting}</td>
        <td>{this.props.data.nsetup.type.interpretation}</td>
        <td>{this.props.data.nsetup.free?0:this.props.data.nsetup.weight}</td>
        <td>{numeral(this.props.data.price_ht).format('0.00')}</td>
        <td>
            <label className="fancy-checkbox">
                <input type="checkbox" checked={(this.props.data.nsetup.free || disabled.disabled)?false:true} onChange={e=>this.props.handleFree(e.target.checked)} value="1" {...disabled}/>
                <span></span>
            </label>
        </td>
    </tr>
    }
}

Modelizer(ReceptacleItem)

class Receptacles extends Component
{
    constructor(props) {
        super(props)
        let total_ht = 0
        let total_weight = 0
        let commissions = 0
        let total_ttc = 0
        this.props.data.receptacles.map(receptacle=>{
            if(!receptacle.nsetup.free && this.cast(receptacle, 'statuses.reception', 82)==74) {
                total_weight += parseFloat(receptacle.nsetup.weight)
                total_ht += parseFloat(receptacle.price_ht)
                commissions += parseFloat(receptacle.commission)
                total_ttc += parseFloat(receptacle.price_ttc)
            }
        })
        this.state = {
            receptacles : this.props.data.receptacles,
            total_weight : total_weight,
            total_ht : total_ht,
            commissions : commissions,
            total_ttc : total_ttc
        }
        this.handleFree = this.handleFree.bind(this)
    }

    handleFree(checked, receptacle) {
        this.setState(state=>{
            state.receptacles.find(item=>item.id==receptacle.id).nsetup.free = !checked
            receptacle.nsetup.free = !checked
            if(!checked) {
                receptacle.price_ht = 0
                receptacle.commission = 0
                receptacle.price_ttc = 0
            }
            else {
                receptacle.price_ht = receptacle.calculated_price_ht
                receptacle.commission = receptacle.calculated_commission
                receptacle.price_ttc = receptacle.calculated_price_ttc
            }
            state.total_weight = 0
            state.total_ht = 0
            state.commissions = 0
            state.total_ttc = 0
            state.receptacles.map(receptacle=>{
                if(this.cast(receptacle, 'statuses.reception', 82)==74) {
                    state.total_weight += parseFloat(receptacle.nsetup.weight)
                    state.total_ht += parseFloat(receptacle.price_ht)
                    state.commissions += parseFloat(receptacle.commission)
                    state.total_ttc += parseFloat(receptacle.price_ttc)
                }
            })
            $.ajax({
                url : '/receptacle_update',
                type : 'post',
                data : {
                    id : receptacle.id,
                    nsetup : receptacle.nsetup
                },
                success : response=>{
                    if(response.type) {
                        this.props.store.dispatch(response)
                    }
                    else {
                        this.props.store.dispatch({
                            type : 'local_update',
                            cardit : {
                                id : this.props.data.id,
                                total_weight : state.total_weight,
                                total_ht : state.total_ht,
                                commissions : state.commissions,
                                total_ttc : state.total_ttc
                            }
                        })
                    }
                }
            })
            return state
        })
    }

    render() {
        return <React.Fragment>
            <PopupHeader>
                <h5>{trans('Liste des récipients')}</h5>
            </PopupHeader>
            <PopupBody>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>{trans('Numéro du récipient')}</th>
                            <th>{trans('Flag')} <i className="icon-info"></i></th>
                            <th>{trans('Container Journey ID')}</th>
                            <th>{trans('Type de récipient')}</th>
                            <th>{trans('Poids')} (Kg)</th>
                            <th>{trans('Prix HT')} ({this.props.cart.currency.iso_code})</th>
                            <th>{trans('Facturé')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.receptacles.map(receptacle=><ReceptacleItem key={`receptacle-${receptacle.id}`} handleFree={checked=>this.handleFree(checked, receptacle)} data={receptacle}/>)}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan="4" className="text-right text-uppercase">{trans('Total')}</th>
                            <td className="bg-warning">
                                {numeral(this.state.total_weight).format('0.0')}
                            </td>
                            <td className="bg-warning">
                                {numeral(this.state.total_ht).format('0.00')}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </PopupBody>
        </React.Fragment>
    }
}

Modelizer(Receptacles)

export class ReceptacleDialog extends Component
{
    render() {
        return <Receptacles data={this.props.data.data} store={this.props.store} cart={this.props.data.cart}/>
    }
}

export class CarditInvoice extends Component
{
    render() {
        return <tr>
            <td className="green"><Ry/>{moment.utc(this.props.data.nsetup.preparation_datetime).local().format('DD/MM/YYYY')}</td>
            <td className="green">{moment(this.props.data.nsetup.preparation_datetime_lt).format('HH:mm')}</td>
            <td>
                <a href={`#dialog/receptacle_invoices?cardit_id=${this.props.data.id}&customer_id=${this.props.cart.customer_id}`} className="text-info" data-display="modal-xl">{this.props.data.nsetup.document_number}</a>
            </td>
            <td>{this.props.data.nsetup.handover_origin_location.iata} - {this.props.data.nsetup.handover_destination_location.iata}</td>
            <td>{this.props.data.nsetup.nreceptacles}</td>
            <td>{numeral(this.props.data.total_weight).format('0.0')}</td>
            <td>{this.props.cart.currency.iso_code}</td>
            <td className="text-info">{numeral(this.props.data.total_ht).format('0.00')}</td>
            <td className="text-info">{numeral(this.props.data.total_ttc).format('0.00')}</td>
            {this.props.nocommission?null:<td className="text-info">{numeral(this.props.data.commissions).format('0.00')}</td>}
        </tr>
    }
}

Modelizer(CarditInvoice)

class Detail extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            loading : false,
            cardits : []
        }
        this.loadCardits = this.loadCardits.bind(this)
    }

    componentDidMount() {
        this.loadCardits()
        this.unsubscribe = this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='receptacle_updates') {
                this.loadCardits()
            }
            else if(storeState.type=='local_update') {
                this.setState(state=>{
                    state.cardits.map(cardit=>{
                        if(cardit.id==storeState.cardit.id) {
                            cardit.total_ht = storeState.cardit.total_ht
                            cardit.total_weight = storeState.cardit.total_weight
                            cardit.commissions = storeState.cardit.commissions
                            cardit.total_ttc = storeState.cardit.total_ttc
                        }
                    })
                    return state
                })
            }
        })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    loadCardits() {
        $.ajax({
            url : '/cart_cardits',
            data : {
                json : true,
                cart_id : this.props.data.id,
                airline_id : this.props.data.airline.id,
                customer_id : this.props.data.customer_id
            },
            success : response => {
                this.setState({
                    cardits : response.data.data
                })
            }
        })
    }

    render() {
        let total_nreceptacles = 0
        let total_wreceptacles = 0
        let total_ht = 0
        let total_ttc = 0
        let total_commissions = 0
        this.state.cardits.map(cardit=>{
            total_ht += parseFloat(cardit.total_ht)
            total_ttc += parseFloat(cardit.total_ttc)
            total_commissions += parseFloat(cardit.commissions)
            total_nreceptacles += parseInt(cardit.nsetup.nreceptacles)
            total_wreceptacles += parseFloat(cardit.total_weight)
            if(false) {
                cardit.nsetup.transports.map(transport=>{
                    total_ht += parseFloat(transport.total_ht)
                    total_ttc += parseFloat(transport.total_ttc)
                })
            }
        })
        return <div className="p-3">
            <button className="btn btn-primary" type="button" onClick={this.props.back}>{trans('Retour')}</button>
            <div className="mt-3 mb-3">
                <label>{trans('Pré-facture Nº')} : </label> 
                <span className="font-weight-bold text-orange">{this.props.data.code}</span>
                <label className="ml-5">{trans('Compagnie aérienne')} : </label>
                <span className="font-weight-bold text-orange"> {this.props.data.airline.edi_code} {this.props.data.airline.name}</span>
                <label className="ml-5">{trans('Mois')} : </label> 
                <span className="font-weight-bold text-orange">{moment.utc(this.props.data.created_at).format('MMMM YYYY')}</span>
                <label className="ml-5">{trans("Nombre d'expéditions")} : </label> 
                <span className="font-weight-bold text-orange">{this.state.cardits.length}</span>
            </div>
            <table className="table table-bordered table-centerall">
                <thead>
                    <tr>
                        <th>{trans('CARDIT du')}</th>
                        <th>{trans('à')}</th>
                        <th>{trans("Nº d'expédition")}</th>
                        <th>{trans('Route')}</th>
                        <th>{trans('Qté')}</th>
                        <th>{trans('Poids')}</th>
                        <th>{trans('Devise')}</th>
                        <th>{trans('Total HT')}</th>
                        <th>{trans('Total TTC')}</th>
                        {this.props.nocommission?null:<th>{trans('Com. AD')}</th>}
                    </tr>
                </thead>
                <tbody>
                    {this.state.cardits.map(cardit=><CarditInvoice key={`cardit-${cardit.id}`} data={cardit} cart={this.props.data} store={this.props.store} nocommission={this.props.nocommission}/>)}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="4" className="text-right">{trans('Total')}</td>
                        <td className="bg-warning">{total_nreceptacles}</td>
                        <td className="bg-warning">{numeral(total_wreceptacles).format('0.0')}</td>
                        <td></td>
                        <td className="bg-warning">{numeral(total_ht).format('0.00')}</td>
                        <td className="bg-warning">{numeral(total_ttc).format('0.00')}</td>
                        {this.props.nocommission?null:<td className="bg-warning">{numeral(total_commissions).format('0.00')}</td>}
                    </tr>
                </tfoot>
            </table>
        </div>
    }
}

export default Modelizer(Detail);