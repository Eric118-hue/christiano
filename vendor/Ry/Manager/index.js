import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Ry from '../Core/Ry';
import Ckeditor from '../Core/Ckeditor';
import Dropzone from '../Core/dropzone';
import trans, {nophoto, LOADINGEND, LOADINGSTART} from '../../../app/translations';
import Dashboard from './Dashboard';
//import Themes from './Themes';

//__webpack_public_path__ = 'http://www.centrale.wr:3000/'

class Manager
{
	constructor(components) {
		this.components = components
		this.$ry = $;
		$("script[type='application/ld+json']").each(function(){
            let text = $(this).text()
            const content = JSON.parse(text?text:'{}');
            if(content.ckeditor) {
				for(let i=0; i<content.ckeditor.modules.length; i++) {
					Ckeditor.addModule(content.ckeditor.modules[i])
				}
			}
        });
		this.ckeditor = Ckeditor
		this.bootstrap();
		const overlay = $('<div><div></div></div>');
		$("body").append(overlay);
		ReactDOM.render(<Ry class="Core.Core" components={this.components}/>, overlay[0]);
	}

	bootstrap() {
		const dis = this
		$('select').not(".select-default").selectpicker({
            noneSelectedText: '--',
            container: 'body'
        });
		$("script[type^='application/json+ry']").each(function(){
			const elementname = $(this).attr('type').replace('application/json+ry', '');
			let text = $(this).text()
			const content = JSON.parse(text?text:'{}');
			Ry.setGlobal(elementname, content)
			const id = $(this).attr('id') || $(this).parent().attr('name');
			ReactDOM.render(<Ry class={elementname} content={content} id={id} components={dis.components}/>, $(this).parent()[0])
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
				dictCancelUpload: trans('Annuler'),
            	dictCancelUploadConfirmation: trans("Êtes-vous certain d'annuler le transfert?"),
				dictInvalidFileType: trans(`Ce type de fichier n'est pas pris en charge`),
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

const Components = {
	Dashboard : Dashboard,
	Manager : Manager,
	//Themes : Themes
}

export default Components;
