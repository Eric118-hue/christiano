import ReactDOM from 'react-dom';
import React from 'react';
import Lucid, {LucidComponents, LucidWrapper, Wrapper} from 'ryvendor/lucid';
import __CORE from 'ryvendor/Ry/Core/Core';
import $ from 'jquery';
import Ry from 'ryvendor/Ry/Core/Ry';
import './style.scss';
import App from './App';

const Components= {
    App : App,
    Core : {
        Core : __CORE
    },
    Lucid : LucidComponents
}

class Leg2LucidWrapper extends LucidWrapper
{
    render() {
        return <Wrapper data={this.props.content} style={{minWidth:960}}altLogo="MPITENDRY">
            <Ry class={this.props.content.view} content={this.props.content} components={this.props.components}/>
            <div className="ry-float-loading">
		    	<div className="ry loading-content">
		    		<i className="fa fa-2x fa-sync-alt fa-spin"></i>Patientez
		    	</div>
		    </div>
        </Wrapper>
    }
}

class Leg2Lucid extends Lucid
{
    wrap() {
        ReactDOM.render(<Leg2LucidWrapper content={{
            menugroup : [],
            view : 'App',
            user : {
                profile : {}
            },
            breadcrumbs : {
                itemListElement : [{
                    title : 'Organiste',
                    href : '/'
                }]
            }
        }} components={Components}/>, $('#app')[0])
    }
}

const lucid = new Leg2Lucid(Components)
lucid.theme({

})
lucid.render()

export const version = 1.0;