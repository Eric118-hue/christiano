import CarditList from '../../Cardit/List';
import React from 'react';
import Cardit from './Item';
import trans from '../../../../app/translations';
import './List.scss';

class List extends CarditList
{
    constructor(props) {
        super(props)
        this.progressive = true
    }

    table() {
        return <table className="table table-bordered table-hover table-striped table-liste" cellSpacing="0" cellPadding="0" id="recipientTable">
            <thead>
                <tr>
                    <th>{trans('Emis le')}</th>
                    <th>{trans('à')}</th>
                    <th>{trans('N° d’expédition')}</th>
                    <th>{trans('Cat.')}</th>
                    <th>{trans('Clas.')}</th>
                    <th>{trans('Qté')}</th>
                    <th>{trans('Poids')}</th>
                    <th>{trans('Orig.')}</th>
                    <th>{trans('Escale')}</th>
                    <th>{trans('Dest.')}</th>
                    <th>{trans('Nº de vol')}</th>
                    <th>{trans('Départ prévu le')}</th>
                    <th>{trans('à')}</th>
                    <th>{trans('REC')}</th>
                </tr>
            </thead>
            <tbody>
                {this.state.data.map(item=><Cardit readOnly={this.readOnly} key={`cardit-${item.id}`} escales={this.escales} data={item} reception={this.reception} assignation={this.assignation} completed={this.completed} consignmentEvents={this.props.data.consignment_events} deliveryConsignmentEvents={this.props.data.delivery_consignment_events} store={this.props.store}/>)}
            </tbody>
            <tfoot className={(this.progressive && this.state.page<this.state.last_page)?'':'d-none'}>
                <tr>
                    <td ref="overscroller" colSpan="14" className={`position-relative py-3`}><i className="spinner"></i></td>
                </tr>
            </tfoot>
        </table>
    }
}

export default List;