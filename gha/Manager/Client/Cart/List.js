import React, {Component} from 'react';
import BaseCart from '../../../../vendor/Ry/Shop/Cart/List';
import Modelizer from '../../../../vendor/Ry/Core/Modelizer';
import trans from '../../../translations';
import moment from 'moment';
import numeral from 'numeral';
import Detail from './Detail';
import { CUSTOMER_TYPES } from '../Organisation';

export class List extends BaseCart
{
    constructor(props) {
        super(props)
        this.nocommission = false
        this.nopaginate = true
        this.state.list = true
		this.state.total_ttc = 0
		this.state.total_commissions = 0
		this.state.tab = this.models("props.companies.0.id")
		this.state.companies = this.models("props.companies", [])
        this.detail = this.detail.bind(this)
		this.totalize = this.totalize.bind(this)
    }

	totalize() {
		this.setState(state=>{
			state.total_ttc = 0
			state.total_commissions = 0
			state.companies.map(company=>{
				state.data.filter(it=>(it.airline && it.airline.id==company.company_id && company.ntype=='air') || (it.transporter && it.transporter.id==company.company_id && company.ntype=='land') || (it.shippingco && it.shippingco.id==company.company_id && company.ntype=='water')).map((item, key)=>{
					state.total_ttc += parseFloat(item.total_ttc)
					state.total_commissions += parseFloat(item.total_commissions)
				})
			})
			return state
		})
	}

    detail(event, cart) {
        event.preventDefault()
        this.setState({
            list : false,
            detail : cart
        })
        if(this.refs.detail_view)
            this.refs.detail_view.loadCardits()
    }

	componentDidMount() {
		super.componentDidMount()
		this.totalize()
	}

