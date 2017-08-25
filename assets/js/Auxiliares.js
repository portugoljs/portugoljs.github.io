var codDiv = document.getElementById('codDiv');//

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
/* fim teste tooltip */
$(document).ready(function() {
	$('body').delegate('.cm-variable','mouseover',function(e){
		if (Interpreter.isRunning() && Interpreter._DEBUGGER.isRunning) {

			var x = e.clientX, y = e.clientY;
			var tooltipSpan = document.getElementById('tpVar');
			tooltipSpan.innerHTML = valorVar;
			tooltipSpan.style.visibility = 'visible';
			tooltipSpan.style.top = (y + 10) + 'px';
			tooltipSpan.style.left = (x + 10) + 'px';
		}
	});
	$('body').delegate('.cm-variable','mouseout',function(e){
		var tooltipSpan = document.getElementById('tpVar');
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
				document.getElementById('infoPanel').innerText = forTip;
				document.getElementById('panel-info2').innerText = forTip2;
			break;
			case 'se':
				document.getElementById('infoPanel').innerText = ifTip;
			break;
			case 'caso':
			break;
			case 'enquanto':
				document.getElementById('infoPanel').innerText = whileTip;
			break;

			case 'de':

			break;
			case 'repita':
				document.getElementById('panel-info').innerText = untilTip;
			break;
			case 'funcao':

			break;
			case 'procedimento':
			break;
			case 'caso':
				document.getElementById('panel-info').innerText = caseTip;
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
/*document.getElementById('novo').onclick = function() {
document.getElementById('my_file').click();getIsRunning
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
	return document.getElementById("InputBox").value;
}

//Limpar input
function clearInputBox() {
	document.getElementById("InputBox").value = "";
}

//Limpa o console de saída quando um novo programa é iniciado
function limpaConsole() {
	document.getElementById("output").value = "";
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
		document.getElementById("InputBox").style.visibility = "visible";
	} else {
		document.getElementById("InputBox").style.visibility = "hidden";
	}
}

function insertDebugHTML(){
	document.getElementById("debug").innerHTML = `<div id="coluna_direita" class="col-md-4 col-xs-12"  style="background-color:white; max-height:450px;float:right">
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
            <button type="button" class="btn btn-default pull-right" onclick="salvar()">Salvar</button>
            <button type="button" class="btn btn-default pull-right" onclick="ativarTabelaVar()">Editar</button>
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
	var text = document.getElementById("debugPanel");
	document.getElementById("debugPanel").style.visibility = "visible";
	text.innerText = erro;
}

function limpaDebug(){
	document.getElementById("debugPanel").style.visibility = "hidden";
	document.getElementById("debugPanel").innerText = "";
}

//fim funcoes debug

//funcoes para pilha
function updateCallStack(funcao, add) {
	if(add){
		var table = document.getElementById("tab_callstack");
		var row = table.insertRow(1);
		var cell1 = row.insertCell(0);
		cell1.innerHTML = funcao;
	}
	else
		document.getElementById("tab_callstack").deleteRow(1);

}

function removerTodaPilhaFuncoes(){
	$("#tab_callstack tr:gt(1	)").remove();
}

//fim funcoes para pilha

//funcoes para pilha de variaveis

//cria objeto tabela e verifica se existe os valores para adicionar na tabela
function adicionarObjetoVar(id){
	objeto = new VarObject(tab[id].name, UNKNOWN, id, tab[id].lev, tab[id].adr);
	insertVariableInDebugPanel(objeto);
	arrayObjetoTabela.push(objeto);
}

function insertVariableInDebugPanel(variable, idRow = 2, ref = tab[variable.id].ref, typ = tab[variable.id].typ, offset = 0, name = '') {
	var table = document.getElementById("tab_var")
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
				cell2.innerHTML = "<input type='text' onkeypress='return inputVariableEvent(event, this)' readOnly='true' value='"+ variable.value +"'name='"+typ+"' id='"+ (Interpreter.getBase(variable.lv) + variable.adr + offset) +"'onclick='enableInputField(this);'>";
			}
			else {
				cell1.innerText = normalizeComposedLabel(variable, name);
				cell2.innerHTML = "<input type='text' onkeypress='return inputVariableEvent(event, this)' readOnly='true' value='"+ Interpreter.getValueWithIndexToTab(variable.id, ref, offset, typ) +"'name='"+typ+"' id='"+ (Interpreter.getBase(variable.lv) + variable.adr + offset) +"'onclick='enableInputField(this);'>";
			}

		break;
	}
	return row;
}


function enableInputField(input){
	input.readOnly = false;
}

function inputVariableEvent(e, v){
	if(e.key === 'Enter'){
		Interpreter._INPUT.inputByDebug = true;
		Interpreter._INPUT.save(v.value, v.id, v.name);
		disableInputField(v);
		Interpreter._DEBUGGER.updateVariableInDebugPanel(v);
	}
}

function disableInputField(input){
	input.readOnly = true;
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
	,		table = document.getElementById('tab_var');

	addEventInCell(show, cell2, lastRow, table, row, variable, offset, ref, typ, name);
	cell2.innerHTML = "<i class='glyphicon glyphicon-plus'></i><div id='variableToggle_"+variable.id+"'>";
	cell1.innerText = (name === '' ? variable.name : '') + normalizeComposedLabel({}, name);
	setAttributeInComposedRow(row, variable.id);
}

function addEventInCell(show, cell, lastRow, table, row, variable, offset, ref, typ, name = ''){
	var mTyp, mRef, mOffset, i, n, sz;
	cell.addEventListener("click", function(){
		if(show){
			show = false;
			cell.innerHTML = "<i class='glyphicon glyphicon-plus'></i><div id='variableToggle_"+variable.id+"'>"
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
				cell.innerHTML = "<i class='glyphicon glyphicon-minus'></i><div id='variableToggle_"+variable.id+"'>"
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
				cell.innerHTML = "<i class='glyphicon glyphicon-minus'></i><div id='variableToggle_"+variable.id+"'>"
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



function removerTopoPilhaVar() {
	if (document.getElementById("tab_var").getElementsByTagName("tr").length > 2) {
		document.getElementById("tab_var").deleteRow(2);
	}
}

function removerTodaPilhaVar(){
	$("#tab_var tr:gt(1)").remove();
}

//fim funcoes para pilha de variaveis

function mostraItensDepuracao(bool){
	if (bool) {
		insertDebugHTML();
		document.getElementById("continuar").style.visibility = "visible";
		document.getElementById("exe_cursor").style.visibility = "visible";
		document.getElementById("prox_funcao").style.visibility = "visible";
		// document.getElementById("exe_entrando").style.visibility = "visible";
		document.getElementById("exe_saindo").style.visibility = "visible";
		//document.getElementById("nao_parar").style.visibility = "visible";
		//document.getElementById("lb_nao_parar").style.visibility = "visible";
		document.getElementById("coluna_direita").style.visibility = "visible";


		document.getElementById("codDiv").className = "col-md-7";
		document.getElementById("coluna_direita").className = "col-md-5 col-xs-12";
		document.getElementById("coluna_direita").style.height = "550px";

	} else {
		//document.getElementById("continuar").style.visibility = "hidden";
		//document.getElementById("exe_cursor").style.visibility = "hidden";
		//document.getElementById("prox_funcao").style.visibility = "hidden";
		// document.getElementById("exe_entrando").style.visibility = "hidden";
		//document.getElementById("exe_saindo").style.visibility = "hidden";
		//document.getElementById("nao_parar").style.visibility = "hidden";
		//document.getElementById("lb_nao_parar").style.visibility = "hidden";
		//document.getElementById("coluna_direita").style.visibility = "hidden";

		document.getElementById("codDiv").className = "col-md-12";
		//document.getElementById("coluna_direita").className = "";
		//document.getElementById("coluna_direita").style.width = "1px;";
		//document.getElementById("coluna_direita").style.height = "1px";

	}
}

function mostraItensDepuracao2(bool){
	if (bool) {
		document.getElementById("colunaDepuracao").className = "col-md-4";
	} else {
		document.getElementById("colunaDepuracao").className = "col-md-0";
	}
}


function mostraBtExecucarNovamente(bool){
	if (bool) {
		document.getElementById("btNovamente").style.visibility = "visible";
	}else{
		document.getElementById("btNovamente").style.visibility = "hidden";
	}
}

mostraItensDepuracao(false);
