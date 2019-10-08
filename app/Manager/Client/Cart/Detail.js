import React, {Component} from 'react';
import Modelizer from '../../../../vendor/Ry/Core/Modelizer';
import trans from '../../../translations';
import moment from 'moment';
import $ from 'jquery';
import {Popup, PopupHeader, PopupBody} from '../../../../vendor/bs/bootstrap';
import numeral from 'numeral';

class CarditInvoice extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            receptacles : this.props.data.receptacles
        }
        this.handleFree = this.handleFree.bind(this)
    }

    handleFree(event, receptacle) {
        const checked = event.target.checked
        this.setState(state=>{
            state.receptacles.find(item=>item.id==receptacle.id).nsetup.free = !checked
            receptacle.nsetup.free = !checked
            $.ajax({
                url : '/receptacle_update',
                type : 'post',
                data : {
                    id : receptacle.id,
                    nsetup : receptacle.nsetup
                }
            })
            return state
        })
    }

    render() {
        let total_weight = 0
        let total_ht = 0
        this.state.receptacles.map(receptacle=>{
            total_weight += parseFloat(receptacle.nsetup.weight)
            if(!receptacle.nsetup.free)
                total_ht += parseFloat(receptacle.price_ht)
        })
        return <tr>
            <td className="green">{moment.utc(this.props.data.nsetup.preparation_datetime).local().format('DD/MM/YYYY')}</td>
            <td className="green">{moment.utc(this.props.data.nsetup.preparation_datetime).local().format('HH:mm')}</td>
            <td>
                <div className="d-flex align-items-center justify-content-center">
                    <a href="#" onClick={e=>{
                e.preventDefault()
                $(`#receptacles-${this.props.data.id}`).modal('show')
            }} className="text-info">{this.props.data.nsetup.document_number}</a>
                </div>
                <Popup id={`receptacles-${this.props.data.id}`} className="modal-xl">
                    <PopupHeader>
                        <h5>{trans('Liste des récipients')}</h5>
                    </PopupHeader>
                    <PopupBody>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Numéro du récipient</th>
                                    <th>Flag <i className="icon-info"></i></th>
                                    <th>Container Journey ID</th>
                                    <th>Type de récipient</th>
                                    <th>Poids (Kg)</th>
                                    <th>Prix HT ({this.props.cart.currency.iso_code})</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.receptacles.map(receptacle=><tr key={`receptacle-${receptacle.id}`}>
                                    <td className="text-left">
                                        {receptacle.nsetup.receptacle_id}
                                    </td>
                                    <td>{receptacle.nsetup.handling}</td>
                                    <td>{receptacle.nsetup.nesting}</td>
                                    <td>{receptacle.nsetup.type.interpretation}</td>
                                    <td>{receptacle.nsetup.weight}</td>
                                    <td>{numeral(receptacle.price_ht).format('0.00')}</td>
                                    <td>
                                        <label className="fancy-checkbox">
                                            <input type="checkbox" checked={receptacle.nsetup.free?false:true} onChange={e=>this.handleFree(e, receptacle)} value="1"/>
                                            <span></span>
                                        </label>
                                    </td>
                                </tr>)}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="4" className="text-right text-uppercase">{trans('total')}</th>
                                    <td className="bg-warning">
                                        {numeral(total_weight).format('0.0')}
                                    </td>
                                    <td className="bg-warning">
                                        {numeral(total_ht).format('0.00')}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </PopupBody>
                </Popup>
            </td>
            <td>{this.props.data.nsetup.handover_origin_location.iata} - {this.props.data.nsetup.handover_destination_location.iata}</td>
            <td>{this.props.data.nsetup.nreceptacles}</td>
            <td>{numeral(this.props.data.total_weight).format('0.0')}</td>
            <td>{this.props.cart.currency.iso_code}</td>
            <td className="text-info">{numeral(this.props.data.total_ht).format('0.00')}</td>
            <td className="text-info">{numeral(this.props.data.total_ttc).format('0.00')}</td>
            <td className="text-info">{numeral(this.props.data.commissions).format('0.00')}</td>
        </tr>
    }
}

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
    }

    loadCardits() {
        let cardits = {}
        this.props.data.items.map(cart_item=>{
            cardits[cart_item.sellable.cardit_id] = true
        })
        $.ajax({
            url : '/cart_cardits',
            data : {
                cardit_ids : Object.keys(cardits),
                json : true,
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
            cardit.receptacles.map(receptacle=>{
                total_wreceptacles += parseFloat(receptacle.nsetup.weight)
            })
            if(false) {
                cardit.nsetup.transports.map(transport=>{
                    total_ht += parseFloat(transport.total_ht)
                    total_ttc += parseFloat(transport.total_ttc)
                })
            }
        })
        return <div className="p-3">
            <button className="btn btn-primary" type="button" onClick={this.props.back}>{trans('retour')}</button>
            <div className="mt-3 mb-3">
                <label>{trans('Pré-facture Nº')} : </label> 
                <span className="font-weight-bold text-orange">{this.props.data.code}</span>
                <label className="ml-5">{trans('Compagnie aérienne')} : </label>
                <span className="font-weight-bold text-orange"> {this.props.data.airline.edi_code} {this.props.data.airline.name}</span>
                <label className="ml-5">{trans('Mois')} : </label> 
                <span className="font-weight-bold text-orange">{moment.utc(this.props.data.created_at).format('MMMM YYYY')}</span>
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
                        <th>{trans('Com. AD')}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.cardits.map(cardit=><CarditInvoice key={`cardit-${cardit.id}`} data={cardit} cart={this.props.data}/>)}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="4" className="text-right">{trans('Total')}</td>
                        <td className="bg-warning">{total_nreceptacles}</td>
                        <td className="bg-warning">{numeral(total_wreceptacles).format('0.0')}</td>
                        <td></td>
                        <td className="bg-warning">{numeral(total_ht).format('0.00')}</td>
                        <td className="bg-warning">{numeral(total_ttc).format('0.00')}</td>
                        <td className="bg-warning">{numeral(total_commissions).format('0.00')}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    }
}

export default Modelizer(Detail);