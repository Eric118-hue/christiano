import React, {Component} from 'react';

class List extends Component
{
    render() {
        return <div className="cardit-container vol-liste col-md-12">
            <div className="row clearfix align-items-stretch position-relative vol-container">
                <div className="col-12">
                    <div className="topContainer d-flex justify-content-between align-items-center">
                        <a href="#" className="btn btn-info"><span><i className="fa fa-plus"></i></span>Ajouter un CARDIT</a>
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
                                    <table className="table table-bordered table-hover table-striped table-liste" cellSpacing="0"
                                        id="addrowExample">
                                        <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Number</th>
                                            <th>BO</th>
                                            <th>BD</th>
                                            <th>Nbr bags</th>
                                            <th>Poids brut</th>
                                            <th>Cat</th>
                                            <th>Classe</th>
                                            <th>leaflet</th>
                                            <th>label</th>
                                            <th>Delivry slip</th>
                                            <th>Airline compagny</th>
                                            <th>Vol N°</th>
                                            <th>Status</th>
                                            <th>CARDIT</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="gradeA">
                                                <td>28/04/2019</td>
                                                <td>1555</td>
                                                <td>AEAUH</td>
                                                <td>FR</td>
                                                <td>02</td>
                                                <td>10,2</td>
                                                <td>A</td>
                                                <td>UN</td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>Air France</td>
                                                <td>AF 66</td>
                                                <td><button className="btn btn-warning">Suspended</button> </td>
                                                <td className="actions">
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                            </tr>
                                            <tr className="gradeA">
                                                <td>28/04/2019</td>
                                                <td>1555</td>
                                                <td>AEAUH</td>
                                                <td>FR</td>
                                                <td>02</td>
                                                <td>10,2</td>
                                                <td>A</td>
                                                <td>UN</td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>Air France</td>
                                                <td>AF 66</td>
                                                <td><button className="btn btn-success">Approuved</button> </td>
                                                <td className="actions">
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                            </tr>
                                            <tr className="gradeA">
                                                <td>28/04/2019</td>
                                                <td>1555</td>
                                                <td>AEAUH</td>
                                                <td>FR</td>
                                                <td>02</td>
                                                <td>10,2</td>
                                                <td>A</td>
                                                <td>UN</td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>Air France</td>
                                                <td>AF 66</td>
                                                <td><button className="btn btn-theme">Pending</button> </td>
                                                <td className="actions">
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                            </tr>
                                            <tr className="gradeA">
                                                <td>28/04/2019</td>
                                                <td>1555</td>
                                                <td>AEAUH</td>
                                                <td>FR</td>
                                                <td>02</td>
                                                <td>10,2</td>
                                                <td>A</td>
                                                <td>UN</td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>Air France</td>
                                                <td>AF 66</td>
                                                <td><button className="btn btn-danger">Blocked</button> </td>
                                                <td className="actions">
                                                    <button className="btn btn-sm btn-icon btn-pure btn-info on-default m-r-5 button-edit"
                                                            data-toggle="tooltip" data-original-title="Edit"><i
                                                            className="icon-pencil" aria-hidden="true"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
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