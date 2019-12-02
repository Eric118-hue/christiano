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
            <div className="row">
                <div className="col-md-7">
                    <div className="card">
                        <div className="card-header">
                            {trans('Recherche')}
                        </div>
                        <div className="body">
                            <form name="frm_search" className="form-inline" action="/carts">
                                <input type="hidden" name="ry"/>
                                <div className="form-group col-md-6 mb-2">
                                    <label className="control-label col-md-5">{trans('Pré-facture Nº')} :</label>
                                    <input type="text" className="form-control col-md-7"/>
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
                    <div className="card">
                        <div className="card-header">
                            {moment().year()} - {trans('Compagnie aérienne')} : {trans('toutes')}
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
            <div className="row mb-5">
                <div className="col-3">
                    <select className="form-control select-primary">

                    </select>
                </div>
                <div className="col-3 form-inline">
                    <label className="control-label col-md-4">{trans('Compagnie aérienne')}</label>
                    <select className="form-control select-primary col-md-8" title={trans('Toutes')}>

                    </select>
                </div>
            </div>    
        </React.Fragment>
    }
}

export default CartList;