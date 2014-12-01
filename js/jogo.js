/**
Construtor da classe
@param puzzle 
	Puzzle do jogo (instância da classe Puzzle) 
@param blocos 
	Array contendo os blocos (classe anônimo contendo os objetos jQuery juntamente com suas dimensões)
@param velocidade 
	Float representando a velocidade de animação dos blocos 
@param numEmbaralhos 
	Número de embaralhos inicial do jogo 
**/
function Jogo(puzzle, blocos, velocidade, numEmbaralhos) {
	this.puzzle = puzzle;
	this.blocos = blocos;
	this.velocidade = velocidade;
	this.numEmbaralhos = numEmbaralhos;
};

/**
Move um bloco se o movimento for possível
@param num 
	Inteiro representando o bloco que se deseja mover 
**/
Jogo.prototype.move = function(num) {
	var distancia = this.blocos[num-1].tamanho + this.blocos[num-1].margem;
	var bloco = this.blocos[num-1].elemento;
	var direcao = this.puzzle.move(num);
	//Som de movimento 
	var isMutado = $(".mutar").data("mutado") == "true";
	if (direcao != null && !isMutado) {
		tocarEfeitoSonoro();
	}
	switch (direcao) {
		case Direcao.ESQUERDA:
			bloco.animate({
				left:"-=" + distancia + "px"
			}, this.velocidade);
			break;
		case Direcao.DIREITA:
			bloco.animate({
				left:"+=" + distancia + "px"
			},  this.velocidade);
			break;
		case Direcao.CIMA:
			bloco.animate({
				top:"-=" + distancia + "px"
			}, this.velocidade);
			break;
		case Direcao.BAIXO:
			bloco.animate({
				top:"+=" + distancia + "px"
			}, this.velocidade);
			break;
	}
};

/**
Move um bloco aleatório dentre os blocos em que são possíveis se movimentar dado a configuração atual  
**/
Jogo.prototype.moveAleatoriamente = function() {
	var movimentosPossiveis = this.puzzle.getMovimentosPossiveis();
	var rand;
	do {
		rand = Math.floor(Math.random() * movimentosPossiveis.length);
	} while (this.puzzle.movimentoAnterior == movimentosPossiveis[rand]);
	var bloco = movimentosPossiveis[rand];
	this.move(bloco);
	return bloco;
};

/**
Embaralha o jogo, movimentando os blocos numEmbaralhos vezes 
@param callbackFunction 
	Função que será chamada ao termino do embaralho 
**/
Jogo.prototype.embaralha = function(callbackFunction) {
	var that = this;
	function embaralhaComAnimacao(callbackFunction, cont) {
		if (cont <= 0) {
			if (callbackFunction) callbackFunction();
		} else {
			that.moveAleatoriamente();
			setTimeout(function() {
				embaralhaComAnimacao(callbackFunction, cont - 1);
			}, that.velocidade);
		}
	};
	embaralhaComAnimacao(callbackFunction, this.numEmbaralhos);
};

/**
Movimenta os blocos de tal forma que ao final o jogo estará resolvido 
@param callbackFunction 
	Função que será chamada ao termino da movimentação 
**/
Jogo.prototype.resolve = function(callbackFunction) {
	var that = this;
	function resolveComAnimacao(caminho, callbackFunction) {
		if (caminho.length == 0) {
			if (callbackFunction) callbackFunction();
		} else {
			var bloco = caminho.shift();
			that.move(bloco);
			setTimeout(function() {
				resolveComAnimacao(caminho, callbackFunction);
			}, that.velocidade);
		}
	};
	var caminho = this.puzzle.resolve();
	resolveComAnimacao(caminho, callbackFunction);
};
