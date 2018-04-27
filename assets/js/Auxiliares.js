function aumentarTamanho(){
	var style = window.getComputedStyle(codDiv, null).getPropertyValue('font-size');
	var fontSize = parseFloat(style);
	if (fontSize < 30) {
		codDiv.style.fontSize = (fontSize + 2) + 'px';
	}
}

function diminuirTamanho(){
	var style = window.getComputedStyle(codDiv, null).getPropertyValue('font-size');
	var fontSize = parseFloat(style);
	if (fontSize > 12) {
		codDiv.style.fontSize = (fontSize - 2) + 'px';
	}
}

function time32() {
	return new Date().getTime() & 0x7fffffff; // getTime() % (2^31) = getTime() % (2^31-1=0x7fffffff)
}
$(document).ready(function() {
	$('body').delegate('.cm-variable','mouseover',function(e){
		if (Interpreter.isRunning() && Interpreter._DEBUGGER.isRunning) {
			activedVariable = Interpreter._DEBUGGER.searchActivedVariable(e.currentTarget.innerText);
			if(activedVariable instanceof VarObject){
				var x = e.clientX, y = e.clientY;
				var tooltipSpan = getElById('tpVar');
				var data = normalizeData(Interpreter.getValueWithIndexToTab(activedVariable.id), tab[activedVariable.id].typ);
				if(data.length > 150)
					data.splice(0,150);
				tooltipSpan.style.width = (data.length * 7 + 2)+"px";
				tooltipSpan.innerText = data;
				tooltipSpan.style.visibility = 'visible';
				tooltipSpan.style.top = (y + 10) + 'px';
				tooltipSpan.style.left = (x + 10) + 'px';
			}

		}
	});
	$('body').delegate('.cm-variable','mouseout',function(e){
		var tooltipSpan = getElById('tpVar');
		tooltipSpan.style.visibility = 'hidden';
	});
});

$(document).ready(function() {
	$('body').delegate('.cm-keyword, .cm-reservadas','click',function(e){
		switch (e.currentTarget.innerText) {
			case 'escreva':
			case 'escrevaln':

			break;
			case 'var':

			break;
			case 'retorne':

			break;
			case 'leia':

			break;
			case 'para':
				getElById('infoPanel').innerText = forTip;
				getElById('infoPanel2').innerText = forTip2;
			break;
			case 'se':
				getElById('infoPanel').innerText = ifTip;
				getElById('infoPanel2').innerText = ifTip2;
			break;
			case 'caso':
				getElById('infoPanel').innerText = caseTip;
				getElById('infoPanel2').innerText = caseTip2;
			break;
			case 'enquanto':
				getElById('infoPanel').innerText = whileTip;
				getElById('infoPanel2').innerText = whileTip2;
			break;

			case 'de':

			break;
			case 'repita':
				getElById('infoPanel').innerText = untilTip;
				getElById('infoPanel2').innerText = untilTip2;
			break;
			case 'funcao':

			break;
			case 'procedimento':
			break;
		}
	});
});

