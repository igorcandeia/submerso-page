
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