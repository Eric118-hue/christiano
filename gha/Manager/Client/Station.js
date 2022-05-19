import React, {Component} from 'react';
import NavigableModel from '../../../vendor/Ry/Core/NavigableModel';
import trans from '../../translations';
import $ from 'jquery';

class Station extends NavigableModel
{
    constructor(props) {
        super(props)
        this.index=0
        this.state.name_search = ''
        this.state.select_airports = []
        this.state.select_airport = false
        this.model = 'station'
        this.endpoint = `/stations?customer_id=${this.props.customerId}`
        this.handleSearch = this.handleSearch.bind(this)
        this.handleSelectAirport = this.handleSelectAirport.bind(this)
        this.removeAirport = this.removeAirport.bind(this)
        this.offClick = this.offClick.bind(this)
    }

    offClick() {
        this.setState({
            select_airport : false
        })
        $('body').off('click', this.offClick)
    }

    removeAirport(customer_airport) {
        if(this.props.customerId) {
            $.ajax({
                url : '/customer_airports',
                type : 'delete',
                data : {
                    airport_id : customer_airport.airport.id,
                    customer_id : this.props.customerId
                },
                success : ()=>{
                    this.setState(state=>{
                        state.data = state.data.filter(item=>item.airport.id!=customer_airport.airport.id)
                        return state
                    })
                }
            })
        }
        else {
            this.setState(state=>{
                state.data = state.data.filter(item=>item.airport.id!=customer_airport.airport.id)
                return state
            })
        }
    }

    handleSearch(event) {
        const value = event.target.value
        this.setState({
            name_search : value,
            airport : value!=this.state.name_search ? {
                id : 0
            } : this.state.airport,
            select_airport : this.state.select_airports.length>0
        })

        if(value.length<2)
            return

        if(this.searchx)
            this.searchx.abort()

        this.searchx = $.ajax({
            url : '/airports',
            data : {
                json : true,
                s : {
                    name : value,
                    iata : value
                }
            },
            success : response=>{
                if(response.data.data.length>0)
                    $('body').on('click', this.offClick)

                this.setState({
                    select_airports : response.data.data,
                    select_airport : response.data.data.length>0
                })
            }
        })
    }

    handleSelectAirport(event, airport) {
        event.preventDefault()
        this.setState(state=>{
            state.name_search = ''
            state.select_airports = []
            if(!state.data.find(item=>item.airport.id==airport.id)) {
                this.index++
                state.data.push({
                    airport : airport,
                    id : this.index
                })
                if(this.props.customerId) {
                    $.ajax({
                        url : '/customer_airports',
                        type : 'post',
                        data : {
                            airport_id : airport.id,
                            customer_id : this.props.customerId
                        }
                    })
                }
            }  
            state.select_airport = false
            return state
        })
    }

    searchEngine() {
        return <div className="card">
            <div className="card-header">
                {trans('Ajouter nouvelle station')}
            </div>
            <div className="body">
                <div className="form-group position-relative">
                    <label className="control-label">{trans('Nom / Code')}</label>
                    <input type="text" className="form-control" placeholder="Tapez le nom ou le code de l'aéroport" value={this.state.name_search} onChange={this.handleSearch} onClick={this.handleSearch} autoComplete="bistrict"/>
                    <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_airport?'show':''}`} style={{maxHeight:200}}>
                        {this.state.select_airports.map(airport=><a key={`select-airport-${airport.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectAirport(e, airport)}>{airport.name} ({airport.iata})</a>)}
                    </div>
                </div>
            </div>
        </div>
    }

    render() {
        let pagination = <ul className={`list-inline m-0 ${this.props.data.per_page>=this.props.data.total?'d-none':''}`}>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toFirst}><i className="fa fa-angle-double-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toPrevious}><i className="fa fa-angle-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toNext}><i className="fa fa-angle-right"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toEnd}><i className="fa fa-angle-double-right"></i></a>
            </li>
        </ul>

        return <div className="col-12">    
            {this.searchEngine()}        
            <div className="justify-content-between m-0 row">
                {this.beforelist()}
                {this.nopaginate?null:pagination}
            </div>
            <div className="row">
                {this.state.data.map((item, key)=><div key={`station-${item.id}`} className="col-md-3 mb-2">
                    <div className="row">
                        <i className="fa fa-check-circle text-success p-2"></i>
                        <div className="p-2 border rounded flex-fill">
                            {item.airport.name}
                            <input type="hidden" name="airports[]" value={item.airport.id}/>
                        </div>
                        <button type="button" className="btn" onClick={()=>this.removeAirport(item)}><i className="fa fa-times-circle text-danger"></i></button>
                    </div>
                </div>)}
            </div>
            <div className="justify-content-between m-0 row">
                {this.afterlist()}
                {this.nopaginate?null:pagination}
            </div>
        </div>
    }
}

export default Station