    searchEngine() {
        return <React.Fragment>
            <div className="row mb-4">
                <div className="col-md-7">
                    <div className="card h-100 mb-0">
                        <div className="card-header">
                            {trans('Recherche')}
                        </div>
                        <div className="body">
                            <form name="frm_search" className="form-inline" action="/carts">
                                <input type="hidden" name="ry"/>
                                <input type="hidden" name="json"/>
                                <input type="hidden" name="customer_id" value={this.props.customerId}/>
                                <div className="form-group col-md-6 mb-2">
                                    <label className="control-label col-md-5">{trans('Pré-facture Nº')} :</label>
                                    <input type="text" className="form-control col-md-7" name="s[code]"/>
                                </div>
                                {true?null:<div className="form-group col-md-6 mb-2">
                                    <label className="control-label col-md-5">{trans('Route')} :</label>
                                    <select className="form-control col-md-7 select-primary" title={trans('Toutes')}>

                                    </select>
                                </div>}
                                {true?null:<div className="form-group col-md-6">
                                    <label className="control-label col-md-5">{trans('Nº Expedition')} :</label>
                                    <input type="text" className="form-control col-md-7"/>
                                </div>}
                                <div className="form-group col-md-6 justify-content-end">
                                    <button className="btn btn-orange">{trans('Rechercher')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card h-100 mb-0">
                        <div className="card-header">
                            {moment().year()} - { CUSTOMER_TYPES[this.props.me.type] } : {this.props.me.facturable.name}
                        </div>
                        <div className="body">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="alert bg-orange h-100 text-center text-white mb-1">
                                        <span className="text-large">{this.state.data.length}</span> <small className="d-block">{trans('Pré-factures')}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="alert bg-primary h-100 text-center text-white mb-1">
                                        <span className="text-large">{numeral(this.state.total_ttc).format('0.00')}</span> <small className="d-block">{trans('Facturation')}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="alert bg-primary h-100 text-center text-white mb-1">
                                        <span className="text-large">{numeral(this.state.total_commissions).format('0.00')}</span> <small className="d-block">{trans('Commissions')}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
        </React.Fragment>
    }

    render() {
        let pagination = <ul className={`list-inline m-0 mb-3 ${this.props.data.per_page>=this.state.total?'d-none':''}`}>
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
		let wtotal = 0
        let total_ht = 0
        let total_ttc = 0
        let total_commissions = 0	
        return this.state.list?<div className={`col-12`}>            
            <div className="justify-content-between m-0 row">
                {this.beforelist()}
                {this.nopaginate?null:pagination}
            </div>
            {this.searchEngine()}
			<div className="d-flex">
	            <div className="border flex-column nav nav-pills p-1 rounded" id="v-pills-tab-client-invoicing" role="tablist" aria-orientation="vertical">
	              {this.state.companies.map(company=><a key={`pill-company-invoicing-${company.id}`} className={`nav-link text-nowrap nav-link-client mb-1 ${company.id==this.state.tab?'active':''}`} id={`v-pills-${company.id}-invoicing-tab`} data-toggle="pill" href={`#v-invoicing-pills-${company.id}`} role="tab" aria-controls={`v-invoicing-pills-${company.id}`} aria-selected={company.id==this.state.tab?"true":"false"}>{company.company.name}</a>)}
	            </div>
	            <div className="tab-content pt-0 flex-fill" id="v-pills-tabContent">
					{this.state.companies.map(company=>{
					wtotal = 0
			        total_ht = 0
			        total_ttc = 0
			        total_commissions = 0	
					return <div key={`v-invoicing-pills-${company.id}`} className={`tab-pane fade show ${company.id==this.state.tab?'active':''}`} id={`v-invoicing-pills-${company.id}`} role="tabpanel" aria-labelledby={`v-pills-${company.id}-tab`}>
			            <table className="table table-bordered table-centerall">
			                <thead>
			                    <tr>
			                        <th>{trans('Date')}</th>
			                        <th>{trans('Pré-facture Nº')}</th>
			                        <th>{trans('Compagnie')}</th>
			                        <th>{trans('Poids total')}</th>
			                        <th>{trans('Devise')}</th>
			                        <th>{trans('Total HT')}</th>
			                        <th>{trans('Total TTC')}</th>
			                        {this.nocommission?null:<th>{trans('Com. AD')}</th>}
			                        <th>{trans('Editer')}</th>
			                    </tr>
			                </thead>
			                <tbody>
			                    {this.state.data.filter(it=>(it.airline && it.airline.id==company.company_id && company.ntype=='air') || (it.transporter && it.transporter.id==company.company_id && company.ntype=='land') || (it.shippingco && it.shippingco.id==company.company_id && company.ntype=='water')).map((item, key)=>{
								wtotal += parseFloat(item.total_weight)
					            total_ht += parseFloat(item.total_ht)
					            total_ttc += parseFloat(item.total_ttc)
					            total_commissions += parseFloat(item.total_commissions)
								return <tr key={`row=-${key}`}>
			                        <td>{moment.utc(item.created_at).format('MMMM YYYY')}</td>
			                        <td>{item.code}</td>
			                        {item.airline?<td>{item.airline.edi_code} {item.airline.name}</td>:null}
									{item.transporter?<td>{this.cast(item, 'transporter.name')}</td>:null}
									{item.shippingco?<td>{this.cast(item, 'shippingco.name')}</td>:null}
									{(!item.transporter && !item.airline && !item.shippingco)?<td></td>:null}
			                        <td>{numeral(item.total_weight).format('0.0')}</td>
			                        <td>{this.cast(item, 'currency.iso_code')}</td>
			                        <td>{numeral(item.total_ht).format('0.00')}</td>
			                        <td>{numeral(item.total_ttc).format('0.00')}</td>
			                        {this.nocommission?null:<td>{numeral(item.total_commissions).format('0.00')}</td>}
			                        <td>
			                            <div className="dropdown show">
			                                <a className="btn btn-orange dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			                                    {trans('Actions')}
			                                </a>
			
			                                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
			                                    <a className="dropdown-item" href={`/cart?id=${item.id}`} onClick={e=>this.detail(e, item)}>{trans('Détail')}</a>
			                                    <a className="dropdown-item" href={`/cn51?id=${item.id}`}>CN51</a>
			                                    <a className="dropdown-item" href={`/cn66?id=${item.id}`}>CN66</a>
			                                </div>
			                            </div>
			                        </td>
			                    </tr>})}
			                </tbody>
			                <tfoot>
			                    <tr>
			                        <td colSpan="3" className="text-right">{trans('Total')}</td>
			                        <td className="bg-warning">{numeral(wtotal).format('0.0')}</td>
			                        <td></td>
			                        <td className="bg-warning">{numeral(total_ht).format('0.00')}</td>
			                        <td className="bg-warning">{numeral(total_ttc).format('0.00')}</td>
			                        {this.nocommission?null:<td className="bg-warning">{numeral(total_commissions).format('0.00')}</td>}
			                        <td></td>
			                    </tr>
			                </tfoot>
			            </table>	
					</div>})}
				</div>
			</div>
            <div className="justify-content-between m-0 row">
                {this.afterlist()}
                {this.nopaginate?null:pagination}
            </div>
        </div>:<Detail ref="detail_view" store={this.props.store} data={this.state.detail} back={()=>this.setState({list:true})} nocommission={this.nocommission}/>
    }
}

Modelizer(List)

class Invoice extends Component
{
    render() {
        return <div className="col-md-12">
        <div className="card">
            <div className="card-body">
                <ul className="nav nav-tabs" role="tablist" id="tab-form">
                    <li className="nav-item">
                        <a className={`nav-link`} href={`/client_edit?id=${this.props.data.row.id}`}>{trans('Compte client')}</a>
                    </li>
                    {this.models('props.data.row.transport_types', []).indexOf('air')>=0?<li className="nav-item">
                        <a className={`nav-link`} href={`/client_edit?id=${this.props.data.row.id}&tab=air`}>{trans('Airlines')}</a>
                    </li>:null}
                    {this.models('props.data.row.transport_types', []).indexOf('land')>=0?<li className="nav-item">
                        <a className={`nav-link`} href={`/client_edit?id=${this.props.data.row.id}&tab=land`}>{trans('Roads')}</a>
                    </li>:null}
                    {this.models('props.data.row.transport_types', []).indexOf('water')>=0?<li className="nav-item">
                        <a className={`nav-link`} href={`/client_edit?id=${this.props.data.row.id}&tab=water`}>{trans('Maritimes')}</a>
                    </li>:null}
                    <li className="nav-item">
                        <a className={`nav-link`} href={`/client_edit?id=${this.props.data.row.id}&tab=organisation`}>{trans('Organisation')}</a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link`} href={`/client_edit?id=${this.props.data.row.id}&tab=pricing`}>{trans('Tarifications')}</a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link active`} href={`/carts?customer_id=${this.props.data.row.id}`}
                aria-controls="invoices">{trans('Facturations')}</a>
                    </li>
                </ul>
                <div className="tab-content border-bottom border-left border-right p-4 mb-4">
                    <div className={`tab-pane active`}
                        id={`invoices`} role="tabpanel" aria-labelledby="invoices-tab">
                            <List data={{data:this.props.data.row.carts}} companies={this.props.data.row.facturable.airports} store={this.props.store} customerId={this.props.data.row.id} me={this.props.data.row}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Invoice);