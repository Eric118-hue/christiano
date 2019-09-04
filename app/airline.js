import Lucid, {LucidComponents, LucidWrapper, Wrapper} from '../vendor/lucid';
import './airline.scss';
import '../medias/fonts/leg2.css';
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Ry from '../vendor/Ry/Core/Ry';
import Dropzone from '../vendor/Ry/Core/dropzone';
import trans, {nophoto, LOADINGEND, LOADINGSTART} from './translations';
import __OPTIONTREE from '../vendor/Ry/Core/OptionTree';
import __ADMINTOOLS from '../vendor/Ry/Admin/AdminTools';
import __NAVIGATION_BY_ROLE from '../vendor/Ry/Admin/NavigationByRole';

import __CORE from '../vendor/Ry/Core/Core';
import __TRANSLATOR, {TraductionsDialog, Languages} from '../vendor/Ry/Admin/Translator';
import __USER from '../vendor/Ry/Admin/User';
import __CHART from '../vendor/Ry/Core/Charts';
import __EMAILS from '../vendor/Ry/Profile/Emails';
import __EDITOR from '../vendor/Ry/Profile/Editor';
import __CATEGORIES from '../vendor/Ry/Categories';
import __TUTO from '../vendor/Ry/Core/Tuto';
import __CARDIT from '../vendor/Ry/Cardit';
import __AIRLINE from '../vendor/Ry/Airline';

const Components = {
    Ry : {
        Admin : {
            User : __USER,
            Languages : Languages,
            AdminTools : __ADMINTOOLS,
            NavigationByRole : __NAVIGATION_BY_ROLE,
            Translator : __TRANSLATOR,
            Traductions : TraductionsDialog
        },
        Categories : __CATEGORIES,
        Profile : {
            Contact : __EMAILS,
            Editor : __EDITOR
		},
		Cardit : __CARDIT,
		Airline : __AIRLINE
    },
    Core : {
        Core : __CORE,
        Tuto : __TUTO,
        OptionTree : __OPTIONTREE,
        Chart : __CHART
    },
	Lucid : LucidComponents
}

class Cardit
{
	constructor() {
		this.$ry = $;
		this.bootstrap();
		const overlay = $('<div><div></div></div>');
		$("body").append(overlay);
		ReactDOM.render(<Ry class="Core.Core" components={Components}/>, overlay[0]);
	}

	bootstrap() {
		const dis = this
		$("script[type^='application/json+ry']").each(function(){
			const elementname = $(this).attr('type').replace('application/json+ry', '');
			let text = $(this).text()
			const content = JSON.parse(text?text:'{}');
			Ry.setGlobal(elementname, content)
			const id = $(this).attr('id') || $(this).parent().attr('name');
			ReactDOM.render(<Ry class={elementname} content={content} id={id} components={Components}/>, $(this).parent()[0])
		});
		$("img").each(function(){
			$(this).on('error', function(){
				if(!$(this).data('broken'))
					this.src = nophoto;
				else
					this.src = $(this).data('broken')
			});
		});
		$("input:file").change(function(){
			let imgContainer = $(this).siblings('img');
			if(imgContainer.length==0 && $(this).data("preview-target")) {
				imgContainer = $($(this).data("preview-target"));
			}
			if (this.files && this.files.length>0) {
				var reader = new FileReader();
			
				reader.onload = function(e) {
					imgContainer.attr('src', e.target.result);
				};
			
				reader.readAsDataURL(this.files[0]);
			}
		});
		$("[data-dropzone-action]").each(function(){
			if(this.dropzone)
				return;
			const dz = new Dropzone(this, {
				url : $(this).data('dropzone-action'),
				paramName : $(this).data('name'),
				acceptedFiles: '.png,.jpg,.jpeg,.gif',
				dictCancelUpload: trans('annuler'),
            	dictCancelUploadConfirmation: trans('etes_vous_certain_dannuler_le_transfert'),
				dictInvalidFileType: trans(`ce_type_de_fichier_nest_pas_autorise`),
				previewTemplate: `<div style="display: none;"></div>`,
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			})
			const LOGOadded = (file) => {
				const imgContainer = $($(this).data("preview-target"));
				var reader = new FileReader();
	
				reader.onload = function (e) {
					imgContainer.attr('src', e.target.result);
				};
	
				reader.readAsDataURL(file);
			};
			dz.on('addedfile', LOGOadded);
			dz.on("sending", ()=>LOADINGSTART($(this).data('name')));
        	dz.on("complete", ()=>LOADINGEND($(this).data('name')));
		});
		$('form').parsley({
			excluded : ':hidden'
		});
	}
}

class Leg2LucidWrapper extends LucidWrapper
{
    render() {
        return <Wrapper data={this.props.content} style={{minWidth:960}}>
            <Ry class={this.props.content.view} content={this.props.content} components={this.props.components}/>
            <div className="ry-float-loading">
		    	<div className="ry loading-content">
		    		<i className="fa fa-2x fa-sync-alt fa-spin"></i> {trans("patientez")}
		    	</div>
		    </div>
        </Wrapper>
    }
}

class Leg2Lucid extends Lucid
{
    wrap() {
        const dis = this
        $("script[type='application/ld+json']").each(function(){
            let text = $(this).text()
            const content = JSON.parse(text?text:'{}');
            ReactDOM.render(<Leg2LucidWrapper content={content} components={dis.components}/>, $(this).parent()[0])
        });
    }
}

const lucid = new Leg2Lucid(Components)
lucid.theme({

})
lucid.render()
const ry = new Cardit(Components)

export const instance = ry

export const version = 1.0;