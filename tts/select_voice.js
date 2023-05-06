function formatState (state) {
  if (!state.id) {
    return state.text;
  }
  var code_text = state.id;
  var flag_code = code_text.substr(-2);	// export 2 char code from last "fil-ph"
	if(flag_code === "XA") flag_code = "AE";
	if(state.text === "22. Basque (Basque) - ES") flag_code = "basque";
  var baseUrl = "/user/pages/images/flags";
  var $state = $(
    '<span><img src="' + SITE_ROOT + '/images/lang/' + flag_code.toLowerCase() + '.jpg" class="img-flag" /> ' + state.text + '</span>'
  );
  return $state;
};

// Server Bin
var obj_lang_bin_voice = JSON.parse(lang_bin_voice);
var obj_demo_voice_bin = JSON.parse(lang_bin_voice_have_demo);
var div_voice_name_bin = $('#voice_name_bin');
$('select[name=select_lang_bin]').on('change', function() {
	var sel_lang = this.value;
	div_voice_name_bin.empty();
	// alert(sel_lang);
	obj_lang_bin_voice[sel_lang]['voice'].forEach(function(entry) {
		
		// Check demo voice
		if(obj_demo_voice_bin[entry.voiceIDplay]){
			span_play = '<audio preload="none" id="' + entry.voiceIDplay + '" src="https://demovoice.ttsfree.com/previews/bin/' + entry.voiceIDplay + '.wav"> Your browser does not support the audio element. </audio>'
					+ '<span title="Play Demo" class="play-btn text-success audio-buttons" data-id="' + entry.voiceIDplay + '" style="cursor:pointer" onclick="playDemo(\'' + entry.voiceIDplay + '\')"><i class="far fa-play-circle"></i></span>'
					+ '<span title="Stop Demo" class="stop-btn text-danger audio-buttons hidden" data-id="' + entry.voiceIDplay + '" style="cursor:pointer" onclick="stopDemo(\'' + entry.voiceIDplay + '\')"><i class="far fa-stop-circle"></i></span>';
		}else{
			span_play = '<span title="No demo sound" class="text-secondary" style="cursor:pointer"><i class="far fa-play-circle"></i></span>';
		}
		
		// Gender
		if(entry.voiceGender == "Female" || entry.voiceGender == "FEMALE"){
			img_gender = '' + SITE_ROOT + '/images/Female.png';
		}else{
			img_gender = '' + SITE_ROOT + '/images/Male.png';
		}
		div_html = '<div class="radio radio-choose-voice"><label><input type="radio" name="voice" id="' + entry.voiceID + '" value="' + entry.voiceID + '" > <img height="16" src="' + SITE_ROOT + '/images/icon-voice-gender-' + entry.voiceGender + '.png"> <b>' + entry.voiceName + '</b></label></div>';
		
		div_html = '<div class="form-check icheck-info text-left item_voice" style="margin: 0 !important; padding: 5px;">'
					+ '<input id="radioPrimary' + entry.voiceID + '" class="form-check-input voice-selection" type="radio" name="voice_bin" value="' + entry.voiceID + '" data-lang="af-ZA" data-humanname="Voice-A" data-gender="FEMALE">'
					+ '<label class="form-check-label" for="radioPrimary' + entry.voiceID + '" style="vertical-align: middle;"> <img class="img-circle" width="45" height="45" src="'+img_gender+'" alt="message user image">'
					+ '	<div style="display: inline-block;text-align: left;vertical-align: middle;width: 150px; margin-right: 10px; margin-left: 10px"> ' + entry.voiceName + ' </div>'
					+ '</label>&nbsp;&nbsp;'
					+ span_play + ''
					+ '</div>';
		
		div_voice_name_bin.append(div_html);
	});
	$("input[type=radio][name=voice_bin]:first").attr('checked', true);
	$("input[type=radio][name=voice_bin]:first").parent().addClass( "item_voice_selected" );
	// div_voice_name_bin.html(sel_lang);
	
});

