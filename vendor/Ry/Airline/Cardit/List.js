import React, {Component} from 'react';
import CarditList from '../../Cardit/List';

class List extends CarditList
{
    buttons() {
        let k = Math.floor(3 * Math.random())
        switch(k) {
            case 0:
                return <button className="btn btn-warning">Suspended</button> 
            case 1:
                return <button className="btn btn-success">Approuved</button>
            case 2:
                return <button className="btn btn-theme">Pending</button>
        }
        return <button className="btn btn-danger">Blocked</button>
    }

    table() {
        return <table className="table table-bordered table-hover table-striped table-liste" cellSpacing="0"
        id="addrowExample">
            <thead>
                <tr>
                    <th>Emis le</th>
                    <th>à (hh:mm)</th>
                    <th>Numéro d’expédition</th>
                    <th>Cat.</th>
                    <th>Classe</th>
                    <th>Nombre de récipients</th>
                    <th>Poids total</th>
                    <th>Aéroport ORIG.</th>
                    <th>Aéroport DEST.</th>
                    <th>Premier vol</th>
                    <th>Statut</th>
                    <th>Traitement</th>
                </tr>
            </thead>
            <tbody>
                {[0,1,2,3,4,5,6,7,8,9,10].map(item=><tr key={`cardit-${item}`} className="gradeA">
                    <td>28/04/2019</td>
                    <td>07:15</td>
                    <td>FRCDG395A014</td>
                    <td>A</td>
                    <td>U</td>
                    <td>10</td>
                    <td>39.5 Kg</td>
                    <td>CDG</td>
                    <td>HKG</td>
                    <td>QR040</td>
                    <td>
                        {this.buttons()}
                    </td>
                    <td className="actions">
                        <a className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit" href="#dialog/cardit_edit" data-display="modal-xl"><i
                                className="icon-pencil" aria-hidden="true"></i></a>
                    </td>
                </tr>)}
            </tbody>
        </table>
    }

    render() {
        return <div className="cardit-container vol-liste col-md-12">
            <div className="row clearfix align-items-stretch position-relative vol-container">
                <div className="col-12">
                    <div className="topContainer d-flex justify-content-between align-items-center">
                        <div></div>
                        <div className="navPager d-flex align-items-center justify-content-end">
                            <a href="#"><i className="fa fa-angle-double-left"></i></a>
                            <a href="#"><i className="fa fa-angle-left"></i></a>
                            <a href="#"><i className="fa fa-angle-right"></i></a>
                            <a href="#"><i className="fa fa-angle-double-right"></i></a>
                        </div>
                    </div>
                    <div className="card overflowhidden">
                        <div className="body">
                            <div className="filter d-flex align-items-center justify-content-start flex-wrap">
                                <div className="form-group d-flex align-items-center justify-content-start flex-nowrap">
                                    <label>Show</label>
                                    <select className="form-control">
                                        <option value="">1</option>
                                    </select>
                                    <label>entries</label>
                                </div>
                                <div className="btnContainer d-flex align-items-center justify-content-start flex-nowrap">
                                    <button className="btn">All</button>
                                    <button className="btn btn-warning">Suspended</button>
                                    <button className="btn btn-success">Approuved</button>
                                    <button className="btn btn-theme">Pending</button>
                                    <button className="btn btn-danger">Blocked</button>
                                </div>

                                <div className="search d-flex align-items-center justify-content-start flex-wrap">
                                    <label>Search:</label>
                                    <input type="search" placeholder=""/>
                                </div>
                            </div>
                            <div className="card-bureau no-border">
                                <div className="table-responsive">
                                    {this.table()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="navPager d-flex align-items-center justify-content-end">
                            <a href="#"><i className="fa fa-angle-double-left"></i></a>
                            <a href="#"><i className="fa fa-angle-left"></i></a>
                            <a href="#"><i className="fa fa-angle-right"></i></a>
                            <a href="#"><i className="fa fa-angle-double-right"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default List;