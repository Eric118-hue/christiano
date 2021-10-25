import React, {Component} from 'react';
import NavigableModel from 'ryvendor/Ry/Core/NavigableModel';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';

class List extends NavigableModel
{
  constructor(props) {
    super(props)
    this.endpoint = '/ltas';
    this.model = 'lta'
    this.progressive = true
  }

  item(item, key) {
    return <div key={`awb-${item.id}`} className={`col-md-2 py-2 border text-center ${item.cardit_id?'border-danger':''}`}>{item.code}</div>
  }

  searchEngine() {
    return <div className="mt-3">
        <label className="control-label">{trans('Quantité AWB restants')} : <strong className="font-18 text-orange">{this.props.remaining}</strong></label>
      </div>
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
        <div className="card">
          <div className="card-body">
            <div className="row mx-0 bg-light">
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