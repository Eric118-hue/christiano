import React from 'react';
import Organisation, {CUSTOMER_TYPES, TRANSPORTERS, TRANSPORTER} from './Organisation';
import Pricing from './RoadPricing';
import trans from 'ryapp/translations';
import Autocomplete from 'ryapp/Manager/Client/Autocomplete';

class RouteOrganisation extends Organisation
{
  validate() {
    let errors = []
    return errors
  }

  tree() {
    return <ul className="list-unstyled">
        <li className="ramification-client">
            <div className="alert w-50 font-24">
                {CUSTOMER_TYPES[this.state.customer.type]} : {this.state.customer.facturable.name}
            </div>
            <ul className="list-unstyled ramification-airline" ref="organisation">
                {this.state.customer.facturable[TRANSPORTERS[this.state.customer.type]].map((transporter, transporter_index)=>transporter.deleted?<input key={`transporter-${transporter_index}`} type="hidden" name={`deleted_transports[${transporter_index}][id]`} value={transporter.id}/>:<li key={`transporter-${transporter_index}`}>
                    <div className="row">
                        <div className="col-8">
                            <div className="alert font-24 d-flex justify-content-between">
                                <Autocomplete onChange={item=>{
                                            this.setState(state=>{
                                                state.customer.facturable.transporters[transporter_index].id = item.id
                                                state.customer.facturable.transporters[transporter_index].name = item.name
                                                state.customer.facturable.transporters[transporter_index].icao_code = item.icao_code
                                                state.customer.facturable.transporters[transporter_index].iata_code = item.iata_code
                                                state.customer.facturable.transporters[transporter_index].adresse = item.adresse
                                                if(this.refs.pricing)
                                                    this.refs.pricing.updateCustomer(state.customer)
                                                return state
                                            })
                                        }} readOnly={this.props.readOnly} value={transporter.id>0?transporter:null} placeholder={trans('Ajouter une compagnie')} endpoint={`/transporters`} line={item=>item.name} selection={item=><span>{item.name} ({this.cast(item, 'adresse.ville.country.nom')})
                                    <input type="hidden" name={`transporters[${transporter_index}][id]`} value={item.id}/>
                                </span>} param="q"/>
                            </div>
                        </div>
                        {this.props.pricing?<React.Fragment>
                            <span className="transporter-trait mt-4"></span>
                            <div className="col-md-3">
                                <div className="alert align-items-center d-flex justify-content-between">
                                    <label className="m-0 text-uppercase">{trans('Com. AD')} : </label>
                                    <input className="bg-transparent form-control text-center text-white w-50" type="number" name={this.props.data.row.type=='gsa'?`transporters[${transporter_index}][nsetup][commission][value]`:`nsetup[commission][value]`} step="0.01" defaultValue={this.cast(transporter, 'commission.value')}/>
                                    {this.props.data.default_currency.symbol}/Kg
                                    <input type="hidden" name={this.props.data.row.type=='gsa'?`transporters[${transporter_index}][nsetup][commission][currency_id]`:`nsetup[commission][currency_id]`} value={this.props.data.default_currency.id}/>
                                </div>
                            </div>
                        </React.Fragment>:null}
                        {(!this.props.readOnly &&  this.state.customer.facturable[TRANSPORTERS[this.state.customer.type]].filter(item=>!item.deleted).length>1)?<button className="btn" type="button" onClick={()=>{
                            this.setState(state=>{
                                state.customer.facturable.transporters[transporter_index].deleted = true
                                return state
                            })
                        }} type="button">
                            <i className="fa fa-trash-alt"></i>
                        </button>:null}
                    </div>
                    <ul className="list-unstyled ramification-edi">
                        {transporter.edis.map((edi, edi_index)=>edi.deleted?<input key={`transporter-${transporter_index}-edi-${edi_index}`} type="hidden" name={`transporters[${transporter_index}][edis][${edi_index}][deleted_id]`} value={edi.id}/>:<li key={`transporter-${transporter_index}-edi-${edi_index}`}>
                            <div className="row">
                                <div className="col-3">
                                    <div className="alert d-flex justify-content-between p-2">
                                        <Autocomplete readOnly={this.props.readOnly} onChange={item=>{
                                            this.setState(state=>{
                                                state.customer.facturable.transporters[transporter_index].edis[edi_index].departure = item
                                                if(this.refs.pricing)
                                                    this.refs.pricing.updateCustomer(state.customer)
                                                return state
                                            })
                                        }} value={this.cast(edi, 'departure.id', -1)>0?edi.departure:null} param="s" placeholder={trans("Ajouter la poste d'origine")} endpoint={`/edis`} line={item=>`${item.edi_address} (${item.network})`} selection={item=><span>
                                            <strong>{item.edi_address}</strong> ({item.network} - L160)
                                            <input type="hidden" name={`transporters[${transporter_index}][edis][${edi_index}][from_id]`} value={item.id}/>
                                        </span>} buttonClass="p-0"/>
                                    </div>
                                </div>
                                <span className="edi-trait mt-3"></span>
                                <div className="col-3">
                                    <div className="alert d-flex justify-content-between p-2">
                                        <Autocomplete onChange={item=>{
                                            this.setState(state=>{
                                                state.customer.facturable.transporters[transporter_index].edis[edi_index].transporter = item
                                                if(this.refs.pricing)
                                                    this.refs.pricing.updateCustomer(state.customer)
                                                return state
                                            })
                                        }} readOnly={this.props.readOnly} value={edi[TRANSPORTER[this.state.customer.type]].id>0?edi.transporter:null} param="q" placeholder={trans("Ajouter la compagnie")} endpoint={`/transporters?with[]=edi_code`} line={item=>`${item.name}`} selection={item=><span>
                                            <strong>{item.name}</strong>
                                            <input type="hidden" name={`transporters[${transporter_index}][edis][${edi_index}][to_id]`} value={item.id}/>
                                        </span> } buttonClass="p-0"/>
                                    </div>
                                </div>
                                {this.props.pricing?<React.Fragment>
                                    <span className="edi-trait mt-3"></span>
                                    <div className="col-3">
                                        <select defaultValue={this.cast(edi, 'nsetup.currency.id')} className="form-control" name={`transporters[${transporter_index}][edis][${edi_index}][nsetup][currency][id]`}>
                                            {this.props.data.currencies.map(currency=><option key={`currency-${currency.id}`} value={currency.id}>{currency.iso_code}</option>)}
                                        </select>
                                    </div>
                                </React.Fragment>:null}
                                <input type="hidden" name={`transporters[${transporter_index}][edis][${edi_index}][id]`} value={edi.id}/>
                                {(!this.props.readOnly && transporter.edis.filter(item=>!item.deleted).length>1)?<button className="btn" onClick={()=>{
                                    this.setState(state=>{
                                        state.customer.facturable.transporters[transporter_index].edis[edi_index].deleted = true
                                        return state
                                    })
                                }} type="button" style={{right:24}}>
                                    <i className="fa fa-trash-alt"></i>
                                </button>:null}
                            </div>
                            <div className="row">
                                {this.props.pricing?null:<div className="col-4">
                                    <ul className="list-unstyled ramification-agent">
                                        {edi.agents.map((agent, agent_index)=>agent.deleted?<input key={`transporter-${transporter_index}-edi-${edi_index}-agent-${agent_index}`} type="hidden" name={`transporters[${transporter_index}][edis][${edi_index}][agents][${agent_index}][deleted_id]`} value={agent.id}/>:<li key={`transporter-${transporter_index}-edi-${edi_index}-agent-${agent_index}`} className="pb-2">
                                            <div className="alert d-flex justify-content-between mb-0 p-2">
                                                <Autocomplete onChange={item=>{
                                            this.setState(state=>{
                                                state.customer.facturable.transporters[transporter_index].edis[edi_index].agents[agent_index] = item
                                                if(this.refs.pricing)
                                                    this.refs.pricing.updateCustomer(state.customer)
                                                return state
                                            })
                                        }} readOnly={this.props.readOnly} value={agent.id>0?agent:null} param="s" placeholder={trans('Ajouter un agent')} endpoint={`/agents?edi_id=${this.cast(edi, 'departure.id')}`} line={item=>`${item.name} (${this.cast(item, 'road_station.iata')})`} selection={item=><div>
                                                    <i className="fa fa-user"></i> {trans('Agent')} <strong>{this.cast(item, 'road_station.iata')}</strong>
                                                    <br/>
                                                    <span className="text-body">
                                                        {item.profile.gender_label} {item.name}
                                                    </span>
                                                    <input type="hidden" name={`transporters[${transporter_index}][edis][${edi_index}][agents][${agent_index}][id]`} value={item.id}/>
                                                </div>} buttonClass="p-0"/>
                                            </div>
                                            {(!this.props.readOnly &&  edi.agents.filter(item=>!item.deleted).length>1)?<button className="btn position-absolute" type="button" onClick={()=>{
                                                this.setState(state=>{
                                                    state.customer.facturable.transporters[transporter_index].edis[edi_index].agents[agent_index].deleted = true
                                                    return state
                                                })
                                            }} style={{right:-40,top:0,zIndex:100}}>
                                                    <i className="fa fa-trash-alt"></i>
                                            </button>:null}
                                        </li>)}
                                        {this.props.readOnly?null:<li>
                                            <button className="p-0 border-0 font-24 btn-add btn focus-outline-hidden" type="button" onClick={()=>this.addAgent(transporter_index, edi_index)}><i className="fa fa-plus-circle"></i></button>
                                        </li>}
                                    </ul>
                                </div>}
                                <div className={this.props.pricing?"col-12":"col-8"}>
                                    <ul className="list-unstyled ramification-route">
                                        {edi.routes.map((route, route_index)=>route.deleted?<input key={`transporter-${transporter_index}-edi-${edi_index}-route-${route_index}`} type="hidden" name={`transporters[${transporter_index}][edis][${edi_index}][routes][${route_index}][deleted_id]`} value={route.id}/>:<li key={`transporter-${transporter_index}-edi-${edi_index}-route-${route_index}`}>
                                            <div className="row">
                                                <div className="col-4">
                                                    <div className="alert d-flex justify-content-between p-2">
                                                        <Autocomplete onChange={item=>{
                                            this.setState(state=>{
                                                state.customer.facturable.transporters[transporter_index].edis[edi_index].routes[route_index].departure = item
                                                if(this.refs.pricing)
                                                    this.refs.pricing.updateCustomer(state.customer)
                                                return state
                                            })
                                        }} readOnly={this.props.readOnly} value={this.cast(route, 'departure.id', -1)>0?route.departure:null} placeholder={trans('Ajouter une station de départ')} line={item=><strong>{item.iata}</strong>} param="q" endpoint={`/road_stations`} selection={item=><span><strong>{item.iata}</strong>
                                                        <input type="hidden" name={`transporters[${transporter_index}][edis][${edi_index}][routes][${route_index}][from_id]`} value={item.id}/>
                                                        </span>} buttonClass="p-0"/>
                                                    </div>
                                                </div>
                                                <span className="edi-trait mt-3"></span>
                                                <div className="col-4">
                                                    <div className="alert d-flex justify-content-between p-2">
                                                        <Autocomplete onChange={item=>{
                                            this.setState(state=>{
                                                state.customer.facturable.transporters[transporter_index].edis[edi_index].routes[route_index].arrival = item
                                                if(this.refs.pricing)
                                                    this.refs.pricing.updateCustomer(state.customer)
                                                return state
                                            })
                                        }} readOnly={this.props.readOnly} value={this.cast(route, 'arrival.id', -1)>0?route.arrival:null} placeholder={trans("Ajouter une station d'arrivée")} line={item=><strong>{item.precon}</strong>} param="q" endpoint={`/post_offices`} selection={item=><span><strong>{item.precon}</strong>
                                                        <input type="hidden" name={`transporters[${transporter_index}][edis][${edi_index}][routes][${route_index}][to_id]`} value={item.id}/>
                                                        </span>} buttonClass="p-0"/>
                                                    </div>
                                                </div>
                                                {this.props.pricing?<React.Fragment>
                                                    <span className="edi-trait mt-3"></span>
                                                    <div className="col-md-2">
                                                        <div className="alert d-flex justify-content-between p-2">
                                                            <label className="m-0 text-uppercase">{trans('TVA')} : </label>
                                                            <input className="bg-transparent form-control h-auto p-0 w-50 text-center text-white" type="number" name={`transporters[${transporter_index}][edis][${edi_index}][routes][${route_index}][nsetup][vat]`} value={this.cast(route, 'nsetup.vat')} onChange={e=>{
                                                                const value = e.target.value
                                                                this.setState(state=>{
                                                                    state.customer.facturable.transporters[transporter_index].edis[edi_index].routes[route_index].nsetup.vat = value
                                                                    return state
                                                                })
                                                            }}/>
                                                            %
                                                        </div>
                                                    </div>
                                                </React.Fragment>:null}
                                                <input type="hidden" name={`transporters[${transporter_index}][edis][${edi_index}][routes][${route_index}][id]`} value={route.id}/>
                                                {(!this.props.readOnly && edi.routes.filter(item=>!item.deleted).length>1)?<button className="btn position-absolute" type="button" onClick={()=>{
                                                    this.setState(state=>{
                                                        state.customer.facturable.transporters[transporter_index].edis[edi_index].routes[route_index].deleted = true
                                                        return state
                                                    })
                                                }} style={{right:24}}>
                                                    <i className="fa fa-trash-alt"></i>
                                                </button>:null}
                                            </div>
                                            {this.props.pricing?<Pricing indexes={{transporter_index,edi_index,route_index}} store={this.props.store} setup={this.props.setup} data={route}/>:null}
                                        </li>)}
                                        {this.props.readOnly?null:<li>
                                            <button type="button" className="p-0 border-0 font-24 btn btn-add focus-outline-hidden" onClick={()=>this.addRoute(transporter_index, edi_index)}><i className="fa fa-plus-circle"></i></button>
                                        </li>}
                                    </ul>
                                </div>
                            </div>
                        </li>)}
                        {this.props.readOnly?null:<li>
                            <button className="p-0 border-0 font-24 btn btn-add focus-outline-hidden" type="button" onClick={()=>this.addEdi(transporter_index)}><i className="fa fa-plus-circle"></i></button>
                        </li>}
                    </ul>
                </li>)}
                {(this.props.data.row.type=='transporter'||this.props.readOnly)?null:<li>
                    <button className="p-0 btn border-0 font-24 btn-add focus-outline-hidden" type="button" onClick={this.addAirline}><i className="fa fa-plus-circle"></i></button>
                </li>}
            </ul>
        </li>
    </ul>
  }

  render() {
    if(!this.props.tabbed) {
        return this.tree()
    }
    return <React.Fragment>
        <div className={`tab-pane ${this.props.data.tab=='organisation'?'active':''}`}
        id={`organisation`} role="tabpanel" aria-labelledby="organisation-tab">
            {this.tree()}
        </div>
        <div className={`tab-pane ${this.props.data.tab=='pricing'?'active':''}`}
        id={`pricing`} role="tabpanel" aria-labelledby="pricing-tab">
            <RouteOrganisation pricing={true} readOnly={true} ref="pricing" data={{row:this.state.customer,currencies:this.props.data.currencies,default_currency:this.props.data.default_currency}} store={this.props.store} setup={this.props.data.pricing}/>
        </div>
    </React.Fragment>
  }
}

export default RouteOrganisation;