//Função para gerar uma hash do código fonte compilado.
function GetHashCode(str) {
	var hash = 0, i;
	if (str.length == 0)
	return hash;
	for (i in str) {
		hash  = ((hash << 5) - hash) + str.charCodeAt(i);
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}





//ao clicar no botao abre janela para selecionar arquivo
/*getElById('novo').onclick = function() {
getElById('my_file').click();getIsRunning
};*/

//seta template no editor de texto
function SetTemplate(){
	editor.setValue("programa test\nvar\n\ti : inteiro\ninicio\n\ti := 2\nfim");
}

//Script para entrada de dados pelo teclado
function InputBoxEvent(e) {
	var value;
	if (e.key == 'Enter') {
		if (Interpreter._INPUT.isReadingInstruction()){
			atualizarConsole(value = getValueFromUser());
			Interpreter._INPUT.save(value);
			clearInputBox();
			Interpreter.resume();
		}
	}
}

//Função para pegar o valor informado pelo usuário
function getValueFromUser() {
	return getElById("InputBox").value;
}

//Limpar input
function clearInputBox() {
	getElById("InputBox").value = "";
}

//adequar os valores javascript para português estruturado
function normalizeData(v, typ){
	switch (typ) {
		case chars:
		case strings:
			return "'" + v + "'";
		break;
		case bools:
			return (v)?'verdadeiro':'falso';
		break;
		case pointers:
			return (v === 0)? 'nulo': v.toString();
		break;
		case arrays:
			return v.toString().slice(0,50);
		break;
		case records:
			return '...';
		break;
		default:
			return v.toString();
	}
}

//Limpa o console de saída quando um novo programa é iniciado
function limpaConsole() {
	getElById("output").value = "";
}

function StringFilter(str){			//Retorna o final da string no tamanho máximo de linhas delimitado por lineLimit
	var count = 0, index = str.length, lineLimit = 200;
	do {
		index = str.lastIndexOf('\n', index-1);
		count++;
		if(count >= lineLimit || index == -1){
			return str.substring(index+1);
		}
		else
		index1 = index;
	} while (true);
}

//Imprime informações no console de saída
function atualizarConsole(string){
	outputConsole.value = StringFilter(outputConsole.value+string);
	outputConsole.scrollTop = outputConsole.scrollHeight;
}

//Imprime erros no console debug abaixo do editor
function mostraErro(){
	limpaDebug();
	adicionarErro(MsgErro+"\nTempo de compilação: "+((time != undefined)?time:0)+" ms.");
}

function isLetter(char){
	var a = "a".charCodeAt();
	var A = "A".charCodeAt();
	var z = "z".charCodeAt();
	var Z = "Z".charCodeAt();
	char = char.charCodeAt();
	return char >= a && char <= z || char >= A && char <= Z
}

function isNumber(n){
	n = n.charCodeAt();
	var _0 = "0".charCodeAt();
	var _9 = "9".charCodeAt();
	return n >= _0 && n <= _9;
}

function mostrarModalOutput(){
	$('#modalOutput').modal('show');
	$('#InputBox').focus();
}

function esconderModalOutput(){
	$('#modalOutput').modal('hide');
}

function renderInput(bool) {
	if (bool) {
		getElById("InputBox").style.visibility = "visible";
	} else {
		getElById("InputBox").style.visibility = "hidden";
	}
}

function insertDebugHTML(){
	getElById("debug").innerHTML = `<div id="coluna_direita" class="col-md-4 col-xs-12"  style="background-color:white; max-height:450px;float:right">
    <!-- <div id="coluna_direita" style="width:295px; height:400px; float:right; visible:none; background-color:white; margin:2px;  overflow: auto;" > -->
    <div class="row" style="margin-top:5px;">
      <div class="col-md-6 col-xs-12" style="resize:both;float:right">
        <div id="vars">
          <div class="table-responsive" style="max-height:445px; overflow-y:auto; margin-bottom:5px;border: 0px solid #dddddd;width:100%">
            <table id="tab_var" class="table table-bordered" style="margin-bottom:5px !important;">
              <thead>
                <tr>
                  <th colspan="2">Variáveis</th>
                </tr>
                <tr>
                  <th>Nome</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <!-- inserir linhas pilha variaveis-->
              </tbody>
            </table>
            <!--<button type="button" class="btn btn-default pull-right" onclick="salvar()">Salvar</button>
            <button type="button" class="btn btn-default pull-right" onclick="ativarTabelaVar()">Editar</button>-->
          </div>
        </div>
      </div>
      <div class="col-md-6 col-xs-12">
        <div id="pilha" style="width:100%; float:right">
          <div class="table-responsive" style="max-height:320px; overflow-y:auto;">
            <table class="table table-bordered" id="tab_callstack" style="border: 0px solid #dddddd;">
              <thead>
                <tr >
                  <th colspan="2">Pilha de execução</th>
                </tr>
              </thead>
              <tbody>
                <!-- inserir linhas pilha execucao-->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div><!--fim coluna 2 -->`
}


//debug
function adicionarErro(erro) {
	var text = getElById("debugPanel");
	getElById("debugPanel").style.visibility = "visible";
	text.innerText = erro;
}

function limpaDebug(){
	getElById("debugPanel").style.visibility = "hidden";
	getElById("debugPanel").innerText = "";
}

//fim funcoes debug

//funcoes para pilha
function updateCallStack(funcao, add) {
	var table = getElById("tab_callstack");
	if(add){
		var row = table.insertRow(table.rows.length);
		var cell1 = row.insertCell(0);
		cell1.innerHTML = funcao;
	}
	else
		getElById("tab_callstack").deleteRow(table.rows.length-1);

}

function removerTodaPilhaFuncoes(){
	$("#tab_callstack tr:gt(1	)").remove();
}

//fim funcoes para pilha

//funcoes para pilha de variaveis

function insertVariableInDebugPanel(variable, idRow = 2, ref = tab[variable.id].ref, typ = tab[variable.id].typ, offset = 0, name = '') {
	var table = getElById("tab_var")
	,		row = table.insertRow(idRow)
	, 	cell1 = row.insertCell(0)
	, 	cell2 = row.insertCell(1)
	,		show = false
	,		lastRow
	,		value;

	variable.row = row;

	switch (typ) {
		case arrays:
		case records:
			insertComposedFields(row, typ,  cell1, cell2, variable, offset, ref, name, lastRow);
		break;
		default:
			if(tab[variable.id].typ === typ){
				variable.value = Interpreter.getValueWithIndexToTab(variable.id, ref, offset, typ);
				if(typ == pointers && variable.value == 0)
					variable.value = 'nulo';
				if(typ == chars && variable.value < 32)
					variable.value = '';
				if(typ == bools)
					if(variable.value)
						variable.value = 'verdadeiro';
					else
						variable.value = 'falso';
				cell1.innerHTML = variable.name;
				cell2.innerHTML = "<input type='text' readOnly='true' value='"+ variable.value +"'name='"+typ+"' id='"+ (tab[variable.id].obj === "konstant"? 0 : (Interpreter.getBase(variable.lv) + variable.adr + offset)) +"'onclick='enableInputField(this)'>";
			}
			else {
				cell1.innerText = normalizeComposedLabel(variable, name);
				cell2.innerHTML = "<input type='text' readOnly='true' value='"+ Interpreter.getValueWithIndexToTab(variable.id, ref, offset, typ) +"'name='"+ typ +"' id='"+ (tab[variable.id].obj === "konstant"? 0 : (Interpreter.getBase(variable.lv) + variable.adr + offset))	 +"'onclick='enableInputField(this);'>";
			}
		break;
	}
	return row;
}

function enableInputField(input){
	input.readOnly = false;
	input.addEventListener('keypress', (event) => {
		if(event.key === 'Enter')
			Interpreter._DEBUGGER.saveDataFromDebugPanel(input);
	});
}

function disableInputField(input){
	input.readOnly = 'true';
}

function normalizeComposedLabel(variable, label){
	var lb = label.split("")
	,		n = 0
	,		str
	,		brackets = {
		b : [],
		n : 0,
		pop : function(){if (this.n > 0) this.n--;},
		push : function(v){this.b[++this.n] = v}
	};
	while(n < lb.length){
		if ( lb[n] === ',' ){
			if(brackets.n === 0){
				brackets.push('[');
				lb.splice(n, 1);
				lb[n] = '[';
			}
		}
		else if( lb[n] === '.' ){
			if( brackets.n > 0 ){
				brackets.pop();
				lb.splice(n, 0, ']');
			}
		}
		n++;
	}
	while( brackets.n > 0 ){
		brackets.pop();
		lb[lb.length] = ']';
	}
	return lb.join("");

}

function insertComposedFields(row, typ, cell1, cell2, variable, offset, ref, name, lastRow){
	var //values = Interpreter.getValueWithIndexToTab(variable.id, ref, offset, typ),
			show = false
	,		table = getElById('tab_var');

	addEventInCell(show, cell2, lastRow, table, row, variable, offset, ref, typ, name);
	cell2.innerHTML = "<i class='glyphicon glyphicon-plus' id='"+(Interpreter.getBase(variable.lv) + variable.adr + offset)+'b'+"'></i><div id='"+ (Interpreter.getBase(variable.lv) + variable.adr + offset) +"'>";
	cell1.innerText = (name === '' ? variable.name : '') + normalizeComposedLabel({}, name);
	setAttributeInComposedRow(row, variable.id);
}

function addEventInCell(show, cell, lastRow, table, row, variable, offset, ref, typ, name = ''){
	var mTyp, mRef, mOffset, i, n, sz;
	cell.addEventListener("click", function(){
		if(show){
			show = false;
			cell.innerHTML = "<i class='glyphicon glyphicon-plus' id='"+(Interpreter.getBase(variable.lv) + variable.adr + offset)+"'></i><div id='"+ (Interpreter.getBase(variable.lv) + variable.adr + offset) +'b'+"'>"
			let i = lastRow.rowIndex;
			while(i > row.rowIndex)
				table.deleteRow(i--);
		}
		else{
			show = true;
			lastRow = row;
			if(typ === arrays){
				mTyp = atab[ref].eltyp;
				mRef = atab[ref].elref;
				n = atab[ref].low;
				cell.innerHTML = "<i class='glyphicon glyphicon-minus id='"+(Interpreter.getBase(variable.lv) + variable.adr + offset)+"''></i><div id='"+ (Interpreter.getBase(variable.lv) + variable.adr + offset) +'b'+"'>"
				mOffset = offset;
				while(n <= atab[ref].high){
					lastRow = insertVariableInDebugPanel(variable, lastRow.rowIndex+1, mRef, mTyp, mOffset, name + ', ' + n);
					mOffset += atab[ref].elsize;
					n++;
				}
			}
			else{
				n = btab[ref].last;
				mTyp = tab[n].typ;
				mRef = tab[n].ref;
				mOffset = tab[n].adr + offset;
				cell.innerHTML = "<i class='glyphicon glyphicon-minus id='"+(Interpreter.getBase(variable.lv) + variable.adr + offset)+"''></i><div id='"+ (Interpreter.getBase(variable.lv) + variable.adr + offset) +"'>"
				while(n != 0){
					lastRow = insertVariableInDebugPanel(variable, lastRow.rowIndex+1, mRef, mTyp, mOffset, name + '.'+tab[n].name);
					n = tab[n].link;
					mTyp = tab[n].typ;
					mRef = tab[n].ref;
					mOffset = tab[n].adr + offset;
				}
			}
		}
	});
}

function setAttributeInComposedRow(row, id){
	row.setAttribute("class", "clickable");
	row.setAttribute("data-toggle", "collapse");
	row.setAttribute("data-target", ".row"+id);
	row.setAttribute("id", "linha_"+id);
}

function removerTodaPilhaVar(){
	$("#tab_var tr:gt(1)").remove();
}

//fim funcoes para pilha de variaveis

function mostraItensDepuracao(bool){
	if (bool) {
		insertDebugHTML();
		getElById("continuar").style.visibility = "visible";
		getElById("exe_cursor").style.visibility = "visible";
		getElById("prox_funcao").style.visibility = "visible";
		// getElById("exe_entrando").style.visibility = "visible";
		getElById("exe_saindo").style.visibility = "visible";
		//getElById("nao_parar").style.visibility = "visible";
		//getElById("lb_nao_parar").style.visibility = "visible";
		getElById("coluna_direita").style.visibility = "visible";


		getElById("codDiv").className = "col-md-7";
		getElById("coluna_direita").className = "col-md-5 col-xs-12";
		getElById("coluna_direita").style.height = "550px";

	} else {
		//getElById("continuar").style.visibility = "hidden";
		//getElById("exe_cursor").style.visibility = "hidden";
		//getElById("prox_funcao").style.visibility = "hidden";
		// getElById("exe_entrando").style.visibility = "hidden";
		//getElById("exe_saindo").style.visibility = "hidden";
		//getElById("nao_parar").style.visibility = "hidden";
		//getElById("lb_nao_parar").style.visibility = "hidden";
		//getElById("coluna_direita").style.visibility = "hidden";

		getElById("codDiv").className = "col-md-12";
		//getElById("coluna_direita").className = "";
		//getElById("coluna_direita").style.width = "1px;";
		//getElById("coluna_direita").style.height = "1px";

	}
}

function mostraItensDepuracao2(bool){
	if (bool) {
		getElById("colunaDepuracao").className = "col-md-4";
	} else {
		getElById("colunaDepuracao").className = "col-md-0";
	}
}


function mostraBtExecucarNovamente(bool){
	if (bool) {
		getElById("btNovamente").style.visibility = "visible";
	}else{
		getElById("btNovamente").style.visibility = "hidden";
	}
}
