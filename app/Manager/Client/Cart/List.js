import React, {Component} from 'react';
import BaseCart from '../../../../vendor/Ry/Shop/Cart/List';
import Modelizer from '../../../../vendor/Ry/Core/Modelizer';
import trans from '../../../translations';
import moment from 'moment';
import numeral from 'numeral';
import Detail from './Detail';

class List extends BaseCart
{
    constructor(props) {
        super(props)
        this.nopaginate = true
        this.state.list = true
        this.detail = this.detail.bind(this)
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

    searchEngine() {
        return <React.Fragment>
            <div className="row">
                <div className="col-md-7">
                    <div className="card">
                        <div className="card-header">
                            {trans('recherche')}
                        </div>
                        <div className="body">
                            <form name="frm_search" className="form-inline" action="/carts">
                                <input type="hidden" name="ry"/>
                                <div className="form-group col-md-6 mb-2">
                                    <label className="control-label col-md-5">{trans('Pré-facture Nº')} :</label>
                                    <input type="text" className="form-control col-md-7"/>
                                </div>
                                <div className="form-group col-md-6 mb-2">
                                    <label className="control-label col-md-5">{trans('Route')} :</label>
                                    <select className="form-control col-md-7 select-primary" title={trans('Toutes')}>

                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label col-md-5">{trans('Nº Expedition')} :</label>
                                    <input type="text" className="form-control col-md-7"/>
                                </div>
                                <div className="form-group col-md-6 justify-content-end">
                                    <button className="btn btn-orange">{trans('rechercher')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header">
                            Septembre 2019 - Airline : toutes
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
                                        <span className="text-large">{numeral(this.state.total_commission).format('0.00')}</span> <small className="d-block">{trans('Commissions')}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-5">
                <div className="col-3">
                    <select className="form-control select-primary">

                    </select>
                </div>
                <div className="col-3 form-inline">
                    <label className="control-label col-md-4">{trans('Airline')}</label>
                    <select className="form-control select-primary col-md-8" title={trans('Toutes')}>

                    </select>
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
        this.state.data.map((item, key)=>{
            wtotal += parseFloat(item.total_weight)
            total_ht += parseFloat(item.total_ht)
            total_ttc += parseFloat(item.total_ttc)
            total_commissions += parseFloat(item.total_commissions)
        })
        return this.state.list?<div className={`col-12`}>            
            <div className="justify-content-between m-0 row">
                {this.beforelist()}
                {this.nopaginate?null:pagination}
            </div>
            {this.searchEngine()}
            <table className="table table-bordered table-centerall">
                <thead>
                    <tr>
                        <th>{trans('Date')}</th>
                        <th>{trans('Pré-facture Nº')}</th>
                        <th>{trans('Compagnie aérienne')}</th>
                        <th>{trans('Poids total')}</th>
                        <th>{trans('Devise')}</th>
                        <th>{trans('Total HT')}</th>
                        <th>{trans('Total TTC')}</th>
                        <th>{trans('Com. AD')}</th>
                        <th>{trans('Editer')}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map((item, key)=><tr key={`row=-${key}`}>
                        <td>{moment.utc(item.created_at).format('MMMM YYYY')}</td>
                        <td>{item.code}</td>
                        <td>{item.airline.edi_code} {item.airline.name}</td>
                        <td>{numeral(item.total_weight).format('0.0')}</td>
                        <td>{item.currency.iso_code}</td>
                        <td>{numeral(item.total_ht).format('0.00')}</td>
                        <td>{numeral(item.total_ttc).format('0.00')}</td>
                        <td>{numeral(item.total_commissions).format('0.00')}</td>
                        <td><a href={`/cart?id=${item.id}`} onClick={e=>this.detail(e, item)} className="btn btn-orange">{trans('Détail')}</a></td>
                    </tr>)}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" className="text-right">{trans('Total')}</td>
                        <td className="bg-warning">{numeral(wtotal).format('0.0')}</td>
                        <td></td>
                        <td className="bg-warning">{numeral(total_ht).format('0.00')}</td>
                        <td className="bg-warning">{numeral(total_ttc).format('0.00')}</td>
                        <td className="bg-warning">{numeral(total_commissions).format('0.00')}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            <div className="justify-content-between m-0 row">
                {this.afterlist()}
                {this.nopaginate?null:pagination}
            </div>
        </div>:<Detail ref="detail_view" data={this.state.detail} back={()=>this.setState({list:true})}/>
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
                    <li className="nav-item">
                        <a className={`nav-link`} href={`/client_edit?id=${this.props.data.row.id}&tab=organisation`}>{trans('Organisation')}</a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link`} href={`/client_edit?id=${this.props.data.row.id}&tab=pricing`}>{trans('Tarifications')}</a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link active`} href={`/client_edit_invoices?id=${this.props.data.row.id}`}
                aria-controls="invoices">{trans('Facturations')}</a>
                    </li>
                </ul>
                <div className="tab-content border-bottom border-left border-right p-4 mb-4">
                    <div className={`tab-pane active`}
                        id={`invoices`} role="tabpanel" aria-labelledby="invoices-tab">
                            <List data={{data:this.props.data.row.carts}} store={this.props.store}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Invoice);