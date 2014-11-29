//enum
Direcao = {
		ESQUERDA: "esquerda",
		DIREITA: "direita",
		CIMA: "cima",
		BAIXO: "baixo"
};

const ESPACO_VAZIO = 0; //constante para definir o espaço vazio 

/**
Construtor da classe
@param dimensao 
	A dimensão do tabuleiro (exemplo: 3 = 3x3)
**/
function Puzzle(dimensao) {
	this.dimensao = dimensao;
	this.tabuleiro = [];
	this.movimentosRealizados = [];
	this.movimentoAnterior = null;
	//preenche o array de acordo com a dimensao
	for (var i = 0; i < dimensao; i++) {
		this.tabuleiro.push([]);
		for (var j = 0; j < dimensao; j++) {
			var ultimoElemento = i == this.dimensao - 1 && j == this.dimensao - 1;
			//ultimo elemento é o espaço vazio 
			if (ultimoElemento) {
				this.tabuleiro[i].push(ESPACO_VAZIO);
			} else {
				this.tabuleiro[i].push(dimensao * i + j + 1);
			}
		}
	}
};

/**
Encontra a posição do espaço vazio no tabuleiro
@return 
	Um par de valores [i, j] onde i é a linha e j é a coluna do espaço vazio 
**/
Puzzle.prototype.encontraEspacoVazio = function() {
	for (var i = 0; i < this.dimensao; i++) {
		for (var j = 0; j < this.dimensao; j++) {
			if (this.tabuleiro[i][j] == ESPACO_VAZIO) {
				return [i, j];
			}
		}
	}
};

/**
A partir de um bloco retorna a direção em que ele pode se movimentar ou null caso o movimento não seja possível
@param num 
	Um inteiro representando o bloco o qual se deseja verificar o movimento 
@return 
	Uma string representando o movimento em que o bloco pode se movimentar ou null 
**/
Puzzle.prototype.verificaMovimento = function(num) {
	var posicaoVazio = this.encontraEspacoVazio();
	var linha = posicaoVazio[0];
	var coluna = posicaoVazio[1];
	if (linha > 0 && num == this.tabuleiro[linha-1][coluna]) {
		return Direcao.BAIXO;
	} else if (linha < this.dimensao - 1 && num == this.tabuleiro[linha+1][coluna]) {
		return Direcao.CIMA;
	} else if (coluna > 0 && num == this.tabuleiro[linha][coluna-1]) {
		return Direcao.DIREITA;
	} else if (coluna < this.dimensao - 1 && num == this.tabuleiro[linha][coluna+1]) {
		return Direcao.ESQUERDA;
	}
};

/**
Realiza a troca entre duas posições 
@param i1 
	Linha da primeira posição 
@param j1 
	Coluna da primeira posição 
@param i2 
	Linha da segunda posição 
@param j2 
	Coluna da segunda posição 
**/
Puzzle.prototype.swap = function(i1, j1, i2, j2) {
	var temp = this.tabuleiro[i1][j1];
	this.tabuleiro[i1][j1] = this.tabuleiro[i2][j2];
	this.tabuleiro[i2][j2] = temp;
}

/**
Dado um bloco, realiza o movimento dele caso seja possível 
@param num 
	Um inteiro representando o bloco que se deseja movimentar 
@return 
	A direção em que o bloco se moveu ou null caso o movimento não tenha sido possível 
**/
Puzzle.prototype.move = function(num) {
	var movimento = this.verificaMovimento(num);
	if (movimento != null) {
		var posicaoVazio = this.encontraEspacoVazio();
		var linha = posicaoVazio[0];
		var coluna = posicaoVazio[1];
		switch (movimento) {
			case Direcao.ESQUERDA:
				this.swap(linha, coluna, linha, coluna + 1);
				break;
			case Direcao.DIREITA:
				this.swap(linha, coluna, linha, coluna - 1);
				break;
			case Direcao.CIMA:
				this.swap(linha, coluna, linha + 1, coluna);
				break;
			case Direcao.BAIXO:
				this.swap(linha, coluna, linha - 1, coluna);
				break;
		}
		if (movimento != null) {
			this.movimentosRealizados.push(num);
			this.movimentoAnterior = num;
		}
		return movimento;
	}
};

/**
A partir da configuração atual do tabuleiro, retorna todos os blocos que podem se movimentar  
@return 
	Uma array de inteiros representando todos os blocos que podem se movimentar 
**/
Puzzle.prototype.getMovimentosPossiveis = function() {
	var movimentosPossiveis = [];
	for (var i = 0; i < this.dimensao; i++) {
		for (var j = 0; j < this.dimensao; j++) {
			var num = this.tabuleiro[i][j];
			if (this.verificaMovimento(num) != null) {
				movimentosPossiveis.push(num);
			}
		}
	}
	return movimentosPossiveis;
};

