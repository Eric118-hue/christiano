import $ from 'jquery';
import trans from '../../app/translations';
import './vendor/light/metisMenu';
import './vendor/light/jquery.slimscroll';
import 'bootstrap';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Ry from '../Ry/Core/Ry';
import {Pg} from '../bs/bootstrap';
import Components from './components';

class Alert extends Component
{
    render() {
        if(this.props.message) {
            return <div className="col-md-12">
                <div className={`alert ${this.props.message.class} alert-dismissible`} role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <div dangerouslySetInnerHTML={{__html:this.props.message.content}}></div>
                </div>
            </div>
        }
        return null;
    }
}

class Account extends Component
{
    render() {
        if(this.props.data.user.customer_account.company_restricted) {
            return <h5 className='text-center'>{this.props.data.user.customer_account.company_restricted.name}</h5>
        }
        return <h5 className='text-center'>{this.props.data.user.customer_account.facturable.name}</h5>
    }
}

export class Wrapper extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            openTour : false,
            hasError : false
        }
        this.anyChildActive = this.anyChildActive.bind(this)
        this.checkLocation = this.checkLocation.bind(this)
    }

    checkLocation(against) {
        let checked = document.location.pathname === against
        if(!checked && this.props && this.props.data.parents) {
            this.props.data.parents.map(parent=>{
                if(parent.href===against)
                    checked = true
            })
        }
        return checked
    }

    anyChildActive(tree) {
        if(!tree)
            return
        let active = false
        tree.map(item=>{
            if(this.checkLocation(item.href))
                active = true
        })
        if(active)
            return true
        tree.map(item=>{
            if(item.children && !active)
                active = this.anyChildActive(item.children)
        })
        if(active)
            return true
        if(this.props.data.menugroup.length==1)
            return true
    }

    componentDidCatch(error, info) {
        this.setState({
            hasError : error
        })
    }

    render() {
        const steps = [
            {
              selector: '.first-step',
              content: 'This is my first Step',
            },
            {
                selector : '.second-step',
                content: ({ goTo, inDOM }) => (
                    <div>
                      Lorem ipsum <button onClick={() => goTo(4)}>Go to Step 5</button>
                      <br />
                      {inDOM && '🎉 Look at your step!'} <div className="form-group">
                        <label className="control-label">Na lien</label>
                        <input type="text" className="form-control"/>
                      </div>
                    </div>
                  )
            }
        ]
        const breadcrumbs = this.props.data.breadcrumbs
        return <React.Fragment>
            <div className="page-loader-wrapper">
                <div className="loader">
                    <div className="m-t-30">
                        <img src={this.props.data.logo}/>
                    </div>
                    <p>{trans("Patientez un instant s'il vous plait...")}</p>
                </div>
            </div>
            <div id="wrapper" style={this.props.style}>

                <nav className="navbar navbar-fixed-top"
                    style={{position: 'fixed', overflow: 'none'}}>
                    <div className="container-fluid">
                        <div className="navbar-btn">
                            <button type="button" className="btn-toggle-offcanvas">
                                <i className="lnr lnr-menu fa fa-bars"></i>
                            </button>
                        </div>

                        <div className="align-items-center d-flex navbar-brand">
                            <a href="/" className={this.props.altLogo?'mr-2':''}><img src={this.props.data.logo}
                                className="img-responsive logo" style={{maxHeight:34}}/></a>
                            {this.props.altLogo?this.props.altLogo:null}
                        </div>

                        <div className="d-flex navbar-right align-items-center">
                            <div className='flex-fill'>{this.props.data.theme==='airline'?<Account data={this.props.data}/>:null}</div>
                            <Components.Bars.TopRight data={this.props.data.usermenu} content={this.props.data}/>
                        </div>
                    </div>
                </nav>

                <div id="left-sidebar" className="sidebar">
                    <div className="sidebar-scroll">
                        <div className="user-account">
                            <Components.Bars.User data={this.props.data}/>
                        </div>
                        <ul className="nav nav-tabs">
                            {this.props.data.menugroup.map((menu_group, index)=><li key={`menu-group-${menu_group.menu}`} className="nav-item"><a className={`nav-link ${this.anyChildActive(this.props.data[menu_group.menu])?'active':''}`} data-toggle="tab"
                                href={`#menu-${menu_group.menu}`}>{trans(menu_group.title)}</a></li>)}
                        </ul>
                        <div className="tab-content p-l-0 p-r-0">
                            {this.props.data.menugroup.map((menu_group, index)=><div className={`tab-pane ${this.anyChildActive(this.props.data[menu_group.menu])?'active':''}`} key={`tab-pane-menu-group-${menu_group.menu}`} id={`menu-${menu_group.menu}`}>
                                <nav id="left-sidebar-nav" className="sidebar-nav">
                                    <ul id={`${menu_group.menu}-menu`} className="metismenu">
                                        <Components.Menus.Drawer data={this.props.data[menu_group.menu]}/>
                                    </ul>
                                </nav>
                            </div>)}
                        </div>
						{(this.props.data.view && this.props.data.view.startsWith('Postoffice') && this.props.data.user.postoffice && this.props.data.user.postoffice.medias.length>0)?<div className="border-top p-5">
							<img src={this.props.data.user.postoffice.medias[0].fullpath} className="img-fluid"/>
						</div>:null}
                    </div>
                </div>

                <div id="main-content">
                    <div className="container-fluid second-step">
                        <div className="block-header">
                            <div className="row clearfix">
                                <Alert message={this.props.data.message}/>
                                <div className="col-md-12 first-step">
                                    <Pg breadcrumbs={breadcrumbs} data={this.props.data}>
                                        {this.state.hasError?<div className="col-md-12"><div className="alert alert-light">{trans("Une erreur imprévisible s'est produite.")}</div></div>:this.props.children}
                                    </Pg>
                                </div>
                            </div>
                            {this.props.footer?this.props.footer():null}
                        </div>
                    </div>
                </div>
                <div id="chart-tooltip" className="chartist-tooltip bg-dark text-light p-2"></div>
            </div>
        </React.Fragment>
    }
}

