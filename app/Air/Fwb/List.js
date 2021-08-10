import React, {Component} from 'react';
import NavigableModel from '../../../vendor/Ry/Core/NavigableModel';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import trans from '../../translations';

class List extends NavigableModel
{
  constructor(props) {
    super(props)
    this.endpoint = '/ltas';
    this.model = 'lta'
    this.progressive = true
  }

  item(item, key) {
    return <div key={`awb-${item.id}`} className={`px-4 py-2 border ${item.cardit_id?'border-danger':''}`}>{item.code}</div>
  }

  searchEngine() {
    return <form name="frm_awb_available" className="row mt-3 justify-content-between mx-0" action="/warnlta" method="post">
      <div className="col-md-3">
        <label className="control-label">{trans('Quantité AWB restants')} : <strong className="font-18 text-orange">{this.props.remaining}</strong></label>
      </div>
      <div className="form-inline">
        <label className="control-label">{trans("AWB Stock Alert")}</label>
        <input type="number" name="nsetup[lta][warning]" defaultValue={this.models('props.customer.company_nsetup.lta.warning', this.models('props.customer.nsetup.lta.warning'))} className="form-control mx-2" required/>
        <button className="btn btn-orange">{trans('Enregistrer')}</button>
      </div>
      <input type="hidden" name="ry"/>
    </form>
  }

  render() {
    let pagination = <ul className={`list-inline m-0 ${this.props.data.per_page>=this.state.total?'d-none':''}`}>
        <li className="list-inline-item">
            <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toFirst}><i className="fa fa-angle-double-left"></i></a>
        </li>
        <li className="list-inline-item">
            <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toPrevious}><i className="fa fa-angle-left"></i></a>
        </li>
        <li className="list-inline-item">
            <a className={`btn btn-outline-primary ${this.state.page===this.state.last_page?'disabled':''}`} href="#" onClick={this.toNext}><i className="fa fa-angle-right"></i></a>
        </li>
        <li className="list-inline-item">
            <a className={`btn btn-outline-primary ${this.state.page===this.state.last_page?'disabled':''}`} href="#" onClick={this.toEnd}><i className="fa fa-angle-double-right"></i></a>
        </li>
    </ul>

    return <div className="col-12">            
        <div className="justify-content-between m-0 row">
            {this.beforelist()}
            {(this.progressive || this.nopaginate)?null:pagination}
        </div>
        {this.searchEngine()}
        <div className="card mt-3">
          <div className="card-body">
            <div className="row my-5 mx-0 bg-light">
              {this.state.data.map((item, key)=>this.item(item, key))}
            </div>
          </div>
        </div>
        <div ref="overscroller" className="justify-content-between m-0 row">
            {this.afterlist()}
            {(this.progressive || this.nopaginate)?null:pagination}
        </div>
    </div>
  }
}

Modelizer(List)

class ListWrapper extends Component
{
  render() {
    return <List data={this.props.data.data} store={this.props.store} customer={this.props.data.user.customer_account} remaining={this.props.data.remaining}/>
  }
}

export default ListWrapper;