/**
A partir da configuração atual do tabuleiro, calcula a distância de manhattan até a solução.
Esta função é usada como auxiliar no método resolve para dar prioridade às possibilidades que possuem a menor distância.
@return 
	Um inteiro representando a distância entre a configuração atual e a solução 
**/
Puzzle.prototype.calculaDistancia = function() {
	var distancia = 0;
	for (var i = 0; i < this.dimensao; i++) {
		for (var j = 0; j < this.dimensao; j++) {
			var bloco = this.tabuleiro[i][j];
			if (bloco != ESPACO_VAZIO) {
				//linhaOriginal e colunaOriginal = linha e coluna a qual o bloco pertencia inicialmente 
				//i e j = linha e coluna a qual o bloco pertence atualmente 
				var linhaOriginal = Math.floor((bloco - 1) / this.dimensao);
				var colunaOriginal = (bloco - 1) % this.dimensao;
				distancia += Math.abs(i - linhaOriginal) + Math.abs(j - colunaOriginal);
			}
		}
	}
	return distancia;
};

/**
Retorna uma cópia profunda do objeto 
@return 
	Um novo objeto do tipo Puzzle contendo todas as características do objeto atual 
**/
Puzzle.prototype.getCopia = function() {
	var novoPuzzle = new Puzzle(this.dimensao);
	for (var i = 0; i < this.dimensao; i++) {
		for (var j = 0; j < this.dimensao; j++) {
			novoPuzzle.tabuleiro[i][j] = this.tabuleiro[i][j];
		}
	}
	for (var i = 0; i < this.movimentosRealizados.length; i++) {
		novoPuzzle.movimentosRealizados.push(this.movimentosRealizados[i]);
	}
	return novoPuzzle;
};

/**
Retorna uma array contendo os passos necessários para resolver o puzzle atual.
Este método utiliza-se de uma variação do algoritmo A*, criando uma árvore de possibilidades e poderando cada possibilidade a partir da distância entre essa possibilidade e a solução.
Cada possibilidade é armazenada numa min-heap para dar prioridade as possibilidades que estão mais próximas da solução.
@return 
	Uma array de inteiros contendo os blocos que foram movimentados em ordem para que a solução possa ser atingida 
**/
Puzzle.prototype.resolve = function() {
	var possibilidades = new MinHeap(null, function(a, b) {
		return a.distancia - b.distancia;
	});
	var distanciaInicial = this.calculaDistancia();
	var puzzleInicial = this.getCopia();
	puzzleInicial.movimentosRealizados = [];
	possibilidades.push({puzzle: puzzleInicial, distancia: distanciaInicial});
	//enquanto houver possibilidades...
	while (possibilidades.size() > 0) {
		var candidato = possibilidades.pop().puzzle;
		var distancia = candidato.calculaDistancia();
		if (distancia == 0) {
			return candidato.movimentosRealizados;
		}
		var movimentosPossiveis = candidato.getMovimentosPossiveis();
		for (var i = 0; i < movimentosPossiveis.length; i++) {
			var numero = movimentosPossiveis[i];
			if (numero != candidato.movimentoAnterior) {
				var novoPuzzle = candidato.getCopia();
				novoPuzzle.move(numero);
				var novaDistancia = novoPuzzle.calculaDistancia() + novoPuzzle.movimentosRealizados.length;
				possibilidades.push({puzzle: novoPuzzle, distancia: novaDistancia});
			}
		}
	}
};

/**
Verifica se o tabuleiro atual já está resolvido 
@return 
	Um boolean representando se o tabuleiro atual está resolvido ou não
**/
Puzzle.prototype.estaResolvido = function() {
	for (var i = 0; i < this.dimensao; i++) {
		for (var j = 0; j < this.dimensao; j++) {
			var ultimoElemento = i == this.dimensao - 1 && j == this.dimensao - 1;
			if (!ultimoElemento) {
				if (this.tabuleiro[i][j] != i * this.dimensao + j + 1) {
					return false;
				}
			}
		}
	}
	return true;
};

/**
Reinicia o tabuleiro
**/
Puzzle.prototype.reinicia = function() {
	this.movimentosRealizados = [];
};

/**
Retorna a quantidade de movimentos realizados desde o início 
@return 	
	Inteiro representando a quantidade de movimentos realizados desde o início 
**/
Puzzle.prototype.getQuantMovimentos = function() {
	return this.movimentosRealizados.length;
};