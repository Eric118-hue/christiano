import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Ry from '../Core/Ry';
import homme from '../../../medias/images/profil-homme.jpg';
import __TRANSLATOR, {Languages, TraductionsDialog} from './Translator';
import User from './User';
import AdminTools from './AdminTools';
import NavigationByRole from './NavigationByRole';
import Authorizations from './Authorizations';
import Events from './Events';
import Alert from './Alert';
import SetupTree from './SetupTree';

class Admin
{
	constructor(components) {
		this.components = components
		this.bootstrap()
		const overlay = $('<div></div>');
		$("body").append(overlay);
		ReactDOM.render(<Ry class="Core.Core" components={this.components}/>, overlay[0]);
	}

	bootstrap() {
		const dis = this
		$("script[type^='application/json+ry']").each(function(){
			const elementname = $(this).attr('type').replace('application/json+ry', '');
			const content = JSON.parse($(this).text());
			const id = $(this).attr('id') || $(this).parent().attr('name');
			ReactDOM.render(<Ry class={elementname} content={content} id={id} components={dis.components}/>, $(this).parent()[0])
		});
		$("img").each(function(){
			$(this).on('error', function(){
				this.src = homme;
			});
		});
		$("input:file").change(function(){
			const imgContainer = $(this).siblings('img')
			if (this.files && this.files.length>0) {
				var reader = new FileReader();
			
				reader.onload = function(e) {
					imgContainer.attr('src', e.target.result);
				}
			
				reader.readAsDataURL(this.files[0]);
			}
		});
	}
}

const components = {
	Admin : Admin,
	User : User,
	Languages : Languages,
	AdminTools : AdminTools,
	NavigationByRole : NavigationByRole,
	Translator : __TRANSLATOR,
	Traductions : TraductionsDialog,
	Authorizations: Authorizations,
	Events : Events,
	Alert : Alert,
	SetupTree : SetupTree
}

//__webpack_public_path__ = 'http://www.centrale.wr:3000/'
export default components;
