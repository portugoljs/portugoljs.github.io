//para compilar
function compile(){
	time = new Date().getTime();
	InputFile = editor.getValue();
	isOk = true;
	isDone = false;
	compiladorPascalS();
	getElById("output").value = "";
	time = new Date().getTime() - time;
	mostraErro();
}
shortcut.add("F9",function() {
	compile();
});

//reexecutar o programa
function executeAgain(){
	if(isOk && isDone){
		Interpreter.init();
		Interpreter.resume();
	}
}
shortcut.add("Ctrl+F9", () => executeAgain());

//Compilar e executar
shortcut.add("F10",() => compileAndExecute());

//rodar até o cursor
shortcut.add("F4", () => Interpreter._DEBUGGER.Until());

//passo-a-passo entrando em rotinas (step into)
shortcut.add("F7",() => Interpreter._DEBUGGER.In());

//Executar sem parar
shortcut.add("Ctrl+F7", () => Interpreter._DEBUGGER.dontStop());

//Executar até sair da rotina(step out)
shortcut.add("Ctrl+F8",() => Interpreter._DEBUGGER.Out());

//passo-a-passo saltando rotinas (step over)
shortcut.add("F8", () => Interpreter._DEBUGGER.Over());

//interromper a depuração e a execução
shortcut.add("Ctrl+F2",() => {
	if(Interpreter.isRunning())
		Interpreter.finalize();
	}
);

//fim atalhos

//funcao para adicionar linha para o depurador no editor
function mostraLinhaDepurador(linha){
	limpaLinhaDepurador();
	editor.addLineClass(linha, 'background', 'line-depurador');
	var info = editor.lineInfo(1);
}

function makeMarkerLinha(linha) {
	var span = getElById("mk_"+linha);
	var valor = 0;

	if (span !== null) {
		valor = parseInt(span.innerHTML);
	}

	valor += 1;
	var marker = document.createElement("div");
	marker.style.color = "#822";
	marker.innerHTML = "<span id=mk_"+linha+" class='badge'>"+ valor +"</span>";
	aumentaMarker();
	return marker;
}

//altera o tamanho dos makers
function aumentaMarker(){
	var elements = document.querySelectorAll('.breakpoints');
	for(var i=0; i<elements.length; i++){
		elements[i].style.width = "28px";
	}
}
//altera o tamanho dos makers
function diminuiMarker(){
	var elements = document.querySelectorAll('.breakpoints');
	for(var i=0; i<elements.length; i++){
		elements[i].style.width = "15px";
	}
}

//limpa todas as linhas depurador
function limpaLinhaDepurador(){
	for(i = 0; i <= editor.lineCount(); i++){
		editor.removeLineClass(i,'background', 'line-depurador');
	}
}

//limpa todos os contadores
function limpaContadores(){
	editor.clearHistory();
	editor.clearGutter("breakpoints");
	diminuiMarker();
}

//funcao para incrementar o numero de vezes que a linha foi executadas
function incrementar(linha){
	editor.setGutterMarker(linha, "breakpoints", makeMarkerLinha(linha));
}

//funcao para adicionar linha de erro no editor
function mostraErroNaLinha(linha, titulo){
	editor.addLineClass(linha, 'background', 'line-error');
	var info = editor.lineInfo(1);
	editor.setGutterMarker(linha, "breakpoints", makeMarker(titulo));
}

//funcao que criar o marcador
function makeMarker(titulo) {
	var marker = document.createElement("div");
	marker.style.color = "#822";
	marker.innerHTML = "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>";
	if (titulo !== "") {
		marker.title = titulo;
	}else{
		marker.title = "";
	}
	marker.setAttribute("data-toggle", "tooltip");
	marker.setAttribute("data-placement", "right");
	return marker;
}
//funcao para remover erros do editor
function limparCodeBox(){
	for(i = 0; i <= editor.lineCount(); i++){
		editor.removeLineClass(i,'background', 'line-error');
	}
	editor.clearHistory();
	editor.clearGutter("breakpoints");
}

//seta tooltip
$(document).ready(function() {
	$("body").tooltip({ selector: '[data-toggle=tooltip]' });
});

//criar um marquer para ponto de parada
function fazerPontoParada() {
	var marker = document.createElement("div");
	marker.style.color = "#822";
	marker.innerHTML = "●";
	return marker;
}
//verifica se tem ponto parada
function temPontoParada(n){
	var info = editor.lineInfo(n);
	if (info.gutterMarkers !== undefined){
		return true;
	}else{
		return false;
	}
}

//retorna todas as linhas com ponto de parada
function getLinhasPontoParada(){
	var linhas = [];
	for (var i = 0; i < editor.lineCount(); i++) {
		if (temPontoParada(i)) {
			linhas.push(i);
		}
	}
	return linhas;
}