export class LucidWrapper extends Component
{
    render() {
        if(this.props.content.view=='Editor.Bar') {
            return <Ry class={this.props.content.view} content={this.props.content} components={this.props.components}/>
        }
        if(this.props.content.unwrap) {
            return <React.Fragment>
                <Ry class={this.props.content.view} content={this.props.content} components={this.props.components}/>
                <div className="ry-float-loading">
                    <div className="ry loading-content">
                        <i className="fa fa-2x fa-sync-alt fa-spin"></i> {trans("Patientez")}
                    </div>
                </div>
            </React.Fragment>
        }
        return <Wrapper data={this.props.content} style={{minWidth:1920}}>
            <Ry class={this.props.content.view} content={this.props.content} components={this.props.components}/>
            <div className="ry-float-loading">
		    	<div className="ry loading-content">
		    		<i className="fa fa-2x fa-sync-alt fa-spin"></i> {trans("Patientez")}
		    	</div>
		    </div>
        </Wrapper>
    }
}

class Lucid
{
    constructor(components) {
        this.components = components
    }

    theme(overrides={}) {

    }

    wrap() {
        const dis = this
        $("script[type='application/ld+json']").each(function(){
            let text = $(this).text()
            const content = JSON.parse(text?text:'{}');
            ReactDOM.render(<LucidWrapper content={content} components={dis.components}/>, $(this).parent()[0])
        });
    }

