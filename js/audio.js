
function getPhoneGapPath() {
	var path = window.location.pathname;
	path = path.substr( path, path.length - 10 );
	return 'file://' + path;
};

function tocarEfeitoSonoro() {
	try {
		if (window.som) {
			window.som.stop();
			window.som.release();
		}
		var arquivo = $("#sonoro").find("source").attr("src");
		window.som = new Media(getPhoneGapPath() + arquivo);
		window.som.play();
	} catch(err) { } 
	$("#sonoro")[0].play();
};

function tocarEfeitoSonoroVitoria() {
	try {
		if (window.som_vitoria) {
			window.som_vitoria.stop();
			window.som_vitoria.release();
		}
		var arquivo = $("#sonoro-venceu").find("source").attr("src");
		window.som_vitoria = new Media(getPhoneGapPath() + arquivo);
		window.som_vitoria.play();
	} catch(err) { } 
	$("#sonoro-venceu")[0].play();
};

function tocarEfeitoSonoroDerrota() {
	try {
		if (window.som_derrota) {
			window.som_derrota.stop();
			window.som_derrota.release();
		}
		var arquivo = $("#sonoro-perdeu").find("source").attr("src");
		window.som_derrota = new Media(getPhoneGapPath() + arquivo);
		window.som_derrota.play();
	} catch(err) { } 
	$("#sonoro-perdeu")[0].play();
};

function tocarMusica() {
	var musica;
	try {
		var arquivo = $("#musica").find("source").attr("src");
		musica = new Media(getPhoneGapPath() + arquivo, null, null, function(status) {
			if (status == Media.MEDIA_STOPPED) {
				musica.play();
			}
		});
		musica.play();
	} catch(err) { } 
	//musica com HTML 5
	$("#musica")[0].play();
	return musica;
};

function tocarMusicaMenu() {
	var musica;
	try {
		var arquivo = $("#musica-menu").find("source").attr("src");
		musica = new Media(getPhoneGapPath() + arquivo, null, null, function(status) {
			if (status == Media.MEDIA_STOPPED) {
				musica.play();
			}
		});
		musica.play();
	} catch(err) { } 
	//musica com HTML 5
	$("#musica-menu")[0].play();
	return musica;
};