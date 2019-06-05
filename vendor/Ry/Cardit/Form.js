import React, {Component} from 'react';

class Form extends Component
{
    render() {
        return <form className="cardit-container col-md-12">
            <div className="row clearfix align-items-stretch position-relative vol-container">
                <div className="vol-ico">
                    <span><img src="/medias/images/avion.png"/></span>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="card overflowhidden">
                        <div className="body">
                            <div className="card-bureau">
                                <label className="title-vol">
                                    <span>1</span> Code du Bureau d’origine <i className="fa fa-lock"></i>
                                </label>
                                <button className="btn btn-vol">AEAUHB <i className="icon-info"></i></button>
                                <span className="vol-info">AP SPID ABU DHABI EAU</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="card overflowhidden">
                        <div className="body">
                            <div className="card-bureau">
                                <div className="title-vol">
                                    <span>2</span> Destination <i className="fa fa-lock"></i>
                                </div>
                                <button className="btn btn-vol">FRCDGA <i className="icon-info"></i></button>
                                <span className="vol-info">ROISSY COURRIER INTERNATIONAL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row clearfix align-items-stretch position-relative vol-container">
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="card overflowhidden h100">
                        <div className="body">
                            <div className="card-bureau">
                                <div className="form-group d-flex align-items-center justify-content-start flex-nowrap">
                                    <label className="title-vol">
                                        <span>3</span> Numéro de la dépêche
                                        <i className="fa fa-lock"></i>
                                    </label>
                                    <input type="text" placeholder="" className="form-control"/>
                                    <i className="icon-info"></i>
                                </div>
                                <div className="form-group d-flex align-items-center justify-content-start flex-nowrap">
                                    <label className="title-vol">
                                        <span>4</span> Date de confection de la dépêche
                                        <i className="fa fa-lock"></i>
                                    </label>
                                    <input type="text" placeholder="" className="form-control"/>
                                    <i className="icon-info"></i>
                                </div>
                                <div className="form-group d-flex align-items-center justify-content-start flex-nowrap">
                                    <label className="title-vol">
                                        <span>5</span> Catégorie
                                        <i className="fa fa-lock"></i>
                                    </label>
                                    <select className="custom-select select-default">
                                        <option>A</option>
                                    </select>
                                    <i className="icon-info"></i>
                                </div>
                                <div className="form-group d-flex align-items-center justify-content-start flex-nowrap">
                                    <label className="title-vol">
                                        <span>6</span> Classe
                                        <i className="fa fa-lock"></i>
                                    </label>
                                    <select className="custom-select select-default">
                                        <option>UN</option>
                                    </select>
                                    <i className="icon-info"></i>
                                </div>
                                <div className="form-group d-flex align-items-center justify-content-start flex-nowrap">
                                    <label className="title-vol">
                                        <span>7</span> Nombre de sacs
                                        <i className="fa fa-lock"></i>
                                    </label>
                                    <input type="text" placeholder="2" className="form-control"/>
                                    <i className="icon-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="card overflowhidden">
                        <div className="body">
                            <div className="card-bureau">
                                <div className="title-vol">
                                    <span>8</span> 1er parcours - N° de vol <i className="fa fa-lock"></i>
                                </div>
                                <div className="input-container">
                                    <input type="text" className="form-control" defaultValue="AF 123"/> <i className="icon-info"></i>
                                </div>
                            </div>
                            <div className="card-bureau">
                                <div className="title-vol">
                                    <span>8b</span> 2er parcours - N° de vol <i className="fa fa-lock"></i>
                                </div>
                                <div className="input-container">
                                    <input type="text" className="form-control" defaultValue="AF 123"/> <i className="icon-info"></i>
                                </div>
                            </div>
                            <div className="card-bureau">
                                <div className="title-vol">
                                    <span>8c</span> 3er parcours - N° de vol <i className="fa fa-lock"></i>
                                </div>
                                <div className="input-container">
                                    <input type="text" className="form-control" defaultValue="AF 123"/> <i className="icon-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row clearfix align-items-stretch position-relative vol-container">
                <div className="col-12">
                    <div className="card overflowhidden">
                        <div className="body">
                            <div className="card-bureau no-border">
                                <div className="title-vol">
                                    <span>9</span> 1er parcours - N° de vol <i className="fa fa-lock"></i>
                                </div>
                                <div className="vol-notice">

                                </div>
                                <div className="table-responsive">
                                    <table className="table table-bordered newTable">
                                        <thead>
                                            <tr>
                                                <th>Nr. Bag</th>
                                                <th>Format of contents</th>
                                                <th>Total Weight (Kgs.)</th>
                                                <th>Receptacle Weight (Kgs.)</th>
                                                <th>Net Weight (Kgs)</th>
                                            </tr>
                                            <tr>
                                                <th>Numéro de Sac</th>
                                                <th>
                                                    Type de contenant <i className="fa fa-lock"></i>
                                                    <button className="btn btn-info">Table de référence</button>
                                                </th>
                                                <th>Poids Brut (Kg) <i className="fa fa-lock"></i></th>
                                                <th>Tare (Kg)</th>
                                                <th>Poids net (Kg) = Poids Brut - Tare</th>
                                                <th rowSpan="2" style={{verticalAlign: 'bottom'}} className="thlast">
                                                    Lettre F <i className="fa fa-lock"></i> <i className="icon-info"></i>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>
                                                    <select className="custom-select select-default">
                                                        <option>sac</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="text" placeholder="10,5"/>
                                                </td>
                                                <td>0,2</td>
                                                <td className="bg-jaune">10,5</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>
                                                    <select className="custom-select select-default">
                                                        <option>sac</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="text" placeholder="10,1"/>
                                                </td>
                                                <td>0,2</td>
                                                <td className="bg-jaune">10,5</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>
                                                    <select className="custom-select select-default">
                                                        <option>sac</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="text" placeholder=""/>
                                                </td>
                                                <td></td>
                                                <td className="bg-jaune"></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>
                                                    <select className="custom-select select-default">
                                                        <option>sac</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="text" placeholder=""/>
                                                </td>
                                                <td></td>
                                                <td className="bg-jaune"></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>
                                                    <select className="custom-select select-default">
                                                        <option>sac</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="text" placeholder=""/>
                                                </td>
                                                <td></td>
                                                <td className="bg-jaune"></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td className="no-border" colSpan="2">
                                                    <a href="#">Ajouter un numéro de sac</a>
                                                </td>
                                                <td className="bg-jaune">20,1</td>
                                                <td className="bg-jaune">0,4</td>
                                                <td className="bg-jaune">20,5</td>
                                                <td className="no-border"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    }
}

export default Form;