import React, {Component} from 'react';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import './Organisation.scss';
import trans from '../../translations';
import $ from 'jquery';

const CUSTOMER_TYPES = {
    airline : trans('Compagnie aérienne'),
    gsa : trans('GSA')
}

class Autocomplete extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            search : '',
            show : false,
            items : []
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
        this.setState({
            search : '',
            show : false,
            selection : item
        })
    }

    componentDidUpdate() {
        this.refs.input.focus()
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
            {this.state.selection?this.props.selection(this.state.selection):<span></span>}
            <button className={`btn ${this.props.buttonClass}`} type="button" onClick={this.toggle}><i className="fa fa-pencil-alt text-body"></i></button>
            <div className={`dropdown-menu w-100 ${this.state.show?'show':''}`}>
                <div className="form-group pl-2 pr-2">
                    <input type="text" ref="input" className="form-control" placeholder={this.props.placeholder} value={this.state.search} onChange={this.handleSearch}/>
                </div>
                <div className="overflow-auto" style={{maxHeight:200}}>
                    {this.state.items.map(item=><a key={`${this.id}-${item.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelection(e, item)}>{this.props.line(item)}</a>)}
                </div>
            </div>
        </React.Fragment>
    }
}

class Organisation extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            customer : {
                type : this.models('props.data.row.type'),
                facturable : {
                    name : this.models('props.data.row.facturable.name'),
                    airlines : this.props.data.row.type=='gsa' ? this.models('props.data.row.facturable.airlines', [{
                        edis : [{
                            agents : []
                        }]
                    }]) : [this.props.data.row.facturable]
                }
            }
        }
        this.addAirline = this.addAirline.bind(this)
        this.addEdi = this.addEdi.bind(this)
        this.addAgent = this.addAgent.bind(this)
    }

    addAgent(airline, edi) {
        this.setState(state=>{
            let a = state.customer.facturable.airlines.find(item=>item.id==airline.id)
            if(a) {
                let e = a.edis.find(item=>item.id==edi.id)
                if(e) {
                    e.agents.push({})
                }
            }
            return state
        })
    }

    addAirline() {
        this.setState(state=>{
            state.customer.facturable.airlines.push({
                edis : [{
                    id : 'new'+(state.customer.facturable.airlines.length+1),
                    agents : []
                }]
            })
            return state
        })
    }

    addEdi(airline) {
        this.setState(state=>{
            let a = state.customer.facturable.airlines.find(item=>item.id==airline.id)
            if(a) {
                a.edis.push({
                    id : 'new'+(a.edis.length+1),
                    agents : []
                })
            }
            return state
        })
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

    render() {
        return <ul className="list-unstyled">
            <li className="ramification-client">
                <div className="alert w-50 font-24">
                    {CUSTOMER_TYPES[this.state.customer.type]} : {this.state.customer.facturable.name}
                </div>
                <ul className="list-unstyled ramification-airline">
                    {this.state.customer.facturable.airlines.map((airline, airline_index)=><li key={`airline-${airline.id}`}>
                        <div className="alert w-50 font-24 d-flex justify-content-between">
                            <Autocomplete placeholder={trans('Rechercher')} endpoint={`/airlines`} line={item=>item.name} selection={item=><span>{item.icao_code} / {item.iata_code} = {item.name} ({this.cast(item, 'adresse.ville.country.nom')})
                                <input type="hidden" name={`airline[id]`} value={item.id}/>
                            </span>} param="q"/>
                        </div>
                        <ul className="list-unstyled ramification-edi">
                            {airline.edis.map((edi, edi_index)=><li key={`airline-${airline.id}-edi-${edi_index}`}>
                                <div className="row">
                                    <div className="col-2">
                                        <div className="alert d-flex justify-content-between p-2">
                                            <Autocomplete param="s" placeholder={trans('Rechercher')} endpoint={`/edis`} line={item=>`${item.edi_address} (${item.network})`} selection={item=><span>
                                                <strong>{item.edi_address}</strong> ({item.network} - L160)
                                                <input type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][from_id]`} value={item.id}/>
                                            </span> } buttonClass="p-0"/>
                                        </div>
                                    </div>
                                    <span className="edi-trait mt-3"></span>
                                    <div className="col-2">
                                        <div className="alert d-flex justify-content-between p-2">
                                            <Autocomplete param="s" placeholder={trans('Rechercher')} endpoint={`/edis`} line={item=>`${item.edi_address} (${item.network})`} selection={item=><span>
                                                <strong>{item.edi_address}</strong> ({item.network} - L160)
                                                <input type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][to_id]`} value={item.id}/>
                                            </span> } buttonClass="p-0"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3">
                                        <ul className="list-unstyled ramification-agent">
                                            {edi.agents.map((agent, agent_index)=><li key={`airline-${airline.id}-edi-${edi.id}-agent-${agent.id}`}>
                                                <div className="alert d-flex justify-content-between mb-0">
                                                    <Autocomplete param="s" placeholder={trans('Rechercher')} endpoint={`/agents`} line={item=>`${item.name} (${item.airport.iata})`} selection={item=><div>
                                                        <i className="fa fa-user"></i> Agent <strong>{item.airport.iata}</strong>
                                                        <br/>
                                                        <span className="text-body">
                                                            {item.profile.gender_label} {item.name}
                                                        </span>
                                                        <input type="hidden" name={`airlines[${airline_index}][edis][${edi_index}][agents][${agent_index}][id]`} value={item.id}/>
                                                    </div>} buttonClass="p-0"/>
                                                </div>
                                            </li>)}
                                            <li>
                                                <button className="p-0 border-0 font-24 btn-add" type="button" onClick={()=>this.addAgent(airline, edi)}><i className="fa fa-plus-circle"></i></button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-9">
                                        <ul className="list-unstyled ramification-route">
                                            <li>
                                                <div className="row">
                                                    <div className="col-5">
                                                        <div className="alert d-flex justify-content-between p-2">
                                                            <span><strong>CDG</strong> - CHARLES DE GAULLE - France</span> 
                                                            <button className="btn p-0"><i className="fa fa-pencil-alt text-body"></i></button>
                                                        </div>
                                                    </div>
                                                    <span className="edi-trait mt-3"></span>
                                                    <div className="col-5">
                                                        <div className="alert d-flex justify-content-between p-2">
                                                            <span><strong>LIS</strong> - PORTELA - Portugal</span> 
                                                            <button className="btn p-0"><i className="fa fa-pencil-alt text-body"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <button className="p-0 border-0 font-24 btn-add"><i className="fa fa-plus-circle"></i></button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>)}
                            <li>
                                <button className="p-0 border-0 font-24 btn-add" type="button" onClick={()=>this.addEdi(airline)}><i className="fa fa-plus-circle"></i></button>
                            </li>
                        </ul>
                    </li>)}
                    <li>
                        <button className="p-0 border-0 font-24 btn-add" type="button" onClick={this.addAirline}><i className="fa fa-plus-circle"></i></button>
                    </li>
                </ul>
            </li>
        </ul>
    }
}

export default Modelizer(Organisation);