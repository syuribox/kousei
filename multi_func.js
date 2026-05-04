"use strict";
let mem_data1 = '';
let mem_data2 = '';
let mem_sample = '';
function my_getid(name){
	return document.getElementById(name);
}
function set_memory1(text){
	mem_data1 = text;
}
function set_memory2(text){
	mem_data2 = text;
}
function set_sample(text){
	mem_sample = text;
}
function muti_func(func, name){
	if(false){
		// 仮
	}else if(func === 'clear'){
		my_getid(name).value = '';
	}else if(func === 'sample'){
		my_getid(name).value = mem_sample;
	}else if(func === 'memosave1'){
		mem_data1 = my_getid(name).value;
	}else if(func === 'memosave2'){
		mem_data2 = my_getid(name).value;
	}else if(func === 'memoload1'){
		my_getid(name).value = mem_data1;
	}else if(func === 'memoload2'){
		my_getid(name).value = mem_data2;
	}else if(func === 'delnoline'){
		let str = my_getid(name).value;
		str = str.replaceAll('\r\n', '\n').replaceAll(/\n{2,}/g, '\n');
		my_getid(name).value = str;
	}else if(func === 'trimline'){
		let str = my_getid(name).value;
		str = str.replaceAll('\r\n', '\n').replaceAll(/(^([ 　])+)|(([ 　])+$)$/gm, '');
		my_getid(name).value = str;
	}else if(func === 'addlinenum'){
		let str = my_getid(name).value;
		let linenum = 0;
		str = str.replaceAll('\r\n', '\n').replaceAll(/^/gm, (linehead) => {
			linenum++;
			return linenum + ': ';
		});
		my_getid(name).value = str;
	}else if(func === 'dellinenum'){
		let str = my_getid(name).value;
		str = str.replaceAll('\r\n', '\n').replaceAll(/^[_0-9]+: /gm, '');
		my_getid(name).value = str;
	}else if(func === 'all'){
		let str = my_getid(name).value;
		str = str.replaceAll('\r\n', '\n').replaceAll(/^[_0-9]+: /gm, '');
		str = str.replaceAll(/(^([ 　])+)|(([ 　])+$)$/gm, '');
		str = str.replaceAll(/\n{2,}/g, '\n');
		let linenum = 0;
		str = str.replaceAll(/^/gm, (linehead) => {
			linenum++;
			return linenum + ': ';
		});
		my_getid(name).value = str;
	}
}

function read_files(files, callback){
	let file_size = 0;
	for(const f of files){
		file_size += f.size;
	}
	if( 1000000 < file_size ){
		if(false == window.confirm('合計ファイルサイズが1MB以上あります。\n' +
				'ファイル読み込みを処理しますか？')){
			return;
		}
	}
	let index = 0;
	const one_file = files.length < 2;
	let all_text = '';
	const end_read = function(data, next){
		all_text += data.replace(/\r\n/g, '\n') + '\n';
		index++;
		if(index < files.length){
			//次のファイル
			let reader2 = new FileReader();
			reader2.onload = next;
			reader2.readAsText(files[index], 'Shift_JIS');
		}else{
			callback(all_text);
		}
		return;
	};
	const loader = function(e){
		 // UTF-8でリロード
		const loader_utf8 = function(e){
			end_read(e.target.result, loader);
			return;
		};
		const data = e.target.result;
		if(
			-1 !== data.indexOf('ｿ縺溘') ||
			-1 !== data.indexOf('縺ｧ縺') ||
			-1 !== data.indexOf('縺ｫ') ||
			-1 !== data.indexOf('縺ｪ') ||
			-1 !== data.indexOf('縺昴ｌ')
		){
			 // 文字化け検出→UTF-8でリロード
			const reader4 = new FileReader();
			reader4.onload = loader_utf8;
			//再読み込み
			reader4.readAsText(files[index], 'UTF-8');
		}else{
			// Shift_JIS
			// ファイル読み込み終わり
			end_read(data, loader);
		}
		return;
	};
	// 1つめを読み込む
	const reader = new FileReader();
	reader.onload = loader;
	reader.readAsText(files[index], 'Shift_JIS');
}

function button_file_open(e, callback){
	read_files(e.target.files, callback);
}

function drop_files(e, callback){
	e.preventDefault();
	read_files(e.dataTransfer.files, callback);
}

function drop_cancel(e){
	if(e.preventDefault){
		e.preventDefault();
	}
	return false;
}
