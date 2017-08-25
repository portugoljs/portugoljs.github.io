const ifTip = `se <condição> entao
	<bloco_instruções>
[senao	<bloco_instruções>]`;
const ifTip2 = ``;

const forTip = `ESTRUTURA DE REPETIÇÃO PARA
para i de 0 ate n passo 2 faca
inicio
	x := i div 2
	se x
fim`;
const forTip2 = `-	A palavra passo é opcional e especifica o valor de incremento de cada iteração, caso seja omitida o incremento será unitário.
-		Os valores da expressão inicial e da expressão final devem ter o mesmo tipo da variável que receberá o incremento.
-		Caso exista apenas uma linha de instrução no laço, as palavras inicio e fim podem ser omitidas.
-		Para realizar o decremento da variável, utilize o caractere de negativação - no passo.`;

const whileTip = `ESTRUTURA DE REPETIÇÃO ENQUANTO
Especificação:
enquanto <expr> faca
<bloco_de_instruções>`;
const whileTip2 = `- A estrutura enquanto sempre avalia a expressão no início do laço, ou seja, o laço pode não ser executado`;

const untilTip = `ESTRUTURA DE REPETIÇÃO REPITA
Especificação:
repita
	{<instruções>}
ate <expr>`;
const untilTip2 = `- A estrutura repita avalia a expressão ao final, ou seja, o laço sempre será executado ao menos uma vez, a execução continua enquanto o resultado da avaliação for falso.`;

const caseTip = `ESTRUTURA DE DECISÃO CASO
Especificação:
caso (<expr>) de
	{<rótulo>{, <rótulo>}: <bloco_de_instruções>}
	[senao <bloco_de_instruções>]
fim`;
const caseTip2 = ``;
