/**
Construtor da classe 
@param tempoTotal 
	Tempo total do cronômetro (em unidade de tempo)
**/
function Cronometro(tempoTotal, barra, callbackFunction) {
	this.tempoTotal = tempoTotal;
	this.tempoAtual = this.tempoTotal;
	this.pausado = true;
	this.barra = barra;
	this.callbackFunction = callbackFunction;
};

/**
Diminui o tempo do cronômetro em uma unidade de tempo 
**/
Cronometro.prototype.diminuiTempo = function() {
	if (this.tempoAtual > 0) {
		this.tempoAtual--;
	}
};

/**
Verifica se o tempo do cronômetro já foi esgotado
**/ 
Cronometro.prototype.tempoEsgotado = function() {
	return this.tempoAtual <= 0;
};

/**
Retorna um float representando o tempo restante do cronômetro 
@return 
	Uma float representando o tempo restante (em porcentagem)
**/
Cronometro.prototype.tempoRestante = function() {
	return this.tempoAtual / this.tempoTotal * 100;
};

/**
Pausa o cronômetro
**/
Cronometro.prototype.pausa = function() {
	this.pausado = true;
};

/**
Reincia o cronômetro 
**/
Cronometro.prototype.reinicia = function() {
	this.tempoAtual = this.tempoTotal;
	this.pausado = false;
	this.inicia();
};

/**
Verifica se o cronômetro está pausado 
**/
Cronometro.prototype.isPausado = function() {
	return this.pausado;
};

/**
Inicia a contagem do cronômetro
**/
Cronometro.prototype.inicia = function() {
	if (!this.isPausado()) {
		if (this.tempoEsgotado()) {
			this.callbackFunction();
		} else {
			this.diminuiTempo();
			this.barra.css("width", this.tempoRestante() + "%");
			var that = this;
			setTimeout(function() {
				that.inicia();
			}, 1000);
		}
	}
};