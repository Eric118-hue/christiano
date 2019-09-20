import React, {Component} from 'react';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import './Organisation.scss';
import trans from '../../translations';
import $ from 'jquery';
import numeral from 'numeral';
import {Datepicker} from '../../../vendor/bs/bootstrap';

const CUSTOMER_TYPES = {
    airline : trans('Compagnie aérienne'),
    gsa : trans('GSA')
}

class PricingRow extends Component
{
    constructor(props) {
        super(props)
        let prices = {
            total : 0
        }
        this.props.setup.columns.map(column=>{
            prices[column.id] = this.props.data[column.id]
            prices.total += prices[column.id] ? parseFloat(prices[column.id]) : 0
        })
        this.state = prices
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event, column) {
        const value = event.target.value
        this.setState(state=>{
            state[column.id] = value
            let total = 0
            this.props.setup.columns.map(item=>{
                total += state[item.id]?parseFloat(state[item.id]):0
            })
            state.total = total
            return state
        })
    }

    render() {
        return <tr>
            <th className="border p-0 bg-light">{this.props.row.title}</th>
            {this.props.setup.columns.map(column=><td className="p-0 border" key={`row-${this.props.row.id}-column-${column.id}`}>
                <input type="number" name={`airlines[${this.props.indexes.airline_index}][edis][${this.props.indexes.edi_index}][routes][${this.props.indexes.route_index}][prices][${this.props.row.category.id}][${this.props.row.class.id}][${column.id}]`} onChange={e=>this.handleChange(e, column)} value={this.state[column.id]?this.state[column.id]:''} className="w-100 text-center border-0" step="0.001" min="0"/>
            </td>)}
            <th className="p-0 bg-light border-right">
                {this.state.total>0?numeral(this.state.total).format('0.00$'):''}
            </th>
            <th className="p-0 bg-light">
                {this.state.total>0?numeral(this.state.total*(1+parseFloat(this.props.vat)/100)).format('0.00$'):''}
            </th>
        </tr>
    }
}

class Pricing extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            start_date : this.props.data.start_date,
            end_date : this.props.data.end_date
        }
    }

    render() {
        return <div className="mb-5">
            <table className="table table-centerall border-right border-bottom" style={{maxWidth: 100*(this.props.setup.columns.length+3)}}>
                <tbody>
                    <tr className="border-top-0">
                        <th width="100" className="p-0 border-right border-top-0"></th>
                        {this.props.setup.columns.map(column=><th className="text-uppercase border-right p-0 bg-light" key={`column-${column.id}`} width="100">{column.title}</th>)}
                        <th width="100" className="text-uppercase p-0  bg-light border-right">{trans('total HT')}</th>
                        <th width="100" className="text-uppercase p-0  bg-light">{trans('total TTC')}</th>
                    </tr>
                    {this.props.setup.rows.map(row=><PricingRow row={row} indexes={this.props.indexes} key={`row-${row.id}`} setup={this.props.setup} store={this.props.store} data={this.models(`props.data.nrates.${row.category.id}.${row.class.id}`)} vat={this.models("props.data.nsetup.vat", 0)}/>)}
                </tbody>
            </table>
            <div className="row align-items-baseline">
                <label className="control-label mr-2">{trans('Date de validité du tarif')} : </label>
                <span className="text-info text-capitalize"> {trans('du')} </span>
                <Datepicker name={`airlines[${this.props.indexes.airline_index}][edis][${this.props.indexes.edi_index}][routes][${this.props.indexes.route_index}][nsetup][pricing][start_date]`}  defaultValue={this.models("props.data.nsetup.pricing.start_date", "")} className="col-md-3"/>
                <span className="text-info"> {trans('au')} </span>
                <Datepicker className="col-md-3" name={`airlines[${this.props.indexes.airline_index}][edis][${this.props.indexes.edi_index}][routes][${this.props.indexes.route_index}][nsetup][pricing][end_date]`} defaultValue={this.models("props.data.nsetup.pricing.end_date", "")}/>
            </div>
        </div>
    }
}

Modelizer(Pricing)

