import React, { Component } from 'react';
import {Pghook} from '../../bs/bootstrap';
import Chart from '../Core/Charts';
import trans from '../../../app/translations';
import Tops from './Tops';
import Map from './Map';
import qs from 'qs';

const now = new Date()
let YEAR = now.getFullYear()
var queries = qs.parse(document.location.search.replace(/^\?/, ''))
if(queries.year) {
    YEAR = queries.year
}
const years = []
for(var year = now.getFullYear(); year>2016; year--) {
    years.push(year)
}

class Dashboard extends Component
{
    componentWillMount() {
        Pghook('rightbreadcrumbs', (content)=><div key="rightbreadcrumbs.yearselect">
            <a className="btn btn-primary export_btn" href="index.php?action=export_stats">Exporter les données <i className="fa fa-share"></i></a>
            <a className="btn btn-primary export_btn ml-3" href="index.php?action=export_proginov">Exporter vers {content.data.site.nsetup.erp.module} <i className="fa fa-share"></i></a>
            <div className="btn-group ml-3">
                <button type="button" className="btn btn-primary">{YEAR}</button>
                <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="sr-only">{YEAR}</span>
                </button>
                <div className="dropdown-menu">
                    {years.map(year=><a className="dropdown-item" key={`year-${year}`} href={`/?year=${year}`}>{year}</a>)}
                </div>
            </div>
        </div>)
    }

    render() {
        return <div>
            <div className="row m-0 charts">
	            <div className="ml-3 mr-3" style={{width:320}}>
                    <Chart data={this.props.data.ventes}/>
                </div>
                <div className="ml-3 mr-3" style={{width:545}}>
                    <Chart data={this.props.data.commandes_par_mois}/>
                </div>
                <div className="ml-3 mr-3" style={{width:325}}>
                    <Chart data={this.props.data.commandes}/>
                </div>
                <div className="ml-3 mr-3" style={{width:325}}>
                    <Chart data={this.props.data.ventes_secteurs}/>
                </div>
                <div className="row m-0 w-100 mt-3">
                    <div className="h-100 ml-3 mr-3" style={{width:897}}>
                        <Chart data={this.props.data.ventes_mensuelles}/>
                    </div>
                    <div className="h-100 d-flex flex-column justify-content-between ml-3 mr-3" style={{width:325}}>
                        <Chart data={this.props.data.opportunites}/>
                        <Chart data={this.props.data.campagnes} className="mt-2"/>
                    </div>
                    <div className="h-100 d-flex flex-column justify-content-between ml-3 mr-3" style={{width:325}}>
                        <div className="bg-white d-flex align-items-center p-3 rounded flex-grow-1">
                            <div className="row text-left">
                                <i className="bg-orange fam fam-2x fam-user ml-3 mr-3 p-1 rounded-circle text-white dashboard-icon"></i>
                                <div>
                                    <h3 className="m-0">{this.props.data.stats.affiliates}</h3>
                                    {trans('Affiliés inscrits')}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white d-flex align-items-center p-3 mt-2 rounded flex-grow-1">
                            <div className="row text-left">
                                <i className="bg-primary fam fam-2x fam-truck ml-3 mr-3 p-1 rounded-circle text-white dashboard-icon"></i>
                                <div>
                                    <h3 className="m-0">{this.props.data.stats.suppliers}</h3>
                                    {trans('Fournisseurs actifs')}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white d-flex align-items-center p-3 mt-2 rounded flex-grow-1">
                            <div className="row text-left">
                                <i className="bg-violet fam fam-2x fam-industry ml-3 mr-3 p-1 rounded-circle text-white dashboard-icon"></i>
                                <div>
                                    <h3 className="m-0">{this.props.data.stats.warehouses}</h3>
                                    {trans('Entrepôts')}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white d-flex align-items-center p-3 mt-2 rounded flex-grow-1">
                            <div className="row text-left">
                                <i className="bg-success fam fam-2x fam-leaf ml-3 p-1 rounded-circle text-white dashboard-icon"></i>
                                <div className="col-md-30">
                                    <h3 className="m-0">{this.props.data.stats.products}</h3>
                                    {trans('Produits')}
                                </div>
                                <div className="col-md-30">
                                    <h3 className="m-0">{this.props.data.stats.variants}</h3>
                                    {trans('Variantes')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3 m-0">
                <Tops data={this.props.data}/>
                <Map data={this.props.data}/>
            </div>
        </div>
    }
}

export default Dashboard;