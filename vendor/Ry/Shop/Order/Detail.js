import React, {Component} from 'react';
import trans, {nophoto} from '../../../../app/translations';
import moment from 'moment';
import Datepicker from '../../../bs/Datepicker';
import Modelizer from '../../Core/Modelizer';
import { Img } from '../../Core/Ry';
import numeral from 'numeral';

class Detail extends Component
{
    constructor(props) {
        super(props)
        this.getUnitPrice = this.getUnitPrice.bind(this)
    }

    getUnitPrice(item) {
        if(!item.nsetup.prices) {
            return parseFloat(this.cast(item.nsetup, 'unit_price', 0))
        }
        let unit = item.nsetup.prices.find(it=>it.shop_id==item.nsetup.shop_id)
        let quantity = item.quantity
        let price_commissionned = item.nsetup.prices.find(it=>it.shop_id==item.nsetup.shop_id)
        let levels = this.cast(unit, 'nsetup.levels', [])
        levels = levels.sort((a, b)=>{
            if(a.from.unit==b.from.unit) {
                if(parseFloat(a.from.value)>parseFloat(b.from.value)) {
                    return -1
                }
                else {
                    return 1
                }
            }
            else {
                return 1
            }
        })
        if(levels.length>0) {
            let weight = quantity * parseFloat(this.cast(this.cast(item.sellable, 'visible_specs', []).find(it=>it.functions=='uci_weight'), 'value', 1))
            for(let i=0; i<levels.length; i++) {
                let level = levels[i]
                if(level.from.unit=='onWeight') {
                    if(weight>=parseFloat(level.from.value)) {
                        return parseFloat(level.price*price_commissionned.commission_factor)
                    }
                }
                else if(level.from.unit=='onQuantity') {
                    if(quantity>=parseFloat(level.from.value)) {
                        return parseFloat(level.price*price_commissionned.commission_factor)
                    }
                }
            }
        }
        return parseFloat(this.cast(price_commissionned, 'price', 0))*price_commissionned.commission_factor
    }

