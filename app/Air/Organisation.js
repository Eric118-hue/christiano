import React, {Component} from 'react';
import Modelizer from '../../vendor/Ry/Core/Modelizer';
import {CUSTOMER_TYPES} from '../Manager/Client/Organisation';
import trans from '../translations';
import $ from 'jquery';
import Pricing from '../Manager/Client/Pricing';
import Autocomplete from '../Manager/Client/Autocomplete';

export const TRANSPORTER = {
    land : 'transporter',
    air : 'airline',
    gsa : 'airline',
    mix : 'mix'
}

class Organisation extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            customer : {
                type : this.models('props.data.row.type'),
                facturable : this.models('props.data.row.facturable'),
                companies : this.models('props.data.row.companies', [])
            }
        }
        this.updateCustomer = this.updateCustomer.bind(this)
    }

    componentDidMount() {
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='client_change') {
                this.setState(state=>{
                    state.customer.type = storeState.data.type
                    state.customer.facturable.name = storeState.data.facturable.name
                    return state
                })
            }
        })
    }

    validate() {
        let errors = []
        $(this.refs.organisation).find('.border-danger').removeClass('border-danger')
        $(this.refs.organisation).find("[required]").each(function(){
            $(this).parent().parent().addClass('border-danger')
            errors.push('required')
        })
        if(this.refs.pricing)
            errors.concat(this.refs.pricing.validate())
        return errors
    }

	companyHeader(company, company_index) {
		if(company.type=='air') {
			return <Autocomplete onChange={item=>{
		                this.setState(state=>{
		                    state.customer.companies[company_index].id = item.id
		                    state.customer.companies[company_index].name = item.name
		                    state.customer.companies[company_index].icao_code = item.icao_code
		                    state.customer.companies[company_index].iata_code = item.iata_code
		                    state.customer.companies[company_index].adresse = item.adresse
		                    if(this.refs.pricing)
		                        this.refs.pricing.updateCustomer(state.customer)
		                    return state
		                })
		            }} readOnly={this.props.readOnly} value={this.cast(company, 'company')} placeholder={trans('Ajouter une compagnie aérienne')} endpoint={`/airlines`} line={item=>item.name} selection={item=><span>{item.icao_code} / {item.iata_code} = {item.name} ({this.cast(item, 'country.nom')})
		        <input type="hidden" name={`companies[${company.id}][company_id]`} value={item.id}/>
		    </span>} param="q"/>
		}
		else if(company.type=='land') {
			return <Autocomplete onChange={item=>{
	                    this.setState(state=>{
	                        state.customer.companies[company_index].id = item.id
	                        state.customer.companies[company_index].name = item.name
	                        state.customer.companies[company_index].icao_code = item.icao_code
	                        state.customer.companies[company_index].iata_code = item.iata_code
	                        state.customer.companies[company_index].adresse = item.adresse
	                        if(this.refs.pricing)
	                            this.refs.pricing.updateCustomer(state.customer)
	                        return state
	                    })
	                }} readOnly={this.props.readOnly} value={this.cast(company, 'company')} placeholder={trans('Ajouter une compagnie')} endpoint={`/transporters`} line={item=>item.name} selection={item=><span>{item.name} ({this.cast(item, 'adresse.ville.country.nom')})
	            <input type="hidden" name={`companies[${company.id}][company_id]`} value={item.id}/>
	        </span>} param="q"/>
		}
		else {
			return <Autocomplete onChange={item=>{
	                    this.setState(state=>{
	                        state.customer.companies[company_index].id = item.id
	                        state.customer.companies[company_index].name = item.name
	                        state.customer.companies[company_index].icao_code = item.icao_code
	                        state.customer.companies[company_index].iata_code = item.iata_code
	                        state.customer.companies[company_index].adresse = item.adresse
	                        if(this.refs.pricing)
	                            this.refs.pricing.updateCustomer(state.customer)
	                        return state
	                    })
	                }} readOnly={this.props.readOnly} value={this.cast(company, 'company')} placeholder={trans('Ajouter une compagnie maritime')} endpoint={`/airlines`} line={item=>item.name} selection={item=><span>{item.name} ({this.cast(item, 'adresse.ville.country.nom')})
	            <input type="hidden" name={`companies[${company.id}][company_id]`} value={item.id}/>
	        </span>} param="q"/>
		}
	}

    tree() {
        return <ul className="list-unstyled">
            <li className="ramification-client">
                <div className="alert w-50 font-24">
                    {CUSTOMER_TYPES[this.state.customer.type]} : {this.state.customer.facturable.name}
                </div>
                <ul className="list-unstyled ramification-airline" ref="organisation">
                    {this.state.customer.companies.map((company, company_index)=>company.deleted?<input key={`company-${company_index}`} type="hidden" name={`deleted_companies[${company_index}]`} value={company.id}/>:<li key={`company-${company_index}`}>
                        <div className="row">
                            <div className="col-8">
                                <div className="alert font-24 d-flex justify-content-between">
									{this.companyHeader(company, company_index)}
                                </div>
                            </div>
                            {this.props.pricing?<React.Fragment>
                                <span className="company-trait mt-4"></span>
                                <div className="col-md-3">
                                    <div className="alert align-items-center d-flex justify-content-between">
                                        <label className="m-0 text-uppercase">{trans('Com. AD')} : </label>
                                        <input className="bg-transparent form-control text-center text-white w-50" type="number" name={`companies[${company.id}][nsetup][commission][value]`} step="0.01" defaultValue={this.cast(company, 'nsetup.commission.value')}/>
                                        {this.props.data.default_currency.symbol}/Kg
                                        <input type="hidden" name={`companies[${company.id}][nsetup][commission][currency_id]`} value={this.props.data.default_currency.id}/>
                                    </div>
                                </div>
                            </React.Fragment>:null}
                            {(!this.props.readOnly &&  this.state.customer.companies.filter(item=>!item.deleted).length>1)?<button className="btn" type="button" onClick={()=>{
                                this.setState(state=>{
                                    state.customer.companies[company_index].deleted = true
                                    return state
                                })
                            }} type="button">
                                <i className="fa fa-trash-alt"></i>
                            </button>:null}
                        </div>

                        
                        <ul className="list-unstyled ramification-edi">
                            {company.edis.map((edi, edi_index)=>edi.deleted?<input key={`company-${company_index}-edi-${edi_index}`} type="hidden" name={`companies[${company.id}][edis][${edi_index}][deleted_id]`} value={edi.id}/>:<li key={`company-${company_index}-edi-${edi_index}`}>
                                <div className="row">
                                    <div className="col-3">
                                        <div className="alert d-flex justify-content-between p-2">
                                            <Autocomplete readOnly={this.props.readOnly} onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.companies[company_index].edis[edi_index].departure = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} value={this.cast(edi, 'departure.id', -1)>0?edi.departure:null} param="s" placeholder={trans("Ajouter la poste d'origine")} endpoint={`/edis`} line={item=>`${item.edi_address} (${item.network})`} selection={item=><span>
                                                <strong>{item.edi_address}</strong> ({item.network} - L160)
                                                <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][from_id]`} value={item.id}/>
                                            </span>} buttonClass="p-0"/>
                                        </div>
                                    </div>
                                    <span className="edi-trait mt-3"></span>
                                    <div className="col-3">
                                        <div className="alert d-flex justify-content-between p-2">
                                            {(company.type=='air' || company.type=='water')?<Autocomplete onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.companies[company_index].edis[edi_index].airline = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} readOnly={this.props.readOnly} value={this.cast(edi, 'airline.id', 0)>0?edi.airline:null} param="q" placeholder={trans("Ajouter la compagnie aérienne")} endpoint={`/airlines?with[]=edi_code`} line={item=>`${item.edi_code}`} selection={item=><span>
                                                <strong>{item.edi_code}</strong>
                                                <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][to_id]`} value={item.id}/>
                                            </span> } buttonClass="p-0"/>:<Autocomplete onChange={item=>{
                                            this.setState(state=>{
                                                state.customer.companies[company_index].edis[edi_index].transporter = item
                                                if(this.refs.pricing)
                                                    this.refs.pricing.updateCustomer(state.customer)
                                                return state
                                            })
                                        }} readOnly={this.props.readOnly} value={this.cast(edi, 'transporter.id', 0)>0?edi.transporter:null} param="q" placeholder={trans("Ajouter la compagnie")} endpoint={`/transporters?with[]=edi_code`} line={item=>`${item.name}`} selection={item=><span>
                                            <strong>{item.name}</strong>
                                            <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][to_id]`} value={item.id}/>
                                        </span> } buttonClass="p-0"/>}
                                        </div>
                                    </div>
                                    {this.props.pricing?<React.Fragment>
                                        <span className="edi-trait mt-3"></span>
                                        <div className="col-3">
                                            <select defaultValue={this.cast(edi, 'nsetup.currency.id')} className="form-control" name={`companies[${company.id}][edis][${edi_index}][nsetup][currency][id]`}>
                                                {this.props.data.currencies.map(currency=><option key={`currency-${currency.id}`} value={currency.id}>{currency.iso_code}</option>)}
                                            </select>
                                        </div>
                                    </React.Fragment>:null}
                                    <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][id]`} value={edi.id}/>
                                    {(!this.props.readOnly && company.edis.filter(item=>!item.deleted).length>1)?<button className="btn" onClick={()=>{
                                        this.setState(state=>{
                                            state.customer.companies[company_index].edis[edi_index].deleted = true
                                            return state
                                        })
                                    }} type="button" style={{right:24}}>
                                        <i className="fa fa-trash-alt"></i>
                                    </button>:null}
                                </div>
                                <div className="row">
                                    {this.props.pricing?null:<div className="col-4">
                                        <ul className="list-unstyled ramification-agent">
                                            {edi.agents.map((agent, agent_index)=>agent.deleted?<input key={`company-${company_index}-edi-${edi_index}-agent-${agent_index}`} type="hidden" name={`companies[${company.id}][edis][${edi_index}][agents][${agent_index}][deleted_id]`} value={agent.id}/>:<li key={`company-${company_index}-edi-${edi_index}-agent-${agent_index}`} className="pb-2">
                                                <div className="alert d-flex justify-content-between mb-0 p-2">
                                                    {(company.type=='air' || company.type=='water')?<Autocomplete onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.companies[company_index].edis[edi_index].agents[agent_index] = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} readOnly={this.props.readOnly} value={agent.id>0?agent:null} param="s" placeholder={trans('Ajouter un agent')} endpoint={`/agents?edi_id=${this.cast(edi, 'departure.id')}`} line={item=>`${item.name} (${item.airport.iata})`} selection={item=><div>
                                                        <i className="fa fa-user"></i> {trans('Agent')} <strong>{this.cast(item, 'airport.iata')}</strong>
                                                        <br/>
                                                        <span className="text-body">
                                                            {item.profile.gender_label} {item.name}
                                                        </span>
                                                        <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][agents][${agent_index}][id]`} value={item.id}/>
                                                    </div>} buttonClass="p-0"/>:<Autocomplete onChange={item=>{
                                            this.setState(state=>{
                                                state.customer.companies[company_index].edis[edi_index].agents[agent_index] = item
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
                                                    <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][agents][${agent_index}][id]`} value={item.id}/>
                                                </div>} buttonClass="p-0"/>}
                                                </div>
                                                {(!this.props.readOnly &&  edi.agents.filter(item=>!item.deleted).length>1)?<button className="btn position-absolute" type="button" onClick={()=>{
                                                    this.setState(state=>{
                                                        state.customer.companies[company_index].edis[edi_index].agents[agent_index].deleted = true
                                                        return state
                                                    })
                                                }} style={{right:-40,top:0,zIndex:100}}>
                                                        <i className="fa fa-trash-alt"></i>
                                                </button>:null}
                                            </li>)}
                                            {this.props.readOnly?null:<li>
                                                <button className="p-0 border-0 font-24 btn-add btn focus-outline-hidden" type="button" onClick={()=>this.addAgent(company_index, edi_index)}><i className="fa fa-plus-circle"></i></button>
                                            </li>}
                                        </ul>
                                    </div>}
                                    <div className={this.props.pricing?"col-12":"col-8"}>
                                        <ul className="list-unstyled ramification-route">
                                            {edi.routes.map((route, route_index)=>route.deleted?<input key={`company-${company_index}-edi-${edi_index}-route-${route_index}`} type="hidden" name={`companies[${company.id}][edis][${edi_index}][routes][${route_index}][deleted_id]`} value={route.id}/>:<li key={`company-${company_index}-edi-${edi_index}-route-${route_index}`}>
                                                <div className="row">
                                                    <div className="col-4">
                                                        <div className="alert d-flex justify-content-between p-2">
                                                            {(company.type=='air' || company.type=='water')?<Autocomplete onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.companies[company_index].edis[edi_index].routes[route_index].departure = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} readOnly={this.props.readOnly} value={route.departure.id>0?route.departure:null} placeholder={trans('Ajouter un aéroport de départ')} line={item=><span><strong>{item.iata}</strong> - {item.name} - {this.cast(item, 'country.nom')}</span>} param="q" endpoint={`/airports`} selection={item=><span><strong>{item.iata}</strong> - {item.name} - {this.cast(item, 'country.nom')}
                                                            <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][routes][${route_index}][from_id]`} value={item.id}/>
                                                            </span>} buttonClass="p-0"/>:<Autocomplete onChange={item=>{
                                                    this.setState(state=>{
                                                        state.customer.companies[company_index].edis[edi_index].routes[route_index].departure = item
                                                        if(this.refs.pricing)
                                                            this.refs.pricing.updateCustomer(state.customer)
                                                        return state
                                                    })
                                                }} readOnly={this.props.readOnly} value={this.cast(route, 'departure.id', -1)>0?route.departure:null} placeholder={trans('Ajouter une station de départ')} line={item=><strong>{item.iata}</strong>} param="q" endpoint={`/road_stations`} selection={item=><span><strong>{item.iata}</strong>
                                                        <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][routes][${route_index}][from_id]`} value={item.id}/>
                                                        </span>} buttonClass="p-0"/>}
                                                        </div>
                                                    </div>
                                                    <span className="edi-trait mt-3"></span>
                                                    <div className="col-4">
                                                        <div className="alert d-flex justify-content-between p-2">
                                                            {(company.type=='air' || company.type=='water')?<Autocomplete onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.companies[company_index].edis[edi_index].routes[route_index].arrival = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} readOnly={this.props.readOnly} value={route.arrival.id>0?route.arrival:null} placeholder={trans("Ajouter un aéroport d'arrivée")} line={item=><span><strong>{item.iata}</strong> - {item.name} - {this.cast(item, 'country.nom')}</span>} param="q" endpoint={`/airports`} selection={item=><span><strong>{item.iata}</strong> - {item.name} - {this.cast(item, 'country.nom')}
                                                            <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][routes][${route_index}][to_id]`} value={item.id}/>
                                                            </span>} buttonClass="p-0"/>:<Autocomplete onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.companies[company_index].edis[edi_index].routes[route_index].arrival = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} readOnly={this.props.readOnly} value={this.cast(route, 'arrival.id', -1)>0?route.arrival:null} placeholder={trans("Ajouter une station d'arrivée")} line={item=><strong>{item.precon}</strong>} param="q" endpoint={`/post_offices`} selection={item=><span><strong>{item.precon}</strong>
                                                        <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][routes][${route_index}][to_id]`} value={item.id}/>
                                                        </span>} buttonClass="p-0"/>}
                                                        </div>
                                                    </div>
                                                    {this.props.pricing?<React.Fragment>
                                                        <span className="edi-trait mt-3"></span>
                                                        <div className="col-md-2">
                                                            <div className="alert d-flex justify-content-between p-2">
                                                                <label className="m-0 text-uppercase">{trans('TVA')} : </label>
                                                                <input className="bg-transparent form-control h-auto p-0 w-50 text-center text-white" type="number" name={`companies[${company.id}][edis][${edi_index}][routes][${route_index}][nsetup][vat]`} value={this.cast(route, 'nsetup.vat')} onChange={e=>{
                                                                    const value = e.target.value
                                                                    this.setState(state=>{
                                                                        state.customer.companies[company_index].edis[edi_index].routes[route_index].nsetup.vat = value
                                                                        return state
                                                                    })
                                                                }}/>
                                                                %
                                                            </div>
                                                        </div>
                                                    </React.Fragment>:null}
                                                    <input type="hidden" name={`companies[${company.id}][edis][${edi_index}][routes][${route_index}][id]`} value={route.id}/>
                                                    {(!this.props.readOnly && edi.routes.filter(item=>!item.deleted).length>1)?<button className="btn position-absolute" type="button" onClick={()=>{
                                                        this.setState(state=>{
                                                            state.customer.companies[company_index].edis[edi_index].routes[route_index].deleted = true
                                                            return state
                                                        })
                                                    }} style={{right:24}}>
                                                        <i className="fa fa-trash-alt"></i>
                                                    </button>:null}
                                                </div>
                                                {this.props.pricing?<Pricing indexes={{company_index:company.id,edi_index,route_index}} store={this.props.store} setup={this.props.setup} ref="pricingform" data={route}/>:null}
                                            </li>)}
                                        </ul>
                                    </div>
                                </div>
                            </li>)}
                        </ul>
                    </li>)}
                </ul>
            </li>
        </ul>
    }

    updateCustomer(customer) {
        this.setState({
            customer
        })
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
                <Organisation pricing={true} readOnly={true} ref="pricing" data={{row:this.state.customer,currencies:this.props.data.currencies,default_currency:this.props.data.default_currency}} store={this.props.store} setup={this.props.data.pricing}/>
            </div>
        </React.Fragment>
    }
}

export default Modelizer(Organisation);