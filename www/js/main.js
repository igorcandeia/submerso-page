
$(document).on("ready", function() {
		
	init();
	
	function init() {
		//------------------------------------------------
		// CONSTANTES DEFINIDAS NO HTML
		//------------------------------------------------
		var dimensao = parseInt($("#dimensao").val()); 				//dimensao do tabuleiro (exemplo: 3 = 3x3)
		var velocidade = parseInt($("#velocidade").val()); 			//velocidade de animação dos blocos em milisegundos 
		var numEmbaralhos = parseInt($("#embaralhos").val()); 		//número de embaralhos feitos ao início do jogo 
		var margem = parseInt($("#margem").val()); 					//margem entre os blocos em pixels 
		var porcentagem = parseFloat($("#porcentagem").val()); 		//porcentagem de ocupação do tabuleiro na tela (entre 0 e 1) 
		var tempoTotal = parseInt($("#tempo-total").val()); 		//tempo total do cronômetro em segundos 
		var duracaoNumeros = parseInt($("#duracao-numeros").val());	//duração em que os números ficarão expostos ao clicar em "mostrar números"
		
		//------------------------------------------------
		// VARIÁVEIS DO JOGO 
		//------------------------------------------------
		var tamanho = getTamanhoBloco(porcentagem, dimensao);
		var blocos = desenharBlocos("nyan_cat", tamanho, dimensao, margem);
		var puzzle = new Puzzle(dimensao);
		var jogo = new Jogo(puzzle, blocos, velocidade, numEmbaralhos);
		var barra = $("#tempo-restante");
		var cronometro = new Cronometro(tempoTotal, barra, perderJogo);
		
		//------------------------------------------------
		// AÇÕES
		//------------------------------------------------
		//Tela inicial 
		$("#tela-vencer").hide();
		$("#tela-derrota").hide();
		$("#iniciar-jogo").on("click", function() {
			$("#inicial").hide();
			iniciarJogo();
		});
		
		//Ação inicial
		var musica;
		function iniciarJogo() {
			jogo.embaralha(function() {
				cronometro.reinicia();
			});
			//musica do jogo 
			try {
				musica = new Media(getPhoneGapPath() + "audio/nyanlooped.mp3", null, null, function(status) {
					if (status == Media.MEDIA_STOPPED) {
						musica.play();
					}
				});
				musica.play();
			} catch(err) { } 
		}

		//Movimentação 
		function moverBloco(bloco) {
			//Permite a movimentação apenas se o cronômetro não estiver pausado 
			//Necessário para não dar conflito com movimentações automáticas como embaralhar e resolver 
			if (!cronometro.isPausado()) {
				jogo.move(bloco);
				if (puzzle.estaResolvido()) {
					vencerJogo();
				}
			}
		};
		for (var i = 0; i < blocos.length; i++) {
			var bloco = blocos[i];
			bloco.elemento.on("click", function() {
				var num = parseInt($(this).attr("id").substring(1));
				moverBloco(num);
			});
		}
		
		//Vencer jogo 
		function vencerJogo() {
			cronometro.pausa();
			$("#tela-vencer h2").text("Você venceu em " + (puzzle.getQuantMovimentos() - numEmbaralhos) + " passos!");
			$("#tela-vencer").show();
		};
		
		//Perder jogo 
		function perderJogo() {
			cronometro.pausa();
			jogo.resolve(function() {
				$("#tela-derrota").show();
			});
		};
		
		//Reiniciar jogo 
		function reiniciarJogo() {
			$("#tela-derrota").hide();
			$("#tela-vencer").hide();
			$(".mostrar-numero").removeAttr("disabled");
			puzzle.reinicia();
			jogo.embaralha(function() {
				cronometro.reinicia();
			});
		};
		$(".reiniciar-jogo").on("click", reiniciarJogo);
		
		//Mostrar os números
		function mostrarNumeros(opacidade, esconder) {
			if (opacidade < 0) return;
			//Muda a opacidade dos números
			for (var i = 1; i < Math.pow(dimensao, 2); i++) {
				var texto = $("#c" + i + " p");
				texto.css("color", "rgba(255, 255, 255, " + opacidade + ")");
			}
			//Define a nova opacidade e o próximo intervalo de tempo dependendo de certos estados
			var novaOpacidade;
			var proximoTempo;
			//Diminui a opacidade gradativamente
			if (esconder) {
				novaOpacidade = opacidade - 0.01;
				proximoTempo = 20;
			} else {
				//Já chegou ao máximo de opacidade. Começar agora o processo de esconder
				if (opacidade >= 1) {
					novaOpacidade = 1.0;
					proximoTempo = duracaoNumeros * 1000;
					esconder = true;
				//Aumenta a opacidade gradativamente 
				} else {
					novaOpacidade = opacidade + 0.01;
					proximoTempo = 20;
				}
			}
			setTimeout(function() {
				mostrarNumeros(novaOpacidade, esconder);
			}, proximoTempo);
		};
		$(".mostrar-numero").on("click", function() {
			$(this).attr("disabled", "disabled");
			mostrarNumeros(0, false);
		});
		
		//Mutar 
		$(".mutar").on("click", function() {
			//desmuta 
			if ($(this).data("mutado") == "true") {
				$(this).find("i").removeClass("fa-bell-slash");
				$(this).find("i").addClass("fa-bell");
				$(this).data("mutado", "false");
				if (musica) {
					musica.play();
				}
			//muta 
			} else {
				$(this).find("i").removeClass("fa-bell");
				$(this).find("i").addClass("fa-bell-slash");
				$(this).data("mutado", "true");
				if (musica) {
					musica.pause();
				}
			}	
		});
		
	};

});