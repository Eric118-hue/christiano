import React, { Component } from 'react';
import numeral from 'numeral';
import Modelizer from '../Core/Modelizer';
import trans from '../../../app/translations';

class Tops extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            tab : 'top_affiliates'
        }
    }

    render() {
        const colors = ['info', 'danger']
        return <React.Fragment>
            <div className="col-md-6 dashboard">
                <div className="bg-white mt-1 p-2 h-100 rounded">
                    <div className="header pb-0">
                        <h5 className="text-center">
                            {trans("LES TOPS DE L'ANNEE")}<span className="text-orange">{this.props.data.year}</span>
                        </h5>
                    </div>
                    <div className="body pb-0">
                        <div className={`row m-0 flex-nowrap mb-2 align-items-center primary-hover mouse-pointable ${this.state.tab=='top_affiliates'?'active':''}`} onClick={()=>this.setState({tab:'top_affiliates'})}>
                            <div className="alert alert-warning mb-0 pr-0 flex-fill">
                                <div className="row m-0 align-items-center">
                                    <div className="col-6">
                                        <span className="float-left">{trans("Top acheteur affilié")}
                                        <br/>
                                        ({trans("CA Achat")} : <strong
                                            className="text-primary">{numeral(this.props.data.top_affiliates.length>0?this.props.data.top_affiliates[0].turnover:0).format('0,0.00$')}</strong> HT)
                                        </span>
                                    </div>
                                    <div className="col-5">
                                        <span className="float-left"><strong>{this.props.data.top_affiliates.length>0?this.props.data.top_affiliates[0].name:''}</strong>&nbsp;</span>
                                    </div>
                                    <div className="col-1">
                                        <span className="float-right text-orange text-primary-hover"><i
                                            className="fas fa-info-circle fa-lg"></i></span>
                                    </div>
                                </div>
                            </div>
                            <i className="fa fa-3x fa-caret-right pl-2 text-white text-primary-hover"></i>
                        </div>
                        <div className={`row m-0 flex-nowrap mb-2 align-items-center primary-hover mouse-pointable ${this.state.tab=='top_suppliers'?'active':''}`} onClick={()=>this.setState({tab:'top_suppliers'})}>
                            <div className="alert alert-success mb-0 pr-0 flex-fill">
                                <div className="row m-0 align-items-center">
                                    <div className="col-6">
                                        <span className="float-left">{trans("Top fournisseur")}<br/>
                                        ({trans("CA Vente")} : <strong
                                            className="text-primary">{numeral(this.props.data.top_suppliers.length>0?this.props.data.top_suppliers[0].turnover:0).format('0,0.00$')}</strong> HT)
                                        </span>
                                    </div>
                                    <div className="col-5">
                                        <span className="float-left"><strong>{this.props.data.top_suppliers.length>0?this.props.data.top_suppliers[0].name:''}</strong>&nbsp;</span>
                                    </div>
                                    <div className="col-1">
                                        <span className="float-right text-orange text-primary-hover"><i
                                            className="fas fa-info-circle fa-lg"></i></span>
                                    </div>
                                </div>
                            </div>
                            <i className="fa fa-3x fa-caret-right pl-2 text-white text-primary-hover"></i>
                        </div>
                        {this.props.data.top_products.map((top_product, index)=><div key={`root-product-${top_product.id}`} className={`row m-0 flex-nowrap mb-2 align-items-center primary-hover mouse-pointable ${this.state.tab==`top_product${top_product.id}`?'active':''}`} onClick={()=>this.setState({tab:`top_product${top_product.id}`})}>
                            <div className={`alert alert-${colors[index%colors.length]} mb-0 pr-0 flex-fill`}>
                                <div className="row m-0 align-items-center">
                                    <div className="col-6">
                                        <span className="float-left">{trans("Top vente produits")} : {top_product.name} 
                                        <br/>
                                        ({trans("Achats")} : <strong
                                            className="text-primary">{numeral(top_product.items.length>0?top_product.items[0].turnover:0).format('0,0.00$')}</strong> HT)
                                        </span>
                                    </div>
                                    <div className="col-5">
                                        <span className="float-left"><strong>{top_product.items.length>0?top_product.items[0].name:''}</strong>&nbsp;</span>
                                    </div>
                                    <div className="col-1">
                                        <span className="float-right text-orange text-primary-hover"><i
                                            className="fas fa-info-circle fa-lg"></i></span>
                                    </div>
                                </div>
                            </div>
                            <i className="fa fa-3x fa-caret-right pl-2 text-white text-primary-hover"></i>
                        </div>)}
                        <div className={`row m-0 flex-nowrap mb-2 align-items-center primary-hover mouse-pointable ${this.state.tab=='top_warehouses'?'active':''}`} onClick={()=>this.setState({tab:'top_warehouses'})}>
                            <div className="alert alert-secondary mb-0 pr-0 flex-fill" style={{background:'#e9eefa'}}>
                                <div className="row m-0 align-items-center">
                                    <div className="col-6">
                                        <span className="float-left">{trans("Top entrepôt")} 
                                        <br/>({trans("Nombre de livraisons")} : <strong
                                            className="text-primary">{numeral(this.props.data.top_warehouses.length>0?this.props.data.top_warehouses[0].total:0).format()}</strong>)
                                        </span>
                                    </div>
                                    <div className="col-5">
                                        <span className="float-left"><strong>{this.props.data.top_warehouses.length>0?this.props.data.top_warehouses[0].name:''}</strong>&nbsp;</span>
                                    </div>
                                    <div className="col-1">
                                       <span className="float-right text-orange text-primary-hover"><i
                                            className="fas fa-info-circle fa-lg"></i></span>
                                    </div>
                                </div>
                            </div>
                            <i className="fa fa-3x fa-caret-right pl-2 text-white text-primary-hover"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 dashboard-detail">
                <div className="bg-white mt-1 p-2 h-100 rounded">
                    {this.state.tab=='top_affiliates'?<div className="body pb-0" id="top_affiliates">
                        <div className="row m-0 mb-3 alert alert-warning justify-content-between">
                            <strong>{trans("Top des acheteurs affiliés")}</strong>
                            <strong className="float-right">{trans("Total CA Achat")} : {numeral(this.props.data.top_affiliate_turnover).format('0,0.00$')} HT</strong>
                        </div>
                        {this.props.data.top_affiliates.slice(0, 7).map(top_affiliate=><div className="row m-0 mb-2 alert alert-secondary" key={`affiliate-${top_affiliate.id}`}>
                            <div className="col text-left">
                                <a href={top_affiliate.href} target="_blank" className="text-grey font-weight-bold-hover text-primary-hover">{top_affiliate.name}</a>
                            </div>
                            <span className="float-right text-grey">({trans("CA Achat")} : {numeral(top_affiliate.turnover).format('0,0.00$')} {trans("HT")})&nbsp;<a href={top_affiliate.href} target="_blank"><i
                                className="fa fa-search-plus"></i></a></span>
                        </div>)}
                    </div>:null}
                    {this.state.tab=='top_suppliers'?<div className="body pb-0" id="top_suppliers">
                        <div className="row m-0 mb-3 alert alert-warning justify-content-between">
                            <strong>{trans("Tops fournisseurs")}</strong>
                            <strong className="float-right">{trans("Total CA Vente")} : {numeral(this.props.data.top_supplier_turnover).format('0,0.00$')} {trans("HT")}</strong>
                        </div>
                        {this.props.data.top_suppliers.slice(0, 7).map(top_supplier=><div className="row m-0 mb-2 alert alert-secondary" key={`supplier-${top_supplier.id}`}>
                            <div className="col text-left">
                                <a href={top_supplier.href} target="_blank" className="text-grey font-weight-bold-hover text-primary-hover">{top_supplier.name}</a>
                            </div>
                            <span className="float-right text-grey">({trans("CA Vente")} : {numeral(top_supplier.turnover).format('0,0.00$')} {trans("HT")})&nbsp;<a href={top_supplier.href} target="_blank"><i
                                className="fa fa-search-plus"></i></a></span>
                        </div>)}
                    </div>:null}
                    {this.props.data.top_products.map(top_product=>(this.state.tab==`top_product${top_product.id}`?<div className="body pb-0" key={`root-product-${top_product.id}`}>
                        <div className="row m-0 mb-3 alert alert-warning">
                            <div className="col">
                                <strong>{trans("Top ventes")} {top_product.name}</strong>
                            </div>
                        </div>
                        {top_product.items.slice(0, 7).map(item=><div className="row m-0 mb-2 alert alert-secondary" key={`top-product-item-${item.id}`}>
                            <div className="col text-left">
                                <a href={item.href} target="_blank" className="text-grey text-primary-hover font-weight-bold-hover">{item.name}</a>
                            </div>
                            <span className="float-right text-grey">({trans("CA Vente")} : {numeral(item.turnover).format('0,0.00$')} {trans("HT")})&nbsp;<a href={item.href} target="_blank"><i
                                    className="fa fa-search-plus"></i></a></span>
                        </div>)}
                    </div>:null))}
                    {this.state.tab=='top_warehouses'?<div className="body pb-0">
                        <div className="row m-0 mb-3 alert alert-warning">
                            <div className="col">
                                <strong>{trans("Top entrepôts")}</strong>
                            </div>
                        </div>
                        {this.props.data.top_warehouses.slice(0, 7).map(top_warehouse=><div className="row m-0 mb-2 alert alert-secondary" key={`warehouse-${top_warehouse.id}`}>
                            <div className="col text-left">
                                <a href={top_warehouse.href} target="_blank" className="text-body text-primary-hover font-weight-bold-hover">{top_warehouse.name}</a>
                            </div>
                            <span className="float-right">({trans("Nombre de livraisons")} : {numeral(top_warehouse.total).format()})&nbsp;<a href={top_warehouse.href} target="_blank"><i
                                    className="fa fa-search-plus"></i></a></span>
                        </div>)}
                    </div>:null}
                </div>
            </div>
        </React.Fragment>
    }
}

export default Modelizer(Tops);
