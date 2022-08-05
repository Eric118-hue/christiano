import React, {Component} from 'react';
import trans from 'ryapp/translations';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import $ from 'jquery';

class Rate extends Component
{
  constructor(props) {
    super(props)
    this.handleRemove = this.handleRemove.bind(this)
  }

  handleRemove() {
    $.ajax({
      url : trans('/shop/delivery/rate'),
      method : 'delete',
      data : {
        id : this.props.data.id
      },
      success : response=>{
        this.props.store.dispatch(response)
      }
    })
  }

  render() {
    return <div className="row">
      <div className="col-md-2 font-weight-bold text-primary form-inline">
        {this.props.data.carrier.name}
        <input type="hidden" name={`rates[${this.props.data.id}][carrier_id]`} value={this.props.data.carrier_id}/>
      </div>
      <div className="col-md-3 form-inline">
        <label className="control-label col-md-2 font-weight-normal required">{trans('De')}</label>
        <input type="number" step="0.01" className="form-control" name={`rates[${this.props.data.id}][nsetup][from][value]`} required defaultValue={this.models('props.data.nsetup.from.value')}/>
        <label className="control-label col-md-2 font-weight-normal required">Kg</label>
        <input type="hidden" name={`rates[${this.props.data.id}][nsetup][from][unit]`} value="Kg"/>
      </div>
      <div className="col-md-3 form-inline">
        <label className="control-label col-md-2 font-weight-normal required">{trans('à')}</label>
        <input type="number" step="0.01" className="form-control" name={`rates[${this.props.data.id}][nsetup][to][value]`} defaultValue={this.models('props.data.nsetup.to.value')}/>
        <label className="control-label col-md-2 font-weight-normal required">Kg</label>
        <input type="hidden" name={`rates[${this.props.data.id}][nsetup][to][unit]`} value="Kg"/>
      </div>
      <div className="col-md-3 form-inline">
        <label className="control-label col-md-2 font-weight-normal required">=</label>
        <input type="number" step="0.01" className="form-control" name={`rates[${this.props.data.id}][prices][0][price]`} required defaultValue={parseFloat(this.models('props.data.prices.0.price'))}/>
        <label className="control-label col-md-2 font-weight-normal required">{trans(':symbol HT', {symbol:this.models('props.data.prices.0.currency.symbol')})}</label>
        <input type="hidden" name={`rates[${this.props.data.id}][prices][0][currency_id]`} value={this.models('props.data.prices.0.currency_id')}/>
      </div>
      <div className="col-md-1">
        <button className="btn" type="button" onClick={this.handleRemove}><i className="fa fa-trash-alt fa-2x text-danger"></i></button>
      </div>
    </div>
  }
}

Modelizer(Rate)

class Zone extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      active : this.models('props.data.centrale.nsetup.active', false),
      data : this.models('props.data')
    }
    this.handleChecked = this.handleChecked.bind(this)
  }

  handleChecked(event) {
    const checked = event.target.checked
    this.setState({
      active : checked
    })
  }

  componentDidMount() {
    this.props.store.subscribe(()=>{
      const storeState = this.props.store.getState()
      if(storeState.type=='zone' && storeState.id==this.props.data.id) {
        this.setState(state=>{
          state.data.rates = storeState.rates
          return state
        })
      }
    })
  }

  render() {
    return <form action={trans('/shop/delivery/zone')} method="post" name="frm_rate" className="mb-3">
      <input type="hidden" name="ry"/>
      <div className="bg-light p-3 border-bottom">
        <div className="row m-0 justify-content-between font-weight-bold text-uppercase">
          <div>
            {trans('Zone')} {this.props.data.id} : <span className="text-primary">{this.props.data.name}</span>
          </div>
          <label className="fancy-checkbox m-0">
            <input type="checkbox" name="checkbox" onChange={this.handleChecked} name="centrale[nsetup][active]" value="1" defaultChecked={this.models('props.data.centrale.nsetup.active', false)}/>
            <span>{trans('Activer cette zone')}</span>
          </label>
        </div>
      </div>
      <div className={`p-3 ${this.state.active?'':'collapse'}`}>
        {this.models('state.data.rates', []).map(rate=><Rate key={rate.id} store={this.props.store} data={rate}/>)}
        <div className="row">
          <div className="col-md-2">
            <select className="form-control" name="rates[0][carrier_id]">
              {this.props.selectCarriers.map(carrier=><option key={carrier.id} value={carrier.id}>
                {carrier.name}
              </option>)}
            </select>
          </div>
          <div className="col-md-3 form-inline">
            <label className="control-label col-md-2 font-weight-normal">{trans('De')}</label>
            <input type="number" step="0.01" className="form-control" name="rates[0][nsetup][from][value]"/>
            <label className="control-label col-md-2 font-weight-normal">Kg</label>
            <input type="hidden" name="rates[0][nsetup][from][unit]" value="Kg"/>
          </div>
          <div className="col-md-3 form-inline">
            <label className="control-label col-md-2 font-weight-normal">{trans('à')}</label>
            <input type="number" step="0.01" className="form-control" name="rates[0][nsetup][to][value]"/>
            <label className="control-label col-md-2 font-weight-normal">Kg</label>
            <input type="hidden" name="rates[0][nsetup][to][unit]" value="Kg"/>
          </div>
          <div className="col-md-3 form-inline">
            <label className="control-label col-md-2 font-weight-normal">=</label>
            <input type="number" step="0.01" className="form-control" name="rates[0][prices][0][price]"/>
            <label className="control-label col-md-2 font-weight-normal">{trans(':symbol HT', {symbol:this.props.currency.symbol})}</label>
            <input type="hidden" name="rates[0][prices][0][currency_id]" value={this.props.currency.id}/>
          </div>
          <div className="col-md-1">
            <input type="hidden" name="id" value={this.props.data.id}/>
            <button className="btn btn-primary">{trans('Enregistrer')}</button>
          </div>
        </div>
      </div>
    </form>
  }
}

Modelizer(Zone)

class List extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      data : this.models('props.data.data', [])
    }
  }

  render() {
    return <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          {trans('Frais de livraison')}
        </div>
        <div className="card-body">
          {this.state.data.map(zone=><Zone key={zone.id} store={this.props.store} data={zone} selectCarriers={this.props.data.select_carriers} currency={this.props.data.currency}/>)}
        </div>
      </div>
    </div>
  }
}

export default Modelizer(List)