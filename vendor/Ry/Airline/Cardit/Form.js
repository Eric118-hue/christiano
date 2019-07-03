import React, {Component} from 'react';
import {PopupHeader, PopupBody} from '../../../bs/bootstrap';
import numeral from 'numeral';

class Form extends Component
{
    render() {
        return <React.Fragment>
            <PopupHeader className="bg-info text-light">
                <h4>Liste des récipients - Expédition FRCDG395A014</h4>
            </PopupHeader>
            <PopupBody>
                <div className="col-md-12">
                    <table className="table table-bordered table-centerall">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Numéro du récipient</th>
                                <th>Flag <i className="fa fa-info-circle"></i></th>
                                <th>Container Journey ID</th>
                                <th>Type de récipient</th>
                                <th>Poids (Kg)</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1,2,3,4,5,6,7,8,9,10].map(item=><tr key={`content-${item}`}>
                                <td>{numeral(item).format('00')}</td>
                                <td>FRCDGAHKHKGAAUX90052001000044</td>
                                <td>R</td>
                                <td>J43FRAXQRHKG940301EH</td>
                                <td>Sac</td>
                                <td>4.4</td>
                                <td>
                                    <div className="fancy-checkbox">
                                        <label>
                                            <input name={`checkbox${item}`} type="checkbox" value="1"/>
                                            <span></span>
                                        </label>
                                    </div>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                    <button className="float-right btn btn-orange">Validation</button>
                </div>
            </PopupBody>
        </React.Fragment>
    }
}

export default Form;