import React from 'react';
import trans from '../../translations';
import {List} from '../../Manager/Client/Cart/List';
import moment from 'moment';
import numeral from 'numeral';

class CartList extends List
{
    constructor(props) {
        super(props)
        this.nocommission = true
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
                            {moment().year()} - {this.props.me.type=='Airline'?`${trans('Compagnie aérienne')} : ${this.props.me.customer_account.facturable.name}`:`${trans('GSA')} : ${trans('Toutes les compagnies aériennes')}`}
                        </div>
                        <div className="body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="alert bg-orange h-100 text-center text-white mb-1">
                                        <span className="text-large">{this.state.data.length}</span> <small className="d-block">{trans('Pré-factures')}</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="alert bg-primary h-100 text-center text-white mb-1">
                                        <span className="text-large">{numeral(this.total_ttc).format('0.00')}</span> <small className="d-block">{trans('Facturation')}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
}

export default CartList;