    render() {
        let sous_total = 0
        let deliveries = []
        this.props.data.data.items.map(item=>{
            deliveries.push(moment(item.nsetup.delivery_at))
        })
        const vat = parseFloat(this.models('props.data.vat', 0))
        return <div className="col-md-12">
    <div className="font-4">{trans('Commande du :date - Nº:code', {date:moment(this.models('props.data.data.operation.created_at', this.models('props.data.data.created_at'))).local().format('DD/MM/YYYY HH:mm:ss'), code:this.models(this.props.data.mode=='seller'?'props.data.data.nsetup.supplier_serial':'props.data.data.nsetup.affiliate_serial', this.models('props.data.data.nsetup.serial'))})}<br/>
    {trans('Affilié')} : {this.props.data.data.buyer.name}</div>
            <div className="card mt-3">
                <div className="card-header">
                    {trans('Informations sur la commande')}
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-inline">
                                <label className="col-md-6 justify-content-end control-label">{trans('Date de livraison')}</label>
                                <Datepicker name="nsetup[delivery_at]" defaultValue={moment.max(deliveries)} className="col-md-6"/>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-inline h-100">
                                <label className="col-md-6 justify-content-end control-label">{trans('Expédié')}</label>
                                <label className="fancy-radio">
                                    <input type="radio" name="dispatched" value="1"/>
    <span><i></i>{trans('Oui')}</span>
                                </label>
                                <label className="fancy-radio">
                                    <input type="radio" name="dispatched" value="0" defaultChecked={true}/>
    <span><i></i>{trans('Non')}</span>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-inline">
                                <label className="col-md-6 justify-content-end control-label">{trans('Date de validation')}</label>
                                <Datepicker readOnly={true} defaultValue={this.props.data.data.created_at} className="col-md-6"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-uppercase">
                            {trans('Adresse de facturation')}
                        </div>
                        <div className="card-body">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Nom')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.nsetup.billing_address.name', this.models('props.data.data.buyer.name'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Adresse')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.billing_address.raw', this.models('props.data.data.buyer.adresse.raw'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Code postal')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.billing_address.ville.cp', this.models('props.data.data.buyer.adresse.ville.cp'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Ville')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.billing_address.ville.nom', this.models('props.data.data.buyer.adresse.ville.nom'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Téléphone')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.nsetup.billing_address.contacts.fixe', this.models('props.data.data.buyer.contacts.fixe_phone.ndetail.value'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Fax')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.nsetup.billing_address.contacts.fax', this.models('props.data.data.buyer.contacts.fax_fax.ndetail.value'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Pays')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.billing_address.ville.country.nom', this.models('props.data.data.buyer.adresse.ville.country.nom'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Email')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.nsetup.billing_address.email', this.models('props.data.data.buyer.contacts.email_email.ndetail.value'))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-uppercase">
                            {trans('Adresse de livraison')}
                        </div>
                        <div className="card-body">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Nom')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.nsetup.delivery_address.name', this.models('props.data.data.buyer.name'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Adresse')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.delivery_address.raw', this.models('props.data.data.buyer.delivery_adresse.raw'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Code postal')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.delivery_address.ville.cp', this.models('props.data.data.buyer.delivery_adresse.ville.cp'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Ville')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.delivery_address.ville.nom', this.models('props.data.data.buyer.delivery_adresse.ville.nom'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Téléphone')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.nsetup.delivery_address.contacts.fixe', this.models('props.data.data.buyer.contacts.fixe_phone.ndetail.value'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Fax')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.nsetup.delivery_address.contacts.fax', this.models('props.data.data.buyer.contacts.fax_fax.ndetail.value'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Pays')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.delivery_address.ville.country.nom', this.models('props.data.data.buyer.delivery_adresse.ville.country.nom'))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            {trans('Email')} :
                                        </td>
                                        <td>
                                            {this.models('props.data.data.cart.nsetup.delivery_address.contacts.email', this.models('props.data.data.buyer.contacts.email_email.ndetail.value'))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header text-uppercase">
                    {trans('Détails de la commande')}
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{trans('Photo')}</th>
                                <th>{trans('Réf. variante')}</th>
                                <th>{trans('Réf. fournisseur')}</th>
                                <th>{trans('Article')}</th>
                                <th>{trans('Quantité')}</th>
                                <th>{trans('Prix unitaire')}</th>
                                <th>{trans('Total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.data.data.items.map(item=>{
                                if(this.props.data.mode=='seller') {
                                    sous_total+=parseFloat(item.nsetup.unit_price)*item.quantity
                                    return <tr key={`order-item-${item.id}`}>
                                        <td><Img className="icon-54 img-responsive img-thumbnail rounded-circle" broken={nophoto} src={item.sellable.product.medias[0].fullpath}/></td>
                                        <td>{item.sellable.nsetup.reference}</td>
                                        <td>{this.cast(item.supplier_setup, 'reference')}</td>
                                        <td>{item.sellable.product.name}</td>
                                        <td>{numeral(parseFloat(item.quantity)).format('0.0')}</td>
                                        <td>{numeral(parseFloat(item.nsetup.unit_price)).format('0.00')}</td>
                                        <td>{numeral(parseFloat(item.nsetup.unit_price)*item.quantity).format('0,0.00$')} {trans('HT')}</td>
                                    </tr>
                                }
                                let unit_price_commissionned = 0
                                if(item.nsetup.unit_price_commissionned)
                                    unit_price_commissionned = parseFloat(item.nsetup.unit_price_commissionned)
                                else
                                    unit_price_commissionned = this.getUnitPrice(item)
                                sous_total+=unit_price_commissionned*item.quantity
                                return <tr key={`order-item-${item.id}`}>
                                    <td><Img className="icon-54 img-responsive img-thumbnail rounded-circle" broken={nophoto} src={item.sellable.product.medias[0].fullpath}/></td>
                                    <td>{item.sellable.nsetup.reference}</td>
                                    <td>{this.cast(item.supplier_setup, 'reference')}</td>
                                    <td>{item.sellable.product.name}</td>
                                    <td>{numeral(parseFloat(item.quantity)).format('0.0')}</td>
                                    <td>{numeral(parseFloat(unit_price_commissionned)).format('0.00')}</td>
                                    <td>{numeral(parseFloat(item.price)).format('0,0.00$')} {trans('HT')}</td>
                                </tr>
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="5" rowSpan={this.models('props.data.data.nsetup.delivery')?4:3}></td>
                                <td className="text-right">
                                    {trans('Sous-total')} :
                                </td>
                                <td>
                                    {numeral(sous_total).format('0,0.00$')} {trans('HT')}
                                </td>
                            </tr>
                            {this.models('props.data.data.nsetup.delivery', 0)>0?<tr>
                                <td className="text-right">
                                {trans('Frais de port')} :
                                </td>
                                <td>
                                    {numeral(parseFloat(this.models('props.data.data.nsetup.delivery'))).format('0,0.00$')} {trans('HT')} (<strong>{this.models('props.data.data.carrier.name')}</strong>)
                                </td>
                            </tr>:null}
                            <tr>
                                <td className="text-right">
                                    {trans('TVA (:vat)', {vat:numeral(vat).format('0.[00]%')})} :
                                </td>
                                <td>
                                    {numeral((sous_total+parseFloat(this.models('props.data.data.nsetup.delivery', 0)))*vat).format('0,0.00$')}
                                </td>
                            </tr>
                            <tr>
                                <th className="text-right">
                                    {trans('Total')}
                                </th>
                                <th>
                                    {numeral((sous_total+parseFloat(this.models('props.data.data.nsetup.delivery', 0)))*(1+vat)).format('0,0.00$')} {trans('TTC')}
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Detail);