import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import Ry, {store} from 'ryvendor/Ry/Core/Ry';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Ckeditor from 'Theme/Ckeditor';
import Components from 'Theme';

const container = {
  wrapper : React.createRef()
}

export const Badger = function(It) {

  Modelizer(It)

  const BadgerContructor = It.prototype.constructor

  It.prototype.constructor = function(props) {
      if(BadgerContructor)
          BadgerContructor.call(this, props)

      let opportunites = {}
      this.models('props.notifications', []).filter(notification=>notification.nsetup.category=='ryopportunites_queryaffiliates').map(notif=>{
          opportunites[notif.nsetup.href] = opportunites[notif.nsetup.href]
      })
      this.nAO = Object.keys(opportunites).length
      let opnegocies = {}
      let opnegociescontracts = {}
      this.models('props.notifications', []).filter(notification=>notification.nsetup.category=='opnegocies').map(notif=>{
          if(/opnegocies\/contract/.test(notif.nsetup.href))
              opnegociescontracts[notif.nsetup.href] = opnegociescontracts[notif.nsetup.href]
          else
              opnegocies[notif.nsetup.href] = opnegocies[notif.nsetup.href]
      })
      this.nON = Object.keys(opnegocies).length
      this.nONcontracts = Object.keys(opnegociescontracts).length
  }

  return It
}

export const mainview = React.createRef()

class ThemeWrapper
{
    constructor(wrapper) {
        this.$ = $;
        this.wrapper = wrapper
        Modelizer(this.wrapper)
        const WrapperConstructor = this.wrapper.prototype.constructor
        const WrapperRender = this.wrapper.prototype.render
        
        this.wrapper.prototype.getStore = function() {
            return store
        }
    
        this.wrapper.prototype.getView = function() {
            return mainview.current
        }

        this.wrapper.prototype.render = function() {
            let ret = null
            if(WrapperRender)
                ret = WrapperRender.call(this)
            
            if(this.models('props.data.view')=='Editor.Bar') {
                return <Ry class={this.props.data.view} content={this.props.data} components={this.props.components}/>
            }
            return <React.Fragment>
                <Ry class="Editor.Iframe" content={this.props.data} components={this.props.components}/>
                {ret}
            </React.Fragment>
        }
        this.bootstrap();
        const overlay = $('<div style="position: absolute; top: 0;"><div></div></div>');
		$("body").append(overlay);
        ReactDOM.render(<Ry class="Core" components={Components}/>, overlay[0]);
        this.ckeditor = Ckeditor
        this.getWrapper = this.getWrapper.bind(this)
    }

    getWrapper() {
        return container.wrapper
    }

    bootstrap() {
        const Wrp = this.wrapper
        $("script[type='application/ld+json']").each(function(){
            let text = $(this).text()
            let content = JSON.parse(text?text:'{}');
            content.blocks = {}
            $(this).next().children().each(function(){
                content.blocks[$(this).attr('id')] = $(this).html()
            });
            ReactDOM.render(<Wrp ref={container.wrapper} data={content} components={Components}/>, $(this).parent()[0])
        });
        $("script[type^='application/json+ry']").each(function(){
			const elementname = $(this).attr('type').replace('application/json+ry', '');
			let text = $(this).text()
			const content = JSON.parse(text?text:'{}');
			Ry.setGlobal(elementname, content)
			const id = $(this).attr('id') || $(this).parent().attr('name');
			ReactDOM.render(<Ry class={elementname} content={content} id={id} components={Components}/>, $(this).parent()[0])
		});
    }
}

export default ThemeWrapper;