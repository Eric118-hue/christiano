import React, { Component } from 'react';
import $ from 'jquery';
import { renderToStaticMarkup } from 'react-dom/server';
import numeral from 'numeral';
import affiliate_pin from './medias/affiliate-pin.png';
import supplier_pin from './medias/supplier-pin.png';
import warehouse_pin from './medias/warehouse-pin.png';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';

class Map extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            affiliates : true,
            suppliers : false,
            warehouses : false
        }
        this.locateAffiliates = this.locateAffiliates.bind(this)
        this.locateSuppliers = this.locateSuppliers.bind(this)
        this.locateWarehouses = this.locateWarehouses.bind(this)
    }

    locateAffiliates() {
        this.setState(state=>{
            state.affiliates = !state.affiliates
            if(state.affiliates) {
                this.props.data.affiliates.map(affiliate=>{
                    if(!affiliate.marker)
                        return
                    affiliate.marker.setMap(this.map)
                    let loc = new google.maps.LatLng(affiliate.marker.position.lat(), affiliate.marker.position.lng())
                    this.bounds.extend(loc);
                })
                this.map.fitBounds(this.bounds);
                this.map.panToBounds(this.bounds);
            }
            else {
                this.props.data.affiliates.map(affiliate=>{
                    if(affiliate.marker)
                        affiliate.marker.setMap(null)
                })
            }
            return state
        })
    }

    locateSuppliers() {
        this.setState(state=>{
            state.suppliers = !state.suppliers
            if(state.suppliers) {
                this.props.data.suppliers.map(supplier=>{
                    supplier.marker.setMap(this.map)
                    let loc = new google.maps.LatLng(supplier.marker.position.lat(), supplier.marker.position.lng())
                    this.bounds.extend(loc);
                })
                this.map.fitBounds(this.bounds);
                this.map.panToBounds(this.bounds);
            }
            else {
                this.props.data.suppliers.map(supplier=>{
                    supplier.marker.setMap(null)
                })
            }
            return state
        })
    }

    locateWarehouses() {
        this.setState(state=>{
            state.warehouses = !state.warehouses
            if(state.warehouses) {
                this.props.data.warehouses.map(warehouse=>{
                    warehouse.marker.setMap(this.map)
                    let loc = new google.maps.LatLng(warehouse.marker.position.lat(), warehouse.marker.position.lng())
                    this.bounds.extend(loc);
                })
                this.map.fitBounds(this.bounds);
                this.map.panToBounds(this.bounds);
            }
            else {
                this.props.data.warehouses.map(warehouse=>{
                    warehouse.marker.setMap(null)
                })
            }
            return state
        })
    }

    componentDidMount() {
        const dis = this
        $.getScript('https://maps.googleapis.com/maps/api/js?key='+this.props.data.google_key, ()=>{
            dis.bounds = new google.maps.LatLngBounds();
            dis.map = new google.maps.Map(dis.refs.map, {
                zoom: 6,
                center: new google.maps.LatLng(45.4667971, 9.1904984),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            });
            dis.props.data.affiliates.map(affiliate=>{
                if(!affiliate.adresse)
                    return
                affiliate.marker = new google.maps.Marker({
                    position: {
                        lat : parseFloat(affiliate.adresse.lat),
                        lng : parseFloat(affiliate.adresse.lng)
                    },
                    map: dis.map,
                    title: affiliate.name,
                    icon: affiliate_pin
                });
                const infoWindow = new google.maps.InfoWindow({
                    content: renderToStaticMarkup(<div className="text-left">
                        <strong>{affiliate.name}</strong>
                        <p>{affiliate.adresse.raw}<br/>
                        {affiliate.adresse.ville.nom}</p>
                        <p>CA : {numeral(affiliate.turnover).format('0,0.00$')} HT</p>
                    </div>)
                });
                let loc = new google.maps.LatLng(affiliate.marker.position.lat(), affiliate.marker.position.lng())
                dis.bounds.extend(loc);
                affiliate.marker.addListener('click', function() {
                    infoWindow.open(dis.map, affiliate.marker);
                });
            })
            dis.map.fitBounds(dis.bounds);
            dis.map.panToBounds(dis.bounds);
            dis.props.data.suppliers.map(supplier=>{
                if(!supplier.adresse)
                    return
                supplier.marker = new google.maps.Marker({
                    position: {
                        lat : parseFloat(supplier.adresse.lat),
                        lng : parseFloat(supplier.adresse.lng)
                    },
                    title: supplier.alias,
                    icon: supplier_pin
                 });
                const infoWindow = new google.maps.InfoWindow({
                    content: renderToStaticMarkup(<div className="text-left">
                        <strong>{supplier.name}</strong>
                        <p>{supplier.adresse.raw}<br/>
                        {supplier.adresse.ville.nom}</p>
                    </div>)
                });
                supplier.marker.addListener('click', function() {
                    infoWindow.open(dis.map, supplier.marker);
                });
            })
            dis.props.data.warehouses.map(warehouse=>{
                if(!warehouse.adresse)
                    return
                warehouse.marker = new google.maps.Marker({
                    position: {
                        lat : parseFloat(warehouse.adresse.lat),
                        lng : parseFloat(warehouse.adresse.lng)
                    },
                    title: warehouse.name,
                    icon: warehouse_pin
                 });
                const infoWindow = new google.maps.InfoWindow({
                    content: renderToStaticMarkup(<div className="text-left">
                        <strong>{warehouse.name}</strong>
                        <p>{warehouse.adresse.raw}<br/>
                        {warehouse.adresse.ville.nom}</p>
                    </div>)
                });
                warehouse.marker.addListener('click', function() {
                    infoWindow.open(dis.map, warehouse.marker);
                });
            })
        })
    }

    render() {
        return <div className="col-md-12 mt-3 dashboard-map">
            <div className="bg-white mt-1 mb-3 p-2 text-center rounded">
                <div className="row m-0">
                    <div className="col-md-2 mr-2 map-nav">
                        <div className={`row p-2 ${this.state.affiliates?'bg-info':'bg-stone'} mb-2 justify-content-between mouse-pointable`} onClick={this.locateAffiliates}>
                            <strong>Affiliés</strong>
                            <strong className="text-turquoise float-right" >{this.props.data.stats.affiliates}</strong>
                        </div>
                        <div className={`row p-2 ${this.state.suppliers?'bg-info':'bg-stone'} mb-2 justify-content-between mouse-pointable`} onClick={this.locateSuppliers}>
                            <strong>Fournisseurs</strong>
                            <strong className="text-turquoise float-right" >{this.props.data.stats.suppliers}</strong>
                        </div>
                        <div className={`row p-2 ${this.state.warehouses?'bg-info':'bg-stone'} justify-content-between mouse-pointable`} onClick={this.locateWarehouses}>
                            <strong>Entrepôts</strong>
                            <strong className="text-turquoise float-right" >{this.props.data.stats.warehouses}</strong>
                        </div>
                    </div>
                    <div className="flex-fill">
                        <div ref="map" style={{minHeight:500,minWith:640,width:'100%'}}></div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Map);