import { puntuation, game } from '../../socket/socket.js';

const btnLiveGame = document.getElementById('headerLiveGame');

const hasGameOline = await game.hasGameOline();

//si existe un partido en linea, mostramos el botón de partido en vivo
if (hasGameOline && btnLiveGame) {
    btnLiveGame.classList.remove('hidden');
}

puntuation.listenerCreateGame(() => {
    if (btnLiveGame) btnLiveGame.classList.remove('hidden');
});

game.listenerEndGame(() => {
    if (btnLiveGame) btnLiveGame.classList.add('hidden');
});