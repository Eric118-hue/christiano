import React, {Component} from 'react';
import numeral from 'numeral';
import {Datepicker} from 'ryvendor/bs/bootstrap';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import moment from 'moment';
import $ from 'jquery';
import {PricingRow, PricingTable} from './Pricing';

class RoadPricingRow extends PricingRow
{
    render() {
        return <tr ref="line">
            <th className={`border p-0 ${this.state.invalid?'bg-danger text-light':'bg-light'}`}>{this.props.row.title}</th>
            {this.props.setup.columns.map(column=><td className="p-0 border" key={`row-${this.props.row.id}-column-${column.id}`}>
                {this.props.readOnly?(this.state[column.id]?numeral(parseFloat(this.state[column.id])).format('0.00$'):''):<input type="number" name={`transporters[${this.props.indexes.transporter_index}][edis][${this.props.indexes.edi_index}][routes][${this.props.indexes.route_index}][prices][${this.props.row.category.id}][${this.props.row.class.id}][${column.id}]`} onChange={e=>this.handleChange(e, column)} value={this.state[column.id]?this.state[column.id]:''} className="w-100 text-center border-0" step="0.001" min="0"/>}
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

class RoadPricingTable extends PricingTable
{
    render() {
        return <div className="my-2" id={`timeline-root${this.props.data.id}`}>
            <div className={`border ${this.props.className} justify-content-between m-0 p-1 pl-3 rounded row`} style={{maxWidth:750}}>
                <div className="col">
                    <div className="align-items-center h-100 m-0 row">
                        <label className="control-label mr-2 mb-0">{trans('Date de validité du tarif')} : </label>
                        <span className="text-info text-capitalize"> {trans('du')} </span>
                        {this.props.readOnly?<div className="col-md-4 text-center">{this.models("props.data.save_at", false)?moment(this.props.data.save_at).format('DD/MM/YYYY'):'n/a'}</div>:<Datepicker name={`transporters[${this.props.indexes.transporter_index}][edis][${this.props.indexes.edi_index}][routes][${this.props.indexes.route_index}][save_at]`}  defaultValue={this.models("props.data.save_at", "")} className="col-md-4" inputProps={{required:true}}/>}
                        <span className="text-info"> {trans('au')} </span>
                        {this.props.readOnly?<div className="col-md-4 text-center">{this.models("props.data.delete_at", false)?moment(this.props.data.delete_at).format('DD/MM/YYYY'):'n/a'}</div>:<Datepicker className="col-md-4" name={`transporters[${this.props.indexes.transporter_index}][edis][${this.props.indexes.edi_index}][routes][${this.props.indexes.route_index}][delete_at]`} defaultValue={this.models("props.data.delete_at", "")} inputProps={{required:true}}/>}
                    </div>
                </div>
                {this.props.readOnly?<button className={`btn btn-blue ${this.state.collapsed?'collapsed':''}`} type="button" data-toggle="collapse" data-target={`#timeline${this.props.data.id}`} aria-expanded="true" aria-controls={`timeline${this.props.data.id}`}>
                    <i className={`fa fa-caret-down`}></i>
                </button>:null}
            </div>
            <div id={`timeline${this.props.data.id}`} className={`${this.props.readOnly?'collapse':''} ${this.props.data.active?'show':''} my-2`} data-parent={`#timeline-root${this.props.data.id}`} ref="table_container">
                <table className="table table-centerall border-right border-bottom" style={{maxWidth: 107*(this.props.setup.columns.length+3)}}>
                    <tbody>
                        <tr className="border-top-0">
                            <th width="100" className="p-0 border-right border-top-0"></th>
                            {this.props.setup.columns.map(column=><th className="text-uppercase border-right p-0 bg-light" key={`column-${column.id}`} width="100">{column.title}</th>)}
                            <th width="100" className="text-uppercase p-0  bg-light border-right">{trans('Total HT')}</th>
                            <th width="100" className="text-uppercase p-0  bg-light">{trans('Total TTC')}</th>
                        </tr>
                        {this.props.setup.rows.map(row=><RoadPricingRow ref={`pricingrow${row.id}`} readOnly={this.props.readOnly} row={row} indexes={this.props.indexes} key={`row-${row.id}`} setup={this.props.setup} store={this.props.store} data={this.models(`props.data.nrates.${row.category.id}.${row.class.id}`)} vat={this.props.vat}/>)}
                    </tbody>
                </table>
            </div>
        </div>
    }
}

class Pricing extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            show_form : false
        }
        this.validate = this.validate.bind(this)
    }

    componentDidMount() {
        $(this.refs.newtimeline).on('show.bs.collapse', ()=>{
            this.setState({
                show_form : true
            })
        })
        $(this.refs.newtimeline).on('hide.bs.collapse', ()=>{
            this.setState({
                show_form : false
            })
        })
    }

    validate() {
        return this.refs.pricingtable.validate()
    }

    render() {
        return <div className="mb-5" id={`pricing${this.props.data.id}`} style={{maxWidth:750}}>
            <div className="border bg-light rounded">
                <div className="align-items-center justify-content-between m-0 p-1 pl-3 row">
                    <strong>{trans('Historique des tarifs pour la route')} {this.models('props.data.departure.iata')} - {this.models('props.data.arrival.precon')}</strong>
                    <button className={`btn btn-blue`} type="button" data-toggle="collapse" data-target={`#timelines${this.props.data.id}`} aria-expanded="true" aria-controls={`timelines${this.props.data.id}`}>
                        <i className={`fa fa-caret-down`}></i>
                    </button>
                </div>
            </div>
            <div id={`timelines${this.props.data.id}`} className="collapse" data-parent={`#pricing${this.props.data.id}`}>
                {this.models('props.data.nrates', []).filter(it=>!it.active).map(timeline=><RoadPricingTable className="border-orange" key={`timeline-${timeline.id}`} data={timeline} indexes={this.props.indexes} setup={this.props.setup} readOnly={true} vat={this.models("props.data.nsetup.vat", 0)}/>)}
            </div>
            <hr/>
            {this.models('props.data.nrates', []).filter(it=>it.active).map(timeline=><RoadPricingTable key={`timeline-${timeline.id}`} className="border-success" data={timeline} indexes={this.props.indexes} setup={this.props.setup} readOnly={true} vat={this.models("props.data.nsetup.vat", 0)}/>)}
            <div className="border bg-light rounded">
                <div className="align-items-center justify-content-between m-0 p-1 pl-3 row">
                    <strong>{trans('Ajouter un tarif sur une autre période')}</strong>
                    <button className="btn btn-danger" type="button" data-toggle="collapse" data-target={`#newtimeline${this.props.data.id}`} aria-expanded="true" aria-controls={`newtimeline${this.props.data.id}`}>
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
            </div>
            <div id={`newtimeline${this.props.data.id}`} ref="newtimeline" className="collapse">
                <RoadPricingTable ref="pricingtable" className="border-orange" data={{}} indexes={this.props.indexes} setup={this.props.setup} vat={this.models("props.data.nsetup.vat", 0)}/>
            </div>
        </div>
    }
}

export default Modelizer(Pricing)