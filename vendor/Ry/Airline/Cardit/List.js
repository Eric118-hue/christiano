import CarditList from '../../Cardit/List';
import React from 'react';
import Cardit from './Item';

class List extends CarditList
{
    table() {
        return <table className="table table-bordered table-hover table-striped table-liste" cellSpacing="0" cellPadding="0" id="recipientTable">
            <thead>
                <tr>
                    <th>Emis le</th>
                    <th>à (hh:mm)</th>
                    <th>N° d’expédition</th>
                    <th>Cat.</th>
                    <th>Classe</th>
                    <th>Nb récips</th>
                    <th>Poids (Kg)</th>
                    <th>Aéro. ORIG.</th>
                    <th>Direct /Escales</th>
                    <th>Aéro. DEST.</th>
                    <th>Premier vol</th>
                    <th>Réception</th>
                    <th>Assignement</th>
                    <th>Trip completed</th>
                </tr>
            </thead>
            <tbody>
                {this.state.items.map(item=><Cardit key={`cardit-${item.id}`} escales={this.escales} data={item} irregularites={this.irregularites} performances={this.performances} completed={this.completed}/>)}
            </tbody>
        </table>
    }
}

export default List;