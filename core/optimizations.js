import $ from 'jquery';
import swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import trans from '../core/translations';
import querystring from 'querystring';

$(document).ajaxSend(function(event, state, ajax){
	if(ajax.isPagination) {
		let url = ajax.url
		let queryparts = url.split(/\?/)
		if(queryparts.length>1) {
			let queries = querystring.parse(queryparts[1])
			delete queries.json
			delete queries.ry
			url = queryparts[0]+'?'+querystring.stringify(queries)
		}
		window.history.pushState({},"", url)
	}
});

$(document).ajaxStart(function() {
    $( "body" ).addClass("ry-loading");
});

$(document).ajaxError(function(event, response) {
    $( "body" ).removeClass("ry-loading");
    let errorText = (response.responseJSON && response.responseJSON.message) ? response.responseJSON.message : trans('une_erreur_sest_produite');
    switch(response.status) {
    	case 403:
    		errorText = trans("cette_action_nest_pas_autorisee_veuillez_contacter_ladministrateur_pour_vous_accorder_ce_droit");
			break;
		case 419:
		case 401:
			window.location.reload();
			errorText = trans("cette_session_a_expire");
			break;
	}
	if(response.status) {
		swal({
			title: `Erreur ${response.status}!`,
			text: errorText,
			type: 'error'
		});
	}
});

$(window).bind("beforeunload",function(event) {
	if($(".confirmquit").length>0 || $(".ry-loading").length>0) {
		return "Veuillez cliquer sur enregistrer avant de quitter cette page";
	}
});

$(document).ajaxStop(function() {
    $( "body" ).removeClass("ry-loading");
});
