import {puntuation, game} from '../../socket/socket.js';

const playerContaner = document.querySelector("#statsPlayersContainer"),
        printPlayerPuntuation = async (val)=>{
            const path = window.location.pathname;
            const partes = path.split('/').filter(Boolean);

            const gameId = partes[partes.length -1];

            if(!gameId){
                alert('Estadística no encontrada');
                return; 
            }

            const data = val || (await puntuation.find(gameId));

            playerContaner.innerHTML = '';

            data.forEach(e => {
                playerContaner.innerHTML += `
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
                            <!-- Botón de edición con atributos data-* estructurados profesionalmente -->
                            <button type="button" class="btn-open-edit-modal stats-edit-button" 
                                data-bs-toggle="modal" 
                                data-bs-target="#editStatsModal"
                                data-player-id="${e.playerId._id}"
                                data-puntuation-id="${e._id}"
                                data-player-name="${e.playerId.name}"
                                data-hits="${e.hits}"
                                data-jonron="${e.jonron}"
                                data-turno="${e.turno}"
                                title="Editar estadísticas">
                                <i class="bi bi-pencil-square" aria-hidden="true"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

             //seleccionamos el modal
                const editStatsModal = document.getElementById("editStatsModal");

                if(editStatsModal){
                    editStatsModal.addEventListener('show.bs.modal', e =>{
                        //boton que disparo el modal
                        const button = e.relatedTarget;

                        if(!button) return;

                        const playerName = button.getAttribute('data-player-name');
                        const hits = button.getAttribute('data-hits');
                        const jonron = button.getAttribute('data-jonron');
                        const turno = button.getAttribute('data-turno');
                        const puntuationId = button.getAttribute('data-puntuation-id');

                        // Asignar los valores a los inputs ocultos y visibles del formulario
                        document.getElementById('statsPlayerName').textContent = playerName;
                        
                        document.getElementById('statsHits').value = hits;
                        document.getElementById('statsHomeRuns').value = jonron;
                        document.getElementById('statsTurns').value = turno;
                        document.getElementById('statsPuntuationId').value = puntuationId;

                        const errorContainer = document.getElementById('editStatsError');
                        if (errorContainer) {
                            errorContainer.textContent = '';
                            errorContainer.hidden = true;
                        }
                    });
                }

                const fieldsEdit = [
                    '#statsPuntuationId',
                    '#statsHits',
                    'statsTurns',
                    'statsHomeRuns' 
                ];

                const form = document.getElementById('editStatsForm');

                form.addEventListener('submit', (e)=>{
                    e.preventDefault();

                    const hasEmtyFieldseEdit  = fieldsEdit.some(c => document.getElementById(c)?.value === ''); 
                    
                    if(hasEmtyFieldseEdit){
                        alert('Por favor completa todos los campos.')
                        return;
                    }

                    const dataEdit = {
                        '_id': document.getElementById('statsPuntuationId').value,
                        'turno': document.getElementById('statsTurns').value,
                        'hits': document.getElementById('statsHits').value,
                        'jonron': document.getElementById('statsHomeRuns').value
                    }

                    puntuation.updateStatistc(dataEdit); 
                    
                });
        };

printPlayerPuntuation();

puntuation.listener(printPlayerPuntuation);
game.listener((v, id)=>{
    if(v){

        const path = window.location.pathname;
        const partes = path.split('/').filter(Boolean);
        const gameId = partes[partes.length -1];

        if(gameId === id)
        window.location.href = "/partidos";
    }
});