    render() {
        this.wrap()

        $(function() {
            "use strict";
            skinChanger();
            
            setTimeout(function() {
                $('.page-loader-wrapper').fadeOut();
            }, 50);
        });
        
        //Skin changer
        function skinChanger() {
            $('.choose-skin li').on('click', function() {
                var $body = $('body');
                var $this = $(this);
          
                var existTheme = $('.choose-skin li.active').data('theme');
                $('.choose-skin li').removeClass('active');
                $body.removeClass('theme-' + existTheme);
                $this.addClass('active');
                $body.addClass('theme-' + $this.data('theme'));
            });
        }
        
        $(document).ready(function() {
        
            // sidebar navigation
            $('.metismenu').metisMenu();
        
            // sidebar nav scrolling
            $('#left-sidebar .sidebar-scroll').slimScroll({
                height: 'calc(100vh - 65px)',
                wheelStep: 10,
                touchScrollStep: 50,
                color: '#efefef',
                size: '2px',
                borderRadius: '3px',
                alwaysVisible: false,
                position: 'right',
            });
        
            // cwidget scroll
            $('.cwidget-scroll').slimScroll({
                height: '263px',
                wheelStep: 10,
                touchScrollStep: 50,
                color: '#efefef',
                size: '2px',
                borderRadius: '3px',
                alwaysVisible: false,
                position: 'right',
            });
        
            // toggle fullwidth layout
            $('.btn-toggle-fullwidth').on('click', function() {
                if(!$('body').hasClass('layout-fullwidth')) {
                    $('body').addClass('layout-fullwidth');
                    $(this).find(".fa").toggleClass('fa-arrow-left fa-arrow-right');
        
                } else {
                    $('body').removeClass('layout-fullwidth');
                    $(this).find(".fa").toggleClass('fa-arrow-left fa-arrow-right');
                }
            });
        
            // off-canvas menu toggle
            $('.btn-toggle-offcanvas').on('click', function() {
                $('body').toggleClass('offcanvas-active');
            });
        
            $('#main-content').on('click', function() {
                $('body').removeClass('offcanvas-active');
            });
        
            // adding effect dropdown menu
            $('.dropdown').on('show.bs.dropdown', function() {
                $(this).find('.dropdown-menu').first().stop(true, true).animate({
                    top: '100%'
                }, 200);
            });
        
            $('.dropdown').on('hide.bs.dropdown', function() {
                $(this).find('.dropdown-menu').first().stop(true, true).animate({
                    top: '80%'
                }, 200);
            });
        
            // navbar search form
            $('.navbar-form.search-form input[type="text"]')
            .on('focus', function() {
                $(this).animate({
                    width: '+=50px'
                }, 300);
            })
            .on('focusout', function() {
                $(this).animate({
                    width: '-=50px'
                }, 300);
            });
        
            // Bootstrap tooltip init
            if($('[data-toggle="tooltip"]').length > 0) {
                $('[data-toggle="tooltip"]').tooltip();
            }
        
            if($('[data-toggle="popover"]').length > 0) {
                $('[data-toggle="popover"]').popover();
            }
        
            $(window).on('load', function() {
                // for shorter main content
                if($('#main-content').height() < $('#left-sidebar').height()) {
                    $('#main-content').css('min-height', $('#left-sidebar').innerHeight() - $('footer').innerHeight());
                }
            });
        
            $(window).on('load resize', function() {
                if($(window).innerWidth() < 420) {
                    $('.navbar-brand logo.svg').attr('src', '../assets/images/logo-icon.svg');
                } else {
                    $('.navbar-brand logo-icon.svg').attr('src', '../assets/images/logo.svg');
                }
            });
        
        });
        
        // toggle function
        $.fn.clickToggle = function( f1, f2 ) {
            return this.each( function() {
                var clicked = false;
                $(this).bind('click', function() {
                    if(clicked) {
                        clicked = false;
                        return f2.apply(this, arguments);
                    }
        
                    clicked = true;
                    return f1.apply(this, arguments);
                });
            });
        
        };
        
        // Select all checkbox
        $('.select-all').on('click',function(){
           
            if(this.checked){
                $(this).parents('table').find('.checkbox-tick').each(function(){
                this.checked = true;
                });
            }else{
                $(this).parents('table').find('.checkbox-tick').each(function(){
                this.checked = false;
                });
            }
            });
        
            $('.checkbox-tick').on('click',function(){   
            if($(this).parents('table').find('.checkbox-tick:checked').length == $(this).parents('table').find('.checkbox-tick').length){
                $(this).parents('table').find('.select-all').prop('checked',true);
            }else{
                $(this).parents('table').find('.select-all').prop('checked',false);
            }
        });
        
        window.lucid= {
            colors: {
                'blue': '#467fcf',
                'blue-darkest': '#0e1929',
                'blue-darker': '#1c3353',
                'blue-dark': '#3866a6',
                'blue-light': '#7ea5dd',
                'blue-lighter': '#c8d9f1',
                'blue-lightest': '#edf2fa',
                'azure': '#45aaf2',
                'azure-darkest': '#0e2230',
                'azure-darker': '#1c4461',
                'azure-dark': '#3788c2',
                'azure-light': '#7dc4f6',
                'azure-lighter': '#c7e6fb',
                'azure-lightest': '#ecf7fe',
                'indigo': '#6574cd',
                'indigo-darkest': '#141729',
                'indigo-darker': '#282e52',
                'indigo-dark': '#515da4',
                'indigo-light': '#939edc',
                'indigo-lighter': '#d1d5f0',
                'indigo-lightest': '#f0f1fa',
                'purple': '#a55eea',
                'purple-darkest': '#21132f',
                'purple-darker': '#42265e',
                'purple-dark': '#844bbb',
                'purple-light': '#c08ef0',
                'purple-lighter': '#e4cff9',
                'purple-lightest': '#f6effd',
                'pink': '#f66d9b',
                'pink-darkest': '#31161f',
                'pink-darker': '#622c3e',
                'pink-dark': '#c5577c',
                'pink-light': '#f999b9',
                'pink-lighter': '#fcd3e1',
                'pink-lightest': '#fef0f5',
                'red': '#e74c3c',
                'red-darkest': '#2e0f0c',
                'red-darker': '#5c1e18',
                'red-dark': '#b93d30',
                'red-light': '#ee8277',
                'red-lighter': '#f8c9c5',
                'red-lightest': '#fdedec',
                'orange': '#fd9644',
                'orange-darkest': '#331e0e',
                'orange-darker': '#653c1b',
                'orange-dark': '#ca7836',
                'orange-light': '#feb67c',
                'orange-lighter': '#fee0c7',
                'orange-lightest': '#fff5ec',
                'yellow': '#f1c40f',
                'yellow-darkest': '#302703',
                'yellow-darker': '#604e06',
                'yellow-dark': '#c19d0c',
                'yellow-light': '#f5d657',
                'yellow-lighter': '#fbedb7',
                'yellow-lightest': '#fef9e7',
                'lime': '#7bd235',
                'lime-darkest': '#192a0b',
                'lime-darker': '#315415',
                'lime-dark': '#62a82a',
                'lime-light': '#a3e072',
                'lime-lighter': '#d7f2c2',
                'lime-lightest': '#f2fbeb',
                'green': '#5eba00',
                'green-darkest': '#132500',
                'green-darker': '#264a00',
                'green-dark': '#4b9500',
                'green-light': '#8ecf4d',
                'green-lighter': '#cfeab3',
                'green-lightest': '#eff8e6',
                'teal': '#2bcbba',
                'teal-darkest': '#092925',
                'teal-darker': '#11514a',
                'teal-dark': '#22a295',
                'teal-light': '#6bdbcf',
                'teal-lighter': '#bfefea',
                'teal-lightest': '#eafaf8',
                'cyan': '#17a2b8',
                'cyan-darkest': '#052025',
                'cyan-darker': '#09414a',
                'cyan-dark': '#128293',
                'cyan-light': '#5dbecd',
                'cyan-lighter': '#b9e3ea',
                'cyan-lightest': '#e8f6f8',
                'gray': '#868e96',
                'gray-darkest': '#1b1c1e',
                'gray-darker': '#36393c',
                'gray-dark': '#6b7278',
                'gray-light': '#aab0b6',
                'gray-lighter': '#dbdde0',
                'gray-lightest': '#f3f4f5',
                'gray-dark': '#343a40',
                'gray-dark-darkest': '#0a0c0d',
                'gray-dark-darker': '#15171a',
                'gray-dark-dark': '#2a2e33',
                'gray-dark-light': '#717579',
                'gray-dark-lighter': '#c2c4c6',
                'gray-dark-lightest': '#ebebec'
            }
          };
    }
}

export const LucidComponents = Components

export default Lucid;