import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'bootstrap-select';
import 'bootstrap-select/sass/bootstrap-select.scss';
import 'jquery-form/src/jquery.form';
const CKEDITOR = window.CKEDITOR;

class Overlays extends Component
{	
	constructor(props) {
		super(props)
		this.state = {
			title : '',
			display : 'modal-lg'
		}
	}
	
	componentDidMount() {
		const store = this.props.store
		const modalcontent = this.refs.modalcontent
		store.subscribe(()=>{
			const state = store.getState()
			if(state.type==="dialog") {
				if(state.display) {
					this.setState({
						display : state.display
					})
				}
				else {
					this.setState({
						display : 'modal-lg'
					})
				}
				let f = function(){
					ReactDOM.unmountComponentAtNode(modalcontent);
					$(modalcontent).html('');
					$.ajax({
						contentType: state.contentType?state.contentType:'application/x-www-form-urlencoded; charset=UTF-8',
						url : state.url,
						type : state.method,
						data : state.data,
						success : function(data){
							$(modalcontent).html(data);
							Ry.instance.bootstrap();
							$("#myModal").off("show.bs.modal", f);
							$('.modal form').not('.custom-hide').ajaxForm({
								beforeSerialize: function($form, options) {
									if(CKEDITOR && CKEDITOR.instances) {
										for (var instance in CKEDITOR.instances)
        									CKEDITOR.instances[instance].updateElement();
									}
									if($form.find("input:hidden[name='ry']").length>0) {
										const raw = $form.find("input:hidden[name='ry']")[0].ry.getRaw();
										options.data = Array.isArray(raw) ? {'ry.array':raw} : raw
									}
								},
								success : function(response){
									$("#myModal").modal('hide');
									if(response.type)
										store.dispatch(response);
								}
							});
						},
						error : function(response){
							$("#myModal").modal('hide');
						}
					});
				};
				$("#myModal").on("show.bs.modal", f);
				$("#myModal").on("hide.bs.modal", function(){
					store.dispatch({
						type : 'dialog.close',
						url : state.url
					})
				})
				$("#myModal").modal('show');
			}
		})
	}
	
	render() {
		return <div className="modal fade" id="myModal" role="dialog">
		  <div className={`modal-dialog ${this.state.display}`} role="document">
		    <div className="modal-content" ref="modalcontent">
		      
		    </div>
		  </div>
		</div>
	}
}

export default Overlays;