// Server GOO
var obj_lang_goo_voice = JSON.parse(lang_goo_voice);
var obj_demo_voice_goo = JSON.parse(lang_goo_voice_have_demo);
var div_voice_name_goo = $('#voice_name_goo');
$('select[name=select_lang_goo]').on('change', function() {
	var sel_lang = this.value;
	div_voice_name_goo.empty();
	// alert(sel_lang);
	obj_lang_goo_voice[sel_lang]['voice'].forEach(function(entry) {
		
		// Check demo voice
		if(obj_demo_voice_goo[entry.voiceID]){
			span_play = '<audio preload="none" id="' + entry.voiceID + '" src="https://demovoice.ttsfree.com/previews/goo/' + entry.voiceID + '.wav"> Your browser does not support the audio element. </audio>'
					+ '<span title="Play Demo" class="play-btn text-primary audio-buttons" data-id="' + entry.voiceID + '" style="cursor:pointer" onclick="playDemo(\'' + entry.voiceID + '\')"><i class="far fa-play-circle"></i></span>'
					+ '<span title="Stop Demo" class="stop-btn text-danger audio-buttons hidden" data-id="' + entry.voiceID + '" style="cursor:pointer" onclick="stopDemo(\'' + entry.voiceID + '\')"><i class="far fa-stop-circle"></i></span>';
		}else{
			span_play = '<span title="No demo sound" class="text-secondary" style="cursor:pointer"><i class="far fa-play-circle"></i></span>';
		}
		
		// Voice premium
		label_premium = '';
		class_disabled = '';
		if(entry.voiceType == "Wavenet"){
			label_premium = '&nbsp;<span class="badge rounded-pillv bg-secondary text-white">Premium</span>';
			if(CURRENT_PLAN != "Premium"){
				class_disabled = ' disabled';
			}
		}
		
		// Voice Neural
		label_neural = '';
		class_hiden = '';
		if(entry.voiceType == "Neural"){
			class_hiden = ' item_voice_neural';
		}
		
		// Gender
		if(entry.voiceGender == "Female" || entry.voiceGender == "FEMALE"){
			img_gender = '' + SITE_ROOT + '/images/Female.png';
		}else{
			img_gender = '' + SITE_ROOT + '/images/Male.png';
		}
		div_html = '<div class="radio radio-choose-voice"><label><input type="radio" name="voice" id="' + entry.voiceID + '" value="' + entry.voiceID + '" > <img height="16" src="' + SITE_ROOT + '/images/icon-voice-gender-' + entry.voiceGender + '.png"> <b>' + entry.voiceName + '</b></label></div>';
		
		div_html = '<div class="form-check icheck-info text-left item_voice ' + class_hiden + '" style="margin: 0 !important; padding: 5px;">'
					+ '<input ' + class_disabled + ' id="radioPrimary' + entry.voiceID + '" class="form-check-input voice-selection" type="radio" name="voice_goo" value="' + entry.voiceID + '" data-lang="af-ZA" data-humanname="Voice-A" data-gender="FEMALE">'
					+ '<label class="form-check-label" for="radioPrimary' + entry.voiceID + '" style="vertical-align: middle;"> <img class="img-circle" width="45" height="45" src="'+img_gender+'" alt="message user image">'
					+ '	<div style="display: inline-block;text-align: left;vertical-align: middle;width: 150px; margin-right: 10px; margin-left: 10px"> ' + entry.voiceName + ' </div>'
					+ '</label>&nbsp;&nbsp;'
					+ span_play + ''
					+ label_premium + ''
					+ '</div>';
		
		div_voice_name_goo.append(div_html);
	});
	$(".item_voice_neural").remove();	// Remove voice Neural
	$("input[type=radio][name=voice_goo]:first").attr('checked', true);
	$("input[type=radio][name=voice_goo]:first").parent().addClass( "item_voice_selected" );
	// div_voice_name_bin.html(sel_lang);
	
});

// Change style voice selected
$(document).on('change', 'input[type=radio][name=voice_bin]', function() { 
	// alert("checkbox");
	$('#tab_voice_bin .item_voice').removeClass("item_voice_selected");
	$(this).parent().toggleClass("item_voice_selected");
});
$(document).on('change', 'input[type=radio][name=voice_goo]', function() { 
	// alert("checkbox");
	$('#tab_voice_goo .item_voice').removeClass("item_voice_selected");
	$(this).parent().toggleClass("item_voice_selected");
});

// Play Demo voice
function playDemo(id) {
	// Pause all audio
	$("audio").each(function () {this.pause();});
	
	// All Play show
	$('.play-btn').removeClass("hidden");
	// All stop hidden
	$('.stop-btn').addClass("hidden");
	
	document.getElementById(id).play();
	$('.play-btn[data-id="' + id + '"]').addClass("hidden");
	$('.stop-btn[data-id="' + id + '"]').removeClass("hidden");
}
function stopDemo(id) {
	document.getElementById(id).pause();
	$('.play-btn[data-id="' + id + '"]').removeClass("hidden");
	$('.stop-btn[data-id="' + id + '"]').addClass("hidden");
}
