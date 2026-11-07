import {player, game, puntuation} from './../../socket/socket.js';

const gamesContainer = document.querySelector('#gamesContainer'),
    printGames = async (val)=>{
        const gamesData = val || (await game.all());
        gamesContainer.innerHTML = '';
        console.log(gamesData);

        gamesData.forEach(e => {
            const dateObj = new Date(e.startDate);
            const humanReadable = dateObj.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            gamesContainer.innerHTML += ` 
            <tr>
                <td>
                    <time datetime="">${humanReadable}</time>
                </td>
                <td>
                    <div class="games-person">
                        <span>${e.player.playerId.name}</span>
                    </div>
                </td>
                 <td>
                    <div class="games-person">
                        <span>${e.player.playerId.position}</span>
                    </div>
                </td>
                <td class="games-text-center">
                    <span class="games-points">${e.player.points.$numberDecimal}</span>
                </td>
                <td class="games-text-end">
                    <button type="button" class="games-icon-button" data-action="view-stats" data-game-id="example-1" aria-label="Ver estadísticas del partido del 2 de noviembre de 2026" title="Ver estadísticas">
                        <i class="bi bi-bar-chart-line" aria-hidden="true"></i>
                    </button>
                </td>
            </tr>
            `;
        });

        clickBtnNewGame();
    },

    action = ()=>{

    },

    gamePlayersContainer = document.querySelector('#gamePlayersContainer'),
    printPlayers = async(val)=>{
        const playersData = val || (await player.all());
        gamePlayersContainer.innerHTML = '';

        playersData.forEach(e =>{
            gamePlayersContainer.innerHTML += `
            <tr>
                <td class="game-checkbox-column">
                    <input type="checkbox" class="game-player-check" id="gamePlayer1" name="players" value="${e._id}" aria-label="Carlos Mendoza participa" aria-describedby="gameSelectionHelp">
                </td>
                <td>
                    <label for="gamePlayer1" class="game-player-label">$${e.name}</label>
                </td>
                <td><span class="game-player-position">${e.position}</span></td>
            </tr>
            `
        });


    },

    clickBtnNewGame = ()=>{
        const gamePlayersContainer = document.getElementById('gamePlayersContainer');
        const btnSelectAll = document.getElementById('btnSelectAllGamePlayers');
        const btnDeselectAll = document.getElementById('btnDeselectAllGamePlayers');
        const selectedCount = document.getElementById('gameSelectedCount');

        const updateSelectedCount = () => {
            const total = gamePlayersContainer.querySelectorAll('.game-player-check:checked:not(:disabled)').length;
            selectedCount.textContent = `${total} ${total === 1 ? 'seleccionado' : 'seleccionados'}`;
        };

        const selectAllPlayers = (checked) => {
            gamePlayersContainer.querySelectorAll('.game-player-check:not(:disabled)').forEach((checkbox) => {
                checkbox.checked = checked;
            });

            updateSelectedCount();
        };

        if (gamePlayersContainer && btnSelectAll && btnDeselectAll && selectedCount) {
            btnSelectAll.addEventListener('click', () => selectAllPlayers(true));
            btnDeselectAll.addEventListener('click', () => selectAllPlayers(false));

            // Actualizar también cuando marques o desmarques un jugador manualmente.
            gamePlayersContainer.addEventListener('change', (event) => {
                if (event.target.matches('.game-player-check')) {
                    updateSelectedCount();
                }
            });

            updateSelectedCount();
        }
    },
    
    initGame =  ()=>{
        const btnStartGame = document.getElementById('btnStartGame');

        btnStartGame.addEventListener('click', ()=>{
            const selectedPlayers = Array.from(
                gamePlayersContainer.querySelectorAll('.game-player-check:checked:not(:disabled)'),
                checkbox => checkbox.value
            );

            if(!selectedPlayers.length > 0) {
                alert('Por favor, selecciona al menos un jugador.');
                return;
            }

            puntuation.create({players: selectedPlayers});
                puntuation.listener((v)=>{
                    if(v){
                        alert('Partido creado con éxito.');
                        window.location.href = '/puntuacion';
                        
                    }
                    else
                        alert('No se pudo crear el juego. Hay uno en curso.');
                });
            

        });
    };


printGames();
printPlayers();
clickBtnNewGame();
initGame();

player.listener(printPlayers);