class Autocomplete extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            search : '',
            show : false,
            items : [],
            selection : this.props.value
        }
        this.handleSelection = this.handleSelection.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState({
            show : !this.state.show
        })
    }

    handleSelection(event, item) {
        event.preventDefault()
        this.setState({
            search : '',
            show : false,
            selection : item
        })
        if(this.props.onChange) {
            this.props.onChange(item)
        }
        return false
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.props.readOnly)
            this.refs.input.focus()
        if(this.models('props.value.id', false) && this.cast(prevProps, 'value.id')!=this.models('props.value.id')) {
            this.setState({
                selection : this.props.value
            })
        }
    }

    handleSearch(event) {
        const value = event.target.value
        this.setState({
            search : value
        })

        if(value.length>1) {
            if(this.ax) {
                this.ax.abort()
            }
            let data = {
                json : true
            }
            data[this.props.param?this.props.param:'q'] = value
            this.ax = $.ajax({
                url : this.props.endpoint,
                data : data,
                success : response=>{
                    if(response.data && 'data' in response.data) {
                        this.setState({
                            show : true,
                            items : response.data.data
                        })
                    }
                    else {
                        this.setState({
                            show : true,
                            items : response
                        })
                    }
                }
            })
        }
    }

    render() {
        return <React.Fragment>
            {this.state.selection?this.props.selection(this.state.selection):<span onClick={this.toggle} className="mouse-pointable">{this.props.placeholder}<input type="hidden" value="" required/></span>}
            {this.props.readOnly?null:<React.Fragment>
                <button className={`btn ${this.props.buttonClass} ${this.state.show?'btn-outline-dark':''}`} type="button" onClick={this.toggle}><i className="fa fa-pencil-alt text-body"></i></button>
                <div className={`dropdown-menu w-100 ${this.state.show?'show':''}`}>
                    <div className="form-group pl-2 pr-2">
                        <input type="text" ref="input" className="form-control" placeholder={this.props.placeholder} value={this.state.search} onChange={this.handleSearch}/>
                    </div>
                    <div className="overflow-auto" style={{maxHeight:200}}>
                        {this.state.items.map(item=><a key={`${this.id}-${item.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelection(e, item)}>{this.props.line(item)}</a>)}
                    </div>
                </div>
            </React.Fragment>}
        </React.Fragment>
    }
}

Modelizer(Autocomplete)

class Organisation extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            customer : {
                type : this.models('props.data.row.type'),
                facturable : this.models('props.data.row.facturable')
            }
        }
        this.addAirline = this.addAirline.bind(this)
        this.addEdi = this.addEdi.bind(this)
        this.addAgent = this.addAgent.bind(this)
        this.addRoute = this.addRoute.bind(this)
        this.validate = this.validate.bind(this)
        this.updateCustomer = this.updateCustomer.bind(this)
    }

    addRoute(airline_index, edi_index) {
        this.setState(state=>{
            state.customer.facturable.airlines[airline_index].edis[edi_index].routes.push({
                departure : {},
                arrival : {}
            })
            return state
        })
    }

    addAgent(airline_index, edi_index) {
        this.setState(state=>{
            state.customer.facturable.airlines[airline_index].edis[edi_index].agents.push({})
            return state
        })
    }

    addAirline() {
        this.setState(state=>{
            state.customer.facturable.airlines.push({
                edis : [{
                    departure : {},
                    airline : {},
                    agents : [{

                    }],
                    routes : [{
                        departure : {},
                        arrival : {},
                        nsetup : {}
                    }]
                }]
            })
            return state
        })
    }

    addEdi(airline_index) {
        this.setState(state=>{
            state.customer.facturable.airlines[airline_index].edis.push({
                departure : {},
                airline : {
                    id: state.customer.facturable.airlines[airline_index].id,
                    iata_code: state.customer.facturable.airlines[airline_index].iata_code,
                    icao_code: state.customer.facturable.airlines[airline_index].icao_code,
                    edi_code: state.customer.facturable.airlines[airline_index].edi_code,
                    name: state.customer.facturable.airlines[airline_index].name
                },
                agents : [{

                }],
                routes : [{
                    departure : {},
                    arrival : {},
                    nsetup : {}
                }]
            })
            return state
        })
    }

    componentDidMount() {
        if(this.state.customer.facturable.airlines.length==0 && !this.props.readOnly && !this.props.pricing)
            this.addAirline()
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
        return errors
    }

    tree() {
        return <ul className="list-unstyled">
            <li className="ramification-client">
                <div className="alert w-50 font-24">
                    {CUSTOMER_TYPES[this.state.customer.type]} : {this.state.customer.facturable.name}
                </div>
                <ul className="list-unstyled ramification-airline" ref="organisation">
                    {this.state.customer.facturable.airlines.map((airline, airline_index)=>airline.deleted?<input key={`airline-${airline_index}`} type="hidden" name={`deleted_airlines[${airline_index}][id]`} value={airline.id}/>:<li key={`airline-${airline_index}`}>
                        <div className="row">
                            <div className="col">
                                <div className="alert font-24 d-flex justify-content-between">
                                    <Autocomplete onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.facturable.airlines[airline_index].id = item.id
                                                    state.customer.facturable.airlines[airline_index].name = item.name
                                                    state.customer.facturable.airlines[airline_index].icao_code = item.icao_code
                                                    state.customer.facturable.airlines[airline_index].iata_code = item.iata_code
                                                    state.customer.facturable.airlines[airline_index].adresse = item.adresse
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} readOnly={this.props.readOnly} value={airline.id>0?airline:null} placeholder={trans('Ajouter une compagnie aérienne')} endpoint={`/airlines`} line={item=>item.name} selection={item=><span>{item.icao_code} / {item.iata_code} = {item.name} ({this.cast(item, 'adresse.ville.country.nom')})
                                        <input type="hidden" name={`airlines[${airline_index}][id]`} value={item.id}/>
                                    </span>} param="q"/>
                                </div>
                            </div>
                            {(!this.props.readOnly &&  this.state.customer.facturable.airlines.filter(item=>!item.deleted).length>1)?<button className="btn" type="button" onClick={()=>{
                                this.setState(state=>{
                                    state.customer.facturable.airlines[airline_index].deleted = true
                                    return state
                                })
                            }} type="button">
                                <i className="fa fa-trash-alt"></i>
                            </button>:null}
                        </div>

                        
                        <ul className="list-unstyled ramification-edi">
                            {airline.edis.map((edi, edi_index)=>edi.deleted?<input key={`airline-${airline_index}-edi-${edi_index}`} type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][deleted_id]`} value={edi.id}/>:<li key={`airline-${airline_index}-edi-${edi_index}`}>
                                <div className="row">
                                    <div className="col-3">
                                        <div className="alert d-flex justify-content-between p-2">
                                            <Autocomplete readOnly={this.props.readOnly} onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.facturable.airlines[airline_index].edis[edi_index].departure = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} value={this.cast(edi, 'departure.id', -1)>0?edi.departure:null} param="s" placeholder={trans("Ajouter la poste d'origine")} endpoint={`/edis`} line={item=>`${item.edi_address} (${item.network})`} selection={item=><span>
                                                <strong>{item.edi_address}</strong> ({item.network} - L160)
                                                <input type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][from_id]`} value={item.id}/>
                                            </span>} buttonClass="p-0"/>
                                        </div>
                                    </div>
                                    <span className="edi-trait mt-3"></span>
                                    <div className="col-3">
                                        <div className="alert d-flex justify-content-between p-2">
                                            <Autocomplete onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.facturable.airlines[airline_index].edis[edi_index].airline = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} readOnly={this.props.readOnly} value={edi.airline.id>0?edi.airline:null} param="q" placeholder={trans("Ajouter la compagnie aérienne")} endpoint={`/airlines?with[]=edi_code`} line={item=>`${item.edi_code}`} selection={item=><span>
                                                <strong>{item.edi_code}</strong>
                                                <input type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][to_id]`} value={item.id}/>
                                            </span> } buttonClass="p-0"/>
                                        </div>
                                    </div>
                                    <input type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][id]`} value={edi.id}/>
                                    {(!this.props.readOnly && airline.edis.filter(item=>!item.deleted).length>1)?<button className="btn" onClick={()=>{
                                        this.setState(state=>{
                                            state.customer.facturable.airlines[airline_index].edis[edi_index].deleted = true
                                            return state
                                        })
                                    }} type="button" style={{right:24}}>
                                        <i className="fa fa-trash-alt"></i>
                                    </button>:null}
                                </div>
                                <div className="row">
                                    {this.props.pricing?null:<div className="col-4">
                                        <ul className="list-unstyled ramification-agent">
                                            {edi.agents.map((agent, agent_index)=>agent.deleted?<input key={`airline-${airline_index}-edi-${edi_index}-agent-${agent_index}`} type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][agents][${agent_index}][deleted_id]`} value={agent.id}/>:<li key={`airline-${airline_index}-edi-${edi_index}-agent-${agent_index}`} className="pb-2">
                                                <div className="alert d-flex justify-content-between mb-0 p-2">
                                                    <Autocomplete onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.facturable.airlines[airline_index].edis[edi_index].agents[agent_index] = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} readOnly={this.props.readOnly} value={agent.id>0?agent:null} param="s" placeholder={trans('Ajouter un agent')} endpoint={`/agents?edi_id=${this.cast(edi, 'departure.id')}`} line={item=>`${item.name} (${item.airport.iata})`} selection={item=><div>
                                                        <i className="fa fa-user"></i> Agent <strong>{item.airport.iata}</strong>
                                                        <br/>
                                                        <span className="text-body">
                                                            {item.profile.gender_label} {item.name}
                                                        </span>
                                                        <input type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][agents][${agent_index}][id]`} value={item.id}/>
                                                    </div>} buttonClass="p-0"/>
                                                </div>
                                                {(!this.props.readOnly &&  edi.agents.filter(item=>!item.deleted).length>1)?<button className="btn position-absolute" type="button" onClick={()=>{
                                                    this.setState(state=>{
                                                        state.customer.facturable.airlines[airline_index].edis[edi_index].agents[agent_index].deleted = true
                                                        return state
                                                    })
                                                }} style={{right:-40,top:0,zIndex:100}}>
                                                        <i className="fa fa-trash-alt"></i>
                                                </button>:null}
                                            </li>)}
                                            {this.props.readOnly?null:<li>
                                                <button className="p-0 border-0 font-24 btn-add focus-outline-hidden" type="button" onClick={()=>this.addAgent(airline_index, edi_index)}><i className="fa fa-plus-circle"></i></button>
                                            </li>}
                                        </ul>
                                    </div>}
                                    <div className={this.props.pricing?"col-12":"col-8"}>
                                        <ul className="list-unstyled ramification-route">
                                            {edi.routes.map((route, route_index)=>route.deleted?<input key={`airline-${airline_index}-edi-${edi_index}-route-${route_index}`} type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][routes][${route_index}][deleted_id]`} value={route.id}/>:<li key={`airline-${airline_index}-edi-${edi_index}-route-${route_index}`}>
                                                <div className="row">
                                                    <div className="col-4">
                                                        <div className="alert d-flex justify-content-between p-2">
                                                            <Autocomplete onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.facturable.airlines[airline_index].edis[edi_index].routes[route_index].departure = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} readOnly={this.props.readOnly} value={route.departure.id>0?route.departure:null} placeholder={trans('Ajouter un aéroport de départ')} line={item=><span><strong>{item.iata}</strong> - {item.name} - {this.cast(item, 'country.nom')}</span>} param="q" endpoint={`/airports`} selection={item=><span><strong>{item.iata}</strong> - {item.name} - {this.cast(item, 'country.nom')}
                                                            <input type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][routes][${route_index}][from_id]`} value={item.id}/>
                                                            </span>} buttonClass="p-0"/>
                                                        </div>
                                                    </div>
                                                    <span className="edi-trait mt-3"></span>
                                                    <div className="col-4">
                                                        <div className="alert d-flex justify-content-between p-2">
                                                            <Autocomplete onChange={item=>{
                                                this.setState(state=>{
                                                    state.customer.facturable.airlines[airline_index].edis[edi_index].routes[route_index].arrival = item
                                                    if(this.refs.pricing)
                                                        this.refs.pricing.updateCustomer(state.customer)
                                                    return state
                                                })
                                            }} readOnly={this.props.readOnly} value={route.arrival.id>0?route.arrival:null} placeholder={trans("Ajouter un aéroport d'arrivée")} line={item=><span><strong>{item.iata}</strong> - {item.name} - {this.cast(item, 'country.nom')}</span>} param="q" endpoint={`/airports`} selection={item=><span><strong>{item.iata}</strong> - {item.name} - {this.cast(item, 'country.nom')}
                                                            <input type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][routes][${route_index}][to_id]`} value={item.id}/>
                                                            </span>} buttonClass="p-0"/>
                                                        </div>
                                                    </div>
                                                    {this.props.pricing?<React.Fragment>
                                                        <span className="edi-trait mt-3"></span>
                                                        <div className="col-md-2">
                                                            <div className="alert d-flex justify-content-between p-2">
                                                                <label className="m-0 text-uppercase">{trans('tva')} : </label>
                                                                <input className="bg-transparent form-control h-auto p-0 w-50 text-center text-white" type="number" name={`airlines[${airline_index}][edis][${edi_index}][routes][${route_index}][nsetup][vat]`} value={this.cast(route, 'nsetup.vat')} onChange={e=>{
                                                                    const value = e.target.value
                                                                    this.setState(state=>{
                                                                        state.customer.facturable.airlines[airline_index].edis[edi_index].routes[route_index].nsetup.vat = value
                                                                        return state
                                                                    })
                                                                }}/>
                                                                %
                                                            </div>
                                                        </div>
                                                    </React.Fragment>:null}
                                                    <input type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][routes][${route_index}][id]`} value={route.id}/>
                                                    {(!this.props.readOnly && edi.routes.filter(item=>!item.deleted).length>1)?<button className="btn position-absolute" type="button" onClick={()=>{
                                                        this.setState(state=>{
                                                            state.customer.facturable.airlines[airline_index].edis[edi_index].routes[route_index].deleted = true
                                                            return state
                                                        })
                                                    }} style={{right:24}}>
                                                        <i className="fa fa-trash-alt"></i>
                                                    </button>:null}
                                                </div>
                                                {this.props.pricing?<Pricing indexes={{airline_index,edi_index,route_index}} store={this.props.store} setup={this.props.setup} data={route}/>:null}
                                            </li>)}
                                            {this.props.readOnly?null:<li>
                                                <button type="button" className="p-0 border-0 font-24 btn-add focus-outline-hidden" onClick={()=>this.addRoute(airline_index, edi_index)}><i className="fa fa-plus-circle"></i></button>
                                            </li>}
                                        </ul>
                                    </div>
                                </div>
                            </li>)}
                            {this.props.readOnly?null:<li>
                                <button className="p-0 border-0 font-24 btn-add focus-outline-hidden" type="button" onClick={()=>this.addEdi(airline_index)}><i className="fa fa-plus-circle"></i></button>
                            </li>}
                        </ul>
                    </li>)}
                    {(this.props.data.row.type=='airline'||this.props.readOnly)?null:<li>
                        <button className="p-0 border-0 font-24 btn-add focus-outline-hidden" type="button" onClick={this.addAirline}><i className="fa fa-plus-circle"></i></button>
                    </li>}
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
            <div className={`tab-pane`}
            id={`organisation`} role="tabpanel" aria-labelledby="organisation-tab">
                {this.tree()}
            </div>
            <div className={`tab-pane`}
            id={`pricing`} role="tabpanel" aria-labelledby="pricing-tab">
                <Organisation pricing={true} readOnly={true} ref="pricing" data={{row:this.state.customer}} store={this.props.store} setup={this.props.data.pricing}/>
            </div>
        </React.Fragment>
    }
}

export default Modelizer(Organisation);