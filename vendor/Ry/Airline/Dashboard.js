import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans, {plural} from 'ryapp/translations';
import './Dashboard.scss';
import $ from 'jquery';
import SalesPerMonth from './Charts/SalesPerMonth';
import StatPerMonth from './Charts/StatPerMonth';
import WeightsPerMonth from './Charts/WeightsPerMonth';
import Pie from './Charts/Pie';
import CatPie from './Charts/CatPie';
import Bar from './Charts/Bar';
import moment from 'moment';
import numeral from 'numeral';

class Dashboard extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      expansion : '',
      filter : {
          year : this.models('props.data.filter.year', moment().year()),
          customer_company_id : this.models('props.data.filter.customer_company_id')
      }
    }
  }

  componentDidMount() {
      const dis = this
      $('[href^="#expandable-card"]').on('click', function(){
        const expansion = 'card-stat-' + $(this).attr('href').replace('#expandable-card/stats/', '')
        dis.setState(state=>{
            state.expansion = state.expansion != expansion ? expansion : ''
            return state
        })
      })
  }

  render() {
      let years = []
      let max_year = moment().year()
      for(let i=2019; i<=max_year; i++)
        years.push(i)
    let total_resdits = this.models('props.data.data.performance.in_time', 0) + this.models('props.data.data.performance.before24', 0) + this.models('props.data.data.performance.after24', 0)
    if(total_resdits==0)
        total_resdits = 1
    return <div className="col-12">
      <div className="card card-search">
        <div className="card-header">
          {trans('Recherche')}
        </div>
        <div className="card-body">
          <form className="row" action="/" method="get" name="frm_filter">
            <div className="col-md-2">
              <div className="form-group">
                <label className="control-label">{trans('Année')} : </label>
                <select className="form-control" name="s[year]" defaultValue={this.models('state.filter.year')}>
                    {years.map(year=><option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label className="control-label">{trans('Airline')} : </label>
                <select className="form-control" name="s[customer_company_id]" defaultValue={this.models('state.filter.customer_company_id')}>
                  <option value="">{trans('Tous')}</option>
                  {this.props.data.customer_companies.map(customer_company=><option key={`select-company-${customer_company.id}`} value={customer_company.id}>{customer_company.company.name}</option>)}
                </select>
              </div>
            </div>
            <div className="col-md-2">
                <label className="control-label">&nbsp;</label>
                <div className="form-group">
                    <button className="btn btn-primary btn-block">{trans('Valider')}</button>
                </div>
            </div>
          </form>
        </div>
      </div>
      <div className="card no-radius">
        <div className="body">
            <div className={`row topsContainer position-relative ${this.state.expansion}`}>
                <div className="col-md-3-5">
                    <SalesPerMonth data={this.props.data.data.sales_per_month}/>
                </div>
                <div className="col-md-1-5">
                    <div className="card no-radius">
                        <div className="header">
                            <h2 className="text-center">{trans('Visibilité')}</h2>
                        </div>
                        <Pie data={this.models('props.data.data.performance')} format="0,0.00%"/>
                    </div>
                </div>
                <div></div>
                <div></div>
                <div className="expansion col-md-1-5">
                    <div className="card cardTop">
                        <div className="card-body blue perfs">
                            <a href="#expandable-card/stats/5" className="ico"><i className="l2-resize"></i></a>
                            <h2 className="text-center text-uppercase">{trans('Performances')}</h2>
                            <div className="recap">
                                <div className="topList">
                                    <span className="type">{trans('On time')}</span>
                                    <span className="line" style={{width: `${this.models('props.data.data.performance.in_time', 0)*100/total_resdits}%`}}></span>
                                    <span>{numeral(this.models('props.data.data.performance.in_time')).format('0,0')}</span>
                                </div>
                                <div className="topList">
                                    <span className="type">{trans('< 24h')}</span>
                                    <span className="line" style={{width: `${this.models('props.data.data.performance.before24', 0)*100/total_resdits}%`}}></span>
                                    <span>{numeral(this.models('props.data.data.performance.before24')).format('0,0')}</span>
                                </div>
                                <div className="topList">
                                    <span className="type">{trans('> 24h')}</span>
                                    <span className="line" style={{width: `${this.models('props.data.data.performance.after24', 0)*100/total_resdits}%`}}></span>
                                    <span>{numeral(this.models('props.data.data.performance.after24')).format('0,0')}</span>
                                </div>
                                <div className="p-5 p-sm-4 text-white">
                                    {trans('Calcul de la performance sur les livraisons à destination uniquement')}
                                </div>
                            </div>
                            <div className="expanded">
                                <Bar data={{tooltip: ':title<br/>:quantity', data:[{title:trans('On time'),quantity:this.models('props.data.data.performance.in_time')}, {title:trans('< 24h'),quantity:this.models('props.data.data.performance.before24')}, {title:trans('> 24h'), quantity:this.models('props.data.data.performance.after24')}]}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row align-items-center">
                <div className="col-md-6">
                    <WeightsPerMonth data={this.props.data.data.weights_per_month}/>
                </div>
                <div className="col-md-6">
                    <StatPerMonth data={this.props.data.data.shipments_per_month} className="my-4"/>
                </div>
            </div>
        </div>
      </div>
      <div className="row clearfix cardContainer">
          <div className="col-lg col-md-12">
            <div className="card no-radius">
                <div className="header">
                    <h2 className="text-center">{trans('Volumes')}</h2>
                </div>
                <Pie data={this.props.data.data.volumes}/>
            </div>
          </div>
                <div className="col-lg col-md-12">
                    <div className="card no-radius">
                        <div className="header">
                            <h2 className="text-center">{trans('Ventes')}</h2>
                        </div>
                        <Pie data={this.models('props.data.data.sales_per_route')} colorIndex={1} format="0,0a$"/>
                    </div>
                </div>
                <div className="col-lg col-md-12">
                    <div className="card no-radius products-cat">
                        <div className="header">
                            <h2 className="text-center">{trans('Produits/Cat.')}</h2>
                        </div>
                        <CatPie data={this.models('props.data.data.products_per_cat')} colorIndex={2} format="0.00%"/>
                    </div>
                </div>
                <div className="col-lg col-md-12">
                    <div className="card no-radius">
                        <div className="header">
                            <h2 className="text-center">{trans('Clients')}</h2>
                        </div>
                        <Pie data={this.models('props.data.data.volumes_per_post')}  colorIndex={3}/>
                    </div>
                </div>
            </div>
            <div className={`row clearfix topsContainer position-relative ${this.state.expansion}`}>
                <div className="expansion col-lg col-md-12">
                    <div className="card cardTop">
                        <div className="card-body">
                            <a href="#expandable-card/stats/1" className="ico"><i className="l2-resize"></i></a>
                            <h2 className="text-center text-uppercase">{trans('TOP Volumes')}</h2>
                            <div className="recap">
                                {this.models('props.data.data.top_volumes_per_route.data', []).slice(0, 3).map(item=><div key={item.title} className="topList">
                                    <span className="type">{item.title}</span>
                                    <span className="line" style={{width: item.percent}}></span>
                                    <span>{numeral(item.quantity).format('0,0')} Kg</span>
                                </div>)}
                            </div>
                            <div className="expanded">
                                <Bar data={this.models('props.data.data.top_volumes_per_route', [])}/>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    {numeral(this.models('props.data.data.total_volume')/1000).format('0,0')}
                                    <span>{trans('Total tonne')}</span>
                                </div>
                                <div className="text-right">
                                    {numeral(this.models('props.data.data.total_volume')/this.models('props.data.data.total_days', 1)).format('0,0')}
                                    <span>{trans('Kg/jour')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="expansion col-lg col-md-12">
                    <div className="card cardTop">
                        <div className="card-body yelow">
                            <a href="#expandable-card/stats/2" className="ico"><i className="l2-resize"></i></a>
                                <h2 className="text-center text-uppercase">{trans('TOP Ventes')}</h2>
                                <div className="recap">
                                {this.models('props.data.data.top_sales_per_route.data', []).slice(0, 3).map(item=><div key={item.title} className="topList">
                                    <span className="type">{item.title}</span>
                                    <span className="line" style={{width: item.percent}}></span>
                                    <span>{numeral(item.quantity).format('0,0a$')}</span>
                                </div>)}
                            </div>
                            <div className="expanded">
                                <Bar data={this.models('props.data.data.top_sales_per_route', [])}/>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    {numeral(this.models('props.data.data.total_ht')).format('0,0a')}
                                    <span>{trans('Total €')}</span>
                                </div>
                                <div className="text-right">
                                    {numeral(this.models('props.data.data.total_ht')/this.models('props.data.data.total_days', 1)).format('0,0a')}
                                    <span>{trans('€/jour')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="expansion col-lg col-md-12">
                    <div className="card cardTop">
                        <div className="card-body violet">
                            <a href="#expandable-card/stats/3" className="ico"><i className="l2-resize"></i></a>
                            <h2 className="text-center text-uppercase">{trans('TOP Produits')}</h2>
                            <div className="recap">
                                {this.models('props.data.data.products.data', []).slice(0, 3).map(item=><div className="topList" key={item.title}>
                                    <span className="type">{item.title}</span>
                                    <span className="line" style={{width: item.quantity+'%'}}></span>
                                    <span>{numeral(item.quantity/100).format('0,0.00%')}</span>
                                </div>)}
                            </div>
                            <div className="expanded">
                                <Bar data={this.models('props.data.data.products')}/>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    {this.models('props.data.data.products.data', []).length}
                                    <span>{trans('Catégories')}</span>
                                </div>
                                <div>
                                    
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="expansion col-lg col-md-12">
                    <div className="card cardTop">
                        <div className="card-body red">
                            <a href="#expandable-card/stats/4" className="ico"><i className="l2-resize"></i></a>
                            <h2 className="text-center text-uppercase">{trans('TOP Clients')}</h2>
                            <div className="recap">
                                {this.models('props.data.data.sales_per_post.data', []).map((item, index)=><div key={index} className="topList">
                                    <span className="type">{item.title}</span>
                                    <span className="line"></span>
                                    <span>{numeral(item.quantity).format('0,0a$')}</span>
                                </div>)}
                            </div>
                            <div className="expanded">
                                <Bar data={this.models('props.data.data.sales_per_post', [])}/>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    {this.models('props.data.data.sales_per_post.data', []).length}
                                    <span>{plural('Client', {n:this.models('props.data.data.sales_per_post.data', []).length})}</span>
                                </div>
                                <div className="text-right">
                                    {numeral(this.models('props.data.data.total_ht')).format('0,0a')}
                                    <span>{trans('Total €')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  }
}

export default Modelizer(Dashboard)