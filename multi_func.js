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
