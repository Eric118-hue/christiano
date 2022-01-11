import React, {Component} from 'react';
import trans from 'ryapp/translations';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import numeral from 'numeral';
import moment from 'moment';
import $ from 'jquery';

class Dashboard extends Component
{
    constructor(props) {
        super(props)
        this.total = 0
        this.totals = {}
        this.getValue = this.getValue.bind(this)
        this.getTotal = this.getTotal.bind(this)
        this.handleYearChange = this.handleYearChange.bind(this)
        this.search_form = React.createRef()
        this.state = {
            q : this.models('props.data.q')
        }
    }

    handleYearChange(e) {
        $(this.search_form.current).submit()
    }

    getTotalCommission(customer, company) {
        let value = 0;
        customer.carts.map(cart=>{
            if(company.ntype=='air' && company.company_id==cart.nsetup.airline_id) {
                value += cart.total_commissions
            }
            else if(company.ntype=='water' && company.company_id==cart.nsetup.shippingco_id) {
                value += cart.total_commissions
            }
            else if(company.ntype=='land' && company.company_id==cart.nsetup.transporter_id) {
                value += cart.total_commissions
            }
        })
        this.total += parseFloat(value)
        return numeral(value).format('0,0.00$')
    }

    getValue(customer, company, month) {
        let cart;
        let value = 0;
        if(company.ntype=='air') {
            cart = customer.carts.find(it=>it.month==month&&it.nsetup.airline_id==company.company_id)
            if(cart) {
                value = cart.total_commissions
            }
        }
        else if(company.ntype=='water') {
            cart = customer.carts.find(it=>it.month==month&&it.nsetup.shippingco_id==company.company_id)
            if(cart) {
                value = cart.total_commissions
            }
        }
        else if(company.ntype=='land') {
            cart = customer.carts.find(it=>it.month==month&&it.nsetup.transporter_id==company.company_id)
            if(cart) {
                value = cart.total_commissions
            }
        }
        if(!(month in this.totals)) {
            this.totals[month] = 0
        }
        this.totals[month] += parseFloat(value)
        return numeral(value).format('0,0.00$')
    }

    getTotal(month) {
        return numeral(month in this.totals ? this.totals[month] : 0).format('0,0.00$')
    }



    render() {
        let total_commission = 0
        let total_membership = 0
        this.models('props.data.data.data', []).map(customer=>customer.companies.map(company=>{
            total_commission += parseFloat(this.cast(company, 'nsetup.commission.value', 0))
            total_membership += parseFloat(this.cast(company, 'nsetup.membership.value', 0))
        }))
        let months = []
        for(let i=1; i<=12; i++) {
            months.push(numeral(i).format('00'))
        }
        let years = []
        for(var i=moment().year();i>=2019;i--){
            years.push(i)                                   
        }
        return <div className='col-12'>
            <form className='align-items-baseline' ref={this.search_form} method="GET" action="/">
                <div className='form-group form-inline'>
                    <label className="control-label col-1">{trans('Année')}</label>
                    <select name="year" onChange={this.handleYearChange} className="form-control col-2" defaultValue={this.state.q.year}>
                        {years.map(year=><option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
            </form>
            <div className="card">
                <div className="card-body overflow-auto">
                    <table className='table table-bordered table-striped' style={{maxWidth:480}}>
                        <thead>
                            <tr>
                                <th>{trans('Nom de la compagnie')}</th>
                                <th className='text-center'>{trans('Com./Kg')}</th>
                                {months.map((month, index)=><th className='text-center' key={`month${index}`}>{moment().month(index).format('MMM')}</th>)}
                                <th className='text-center'>{trans('Total annuel')}</th>
                                <th className='text-center'>{trans('Abo./mois')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.models('props.data.data.data', []).map(customer=>customer.companies.map(company=><tr key={`${company.type}-${company.id}`}>
                                <td>{company.company.name}</td>
                                <th className='text-right text-nowrap'>{numeral(parseFloat(this.cast(company, 'nsetup.commission.value'))).format('0,0.00$')}</th>
                                {months.map((month, index)=><td className='text-right text-nowrap' key={`month-value-${index}`}>{this.getValue(customer, company, month)}</td>)}
                                <th className='text-right text-nowrap'>{this.getTotalCommission(customer, company)}</th>
                                <th className='text-right text-nowrap'>{numeral(parseFloat(this.cast(company, 'nsetup.membership.value'))).format('0,0.00$')}</th>
                            </tr>))}
                        </tbody>
                        <tfoot>
                            <tr className='text-right'>
                                <th colSpan={2}>{trans('Total')}</th>
                                {months.map((month, index)=><th className='text-right text-nowrap' key={`month-total-${index}`}>{this.getTotal(month)}</th>)}
                                <th className='text-right text-nowrap'>{numeral(this.total).format('0,0.00$')}</th>
                                <th>{numeral(total_membership).format('0,0.00$')}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Dashboard)