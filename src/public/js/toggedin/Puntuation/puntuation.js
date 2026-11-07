import {game, puntuation} from '../../socket/socket.js';

const livePlayerContainer = document.getElementById('livePlayersContainer'),
gameId = document.getElementById('gameId');

const printPuntuation = async ()=>{
    const {gameOnline, puntuations} = await puntuation.gameOnlinePuntuation();
    livePlayerContainer.innerHTML = '';
    gameId.value = gameOnline._id;

    puntuations.forEach(e =>{
        livePlayerContainer.innerHTML += `
             <tr data-player-id="${e.playerId._id}">
                <td>
                    <div class="live-player">
                        <span class="live-player-name">${e.playerId.name}</span>
                    </div>
                </td>
                <td>${e.playerId.position}</td>
                <td>${e.turno}</td>
                <td>${e.hits}</td>
                <td>${e.jonron}</td>
                <td><span class="live-points">${e.points.$numberDecimal}</span></td>
                <td>
                    <button type="button" class="live-add-turn" data-bs-toggle="modal" data-bs-target="#addScoreModal" aria-label="Agregar turno a José Romero" title="Agregar turno">
                        <i class="bi bi-plus-circle" aria-hidden="true"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    
},

addPuntuation = () =>{
    const scoreModal = document.getElementById('addScoreModal');

if (scoreModal) {
    const form = document.getElementById('addScoreForm');
    const playerId = document.getElementById('scorePlayerId');
    const playerName = document.getElementById('scorePlayerName');
    const hit = document.getElementById('scoreHit');
    const homeRun = document.getElementById('scoreHomeRun');
    const error = document.getElementById('addScoreError');

    scoreModal.addEventListener('show.bs.modal', (event) => {
        form.reset();
        error.hidden = true;
        error.textContent = '';
        playerId.value = '';
        playerName.textContent = 'Selecciona un jugador';

        const row = event.relatedTarget?.closest('tr[data-player-id]');
        if (!row) return;

        playerId.value = row.dataset.playerId;
        playerName.textContent = row.querySelector('.live-player-name')?.textContent.trim() || 'Jugador';
    });

    hit.addEventListener('change', () => {
        if (hit.checked) homeRun.checked = false;
    });

    homeRun.addEventListener('change', () => {
        if (homeRun.checked) hit.checked = false; 
    });

    const fields = [
        "#scorePlayerId",
        "#gameId"
    ];

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const results = fields.some(element => {
            const field = document.querySelector(element);
            return field && !field.value.trim();
        });

        if(results){
            alert('Por favor completa todos los campos.');
            return;
        }

        const data = {
            "playerId": document.querySelector("#scorePlayerId")?.value,
            "gameId": document.querySelector("#gameId")?.value,
            "hits": document.querySelector("#scoreHit")?.checked,
            "jonron": document.querySelector("#scoreHomeRun")?.checked
        }

        puntuation.update(data);
        puntuation.listener((value)=>{
            if(value){
                alert("Puntuación agregada al marcador.");
                printPuntuation();
                const modalElement = document.getElementById('addScoreModal');

                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
                    modalInstance.hide();
                }
            }
            else{
                alert("Error al actualizar la puntuación.");
            }
        });

    });
}
},

endGame = ()=>{
    const btnEndGame = document.querySelector("#btnFinishGame");

    btnEndGame.addEventListener('click', (e)=>{
        if(confirm('¿Seguro que deseas finalizar el partido?')){
            const gameId = document.querySelector('#gameId');

            if(gameId){
                game.endGame(gameId.value);

                game.listener((v)=>{
                    if(v){
                        alert("Partido finalizado con exito.");
                        window.location.href = "/partidos";
                    }
                    else{
                        alert("No se pudo finalizar el partido.");
                    }
                });
            }
        }
    });
};



addPuntuation();
printPuntuation();
endGame();

