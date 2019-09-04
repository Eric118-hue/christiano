import CarditList from '../../Cardit/List';
import React from 'react';
import Cardit from './Item';
import trans from '../../../../app/translations';

class List extends CarditList
{
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
                    <th>{trans('Réception')}</th>
                    <th>{trans('Assignement')}</th>
                    <th>{trans('Trip completed')}</th>
                </tr>
            </thead>
            <tbody>
                {this.state.items.map(item=><Cardit key={`cardit-${item.id}`} escales={this.escales} data={item} irregularites={this.irregularites} performances={this.performances} completed={this.completed} consignmentEvents={this.props.data.consignment_events} store={this.props.store}/>)}
            </tbody>
        </table>
    }
}

export default List;