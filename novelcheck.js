// Novel Checker js

function get_id(id){
	return document.getElementById(id);
}

function html_escape(s){
	return s.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function book_change(){
	get_id('book_val').value = get_id('book').value;
}

function area_clear(){
	document.mainform.maintext.value = "";
}

function open_option(){
	if(get_id('check_options').style.display == 'none'){
		get_id('check_options').style.display = 'block';
	}else{
		get_id('check_options').style.display = 'none'
	}
}
function area_sample(){
	var sample = '';
	sample += '　地の文。\n';
	sample += '行頭空白。\n';
	sample += '　「空白括弧」\n';
	sample += '　疑問符の後の空白？　です？例外：「括弧の直前？」連続！？　疑問符！！！\n';
	sample += '「大丈夫です？……」「大丈夫です……？」\n';
	sample += '句読後の空白、　句点後の空白。　行末でも有効。　\n';
	sample += '「セリフの句読点括弧。」\n';
	sample += '『あいうえお。\n';
	sample += '　かきくけこ。(さしすせそ。「「「括弧のネスト」」」)』\n';
	sample += '【括弧の対応がおかしいのも検出します」\n';
	sample += '　句読点連続、のチェック、、句点のチェック。。\n';
	sample += '　三点リーダ…または・・・正しいのは2の倍数個……\n';
	sample += '　ダッシューーまたは―正しいのは2の倍数個またの名をダーシ――\n';
	sample += '　行末が句読点括弧以外の場所は閉じ括弧ミスか。忘れの可能性があります\n';
	sample += '　ASCIIの半角123、ABC、全角１２３、ＡＢＣ、ａｂｃ。\n';
	sample += '　巫女　味噌　魑魅魍魎　囁く　聳える　😀👾🍄\n';
	sample += '　二クキュウ　インドへ　へクタール　チ－ト　ニ個　二ーチェ\n';
	sample += '■補足\n';
	sample += '　ダッシュには「あほーー」のような伸ばし棒が2つ以上の場合も警告表示されてしまいますが、問題ない場合もあります。ダッシュと伸ばし棒の書き間違いなら修正してください。\n'
	sample += '　空白括弧には行頭に行に埋め込まれた括弧文があるとそれも警告されてしまいます。\n'
	sample += '　常用漢字のリストには第三水準の「塡剝頰𠮟」を含めていません。「塡剝頰」は表外漢字の警告対象です。「𠮟」はサロゲート漢字として検出されます。\n';
	sample += '■第二話\n';
	sample += '　このように1文字目に置いてある■◆●▲▼のうち最初に現れるものを話の区切りと認識して、各話ごとの本文の文字数(改行空白を除く)を数えます。\n';
	sample += '　平均-1は末尾に「■終了」などのマークがあっても一つ少ない話数でカウントできるようになっています。\n';
	get_id('maintext').value = sample;
}

function fixnum(i){
	return ("_____" + i).substr(-6);
}

function is_kanji(c){
	if((0x4e00 <= c && c <= 0x9fcf)
		|| (0x3400 <= c && c <= 0x4dbf)
		|| (0xf900 <= c && c <= 0xfadf)){
		return true;
	}
	return false;
}

function surrogate_to_codepoint(s){
	var c0 = s.charCodeAt(0);
	var c1 = s.charCodeAt(1);
	c0 &= 0x3FF;
	c1 &= 0x3FF;
	return ((c0 << 10) | c1) + 0x10000;
}

function file_opens(e){
	read_files(e.target.files);
}

function read_files(files){
	var file_size = 0;
	for(var i = 0; i < files.length; i++){
		file_size += files[0].size;
	}
	if( 500000 < file_size ){
		if(false == window.confirm('合計ファイルサイズが500KB以上あります。\n' +
				'ファイル読み込みを処理しますか？')){
			return;
		}
	}
	var encoding = 'UTF-8';
	if(get_id('option_sjis').checked){
		encoding = 'Shift_JIS';
	}
	var loader = function(e){
		get_id('maintext').value = e.target.result;
	}
	var reader = new FileReader();
	reader.onload = loader;
	reader.readAsText(files[0], encoding);
}


function start_check(){
	var option_linetop = get_id('option_linetop').checked;
	var option_bracket_indent = get_id('option_bracket_indent').checked;
	var option_question_space = get_id('option_question_space').checked;
	var option_bracket_pair = get_id('option_bracket_pair').checked;
	var option_bracket_pair2 = get_id('option_bracket_pair2').checked;
	var option_bracket_period = get_id('option_bracket_period').checked;
	var option_repeat_period = get_id('option_repeat_period').checked;
	var option_santen = get_id('option_santen').checked;
	var option_dash = get_id('option_dash').checked;
	var option_line_end  = get_id('option_line_end').checked;
	var option_line_end_imp  = get_id('option_line_end_imp').checked;

	var option_full_alnum = get_id('option_full_alnum').checked;
	var option_full_alnum_imp = get_id('option_full_alnum_imp').checked;
	var option_half_alnum = get_id('option_half_alnum').checked;
	var option_half_alnum_imp = get_id('option_half_alnum_imp').checked;
	var option_katakana = get_id('option_katakana').checked;
	var option_katakana_imp = get_id('option_katakana_imp').checked;
	var option_kanji = get_id('option_kanji').checked;
	var option_kanji_imp = get_id('option_kanji_imp').checked;
	var option_kanji_jinmei = get_id('option_kanji_jinmei').checked;
	var option_kanji_jinmei_imp = get_id('option_kanji_jinmei_imp').checked;
	var option_kanji_daiiti = get_id('option_kanji_daiiti').checked;
	var option_kanji_daiiti_imp = get_id('option_kanji_daiiti_imp').checked;
	var option_kanji_ext = get_id('option_kanji_ext').checked;
	var option_kanji_ext_imp = get_id('option_kanji_ext_imp').checked;
	var option_kanji_emoji_imp = get_id('option_kanji_emoji_imp').checked;
	var option_kanji_etc_imp = get_id('option_kanji_etc_imp').checked;
	var option_linenum = get_id('option_linenum').checked;
	var option_view_warning_only = get_id('option_view_warning_only').checked;
	var option_entity = get_id('option_entity').checked;
	var custom_red = get_id('custom_red').value;
	var custom_gray = get_id('custom_gray').value;
	var custom_red_imp = get_id('custom_red_imp').checked;
	var custom_gray_imp = get_id('custom_gray_imp').checked;

	var rule_no_check = '----';

	var text = get_id('maintext').value;
	text = text.replace(/\r\n/g, "\n").replace(/\n+$/g, "");

	var book = get_id('book_val').value;
	var book_line = parseInt(book.replace(/([0-9]+)x([0-9]+)/, "$2"));
	var book_col = parseInt(book.replace(/([0-9]+)x([0-9]+)/, "$1"));
	var kanji_except = get_id('kanji_except').value;

	var line_val = 0;
	var col_val = 0;
	var char_count = 0;
	var char_count_all = 0;
	var line_count = 0;
	var end_line = false;
	for(var i = 0; i < text.length; i++){
		var c1 = text.charAt(i);
		if( c1 === '\n' ){
			col_val = 0;
			line_val++;
			line_count++;
			char_count_all++;
			end_line = true;
		}else{
			end_line = false;
			if( c1 === ' ' ){
				char_count_all++;
			}else if( c1 === '　' ){
				char_count_all++;
			}else if( c1 === '\t' ){
				char_count_all++;
			}else{
				char_count++;
			}
			col_val++;
			if( book_col < col_val ){
				col_val = 1;
				line_val++;
			}
		}
	}
	if( false == end_line ){
		line_val++;
		line_count++;
	}
	char_count_all += char_count;
	var book_val_down = Math.round((line_val) * 10 / book_line);
	var book_val_up = Math.floor(book_val_down / 10);
	book_val_down = book_val_down - book_val_up * 10;

	var char_hira = 0;
	var char_kata = 0;
	var char_kigou = 0;
	var char_ascii = 0;
	var char_kanji = 0;
	for(var i = 0; i < text.length; i++){
		var c2 = text.charAt(i);
		if( -1 !== c2.search(/[ぁ-\u309e]/) ){
			char_hira++;
		}else if( -1 !== c2.search(/[ァ-\u30ff]/) ){
			char_kata++;
		}else if( is_kanji(text.charCodeAt(i)) ){
			char_kanji++;
		}else if( -1 !== c2.search(/[\u0000-\u007f]/) ){
			if(c2 !== '\n'){
				char_ascii++;
			}
		}else{
			var cc = text.charCodeAt(i);
			var cc1 = text.charCodeAt(i + 1);
			var mozi = '';
			if(0xD800 <= cc && cc <= 0xDBFF){
				if(0xDC00 <= cc1 && cc1 <= 0xDFFF){
					mozi = text.substr(i, 2); // サロゲート正常
				}else{
					// 不正シーケンス
					mozi = text.substr(i, 1);
				}
			}else if(0xDC00 <= cc && cc <= 0xDFFF){
				// 不正シーケンス
				mozi = text.substr(i, 1);
			}
			if( 0 < mozi.length){
				if(2 === mozi.length){
					i++;
					var x = surrogate_to_codepoint(mozi);
					if(0x1F300 <= x && x <= 0x1FFFF){
						//絵文字->記号
					}else if(0x20000 <= x && x <= 0x3FFFF){
						//サロゲート漢字
						char_kanji++;
						continue;
					}
					//サロゲートその他
					char_kigou++;
					continue;
				}
				//サロゲート断片
				char_kigou++;
				continue;
			}
			// その他はとりあえず記号
			char_kigou++;
		}
	}

	text = html_escape(text);

	var text_head = '';
	var text_footer = '';
	var text_replace_list = [];
	var text_replace_list_img = [];
	var text_type = 'normal';
	var head_char = '';
	var head_types = '■◆●▲▼';
	if(text.substr(0,8) === '【ユーザ情報】\n'){
		// narou backup format
		var start_one = '\n------------------------- 第1部分開始 -------------------------\n';
		var start_pos = text.indexOf(start_one);
		if(-1 === start_pos){
			// 短編
			start_one = '\n【本文】\n';
			start_pos = text.indexOf(start_one);
		}
		if(-1 !== start_pos){
			text_type = 'backup';
			text_head = text.substr(0, start_pos + start_one.length - 1);
			text = text.substr(start_pos + start_one.length - 1);
			var footer_str = '\n【免責事項】\n本テキストデータの利用';
			var footer_pos = text.indexOf(footer_str);
			if(-1 !== footer_pos){
				text_footer = text.substr(footer_pos + 1);
				text = text.substr(0, footer_pos + 1);
			}
			text = text.replace(/ⓐ/g, 'ⓐⓩ');
			text = text.replace(/^(------------------------- 第\d+部分開始 -------------------------|【(第\d+章|前書き|本文|後書き)】)$/mg, function(s){
				text_replace_list.push(s);
				return '　ⓐⓓ。';
			});
			text = text.replace(/\n【サブタイトル】\n/g, '\n　ⓐⓑ');
			text = text.replace(/^([ \t　]*)\&lt;i(\d+)\|(\d+)\&gt;([ \t　]*)$/mg, function(s){
				text_replace_list_img.push(s);
				return '　ⓐⓒ';
			});
		}
	}
	if(text_type === 'normal' && -1 != text.indexOf('\n----------------\n')){
		text_type = 'narou_dl';
		text = text.replace(/ⓐ/g, 'ⓐⓩ');
		text = text.replace(/^([^\n]+)\n([^\n]+)\n/, function(s){
			text_replace_list.push(s);
			return '　ⓐⓓ。';
		});
		text = text.replace(/^(----------------|(\*{44})|(\*{48}))$/mg, function(s){
			text_replace_list.push(s);
			return '　ⓐⓓ。';
		});
		text = text.replace(/^([ \t　]*)\&amp;lt;i(\d+)\|(\d+)\&amp;gt;([ \t　]*)$/mg, function(s){
			text_replace_list_img.push(s);
			return '　ⓐⓒ';
		});
	}else{
		// text_type === 'normal'
		text.replace(/^[■◆●▲▼]/m, function(s){
				head_char = s;
			});
	}

	var rule_custom_red = 0;
	var rule_custom_gray = 0;
	if(0 < custom_red.length){
		try{
			text = text.replace(new RegExp(custom_red, 'g'), function (s){
					rule_custom_red++;
					return 'ⓐ㊀' + s +'ⓐ㊁';});
		}catch(e){
			alert('カスタム(赤)の正規表現が不正です。\n' + custom_red);
		}
	}else{
		rule_custom_red = rule_no_check;
	}
	if(0 < custom_gray.length){
		try{
			text = text.replace(new RegExp(custom_gray, 'g'), function (s){
					rule_custom_red++;
					return 'ⓐ㊂' + s +'ⓐ㊃';});
		}catch(e){
			alert('カスタム(灰)の正規表現が不正です。\n' + custom_gray);
		}
	}else{
		rule_custom_gray = rule_no_check;
	}

	var rule_half_alnum = 0;
	if( option_half_alnum ){
		text = text.replace(/&lt;/g, "&%;").replace(/&gt;/g, "&%%;").replace(/&amp;/g, "&%%%;");
		if(option_half_alnum_imp){
			text = text.replace(/[a-zA-Z_0-91,.\-]+/g, function(s){
				rule_half_alnum++;
				return '<span class="rule_highlight">{半角英数}</span><span class="rule_half_alnum">' + s + '</span>';
			});
		}else{
			text = text.replace(/[a-zA-Z_0-9,.\-]+/g, function(s){
				rule_half_alnum++;
				return '<span class="rule_half_alnum">' + s + '</span>';
			});
		}
		text = text.replace(/&%;/g, "&lt;").replace(/&%%;/g, "&gt;").replace(/&%%%;/g, "&amp;");
	}else{
		rule_half_alnum = rule_no_check;
	}

	var rule_linetop = 0;
	if(option_linetop){
		text = text.replace(/^[^「『【≪〈《〔（［｛＜\(　\n]/mg, function(s){
			rule_linetop++;
			return '<span class="rule_linetop">{行頭空白}</span>' + s;
		});
	}else{
		rule_linetop = rule_no_check;
	}
	var rule_bracket_indent = 0;
	if(option_bracket_indent){
		text = text.replace(/^[　 \t]+[「『【≪〈《〔（［｛＜\)]/mg, function(s){
			rule_bracket_indent++;
			return '<span class="rule_bracket_indent">{空白括弧}</span>' + s;
		});
	}else{
		rule_bracket_indent = rule_no_check;
	}
	var rule_bracket_period = 0;
	if(option_bracket_period){
		text = text.replace(/[,\.。、，．][」』】≫〉》〕）］｝＞\)]/g, function(s){
			rule_bracket_period++;
			return '<span class="rule_bracket_indent">{句読点括弧}' + s.substr(0,1) + '</span>' + s.substr(1);
		});
	}else{
		rule_bracket_period = rule_no_check;
	}
	var rule_question_space = 0;
	if(option_question_space){
		text = text.replace(/([？！\?\!⁈⁉☆♡♥♪]+)([^？！\?\!])/g, function(s, s1, s2){
			if( -1 == s2.search(/[　」』】≫〉》〕）］｝＞《（\)…―─\n]/) ){
				rule_question_space++;
				return '<span class="rule_question_space">{句読点空白}' + s1 + '</span>' + s2;
			}
			return s;
		});
		text = text.replace(/([、。])([　 \t])/g, function(s, s1, s2){
			rule_question_space++;
			return '<span class="rule_question_space">{句読点空白}' + s + '</span>';
		});
		text = text.replace(/([\n「『【≪〈《〔（［｛＜])([、。])/g, function(s, s1, s2){
			rule_question_space++;
			return s1 + '<span class="rule_question_space">{文頭句読点}' + s2 + '</span>';
		});
		text = text.replace(/([　 \t])([、。])/g, function(s, s1, s2){
			rule_question_space++;
			return s1 + '<span class="rule_question_space">{空白句読点}' + s2 + '</span>';
		});
	}else{
		rule_question_space = rule_no_check;
	}
	var rule_katakana = 0;
	if( option_katakana ){
		if(option_katakana_imp){
			text = text.replace(/[ァ-ヴ･-ﾟ]([ァ-ヴ゛゜゙゚ー]*)/g, function(s){
				rule_katakana++;
				return '<span class="rule_highlight">{カタカナ}</span><span class="rule_katakana">' + s + '</span>';
			});
		}else{
			text = text.replace(/[ァ-ヴ･-ﾟ]([ァ-ヴ゛゜゙゚ー]*)/g, function(s){
				rule_katakana++;
				return '<span class="rule_katakana">' + s + '</span>';
			});
		}
	}else{
		rule_katakana = rule_no_check;
	}

	var rule_santen = 0;
	var rule_santen_mix = false;
	if(option_santen){
		var find_santen = 0;
		text = text.replace(/…+/g, function(s){
			find_santen++;
			if( s.length % 2 !== 0 ){
				rule_santen++;
				return '<span class="rule_santen">{三点リーダ}' + s + '</span>';
			}
			return s;
		});
		var find_santen_ex = 0;
		text = text.replace(/⋯+/g, function(s){
			find_santen_ex++;
			if( s.length % 2 !== 0 ){
				rule_santen++;
				return '<span class="rule_santen">{三点リーダ}' + s + '</span>';
			}
			return s;
		});
		if(0 < find_santen && 0 < find_santen_ex){
			rule_santen_mix = true;
		}
		text = text.replace(/([\(（《]?)(・(・+))([\)）》]?)/g, function(s,g1,g2,g3,g4){
			if(g1 !== '' && g4 !== ''){
				var x = '(（《'.indexOf(g1);
				var y = ')）》'.indexOf(g4);
				if( x !== -1 && x === y ){
					// ルビ
					return s;
				}
			}
			rule_santen++;
			return g1 + '<span class="rule_santen">{三点リーダ}' + g2 + '</span>' + g4;
		});
	}else{
		rule_santen = rule_no_check;
	}


	var rule_bracket_pair = 0;
	var rule_bracket_pair2 = 0;
	var rule_line_end = 0;
	var brackets = 0;
	var prev = true;
	var ignore_mode = false;
	var brackets_line = 0;
	var brackets_types_arr = [];
	var bracket_pair_begin = 0;
	var normal_line = 0;
	var line_type = 0;
	var line_num = 1;
	var in_tag = false;
	var in_mark = false;
	var preg_tag_end = 0;
	var brackets_char = 0;
	var normal_char = 0;
	var prev_eol = false;
	for(var i = 0; i < text.length; i++){
		var mozi = text.charAt(i);
		var brackets_types_1 = "「『【≪〈《〔［｛（([".indexOf(mozi);
		var brackets_types_2 = "」』】≫〉》〕］｝）)]".indexOf(mozi);
		if(prev_eol){
			prev_eol = false;
			if(0 < brackets){
				var s1 = '<span class="rule_bracket_inner' + ((brackets + 3) % 4 + 1) + '">';
				text = text.substr(0, i) + s1 + text.substr(i);
				i += s1.length;
			}
		}
		if( -1 !== brackets_types_1 ){
			brackets_types_arr.push(brackets_types_1);
			brackets++;
			var s1 = '<span class="rule_bracket_inner' + ((brackets + 3) % 4 + 1) + '">';
			if(1 < brackets){
				s1 = '</span>' + s1;
			}
			text = text.substr(0, i) + s1 + text.substr(i);
			i += s1.length;
			prev = false;
			if( line_type === 0 ){
				line_type = 1; // 台詞行
			}
		} else if( -1 !== brackets_types_2 ){
			brackets--;
			if( 0 <= brackets ){
				var postion = brackets_types_arr.length - 1;
				var pos_old = postion;
				for(; 0 <= postion; postion--){
					if( brackets_types_arr[postion] === brackets_types_2 ){
						brackets_types_arr.splice(postion, 1);
						break;
					}
				}
				if( pos_old !== postion ){
					if(option_bracket_pair2){
						var s1 = '<span class="rule_bracket_pair">{括弧対応：種別}</span>';
						text = text.substr(0, i) + s1 + text.substr(i);
						i += s1.length;
						rule_bracket_pair2++;
					}
				}
			}
			if( 0 <= brackets ){
				var s2 = '</span>';
				if(1 <= brackets){
					s2 += '<span class="rule_bracket_inner' + ((brackets + 3) % 4 + 1) + '">';
				}
				text = text.substr(0, i + 1) + s2 + text.substr(i + 1);
				i += s2.length;
			}
			if( brackets < 0 ){
				brackets_types_arr = [];
				brackets = 0;
				if(option_bracket_pair2){
					var s1 = '<span class="rule_bracket_pair">{括弧対応：閉じ}</span>';
					text = text.substr(0, i) + s1 + text.substr(i);
					i += s1.length;
					rule_bracket_pair2++;
				}
			}
			// 閉じ括弧が後で普通の文字換算されてしまうので、ここで調整
			if( 0 === brackets ){
				brackets_char++;
				normal_char--;
			}
			prev = true;
		} else if( -1 !== mozi.search(/[）\)]/) ){
			// 心境の場合は行末可。ルビは考慮外
			prev = true;
		} else if( mozi === '\n' ){
			prev_eol = true;
			var bracket_pair_begin_temp = bracket_pair_begin;
			bracket_pair_begin = brackets;
			if( option_bracket_pair ){
				if(0 < brackets && brackets != bracket_pair_begin_temp){
					var s1 = '<span class="rule_bracket_pair">{括弧内改行}</span>';
					text = text.substr(0, i) + s1 + text.substr(i);
					i += s1.length;
					rule_bracket_pair++;
				}
			}
			if( prev === false && ignore_mode === false && option_line_end){
				if( text.substr(i-1, 1) !== '＞' ){
					// ＞は括弧ではないので個別チェックする(暫定)
					var s3 = '<span class="rule_line_end">＿</span>';
					var s3imp = '<span class="rule_line_end_imp">{行末文字}</span>';
					var s3_;
					if( option_line_end_imp ){
						s3_ = s3imp;
					}else{
						s3_ = s3;
					}
					text = text.substr(0, i) + s3_ + text.substr(i);
					i += s3_.length;
				}
				rule_line_end++;
			}
			prev = true;
			// line_type == 0の空行はカウントしない
			if( line_type === 1 ){
				brackets_line++;
			}else if( line_type === 2 ) {
				normal_line++;
			}
			line_type = 0;
			if(text_type !== 'normal'){
				var sub_head = text.substr(i + 1, 3);
				if(sub_head === '　ⓐⓓ'){
					ignore_mode = true;
					// reset
					for(; 0 < brackets; brackets--){
						var s1 = '<span class="rule_bracket_pair">{括弧対応：未閉じ}</span></span>';
						text = text.substr(0, i) + s1 + text.substr(i);
						i += s1.length;
						rule_bracket_pair2++;
					}
					brackets = 0;
					brackets_types_arr = [];
					bracket_pair_begin = 0;
				}
				if(sub_head === '　ⓐⓑ' || sub_head === '　ⓐⓒ'){
					ignore_mode = true;
				}else{
					ignore_mode = false;
				}
			}else{
				// text_type == normal;
				var head = text.charAt(i + 1);
				var head_sub_match = false;
				if('<' === head){
					if(-1 != text.substr(i + 1, 1000).indexOf('{行頭空白}</span>' + head_char)){
						head_sub_match = true;
					}
				}
				if(head_char !== '' && (head_char === head || head_sub_match)){
					ignore_mode = true;
					// reset
					for(; 0 < brackets; brackets--){
						var s1 = '<span class="rule_bracket_pair">{括弧対応：未閉じ}</span></span>';
						text = text.substr(0, i) + s1 + text.substr(i);
						i += s1.length;
						rule_bracket_pair2++;
					}
					brackets = 0;
					brackets_types_arr = [];
					bracket_pair_begin = 0;
				}else{
					ignore_mode = false;
				}
			}
			if(0 < brackets){
				var s1 = '</span>';
				text = text.substr(0, i) + s1 + text.substr(i);
				i += s1.length;
			}
		} else if( -1 !== mozi.search(/[”〟―…⋯─\.。．？！\?\!⁈⁉!!☆★♡♥♪♫♬♩]/) ){
			prev = true;
		} else {
			if( line_type === 0 ){
				if( 0 < brackets ){
					line_type = 1; // 台詞中の改行の次の行
				}else{
					line_type = 2; // 通常行
				}
			}
			if(option_brank_line && -1 !== mozi.search(/[ \t　]/)){
				prev = true;
			}else{
				prev = false;
			}
		}
		if( mozi !== '\n' ){
			var in_mark2 = in_mark;
			var in_tag2 = in_tag;
			if( mozi === '{' && preg_tag_end === 2){
				in_mark2 = in_mark = true;
			}else if( mozi === '}' ){
				in_mark = false;
			}else if( mozi === '<' ){
				if( 'span ' === text.substr(i + 1, 5)){
					preg_tag_end = 1;
				}
				in_tag2 = in_tag = true;
			}else if( mozi === '>' ){
				in_tag = false;
				preg_tag_end = 2;
			}else{
				if(preg_tag_end === 2){
					preg_tag_end = 0;
				}
			}
			if(in_mark2 || in_tag2){
			}else{
				if( 0 < brackets ){
					brackets_char++;
				}else{
					normal_char++;
				}
			}
		}
	}
	if( brackets != 0 ){
		text = text + '</span>';
	}
	if( line_type === 1 ){
		brackets_line++;
	}else {
		normal_line++;
	}
	var brackets_line_per = Math.round(brackets_line * 100 / (brackets_line + normal_line));
	var brackets_char_per = Math.round(brackets_char * 100 / (brackets_char + normal_char));

	var char_all = char_hira + char_kata + char_kigou + char_ascii + char_kanji;
	if(0 === char_all){
		char_all = 1;
	}
	var char_hira_per = Math.round(char_hira * 100 / (char_all));
	var char_kata_per = Math.round(char_kata * 100 / (char_all));
	var char_kigou_per = Math.round(char_kigou * 100 / (char_all));
	var char_ascii_per = Math.round(char_ascii * 100 / (char_all));
	var char_kanji_per = Math.round(char_kanji * 100 / (char_all));

	if(!option_bracket_pair){
		rule_bracket_pair = rule_no_check;
	}
	if(!option_bracket_pair2){
		rule_bracket_pair2 = rule_no_check;
	}
	if(!option_line_end){
		rule_line_end = rule_no_check;
	}

	var rule_repeat_period = 0;
	if(option_repeat_period){
		text = text.replace(/[。、，．\.]{2,999}/g, function(s){
			rule_repeat_period++;
			return '<span class="rule_repeat_period">{句読点連続}' + s + '</span>';
		});
	}else{
		rule_repeat_period = rule_no_check;
	}
	var rule_dash = 0;
	if(option_dash){
		text = text.replace(/—/g,'―').replace(/―+/g, function(s){
			if( s.length % 2 !== 0 ){
				rule_dash++;
				return '<span class="rule_dash">{ダッシュ}' + s + '</span>';
			}else{
				return s;
			}
		});
		text = text.replace(/ー(ー+)/g, function(s){
			rule_dash++;
			return '<span class="rule_dash">{ダッシュ}' + s + '</span>';
		});
	}else{
		rule_dash = rule_no_check;
	}
	var rule_full_alnum = 0;
	if( option_full_alnum ){
		if(option_full_alnum_imp){
			text = text.replace(/[Ａ-Ｚａ-ｚ０-９－，．]+/g, function(s){
				rule_full_alnum++;
				return '<span class="rule_highlight">{全角英数}</span><span class="rule_full_alnum">' + s + '</span>';
			});
		}else{
			text = text.replace(/[Ａ-Ｚａ-ｚ０-９－，．]+/g, function(s){
				rule_full_alnum++;
				return '<span class="rule_full_alnum">' + s + '</span>';
			});
		}
	}else{
		rule_full_alnum = rule_no_check;
	}

	var rule_kanji = 0;
	var rule_kanji_jinmei = 0;
	var rule_kanji_daiiti = 0;
	var rule_kanji_surrogate = 0;
	if(option_kanji || option_kanji_jinmei || option_kanji_daiiti || option_kanji_ext || option_kanji_emoji_imp || option_kanji_etc_imp){
		var len = text.length;
		var kanji = ret_kanji_list();
		var kanji_jyoyo = kanji.jyoyo;
		var kanji_jinmei = kanji.jinmei;
		var kanji_daiiti = kanji.daiiti;
		for(var i = 0; i < len; i++){
			var cc = text.charCodeAt(i);
			var cc1 = text.charCodeAt(i + 1);
			var mozi = '';
			if(0xD800 <= cc && cc <= 0xDBFF){
				if(0xDC00 <= cc1 && cc1 <= 0xDFFF){
					mozi = text.substr(i, 2); // サロゲート正常
				}else{
					// 不正シーケンス
					mozi = text.substr(i, 1);
				}
			}else if(0xDC00 <= cc && cc <= 0xDFFF){
				// 不正シーケンス
				mozi = text.substr(i, 1);
			}
			if( 0 < mozi.length){
				var name = 'サロゲートその他';
				var warning = false;
				if(2 === mozi.length){
					var x = surrogate_to_codepoint(mozi);
					if(0x1F300 <= x && x <= 0x1FFFF){
						if(option_kanji_emoji_imp){
							name = 'サロゲート絵文字';
							warning = true;
						}else{
							// 警告から除く
							i += 1;
							continue;
						}
					}else if(0x20000 <= x && x <= 0x3FFFF){
						if(option_kanji_ext){
							if(option_kanji_ext_imp){
								name = 'サロゲート漢字';
								warning = true;
							}
						}else{
							i += 1;
							continue;
						}
					}else if(option_kanji_etc_imp){
						warning = true;
					}else{
						i += 1;
						continue;
					}
				}else{
					name = 'サロゲート断片';
					warning = true;
				}
				var s1 ='';
				if(warning){
					s1 = '<span class="rule_highlight">{' + name + '}</span>';
				}
				s1 += '<span class="rule_kanji">';
				var s2 = '</span>';
				text = text.substr(0, i) + s1 + mozi + s2 + text.substr(i + mozi.length);
				var n = s1.length + s2.length + mozi.length - 1;
				len += n;
				i += n;
				rule_kanji_surrogate++;
				continue;
			}
			if(!is_kanji(cc)){
				continue;// 漢字以外
			}
			var c0 = text.charAt(i);
			if(-1 != kanji_jyoyo.indexOf(c0)){
				continue;
			}
			if(-1 != kanji_except.indexOf(c0)){
				continue; // 除外
			}
			if(-1 != kanji_jinmei.indexOf(c0)){
				if(option_kanji_jinmei){
					var s1 = '<span class="rule_kanji_jinmei">';
					if(option_kanji_imp){
						s1 = '<span class="rule_highlight">{人名漢字}</span>' + s1;
					}
					var s2 = '</span>';
					text = text.substr(0, i) + s1 + c0 + s2 + text.substr(i + 1);
					var n = s1.length + s2.length;
					len += n;
					i += n;
					rule_kanji_jinmei++;
				}
				continue;
			}if(-1 != kanji_daiiti.indexOf(c0)){
				if(option_kanji_daiiti){
					var s1 = '<span class="rule_kanji_daiiti">';
					if(option_kanji_daiiti_imp){
						s1 = '<span class="rule_highlight">{第一漢字}</span>' + s1;
					}
					var s2 = '</span>';
					text = text.substr(0, i) + s1 + c0 + s2 + text.substr(i + 1);
					var n = s1.length + s2.length;
					len += n;
					i += n;
					rule_kanji_daiiti++;
				}
				continue;
			}
			{
				if(option_kanji){
					var s1 = '<span class="rule_kanji">';
					if(option_kanji_imp){
						s1 = '<span class="rule_highlight">{表外漢字}</span>' + s1;
					}
					var s2 = '</span>';
					text = text.substr(0, i) + s1 + c0 + s2 + text.substr(i + 1);
					var n = s1.length + s2.length;
					len += n;
					i += n;
					rule_kanji++;
				}
			}
		}
	}
	if(!rule_kanji){
		rule_kanji = rule_no_check;
	}
	if(!option_kanji_jinmei){
		rule_kanji_jinmei = rule_no_check;
	}
	if(!option_kanji_daiiti){
		rule_kanji_daiiti = rule_no_check;
	}

	var custom_span = function (rx_, begin_, end_, imp_, css_){
		var hit_level = false;
		var warning_tag = false;
		var imp_css = imp_ + css_;
		text = text.replace(rx_, function(s){
			if(s === begin_){
				hit_level = true;
				return imp_css;
			}
			if(s === end_){
				hit_level = false;
				return '</span>';
			}
			if(s.substr(0,6)  === '<span '){
				if(s.substr(s.length - 1, 1) === '{'){ //'}'
					warning_tag = true;
					return s;
				}
				if(hit_level){
					return '</span>' + s + css_;
				}
				return s;
			}
			if(warning_tag){
				warning_tag = false;
				return '</span>';
			}
			if(hit_level){
				return '</span></span>' + css_;
			}
			return '</span>';
		});
	}
	if(0 < custom_red.length){
		custom_span(/ⓐ[㊀㊁]|<span ([^\n>]+)>({?)|<\/span>/g, 'ⓐ㊀', 'ⓐ㊁',
			custom_red_imp ? '<span class="rule_highlight">{カスタム赤}</span>' : '',
			'<span class="rule_custom_red">');
	}
	if(0 < custom_gray.length){
		custom_span(/ⓐ[㊂㊃]|<span ([^\n>]+)>({?)|<\/span>/g, 'ⓐ㊂', 'ⓐ㊃',
			custom_gray_imp ? '<span class="rule_highlight">{カスタム灰}</span>' : '',
			'<span class="rule_custom_gray">');
	}

	if(text_type !== 'normal'){
		var replace_count = 0;
		text = text.replace(/　ⓐⓒ/g, function(){
			var x = text_replace_list_img[replace_count];
			replace_count++;
			return x;
		});
		if(text_type === 'backup'){
			text = text.replace(/　ⓐⓑ/g, '【サブタイトル】\n');
		}
		replace_count = 0;
		text = text.replace(/　ⓐⓓ。/g, function(){
			var x = text_replace_list[replace_count];
			replace_count++;
			return x;
		});
		text = text.replace(/ⓐⓩ/g, 'ⓐ');
	}
	if(text_head !== ''){
		text = text_head + text;
	}
	if(text_footer !== ''){
		text += text_footer;
	}

	if(option_entity){
		text = text.replace(/&amp;/g, '&');
	}

	if(option_linenum){
		line_num = 1;
		text = text.replace(/\n/g, function(){
				line_num++;
				return '\n<span class="linenum">' + fixnum(line_num) + ':</span> ';
		});
		text = '<span class="linenum">' + fixnum(1) + ': </span>' + text;
	}

	if(option_view_warning_only){
		text = text.replace(/^.*$/mg, function(s){
				if( -1 != s.search(/<span class="rule_[a-z0-9_]+">{[^\n{}]+}/)){
					return s;
				}
				return '';
		});
		text = text.replace(/\n+/g, "\n");
	}
	if(rule_santen_mix){
		text = '<span class="rule_santen">※{三点リーダ}……(U+2026)と⋯⋯(U+22EF)が混在しています。</span>\n' + text;
	}

	text = text.replace(/\n/g, "<br>\n");

	var rules = '<table class="rule_result">';
	rules += '<tr class="rule_tr"><td class="rule_type">　　項目</td><td class="rule_type">　　値</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">原稿用紙(' + html_escape(book)+ '行)</td><td class="rule_value">' + book_val_up + '.' + book_val_down + '枚</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">文字数(空白改行除く)</td><td class="rule_value">' + char_count + '文字</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">文字数(空白改行含む)</td><td class="rule_value">' + char_count_all + '文字</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">行数</td><td class="rule_value">' + line_count + '行</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">台詞：地の文　台詞率</td><td class="rule_value">' + brackets_line + '：' + normal_line + '行 ' + brackets_line_per + '%';
		rules += ' ／ ' + brackets_char + '：' + normal_char + '文字 ' + brackets_char_per + '%</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">かな: カナ: 漢字: 他: ASCII</td><td class="rule_value">' + char_hira + ': ' + char_kata  + ': ' + char_kanji + ': ' + char_kigou + ': ' + char_ascii + '文字</td></tr>'
	rules += '<tr class="rule_tr"><td class="rule_type">文字種%</td><td class="rule_value">ひら' +
		char_hira_per + ': カタ' + char_kata_per  + ': 漢字' + char_kanji_per + ': 他' + char_kigou_per + ': A' + char_ascii_per + '%</td></tr>'

	rules += '<tr class="rule_tr"><td class="rule_type">　　項目</td><td class="rule_type">　　検出数</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">行頭空白</td><td class="rule_value">　' + rule_linetop + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">空白括弧</td><td class="rule_value">　' + rule_bracket_indent + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">句読点空白</td><td class="rule_value">　' + rule_question_space + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">括弧内改行</td><td class="rule_value">　' + rule_bracket_pair + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">括弧対応</td><td class="rule_value">　' + rule_bracket_pair2 + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">句読点括弧</td><td class="rule_value">　' + rule_bracket_period + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">句読点連続</td><td class="rule_value">　' + rule_repeat_period + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">三点リーダ</td><td class="rule_value">　' + rule_santen + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">ダッシュ</td><td class="rule_value">　' + rule_dash + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">行末文字</td><td class="rule_value">　' + rule_line_end;
	if( option_line_end && false == option_line_end_imp ){
		rules += '　※<span class="rule_line_end">＿</span>(アンダーバー)';
	}
	rules += '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">全角英数</td><td class="rule_value">　' + rule_full_alnum;
	if( option_full_alnum ){
		rules += '　※<span class="rule_full_alnum">背景色</span>'
	}
	rules += '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">半角英数</td><td class="rule_value">　' + rule_half_alnum;
	if( option_half_alnum ){
		rules += '　※<span class="rule_half_alnum">背景色</span>';
	}
	rules += '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">表外漢字(常用人名以外)<br>　+サロゲート</td><td class="rule_value">　' + rule_kanji + '　※<span class="rule_kanji">背景色</span><br>　' + rule_kanji_surrogate + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">人名漢字<br>第一漢字</td><td class="rule_value">　' + rule_kanji_jinmei + '　※<span class="rule_kanji_jinmei">背景色</span><br>　' + rule_kanji_daiiti + '　※<span class="rule_kanji_daiiti">背景色</span></td></tr>';
	if(0 < custom_red.length){
		rules += '<tr class="rule_tr"><td class="rule_type">カスタム赤</td><td class="rule_value">　' + rule_custom_red + '　※<span class="rule_custom_red">背景色</span></td></tr>';
	}
	if(0 < custom_gray.length){
		rules += '<tr class="rule_tr"><td class="rule_type">カスタム灰</td><td class="rule_value">　' + rule_custom_gray + '　※<span class="rule_custom_gray">背景色</span></td></tr>';
	}
	rules += '</table><br>'

	get_id("result").innerHTML = rules + '<div class="resultext">' + text + '</div>';
}

function check_katakana(exp){
	const lines = get_id('maintext').value.split(/\n/);

	const linesCount = lines.length;
	let map = {};
	for(let i = 0; i < linesCount; i++){
		const line = lines[i].replace(/[\r\n]+$/, '');
		if(line == ''){
			continue;
		}
		exp.lastIndex = 0;
		let r;
		while(r = exp.exec(line)){
			const pos = r.index;
			const a = r[0];
			const column = 6;
			let pre = pos - column;
			if(pre < 0){
				pre = 0;
			}
			let after = pos + a.length + column;
			if(line.length < after){
				after = line.length;
			}
			let item = {};
			let end = pos + a.length;
			const aa = map[a];
			if(aa){
				if(aa.pre != '' || aa.after != ''){
					const len = aa.pre.length;
					let pre2 = 0;
					if(len < pos - pre){
						pre2 = 0;
						pre = pos - len;
					}else if(pos - pre < len){
						pre2 = len - (pos - pre);
					}
					const aa_pre = aa.pre;
					let k = pre;
					for(; k < pos; k++){
						const b = line.substr(k, pos - k);
						const c = aa_pre.substr(k - pre + pre2);
						if(b == c){
							break;
						}
					}
					const s1 = line.substr(k, pos - k);
					item['pre'] = s1;
					const aa_after = aa.after;
					k = after;
					for(; end < k; k--){
						const b = line.substr(end, k - end);
						const c = aa_after.substr(0, k - end);
						if(b == c){
							break;
						}
					}
					const s2 = line.substr(end, k - end);
					item['after'] = s2;
					item['count'] = aa.count + 1;
					map[a] = item;
				}else{
					item['pre'] = '';
					item['after'] = '';
					item['count'] = aa.count + 1;
					map[a] = item;
				}
			}else{
				item['pre'] = line.substr(pre, pos - pre);
				item['after'] = line.substr(end, after - end);
				item['count'] = 1;
				map[a] = item;
			}
		}
	}
	let temp = [];
	let i = 0;
	for(let key in map){
		temp[i] = key + '　' + map[key].count;
		if(map[key].pre != '' || map[key].after != ''){
			temp[i] += '　　' + map[key].pre + key + map[key].after;
		}
		i++;
	}
	temp.sort();
	let size = temp.length;
	let output = '';
	for(i = 0; i < size; i++){
		output += temp[i] + '\n';
	}
	return output;
}

function start_check_katakana(){
	var output = "";
	output += "■カタカナ一覧\n";
	output += check_katakana(/[ァ-ヺ][ァ-ヺー゛゜゙゚]*/g);
	output += "\n■前後がひらがな「へ」\n";
	output += check_katakana(/[へべぺ]+[ァ-ヺー゛゜゙゚]+/g);
	output += check_katakana(/[ァ-ヺ][ァ-ヺー゛゜゙゚]*[へべぺ]+/g);
	output += "\n■カナ罫線\n";
	output += check_katakana(/[ァ-ヺ][ァ-ヺー゛゜゙゚]*[―—–‒－−─]+/g);
	output += "\n■漢字[力口□ニ]\n";
	output += check_katakana(/[力口□二][ァ-ヺー゛゜゙゚]+/g);
	output += check_katakana(/[ァ-ヺ][ァ-ヺー゛゜゙゚]*[力口□二]/g);
	var text = output.replace(/\n/g, "<br>")
	get_id('result').innerHTML = '<div class="resultext">' + text + '</div>';
}

function start_check_alpha(){
	var output = '';
	output += '■英語一覧\n';
	output += check_katakana(/[a-zA-Z\-_]+/g);
	output += check_katakana(/[ａ-ｚＡ-Ｚ＿－゙゚]+/g);
	var text = output.replace(/\n/g, "<br>")
	get_id('result').innerHTML = '<div class="resultext">' + text + '</div>';
}

function start_check_kanji_listup(){
	var text = get_id('maintext').value;
	text = text.replace(/\r\n/g, "\n").replace(/\n+$/g, "");

	var output = "";

	var rule_kanji = 0;
	var rule_kanji_jinmei = 0;
	var rule_kanji_daiiti = 0;
	var rule_kanji_ext = 0;
	
	var len = text.length;
	var kanji = ret_kanji_list();
	var kanji_jyoyo = kanji.jyoyo;
	var kanji_jinmei = kanji.jinmei;
	var kanji_daiiti = kanji.daiiti;
	var kanji_list = '';
	var kanji_list_jinmei = '';
	var kanji_list_daiiti = '';
	var kanji_list_ext = ''; // サロゲート
	for(var i = 0; i < len; i++){
		var cc = text.charCodeAt(i);
		var cc1 = text.charCodeAt(i + 1);
		var mozi = '';
		if(0xD800 <= cc && cc <= 0xDBFF){
			if(0xDC00 <= cc1 && cc1 <= 0xDFFF){
				mozi = text.substr(i, 2); // サロゲート正常
			}else{
				// 不正シーケンス
				mozi = text.substr(i, 1);
			}
		}else if(0xDC00 <= cc && cc <= 0xDFFF){
			// 不正シーケンス
			mozi = text.substr(i, 1);
		}
		if( 0 < mozi.length){
			if(2 === mozi.length){
				i++;
				var x = surrogate_to_codepoint(mozi);
				if(0x1F300 <= x && x <= 0x1FFFF){
					//絵文字->記号
				}else if(0x20000 <= x && x <= 0x3FFFF){
					//サロゲート漢字
					if(-1 === kanji_list_ext.indexOf(mozi)){
						kanji_list_ext += mozi;
					}
					rule_kanji_ext++;
					continue;
				}
				//サロゲートその他
				continue;
			}
			//サロゲート断片
			continue;
		}
		if(!is_kanji(cc)){
			continue;// 漢字以外
		}
		var c = text.charAt(i);
		if(-1 !== kanji_jyoyo.indexOf(c)){
			continue;
		}
		if(-1 !== kanji_jinmei.indexOf(c)){
			if(-1 === kanji_list_jinmei.indexOf(c)){
				kanji_list_jinmei += c;
			}
			rule_kanji_jinmei++;
			continue;
		}
		if(-1 !== kanji_daiiti.indexOf(c)){
			if(-1 === kanji_list_daiiti.indexOf(c)){
				kanji_list_daiiti += c;
			}
			rule_kanji_daiiti++;
			continue;
		}
		if(-1 === kanji_list.indexOf(c)){
			kanji_list += c;
		}
		rule_kanji++;
	}
	var kanji_len = kanji_list.length;
	var kanji_jinmei_len = kanji_list_jinmei.length;
	var kanji_daiiti_len = kanji_list_daiiti.length;
	var kanji_ext_len = kanji_list_ext.length / 2;

	kanji_list = kanji_list.replace(/.{20}/g, "$&\n");
	kanji_list_jinmei = kanji_list_jinmei.replace(/.{20}/g, "$&\n");
	kanji_list_daiiti = kanji_list_daiiti.replace(/.{20}/g, "$&\n");
	kanji_list_ext = kanji_list_ext.replace(/.{40}/g, "$&\n");

	output += '■使用第一表外漢字一覧((常用+人名+第一水準)以外)\n';
	output += kanji_len + '字 ' + rule_kanji + '箇所\n'
	output += kanji_list;
	output += '\n■使用人名漢字一覧\n';
	output += kanji_jinmei_len + '字 ' + rule_kanji_jinmei + '箇所\n'
	output += kanji_list_jinmei;
	output += '\n■使用第一水準((人名+常用)以外)漢字一覧\n';
	output += kanji_daiiti_len + '字 ' + rule_kanji_daiiti + '箇所\n'
	output += kanji_list_daiiti;
	output += '\n■サロゲート漢字一覧\n';
	output += kanji_ext_len + '字 ' + rule_kanji_ext + '箇所\n'
	output += kanji_list_ext;

	var text = output.replace(/\n/g, "<br>")
	get_id('result').innerHTML = '<div class="resultext">' + text + '</div>';
}

function ret_kanji_list(){
	var jyoyo = 
	'亜哀挨愛曖悪握圧扱宛嵐安案暗以衣位囲医依委威為畏胃尉異移萎偉椅彙意違維慰遺緯域育一壱逸茨芋引印因咽姻' +
	'員院淫陰飲隠韻右宇羽雨唄鬱畝浦運雲永泳英映栄営詠影鋭衛易疫益液駅悦越謁閲円延沿炎怨宴媛援園煙猿遠鉛塩' +
	'演縁艶汚王凹央応往押旺欧殴桜翁奥横岡屋億憶臆虞乙俺卸音恩温穏下化火加可仮何花佳価果河苛科架夏家荷華菓' +
	'貨渦過嫁暇禍靴寡歌箇稼課蚊牙瓦我画芽賀雅餓介回灰会快戒改怪拐悔海界皆械絵開階塊楷解潰壊懐諧貝外劾害崖' +
	'涯街慨蓋該概骸垣柿各角拡革格核殻郭覚較隔閣確獲嚇穫学岳楽額顎掛潟括活喝渇割葛滑褐轄且株釜鎌刈干刊甘汗' +
	'缶完肝官冠巻看陥乾勘患貫寒喚堪換敢棺款間閑勧寛幹感漢慣管関歓監緩憾還館環簡観韓艦鑑丸含岸岩玩眼頑顔願' +
	'企伎危机気岐希忌汽奇祈季紀軌既記起飢鬼帰基寄規亀喜幾揮期棋貴棄毀旗器畿輝機騎技宜偽欺義疑儀戯擬犠議菊' +
	'吉喫詰却客脚逆虐九久及弓丘旧休吸朽臼求究泣急級糾宮救球給嗅窮牛去巨居拒拠挙虚許距魚御漁凶共叫狂京享供' +
	'協況峡挟狭恐恭胸脅強教郷境橋矯鏡競響驚仰暁業凝曲局極玉巾斤均近金菌勤琴筋僅禁緊錦謹襟吟銀区句苦駆具惧' +
	'愚空偶遇隅串屈掘窟熊繰君訓勲薫軍郡群兄刑形系径茎係型契計恵啓掲渓経蛍敬景軽傾携継詣慶憬稽憩警鶏芸迎鯨' +
	'隙劇撃激桁欠穴血決結傑潔月犬件見券肩建研県倹兼剣拳軒健険圏堅検嫌献絹遣権憲賢謙鍵繭顕験懸元幻玄言弦限' +
	'原現舷減源厳己戸古呼固股虎孤弧故枯個庫湖雇誇鼓錮顧五互午呉後娯悟碁語誤護口工公勾孔功巧広甲交光向后好' +
	'江考行坑孝抗攻更効幸拘肯侯厚恒洪皇紅荒郊香候校耕航貢降高康控梗黄喉慌港硬絞項溝鉱構綱酵稿興衡鋼講購乞' +
	'号合拷剛傲豪克告谷刻国黒穀酷獄骨駒込頃今困昆恨根婚混痕紺魂墾懇左佐沙査砂唆差詐鎖座挫才再災妻采砕宰栽' +
	'彩採済祭斎細菜最裁債催塞歳載際埼在材剤財罪崎作削昨柵索策酢搾錯咲冊札刷刹拶殺察撮擦雑皿三山参桟蚕惨産' +
	'傘散算酸賛残斬暫士子支止氏仕史司四市矢旨死糸至伺志私使刺始姉枝祉肢姿思指施師恣紙脂視紫詞歯嗣試詩資飼' +
	'誌雌摯賜諮示字寺次耳自似児事侍治持時滋慈辞磁餌璽鹿式識軸七叱失室疾執湿嫉漆質実芝写社車舎者射捨赦斜' +
	'煮遮謝邪蛇尺借酌釈爵若弱寂手主守朱取狩首殊珠酒腫種趣寿受呪授需儒樹収囚州舟秀周宗拾秋臭修袖終羞習週就' +
	'衆集愁酬醜蹴襲十汁充住柔重従渋銃獣縦叔祝宿淑粛縮塾熟出述術俊春瞬旬巡盾准殉純循順準潤遵処初所書庶暑署' +
	'緒諸女如助序叙徐除小升少召匠床抄肖尚招承昇松沼昭宵将消症祥称笑唱商渉章紹訟勝掌晶焼焦硝粧詔証象傷奨照' +
	'詳彰障憧衝賞償礁鐘上丈冗条状乗城浄剰常情場畳蒸縄壌嬢錠譲醸色拭食植殖飾触嘱織職辱尻心申伸臣芯身辛侵信' +
	'津神唇娠振浸真針深紳進森診寝慎新審震薪親人刃仁尽迅甚陣尋腎須図水吹垂炊帥粋衰推酔遂睡穂随髄枢崇数据杉' +
	'裾寸瀬是井世正生成西声制姓征性青斉政星牲省凄逝清盛婿晴勢聖誠精製誓静請整醒税夕斥石赤昔析席脊隻惜戚責' +
	'跡積績籍切折拙窃接設雪摂節説舌絶千川仙占先宣専泉浅洗染扇栓旋船戦煎羨腺詮践箋銭潜線遷選薦繊鮮全前善然' +
	'禅漸膳繕狙阻祖租素措粗組疎訴塑遡礎双壮早争走奏相荘草送倉捜挿桑巣掃曹曽爽窓創喪痩葬装僧想層総遭槽踪操' +
	'燥霜騒藻造像増憎蔵贈臓即束足促則息捉速側測俗族属賊続卒率存村孫尊損遜他多汰打妥唾堕惰駄太対体耐待怠胎' +
	'退帯泰堆袋逮替貸隊滞態戴大代台第題滝宅択沢卓拓託濯諾濁但達脱奪棚誰丹旦担単炭胆探淡短嘆端綻誕鍛団男段' +
	'断弾暖談壇地池知値恥致遅痴稚置緻竹畜逐蓄築秩窒茶着嫡中仲虫沖宙忠抽注昼柱衷酎鋳駐著貯丁弔庁兆町長挑帳' +
	'張彫眺釣頂鳥朝貼超腸跳徴嘲潮澄調聴懲直勅捗沈珍朕陳賃鎮追椎墜通痛塚漬坪爪鶴低呈廷弟定底抵邸亭貞帝訂庭' +
	'逓停偵堤提程艇締諦泥的笛摘滴適敵溺迭哲鉄徹撤天典店点展添転田伝殿電斗吐妬徒途都渡塗賭土奴努度怒刀冬' +
	'灯当投豆東到逃倒凍唐島桃討透党悼盗陶塔搭棟湯痘登答等筒統稲踏糖頭謄藤闘騰同洞胴動堂童道働銅導瞳峠匿特' +
	'得督徳篤毒独読栃凸突届屯豚頓貪鈍曇丼那奈内梨謎鍋南軟難二尼弐匂肉虹日入乳尿任妊忍認寧熱年念捻粘燃悩納' +
	'能脳農濃把波派破覇馬婆罵拝杯背肺俳配排敗廃輩売倍梅培陪媒買賠白伯拍泊迫舶博薄麦漠縛爆箱箸畑肌八鉢発' +
	'髪伐抜罰閥反半氾犯帆汎伴判坂阪板版班畔般販斑飯搬煩頒範繁藩晩番蛮盤比皮妃否批彼披肥非卑飛疲秘被悲扉費' +
	'碑罷避尾眉美備微鼻膝肘匹必泌筆姫百氷表俵票評漂標苗秒病描猫品浜貧賓頻敏瓶不夫父付布扶府怖阜附訃負赴浮' +
	'婦符富普腐敷膚賦譜侮武部舞封風伏服副幅復福腹複覆払沸仏物粉紛雰噴墳憤奮分文聞丙平兵併並柄陛閉塀幣弊蔽' +
	'餅米壁璧癖別蔑片辺返変偏遍編弁便勉歩保哺捕補舗母募墓慕暮簿方包芳邦奉宝抱放法泡胞俸倣峰砲崩訪報蜂豊飽' +
	'褒縫亡乏忙坊妨忘防房肪某冒剖紡望傍帽棒貿貌暴膨謀北木朴牧睦僕墨撲没勃堀本奔翻凡盆麻摩磨魔毎妹枚昧埋' +
	'幕膜枕又末抹万満慢漫未味魅岬密蜜脈妙民眠矛務無夢霧娘名命明迷冥盟銘鳴滅免面綿麺茂模毛妄盲耗猛網目黙門' +
	'紋問冶夜野弥厄役約訳薬躍闇由油喩愉諭輸癒唯友有勇幽悠郵湧猶裕遊雄誘憂融優与予余誉預幼用羊妖洋要容庸揚' +
	'揺葉陽溶腰様瘍踊窯養擁謡曜抑沃浴欲翌翼拉裸羅来雷頼絡落酪辣乱卵覧濫藍欄吏利里理痢裏履璃離陸立律慄略柳' +
	'流留竜粒隆硫侶旅虜慮了両良料涼猟陵量僚領寮療瞭糧力緑林厘倫輪隣臨瑠涙累塁類令礼冷励戻例鈴零霊隷齢麗暦' +
	'歴列劣烈裂恋連廉練錬呂炉賂路露老労弄郎朗浪廊楼漏籠六録麓論和話賄脇惑枠湾腕';
	var jyoyo_ex = '塡剝頰'; // 第三水準
	var jyoyo_ex2 = '𠮟'; // 第三水準・Unicode2面
	var jinmei = 
	'丑丞乃之乎也云亘亙些亦亥亨亮仔伊伍伽佃佑伶侃侑俄俣俐倭倦倖偲' +
	'傭儲允兎兜其冴凌凜凛凧凪凰凱函劉劫勁勺勿匁匡廿卜卯卿厨厩叉叡' +
	'叢叶只吾吻哉哨啄哩喬喧喰喋嘩嘉嘗噌噂圃圭坐尭堯坦埴堰堺堵塙壕' +
	'壬夷奄奎套娃姪姥娩嬉孟宏宋宕宥寅寓寵尖尤屑峨峻崚嵯嵩嶺巌巖已' +
	'巳巴巷巽帖幌幡庄庇庚庵廟廻弘弛彗彦彪彬徠忽怜恢恰恕悌惟惚悉惇' +
	'惹惺惣慧憐戊或戟托按挺挽掬捲捷捺捧掠揃摺撒撰撞播撫擢孜敦斐斡' +
	'斧斯於旭昂昊昏昌昴晏晃晄晒晋晟晦晨智暉暢曙曝曳朋朔杏杖杜李杭' +
	'杵杷枇柑柴柘柊柏柾柚桧檜栞桔桂栖桐栗梧梓梢梛梯桶梶椛梁棲椋椀' +
	'楯楚楕椿楠楓椰楢楊榎樺榊榛槙槇槍槌樫槻樟樋橘樽橙檎檀櫂櫛櫓欣' +
	'欽歎此殆毅毘毬汀汝汐汲沌沓沫洸洲洵洛浩浬淵淳渚淀淋渥湘湊湛溢' +
	'滉溜漱漕漣澪濡瀕灘灸灼烏焚煌煤煉熙燕燎燦燭燿爾牒牟牡牽犀狼猪' +
	'獅玖珂珈珊珀玲琢琉瑛琥琶琵琳瑚瑞瑶瑳瓜瓢甥甫畠畢疋疏皐皓眸瞥' +
	'矩砦砥砧硯碓碗碩碧磐磯祇祢禰祐祷禄祿禎禽禾秦秤稀稔稟稜穣穰穹' +
	'穿窄窪窺竣竪竺竿笈笹笙笠筈筑箕箔篇篠簾籾粥粟糊紘紗紐絃紬絆絢' +
	'綺綜綴緋綾綸縞徽纂纏羚翔翠耀而耶耽聡肇肋肴胤胡脩腔脹膏臥舜舵' +
	'芥芹芭芙芦苑茄苔苺茅茉茸茜莞荻莫莉菅菫菖萄菩萌萠菱葦葵萱葺萩' +
	'董葡蓑蒔蒐蒼蒲蒙蓉蓮蔭蔦蓬蔓蕎蕨蕉蕃蕪薙蕾蕗藁薩蘇蘭蝦蝶螺蟹' +
	'衿袈袴裡裟裳襖訊訣註詢詫誼諏諄諒謂諺讃豹貰賑赳跨蹄蹟輔輯輿轟' +
	'辰辻迂迄辿迪迦這逞逗逢遥遙遁遼邑祁郁鄭酉醇醐醍釉釘釧銑鋒鋸錘' +
	'錐錆錫鍬鎧閃閏閤阿陀隈隼雀雁雛雫霞靖鞄鞍鞘鞠鞭頁頌頗颯饗馨馴' +
	'馳駕駿驍魁魯鮎鯉鯛鰯鱒鱗鳩鳶鳳鴨鴻鵜鵬鷲鷺鷹麒麟麿黎黛鼎巫渾';
	// 人名漢字第三・第四水準
	var jinmei_ex =
	'俱侮俠僧勉勤卑卽嘆器增墨寬層吞巢廊徵德悔憎懲揭摑擊敏晚暑曆朗' +
	'梅橫欄步歷每海涉淚渚渴溫漢瀨焰煮狀猪琢碑社祉祈祐祖祝神祥禍禎' +
	'福禱穀突節簞綠緖緣練繁繡署者臭萊著蔣薰虛虜蟬蠟視諸謁謹賓賴贈' +
	'逸郞都醬錄鍊難響顚類鷗黃黑瘦繫';
	var jinmei_cp932 = '增寬德朗橫瀨猪神祥福綠緖薰諸賴郞都黑';

	var daiiti =
	'乍什仇佼侠侭倶僑僻兇凋剃剥劃匙匝匪卦厭叛叩叱吃吊吋吠呆呑咋咳' +
	'唖嘘噛噸噺嚢坤垢埠塘填塵壷夙妓妾姐姑姦姶娼婁嬬嬰宍屍屠屡岨岱' +
	'庖廓廠廼弗弼彊怯悶愈慾戎扮捌掩掴掻揖摸撚撹擾斌杓杢柁栂栢栴桓' +
	'桝梱梼棉椙椴楳榔樗樵橡橿櫨欝歪洩涌涛涜淘渠溌漉潅澗澱濠瀞瀦烹' +
	'焔煽熔燐爺牌牝牢狐狗狛狸狽猷珪甑甜畦畷疹痔癌盈矧砺砿硲碇碍碕' +
	'禦禿稗穆穎穐竃笥筏箆箪箭篭簸粁粂粍粕糎糞糟糠綬緬繋繍罫翫翰聯' +
	'聾肱脆腿膿舘舛艮苅苓苧苫荊荏莱菟菰葎葱蒋蒜蔀蔚蕊蕩薮薯藷虻蚤' +
	'蛋蛎蛙蛤蛭蛸蛾蜘蝉蝋蝕蝿蟻袷覗詑誹諌諜謬讐賎贋赫趨躯轍轡迩逼' +
	'酋醗醤釆釦鈎鈷鉦鉾銚鋤鋪鋲錨鍍鍔鍾鎗鎚鏑鐙鐸鑓靭韮頚頬頴顛飴' +
	'餐駁騨髭鮒鮪鮫鮭鯖鯵鰍鰐鰭鰹鰻鱈鴇鴎鴛鴫鴬鵠鵡鹸麹黍鼠';
	// TODO:第2水準
	return {jyoyo:jyoyo, jinmei:jinmei, daiiti:daiiti};
}
function start_check_moji_count(){
	var text = get_id('maintext').value;
	text = text.replace(/\r\n/g, "\n").replace(/\n+$/g, "");
	text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	var text_lines = text.split('\n');

	var last = text_lines.length;
	var count = 0;
	var all = 0;
	var data = "";
	var part = 0;
	var pre = "";
	var leftpad = function(a, b){
		var x = "                  " + a;
		return x.substr(x.length - b);
	}
	var head = '■';
	var line;
	var c;
	var heads ="■◆●▲▼";
	for(var i = 0; i < last; i++){
		line = text_lines[i];
		c = line.charAt(0);
		if(c != ''){
			var index = heads.indexOf(c);
			if(-1 < index){
				head = heads.charAt(index);
				break;
			}
		}
	}
	for(var i = 0; i < last; i++){
		line = text_lines[i];
		c = line.charAt(0);
		if(c === head){
			if(0 < all){
				data += leftpad(count, 6) + "  ";
				all += count;
				if(10 <= count){
					part++;
				}
			}else{
				all = 1;
			}
			count = 0;
			if(pre != ''){
				data += pre + '\n';
			}
			pre = line;
		}else{
			count += line.replace(/[　 \r\n\t]/g, "").length;
		}
	}
	data += leftpad(count, 6) + "  ";
	all += count;
	all -= 1;
	data += pre + '\n';
	data += "" + leftpad(all, 6) + "  合計\r";
	data += "平均    " + leftpad(part + 1, 4) + " * " + Math.floor(all/(part+1)) + "\n";
	data += "平均-1  " + leftpad(part, 4) + " * " + Math.floor(all/(part)) + "\n";
	var text = data.replace(/\n/g, "<br>")
	get_id('result').innerHTML = '<div class="resultext" style="white-space:pre-wrap;">' + text + '</div>';
}

function start_check_jitai(){
	const text = '' + get_id('maintext').value;
	const len = text.length;

	const jitai_list1 = 
	'㡡幮䋆纑䵷鼃一弌万萬丈𠀋与與丑丒世丗両兩並竝乗乘乱亂亀龜予豫争爭事亊二弍亘亙亜亞亟焏京亰仏佛仝同仞仭' +
	'仮假会會伜倅伝傳佇竚余餘作做佞侫你儞併倂侠俠価價侭儘侮侮俎爼俣㑨倆𠈓倏倐倶俱倹儉偽僞傘仐傚俲僊僲働仂' +
	'僣僭僧僧儔俦儕㑪儼𠑊兌兊免免兎兔児兒党黨兜兠円圓冊册冒冐冣㝡冤寃冦寇冪羃冽洌凄淒凛凜凡凢処處函凾刃刄' +
	'刈苅剋尅剤劑剥剝剰剩功㓛劫刧励勵労勞効效勅敕勇勈勉勉勢㔟勤勤勧勸勲勳勻匀匆匇匯滙区區医醫卑卑卒卆卓桌' +
	'単單卮巵卯夘即卽却卻厖庬厠廁厦廈厨廚厮廝厳嚴参參双雙収收叡睿叱𠮟号號呑吞呪咒和咊咤咜咯喀哲啠唇脣唖啞' +
	'啖啗善譱喝喝営營嘆嘆嘔呕嘗甞嘘噓嘩譁嘯嘨嘱囑噛嚙噪譟嚏嚔嚢囊回囘団團囲圍図圖圏圈圧壓址阯坂阪坡陂垂埀' +
	'埒埓埣𡉻堕墮堯尭場塲塀塀塁壘塚塚填塡増增墨墨墩墪墻牆壊壞壌壤壗𡋤壚𡉴壜罎壟壠壮壯声聲壱壹売賣壷壺変變' +
	'多夛夢梦奇竒奈柰奘弉奥奧奩匳妊姙妍姸妬妒嫩嫰嫺嫻嬢孃嬲嫐孽孼宇𡧃宍肉宜冝実實富冨寛寬寝寢寱䆿対對寿壽' +
	'専專将將尢尣尫尩尻㞍尽盡届屆屏屛属屬屡屢層層屮屮岡崗岪𡶒岳嶽岺岭峡峽峨峩峰峯崑崐崖崕崙崘嵆嵇嵯嵳嶧𡵸' +
	'嶮𡸴巣巢巻卷帆㠶帯帶幣幤并幷幹榦幺么広廣庵菴廃廢廊廊廠厰廸迪廼迺弥彌弯彎弾彈当當彜彝彿髴往徃徴徵応應' +
	'忰悴怪恠恋戀恒恆恥耻恵惠悔悔悩惱悪惡惧懼惨慘慎愼慚慙慨慨憎憎憖憗憚惮憩憇懐懷懣𢡛懲懲懴懺戛戞戦戰戯戲' +
	'戻戾払拂扞捍扠扨抜拔択擇抬擡担擔拏拿拖拕拘抅拝拜拠據拡擴挟挾捜搜掎𢰤掲揭掴摑掻搔揀柬揺搖摂攝摠揔撃擊' +
	'撈𢭐撹攪撿𢮦擣𢭏攅攢敏敏数數斎齋断斷斲斵旙旛既既旨㫖昇曻明朙昜暘昞昺映暎昼晝昿曠晃晄晋晉晢晣晰晳暁曉' +
	'暑暑暦曆曦㬢曳曵曹曺曽曾期朞本夲杉杦村邨杠槓条條杯盃枡桝枢樞柁舵栖棲栢柏栲𣑥桑桒桜櫻桟棧档檔桧檜梨棃' +
	'梹檳梼檮棄弃棋棊棕椶椁槨検檢椢槶楕橢楼樓楽樂槁槀槊㮶様樣槙槇槞櫳槳㯍樒櫁権權横橫橈𣓤橋𣘺橐槖檃櫽檐簷' +
	'檗蘗檪櫟櫑罍欄欄欅﨔欒栾欛𣠽欝鬱欟𣠤欧歐歓歡歩步歯齒歴歷歹歺殁歿残殘殱殲殴毆殺殺殻殼毎每毘毗氈氊氷冰' +
	'汚汙決决沈沉沖冲没沒沢澤況况泰𣳾浄淨浅淺浣澣海海涅𣵀涌湧涛濤涜瀆涸凅涼凉淫婬淬㳃添𣷹渇渴済濟渉涉渚渚' +
	'温溫湾灣湿濕満滿溌潑準凖溜澑滔㴞滝瀧滞滯滲渗漢漢潅灌潸澘澄澂瀦潴瀬瀨灎灩灞㶚灯燈灵㚑炉爐炯烱点點為爲' +
	'焼燒煙烟煢㷀熏燻熔鎔燮爕燼烬爍鑠爵𣝣爿丬牖牗犁犂犠犧犢㸿犲豺状狀狢貉独獨狭狹狸貍猊貎猟獵猫貓献獻猯貒' +
	'猶犹獏貘獣獸珍珎珏玨珱瓔琅瑯琢琢瑙碯瑠璢瑶瑤瓉瓚瓶甁甌瓯甎磚町甼画畫略畧畴疇疎踈疏䟽痩瘦痴癡瘉癒瘻瘘' +
	'発發皎晈皐皋皖晥皸皹盗盜盪蘯県縣真眞眥眦睨𥆩睹覩瞞𥈞瞭暸瞼𥇥矚瞩研硏砕碎砧碪砺礪碍礙碑碑礦砿礼禮社社' +
	'祈祈祉祉祐祐祖祖祝祝神神祢禰祥祥祷禱禀稟禄祿禅禪禍禍禎禎福福秕粃秘祕稚穉稲稻穀穀穂穗穎頴穏穩穣穰突突' +
	'窃竊窓窗窪漥窯窰竜龍竪豎笻筇筍笋筐筺筝箏箆篦箘箟箪簞節節範笵篏嵌簗𥱋籌筹籏簱籐籘籖籤籠篭籥龠粋粹粘黏' +
	'粛肅粥鬻粼𥻘糧粮糸絲糾糺紘綋紙帋紣綷累縲絋纊経經絵繪継繼続續綿緜総總緑綠緒緖緕纃線綫練練縁緣縄繩縉縉' +
	'縦縱繁繁繋繫繍繡纉纘纏纒纓䋝纜䌫缶罐罰罸署署羌羗羑羐群羣羮羹翠翆翻飜耀燿者者耋耊耕畊耼聃聯聨聴聽肬疣' +
	'育毓胆膽胚肧脈脉脛𦙾脳腦腟膣腮顋腸膓臍𦜝臓臟臥卧臭臭舎舍舐䑛舮艫船舩艶艷艾𦫿芦蘆芸藝芻蒭苺莓茎莖茘荔' +
	'荘莊莱萊莵菟菱蔆萌萠萸茰萼蕚著著葱蔥蒂蔕蒋蔣蔵藏蕭䔥薀蘊薫薰薬藥薯藷薺萕蘇蘓蘒蘒虁夔虎乕虜虜虫蟲虱蝨' +
	'蚊蚉蚕蠶蛍螢蛎蠣蛮蠻蛾䖸蝉蟬蝋蠟蝿蠅螻蝼蟇蟆蟒蠎蟹蠏蠧蠹衄衂衛衞衽袵装裝裏裡裴裵褐褐褒襃褝襌襄㐮襪韈' +
	'襷𧜎覇霸規䂓覓覔視視覚覺覧覽覰覷観觀解觧触觸觽觿訛譌訳譯証證詠咏誉譽読讀諌諫諸諸謁謁謚諡謡謠謳𧦅謹謹' +
	'譛譖譲讓讃讚讐讎豊豐豼貔財戝賍贓賎賤賓賓賛贊賢贒質貭贈贈走赱践踐踊踴蹈𨂻蹤踪躊踌躙躪躯軀軌䡄転轉軽輕' +
	'輌輛輒輙轟軣轢轣轤䡎辛𨐌辞辭返﨤迥逈迩邇迫廹逃迯逅遘逎遒逓遞逸逸遅遲達逹遥遙邃𨗉郎郞部郶郷鄕都都鄷酆' +
	'酔醉酢醋醗醱醤醬醸釀釈釋釜釡鈎鉤鈩鑪鉱鑛銭錢鋏𨦇鋳鑄錬鍊録錄鍬鍫鎮鎭鏘𨪙鐸鈬鑚鑽鑵𨫝長镸閉閇閙鬧関關' +
	'陀陁陥陷陦隯陰隂険險隆隆随隨隠隱隣鄰隲騭隴𨻫隷隸雄䧺雋隽雛鶵難難霊靈静靜韮韭韲齏韻韵響響頚頸頤頥頬頰' +
	'頻頻頼賴顔顏顕顯顛顚類類風凮飄飃飠𩙿飧飱飲飮飾餝餅餠餞䬻館舘饒𩜙駅驛駝駞騒騷験驗騨驒驢馿髪髮髯髥鯵鰺' +
	'鰛鰮鰲鼇鱪鱰鱸魲鳬鳧鴎鷗鴟鵄鴬鶯鵞鵝鶇鶫鷀鶿鷆鷏鹸鹼鹿𢈘麦麥麸麩麹麴麼麽黄黃黒黑黙默鼓皷鼠鼡齔齓齟𪗱' +
	'齢齡齬𪘚爫爫辶辶𥫣籅𧯇豅𡋗𡑭';

	const jitai_list2 = 
	'厩廏廐/栄榮荣/ヶ个箇/堺界畍/概槩槪/盖葢蓋/学學斈/泻潟瀉/鍳鑑鑒/巌巖巗/岩嵒嵓/雁鳫鴈/㐂喜憙/噐器器/' +
	'帰歸皈/气気氣/挙擧舉/虗虚虛/駆駈驅/径徑逕/携擕攜/欠缺缼/稾稿藁/国圀國/冱冴沍/襍雑雜/筱筿篠/蕊蕋蘂/' +
	'写冩寫/煑煮煮/从従從/渋澀澁/叙敍敘/奨奬獎/松枩柗/称稱穪/靫靭靱/膸髄髓/斉斊齊/跡蹟迹/潛潜濳/繊纎纖/' +
	'泝溯遡/挿插揷/聡聦聰/䑓台臺/猪豬猪/庁廰廳/闘鬪鬭/弐貮貳/梅楳梅/浜濱濵/淵渊渕/辺邉邊/舖舗鋪/宝寳寶/' +
	'㒵皃貌/簑簔蓑/壻婿聟/麪麵麺/柳栁桺/來徠来/泪涙淚/朖朗朗/剳劄箚/尒尓爾/帮幇幫/沪濾瀘/䇳牋箋/畄留畱/' +
	'畬畭畲/疱皰靤/脍膾鱠/臈臘﨟/䦰䰗鬮/暭皞皡/靍靎靏/塩鹽𦣪/廻廽𢌞/㟁岸𡶜/旧舊𦾔/土圡𡈽/晚晩𣆶/埜野𡌛/' +
	'䏮脇𦚰/嶢嶤𡸳/㫪舂𣇃/濶闊𤄃/囓齧𪘂/㓁罒𦉰/㷔焔焰熖/秋秌穐龝/畳疂疉疊/体躰軆體/鉄銕鐡鐵/㠀島嶋嶌/' +
	'䉤籔薮藪/羇羈覉覊/颷飆飇飈/䒑艹艹艹/渓溪谿𧮾/雞鶏鷄𨿸/徳德悳𢛳/杤栃櫔𣜜/䆴竃竈𥧄/䕃蔭𦹥𨼲/' +
	'弁瓣辧辨辯/凞煕熈熙凞/㽗畆畒畝𤰖/剣剱劍劒劔釼𠝏/崎埼㟢嵜碕𥔎﨑';

	const kanji_jitai = function(text){
		const get_char_from_index = function(str, index){
			const cc = str.charCodeAt(index);
			const cc1 = str.charCodeAt(index + 1);
			if(0xD800 <= cc && cc <= 0xDBFF){
				if(0xDC00 <= cc1 && cc1 <= 0xDFFF){
					return str.substr(index, 2); // サロゲート正常
				}else{
					// 不正シーケンス
					return '';
				}
			}else if(0xDC00 <= cc && cc <= 0xDFFF){
				// 不正シーケンス
				return '';
			}
			// 普通の1文字
			return str.substr(index, 1);
		}
		const jitai_len1 = jitai_list1.length;
		let jitai_map = [];
		for(let i = 0; i < jitai_len1;){
			const ch1 = get_char_from_index(jitai_list1, i);
			i += ch1.length;
			const ch2 = get_char_from_index(jitai_list1, i);
			i += ch2.length;
			jitai_map[ch1] = [0, [ch2]];
			jitai_map[ch2] = [0, null];
		}
		const jitai_arr2 = jitai_list2.split('/');
		const jitai_len2 = jitai_arr2.length;
		for(let i = 0; i < jitai_len2; i++){
			const kanji_arr = jitai_arr2[i];
			const kanji_arr_len = jitai_arr2[i].length;
			const ch1 = get_char_from_index(kanji_arr, 0);
			let arr = [];
			for(let k = ch1.length; k < kanji_arr_len;){
				const ch2 = get_char_from_index(kanji_arr, k);
				k += ch2.length;
				arr.push(ch2);
				jitai_map[ch2] = [0, null];
			}
			jitai_map[ch1] = [0, arr];
		}

		for(let i = 0; i < len;){
			const kanji = get_char_from_index(text, i);
			if(kanji in jitai_map){
				jitai_map[kanji][0]++;
			}
			i += kanji.length;
		}
		let outstr = '';
		for(let key in jitai_map){
			const a = jitai_map[key];
			const link = a[1];
			if(link !== null){
				let count = 0;
				if(0 < a[0]){
					count = 1;
				}
				for(let i = 0; i < link.length; i++){
					const b = link[i];
					if(0 < jitai_map[b][0]){
						count++;
					}
				}
				if(2 <= count){
					outstr += key + ' ' + fixnum(a[0]);
					for(let i = 0; i < link.length; i++){
						const b = link[i];
						outstr += ' /' + b + ' ' + fixnum(jitai_map[b][0]);
					}
					outstr += '\n';
				}
			}
		}
		if(outstr.length == 0){
			outstr = '検出されませんでした。\n';
		}
		return outstr;
	};

	const kakikae_list1 = 
	'愛欲|愛慾/安逸|安佚/暗影|暗翳/暗唱|暗誦/案分|按分/暗夜|闇夜/意向|意嚮/慰謝料|慰藉料/衣装|衣裳/' +
	'遺跡|遺蹟/一丁|一挺/陰影|陰翳/英知|叡智|叡知|英智/英才|頴才/園地|苑地/憶説|臆説/憶測|臆測/' +
	'恩義|恩誼/外郭|外廓/快活|快濶/皆既食|皆既蝕/戒告|誡告/開削|開鑿/回送|廻送/回虫|蛔虫/' +
	'回転|廻転/回復|恢復/壊滅|潰滅/壊乱|潰乱/回廊|廻廊/火炎|火焔/画然|劃然/郭大|廓大/' +
	'格闘|挌闘/画期的|劃期的/活発|活潑|活溌/干害|旱害/間欠|間歇/管弦楽|管絃楽/肝心|肝腎/干天|旱天/' +
	'乾留|乾溜/気炎|気焔/飢餓|饑餓/企画|企劃/奇形|畸形/希元素|稀元素/希釈|稀釈/希少|稀少/' +
	'記章|徽章/奇跡|奇蹟/希代|稀代/奇談|綺談/機知|機智/喫水|吃水/希薄|稀薄/糾弾|糺弾/糾明|糺明/' +
	'旧跡|旧蹟/凶悪|兇悪/供応|饗応/教戒|教誨/凶漢|兇漢/凶器|兇器/強固|鞏固/凶行|兇行/凶刃|兇刃/' +
	'凶変|兇変/凶暴|兇暴/御者|馭者/漁労|漁撈/希硫酸|稀硫酸/技量|技倆/吟唱|吟誦/区画|区劃/掘削|掘鑿/' +
	'訓戒|訓誡/薫製|燻製|くん製/係船|繋船|繫船/係争|繋争|繫争/係属|繋属|繫属/係留|繋留|繫留/下克上|下剋上/' +
	'決壊|決潰/決起|蹶起/月食|月蝕/決別|訣別/弦歌|絃歌/元凶|元兇/険阻|嶮岨|険岨|嶮阻/研摩|研磨/' +
	'厳然|儼然/交歓|交驩/鉱業|礦業/硬骨|鯁骨/交差|交叉/控除|扣除/更生|甦生/鉱石|礦石/' +
	'広壮|宏壮/広大|宏大/香典|香奠/高騰|昂騰/広範|広汎/興奮|昂奮|亢奮/広報|弘報/広野|曠野/高揚|昂揚/' +
	'強欲|強慾/講和|媾和/枯渇|涸渇/古希|古稀/古跡|古蹟/骨格|骨骼/雇用|雇傭/混交|混淆/根底|根柢/混迷|昏迷/' +
	'酢酸|醋酸/座視|坐視/座礁|坐礁/座州|坐洲/雑踏|雑沓/三弦|三絃/賛仰|讃仰/賛辞|讃辞/散水|撒水/' +
	'賛嘆|讃嘆/賛美|讃美/散布|撒布/色欲|色慾/刺激|刺戟/史跡|史蹟/死体|屍体/七顛八倒|七顚八倒/死没|死歿/' +
	'射幸心|射倖心/車両|車輛/集荷|蒐荷/収集|蒐集/終息|終熄/集落|聚落/手跡|手蹟/俊才|駿才/' +
	'消夏|銷夏/消却|銷却/障害|障碍|障礙|障がい/情義|情誼/称賛|称讃|賞讃|賞賛/昇叙|陞叙/焦燥|焦躁/' +
	'消沈|銷沈/障壁|牆壁/蒸留|蒸溜/書簡|書翰/食尽|蝕甚|食甚|蝕尽/食欲|食慾/叙情|抒情/試練|試煉|試錬/針術|鍼術/' +
	'侵食|侵蝕/浸食|浸蝕/真跡|真蹟/伸長|伸暢/浸透|滲透/侵略|侵掠/尋問|訊問/哀退|哀頽/制御|制馭|制禦/' +
	'生息|棲息|栖息/性欲|性慾/絶賛|絶讃/先鋭|尖鋭/全壊|全潰/選考|銓衡|選衡|銓考/扇情|煽情/洗浄|洗滌/' +
	'戦々恐々|戦々兢々|戦戦兢兢/船倉|船艙/先端|尖端/専断|擅断/扇動|煽動/戦没|戦歿/象眼|象嵌/' +
	'倉皇|蒼惶/総合|綜合/相克|相剋/総菜|惣菜/装丁|装釘|装幀/掃滅|剿滅/族生|簇生/阻止|沮止/疎水|疏水/' +
	'阻喪|沮喪/疎通|疏通/疎明|疏明/退色|褪色/退勢|頽勢/退廃|頽廃/台風|颱風/大欲|大慾/奪略|奪掠/' +
	'嘆願|歎願/炭鉱|炭礦/端座|端坐/短編|短篇/暖房|煖房/暖炉|煖炉/知恵|智慧|知慧|智恵/知能|智能/' +
	'知謀|智謀/注解|註解/注釈|註釈/注文|註文/長編|長篇/沈殿|沈澱/低回|彽徊|低徊|彽回/抵触|彽触|觝触/' +
	'丁重|鄭重/丁寧|叮嚀|丁嚀|叮寧/停泊|碇泊/手帳|手帖/転倒|顚倒|顛倒/転覆|顚覆|顛覆/倒壊|倒潰/' +
	'踏襲|蹈襲/特集|特輯/途絶|杜絶/日食|日蝕/背徳|悖徳/破棄|破毀/暴露|曝露/破砕|破摧/発酵|醗酵|醱酵/薄幸|薄倖/' +
	'抜粋|抜萃/反旗|叛旗/反逆|叛逆/繁殖|蕃殖/蛮族|蕃族/反発|反撥/反乱|叛乱/飛語|蜚語/筆跡|筆蹟/' +
	'病没|病歿/風刺|諷刺/腐食|腐蝕/符丁|符牒/物欲|物慾/腐乱|腐爛/辺境|辺疆/編集|編輯/保育|哺育/' +
	'崩壊|崩潰/妨害|妨碍/放棄|抛棄/防御|防禦/包帯|繃帯/膨大|厖大/包丁|庖丁/放物線|抛物線/補佐|輔佐/' +
	'舗装|鋪装/補導|輔導/保母|保姆/摩滅|磨滅/無知|無智/無欲|無慾/名誉欲|名誉慾/綿花|棉花/' +
	'盲動|妄動/模索|摸索/野卑|野鄙/溶解|鎔解/溶岩|熔岩/溶鉱炉|鎔鉱炉/溶接|熔接/落盤|落磐/' +
	'理屈|理窟/利口|悧巧|利巧|悧口/理知|理智/離反|離叛/略奪|掠奪/里謡|俚謡/了解|諒解/了承|諒承/' +
	'輪郭|輪廓/連係|連繋|連繫/連合|聯合/連座|連坐/連想|聯想/連珠|聯珠/練炭|煉炭/練乳|煉乳/連邦|聯邦/' +
	'連盟|聯盟/連絡|聯絡/連立|聯立/湾曲|彎曲/湾入|彎入';

	const kakikae_list2 = 
	'炎|焔/戒|誡/回|廻/画|劃/郭|廓/奇|畸/希|稀/糾|糺/御|馭/凶|兇/弦|絃/幸|倖/広|宏/鉱|礦/座|坐/' +
	'賛|讃/州|洲/集|輯/昇|陞/消|銷/跡|蹟/阻|沮/総|惣/嘆|歎/知|智/踏|蹈/反|叛/編|篇/補|輔/没|歿/模|摸/' + 
	'溶|熔|鎔/欲|慾/略|掠/了|諒/両|輛/連|聯/湾|彎';

	const kakikae_list3 =
	'暗|闇/個|箇/張|脹/付|附/遵守|順守/遵法|順法';

	const kakikae_list4 = 
	'啞鈴|亜鈴|唖鈴/萎縮|委縮/一攫千金|一獲千金/湮滅|隠滅/臆断|憶断/臆病|憶病/回游|回遊/箇条書き|個条書き/' +
	'確乎|確固/恰好|格好/恰幅|格幅/函数|関数/貫禄|貫録|貫ろく/義捐|義援/嬉々|喜々|嬉嬉|喜喜/毀損|棄損/気魄|気迫/' +
	'詭弁|奇弁|危弁/嬉遊曲|喜遊曲/饗宴|供宴/橋頭堡|橋頭保/共軛|共役/醵金|拠金/醵出|拠出/禁錮|禁固/' +
	'均斉|均整/燻蒸|薫蒸/敬虔|敬謙/激昂|激高/肩胛骨|肩甲骨/建蔽率|建坪率/眩惑|幻惑/勾引|拘引/' +
	'耕耘機|耕運機/昂進|高進|亢進/合辧|合弁|合辨/渾然|混然/鑿岩|削岩/三叉路|三差路/質種|質草/紫斑|紫班/' +
	'馴化|順化/醇朴|純朴/駿馬|俊馬/饒舌|冗舌|じょう舌/絛虫|条虫/食餌|食事/新撰|新選/心搏|心拍/' +
	'撰者|選者/撰集|選集/撰修|選修/尖兵|先兵/擡頭|台頭/高嶺の花|高根の花/断乎|断固/抽籤|抽選|抽せん/鳥瞰|鳥観/' +
	'輾転反側|展転反側/臀部|殿部/当籤|当選|当せん/廃墟|廃虚/買辦|買弁/白堊|白亜/搏動|拍動/波瀾|波乱/斑点|班点/' +
	'菲才|非才/飄然|漂然/披瀝|披歴/諷喩|風諭/敷衍|敷延/扮装|粉装/分溜|分留/辮髪|弁髪/扁平|偏平/防遏|防圧/' +
	'捧持|奉持/芳醇|芳純/膨脹|膨張/堡塁|保塁/拇指|母指/脈搏|脈拍/明媚|明美/友誼|友宜/優駿|優俊/悠然|裕然/' +
	'油槽船|油送船/輿論|世論/落伍|落後/濫獲|乱獲/濫掘|乱掘/濫作|乱作/濫造|乱造/濫読|乱読/濫伐|乱伐/' +
	'濫発|乱発/濫費|乱費/濫用|乱用/溜飲|留飲/溜出|留出/料簡|了見/嗹|連/' +
	'奇麗|綺麗|きれい|キレイ/砂漠|沙漠/死骸|屍骸/検死|検屍/死斑|屍斑/死肉|屍肉/死臭|屍臭/七転八起|七顚八起|七顛八起/' +
	'転落|顚落|顛落/動転|動顚|動顛/澱粉|殿粉|でん粉/補助|輔助/模写|摸写/模擬|摸擬/模造|摸造/模倣|摸倣/' +
	'模作|摸作/付加|附加/付記|附記/付近|附近/付言|附言/付則|附則/付随|附随/付帯|附帯/付託|附託/付着|附着/' +
	'付録|附録/寄付|寄附/添付|添附/付与|附与/付議|附議/下付|下附/交付|交附/付属|附属/付箋|附箋|付せん|附せん/' +
	'乱売|濫売/乱立|濫立/練成|錬成/鍛練|鍛錬/修練|修錬/精練|精錬/個所|箇所/個国|箇国/個月|箇月/' +
	'希人|稀人/希有|稀有/類希|類稀/僥倖|僥幸';

	const kakikae_list5 =
	'究極|窮極/建言|献言/古老|故老/醜体|醜態/重体|重態/小憩|少憩/小食|少食/植民|殖民/定年|停年/年配|年輩/' +
	'配列|排列/反復|反覆/表札|標札/表示|標示/変人|偏人/容体|容態/' +
	'栄養|営養/簡単|簡短/観点|看点/気概|気慨/機転|気転/規範|軌範/漁網|魚網/幸運|好運/豪胆|剛胆/作戦|策戦/' +
	'残酷|残刻/自動|自働/集荷|集貨/冗員|剰員/定規|定木/定宿|常宿/常連|定連/準決勝|准決勝/親切|深切/深刻|深酷/' + 
	'素性|素姓/整然|井然/折衷|折中/先頭|先登/奏功|奏効/滞貨|滞荷/端正|端整/富裕|富有' + 
	'台詞|科白|セリフ/盾|楯/盾突|楯突/矛盾|矛楯/槌|鎚/木槌|木鎚/相槌|相鎚|相づち|相ずち/金鎚|金槌/鉄鎚|鉄槌/' +
	'愛嬌|愛きょう/唖然|啞然|あ然/斡旋|あっ旋/安堵|安ど/一縷|一る/隕石|いん石/' +
	'隕鉄|いん鉄/隠蔽|隠ぺい/迂回|う回;※誤検出多め/迂闊|迂かつ/鬱蒼|(鬱そう:憂鬱そう)/胡乱|う乱;※誤検出多め/怨恨|えん恨/冤罪|えん罪/旺盛|おう盛/' +
	'幼馴染|幼なじみ/御伽噺|御伽話|お伽噺|お伽話|おとぎ噺|おとぎ話/' + 
	'改竄|改ざん/覚醒|覚せい/攪拌|撹拌|かく拌/攪乱|撹乱|かく乱/' +
	'喝采|喝さい/闊歩|かっ歩/完璧|完ぺき/灌木|かん木/骸骨|がい骨/急遽|急きょ/軽蔑|軽べつ/' +
	'牽制|けん制/牽引|けん引/研鑽|研さん/膠着|こう着/滑稽|滑けい/渾身|こん身/昏倒|こん倒/棍棒|こん棒/' +
	'語彙|語い/豪奢|豪しゃ/傲慢|ごう慢/炸裂|さく裂/惨憺|惨たん/殺戮|殺りく/失踪|失そう/執拗|執よう/贖罪|しょく罪/' +
	'進捗|進ちょく/自嘲|自ちょう/精悍|精かん/清楚|清そ/殲滅|せん滅/僭越|せん越/閃光|せん光/' +
	'戦慄|戦りつ/贅沢|ぜい沢/双璧|双へき/双眸|双ぼう/聡明|そう明/対峙|(対じ:対じゃ)/団欒|団らん/緻密|ち密/辻褄|辻つま/' +
	'覿面|てき面/爛漫|らん漫/島嶼|島しょ/投擲|投てき/同衾|同きん/獰猛|どう猛/暢気|呑気|暖気|のん気/梯子|はし子/' +
	'破綻|破たん/反芻|反すう/秘訣|秘けつ/逼迫|ひっぱ迫/憑依|ひょう依/瀕死|ひん死/美貌|美ぼう/不憫|不びん/不埒|不らち/' +
	'不躾|不しつけ/辟易|へき易/辺鄙|辺ぴ/変貌|変ぼう/蔑視|べっ視/翻弄|翻ろう/邁進|まい進/末裔|末えい/' +
	'悶絶|もん絶/憂鬱|憂うつ/妖艶|妖えん/傭兵|よう兵/戮殺|りく殺/裂帛|裂ぱく/濾過|ろ過/賄賂|賄ろ/' +
	'子供|子ども';
	const kakikae_list6 =
	'内臓|内蔵/露店|露天/露天商;→露店商/露天風呂|露天掘り/試験官|試験管/個体|固体/人工|人口/魔方陣/掲示版;→掲示板/' +
	'候爵;→侯爵/諸候;→諸侯/王候貴族;王侯貴族/耳障りがい|耳障りがよ/取り合えず;→取り敢えず/大坂';
	const kakikae_list7 =
	'○;丸|〇;ゼロ|◯;大丸/魔道|魔導/魔道具|魔導具/魔道書|魔導書/魔道師|魔導師/魔道炉|魔導炉/魔道士|魔導士/魔道回路|魔導回路/' + 
	'魔道コンロ|魔導コンロ/魔道船|魔導船';
	const kakikae_list8 =
	'大阪|大坂/一生懸命|一所懸命/十分|充分/麓|ふもと/蝋燭|蠟燭|ろうそく|ロウソク/胡椒|こしょう|コショウ/' + 
	'アホ|阿保/カッコ|括弧/カビ|黴/ガキ|餓鬼/ガン|癌/クソ|糞/ケンカ|喧嘩/ゴミ|塵|芥/シャレ|洒落/タダ|只/ダメ|駄目' + 
	'/ツボ|壺|壷/ナンパ|軟派/ハシタナ|ハシタな|端な/バカ|馬鹿/ヒビ|罅/ボケ|呆け|惚け/ボロ|襤褸/ムダ|無駄/メッキ|鍍金|鍍/' +
	'コンロ|焜炉/メンツ|面子/' + 
	'挨拶|あいさつ/胡座|あぐら/斡旋|あっせん/予め|あらかじめ/改め|あらため/あり得|ありう|ありえ/有難|有り難|ありがた/' +
	'或いは|あるいは/如何に|いかに/幾つ|いくつ/何れ|いずれ/至って|いたって/何時か|いつか/一層|いっそう/一旦|いったん/' +
	'一杯|いっぱい/一遍|いっぺん/今更|いまさら/未だ|いまだ/色々|いろいろ/言わば|いわば/所謂|いわゆる/上手|うま;※誤検出(じょうず)/' +
	'羨まし/うらやまし/嬉し|うれし/概ね|おおむね/可笑しい|おかしい/恐らく|おそらく/各々|おのおの/面白|おもしろ/' +
	'凡そ|およそ/及び|および/関わらず|係わらず|拘らず|かかわらず/且つ|かつ/可也|かなり/可愛い|かわいい/' +
	'き難く/きがたく/極めて|きわめて/此処|ここ/殊更|ことさら/此の|この/細か|こまか/此れ|これ/先程|さきほど/流石|さすが/' +
	'早速|さっそく/様々|さまざま/更に|さらに/然し|しかし/し難い/しがたい/し難く/しがたく/直に|じかに/然も|しかも/' +
	'次第に|しだいに/従って.したがって/暫く|しばらく/過ぎ|すぎ/直ぐ|すぐ/凄|すご/素敵|すてき/既に|すでに/即ち|すなわち/' +
	'素晴らし|すばらし/全て|すべて/精精|せいぜい/折角|せっかく/是非|ぜひ/其処/そこ/其の|その/そんな風/そんなふう' +
	'(大分:大分県)|だいぶ/大変|たいへん/沢山|たくさん/確かに|たしかに/只|ただ/但し|ただし/例えば|たとえば/' +
	'度々|たびたび/多分|たぶん/為|ため/段々|だんだん/丁度|ちょうど/一寸|ちょっと/次いで|ついで/遂に|ついに/' +
	'R続[かきくけこい]|Rつづ[かきくけこい]/R繋[がげ]|Rつな[がげ]/詰まらな|つまらな/Rて置[かきくけこい]|Rてお[かきくけこい]/' +
	'と[い言]う事|ということ/到底|とうてい/通り|とおり/兎角|とかく/時々|ときどき/特に|とくに/何処|どこ/何方|どなた/' +
	'伴い|ともない/共に|ともに/捉える|とらえる/尚更|なおさら/直す|なおす/中々|なかなか/何故|なぜ/' +
	'何卒|なにとぞ/成る|なる/何と|なんと/何ら|なんら/何等|なんら/温い|ぬるい/後ほど|のちほど/捗る|はかどる/挟んで|はさんで/' +
	'筈|はず/果たして|はたして/甚だ|はなはだ/久しぶり|ひさしぶり/久々|ひさびさ/' +
	'一つ|1つ|１つ|ひとつ/一人|1人|１人|ひとり/二つ|2つ|２つ|ふたつ/二人|2人|２人|ふたり|ニ人/' +
	'程々|ほどほど/殆ど|ほとんど/紛らわし|まぎらわし/真面目|まじめ/先ず|まず/益々|ますます/又は|または' +
	'/全く|まったく/迄|まで/難し|むずかし/滅多|めった/滅法|めっぽう/勿論|もちろん/尤も|もっとも/最も|もっとも/専ら|もっぱら/' +
	'基づ|もとづ/下で|もとで/元に|もとに/基に|もとに/最早|もはや/易し|やさし/柔らか|やわらか/故に|ゆえに/行く行く|ゆくゆく/' +
	'由々し|ゆゆし/良い|よい/善い|よい/因って|よって/依って|よって/拠って|よって/' +
	'余程|よほど/我が|わが/分からな|わからな/分か[らりるれろんっ]|わからりるれろんっ/[判らりるれろんっ|わからりるれろんっ]/' +
	'解[らりるれろんっ]|わからりるれろんっ/僅か|わずか/[私僕俺]達|[私僕俺]たち/割[とに]|わり[とに]/我々|われわれ/腕白|わんぱく/';
	'[きくぐすつぬぶむるう]難[いかきくけ]/[きくぐすつぬぶむるう]が[いかきくけ];※言い難い等/' +
	'[きくぐすつぬぶむるう]様[だなにで]/[きくぐすつぬぶむるう]よう[だなにで];※言う様な等';

	const kanji_kakikae = function(text, list, val_count){
		const create_array = function(data){
			let list = data.split('/');
			const len = list.length;
			for(var x = 0; x < len; x++){
				list[x] = list[x].split(/\|/);
			}
			return list;
		}
		const kakikae_list = create_array(list);
		const match_count = function(str, pattern){
			let count = 0;
			if(pattern.charAt(0) === 'R'){
				let re = new RegExp(pattern.substr(1), 'g');
				let array = null;
				if(array = str.match(re)){
					count = array.length;
				}
			}else{
				for(let pos = 0; pos < str.length;){
					const pos2 = str.indexOf(pattern, pos + 1);
					if(pos2 == -1){
						return count;
					}
					pos = pos2;
					count++;
				}
			}
			return count;
		}
		const match_count2 = function(str, pattern){
			let p_fix = pattern;
			if(-1 != pattern.indexOf(';')){
				p_fix = pattern.split(';')[0];
			}
			if('(' === p_fix.charAt(0)){
				// (cde:abcdefg)
				const p = p_fix.split(':');
				const p1 = p[0].substr(1, p[0].length - 1);
				const p2 = p[1].substr(0, p[1].length - 1);
				const ret1 = match_count(str, p1);
				if(0 < ret1){
					return ret1 - match_count(str, p2);
				}
				return 0;
			}
			return match_count(str, p_fix);
		}
		let outstr = '';
		for(let x = 0; x < kakikae_list.length; x++){
			const item = kakikae_list[x];
			const len = item.length;
			let count_sum = 0;
			let count = [];
			for(let y = 0; y < len; y++){
				let a = match_count2(text, item[y]);
				count[y] = a;
				if(0 < a){
					count_sum++;
				}
			}
			if(val_count <= count_sum){
				outstr += item[0] + ' ' + fixnum(count[0]);
				for(let y = 1; y < len; y++){
					if('(' === item[y].charAt(0)){
						// (cde:abcdefg)
						const p = item[y].split(':');
						const p1 = p[0].substr(1, p[0].length - 1);
						outstr += ' /' + p1 + ' ' + fixnum(count[y]);
					}else{
						outstr += ' /' + item[y] + ' ' + fixnum(count[y]);
					}
				}
				outstr += '\n';
			}
		}
		if(outstr.length == 0){
			outstr = '検出されませんでした。\n';
		}
		return outstr;
	};

	let output = "";
	output += '■漢字字体揺れチェック\n'
	output += kanji_jitai(text);
	output += '■当用漢字による漢字の書きかえ\n';
	output += kanji_kakikae(text, kakikae_list1, 2);
	output += '■当用漢字による漢字の書きかえ(単漢字/参考)\n';
	output += kanji_kakikae(text, kakikae_list2, 2);
	output += '■当用漢字による漢字の書きかえ(特殊/参考)\n';
	output += kanji_kakikae(text, kakikae_list3, 2);
	output += '■当用漢字による漢字の書きかえ(慣用)\n';
	output += kanji_kakikae(text, kakikae_list4, 2);
	output += '■その他/交ぜ書き(参考/誤検出あり)\n';
	output += kanji_kakikae(text, kakikae_list5, 2);
	output += '■おまけ誤字等1(参考)\n';
	output += kanji_kakikae(text, kakikae_list6, 1);
	output += '■おまけ誤字等2(参考)\n';
	output += kanji_kakikae(text, kakikae_list7, 2);
	output += '■おまけ表記ゆれ(参考)\n';
	output += kanji_kakikae(text, kakikae_list8, 2);

	let text2 = output.replace(/\n/g, "<br>")
	get_id('result').innerHTML = '<div class="resultext">' + text2 + '</div>';
}
