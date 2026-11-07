import {player, socket} from '../../socket/socket.js'

const tbody = document.getElementById("playersContainer"),
    printPlayers = async (val)=>{
        const data = val || (await player.all());
        tbody.innerHTML = '';

        data.forEach(e => {
            tbody.innerHTML += `
                    <!-- Tarjeta -->
        <article class="roster-card card-player" id="id${e._id}">
            <div class="roster-card-heading">
                <div class="roster-avatar" aria-hidden="true"></div>

                <span class="roster-sport" aria-label="Béisbol">⚾</span>
            </div>

            <div class="roster-player">
                <h2 id="name">${e.name}</h2>
                <span class="roster-position" id="position">${e.position}</span>
            </div>

            <div class="roster-actions"> 
                <button
                    type="button"
                    class="roster-score"
                    aria-label="Agregar puntuación a Carlos Mendoza"
                >
                    <i class="bi bi-plus-circle" aria-hidden="true"></i>
                    Agregar puntuación
                </button>

                <div class="roster-secondary-actions">
                    <button type="button" class="roster-edit update" data-bs-toggle="modal" data-bs-target="#editPlayerModal" data-player-id="${e._id}" aria-label="Editar jugador">
                    <i class="bi bi-pencil" aria-hidden="true"></i>
                    Editar
                </button>

                    <button
                        type="button"
                        class="roster-delete delete"
                        aria-label=""
                        data-id="${e._id}"
                    >
                        <i class="bi bi-trash3" aria-hidden="true"></i>
                        Eliminar
                    </button>
                </div>
            </div>
        </article>
            `;
        });


        Action(); 

    },
    Action = ()=>{
        let btns = {
            delete: [...tbody.querySelectorAll('.delete')],
            update: [...tbody.querySelectorAll('.update')]
        },
        fields = [
            "#editPlayerName",
            "#editPlayerPosition"
        ]

        //logica para eliminar
        btns.delete.forEach(btn =>{
            btn.addEventListener("click", (e)=>{
                const id = e.currentTarget.getAttribute("data-id");
                
                //validamos que el id exista y no esté vacío ni lleno de espacios
                if(!id || id.trim() === ""){
                    alert('Chatel, no se pudo eliminar, intenta recargar la pagina.');
                    return;
                }
                else{
                    player.delete(id);
                }
            });
        });


        //logica para editar
        btns.update.forEach(btn=>{
            btn.addEventListener('click', (e)=>{
                const player = document.querySelector(`#id${e.currentTarget.getAttribute("data-player-id")}`);

                //Asignar los datos de edicion a los campos del formulario
                document.querySelector("#editPlayerName").value = player.querySelector("#name").textContent;
                document.querySelector("#editPlayerPosition").value = player.querySelector("#position").textContent;
                document.querySelector("#editPlayerId").value = e.currentTarget.getAttribute("data-player-id");

            });
        });
    };


    printPlayers();

    //formulario
    const form = document.querySelector('#form'),
    fields = [
        "#playerName",
        "#playerPosition"
    ];


    form.addEventListener('submit', (e)=>{
        e.preventDefault();

        //verificar que los campos no esten vacios
        const hasEmptyFields = fields.some(
            (id) => document.querySelector(id)?.value.trim() === "",
        );

    if(hasEmptyFields){
        alert('Chatel, no se admiten campos vacios.');
        return;
    }else{
        let newPlayer = {
            "name": document.querySelector("#playerName")?.value,
            "position": document.querySelector("#playerPosition")?.value
        }

        player.create(newPlayer);
        
        satinizer(fields);


        // Cerrar el modal de Bootstrap.
        const modalElement = document.getElementById('createPlayerModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

        if (modalElement.contains(document.activeElement)) {
            document.activeElement.blur();
        }

        modalInstance.hide();
    }



});

const editPlayerForm = document.querySelector("#editPlayerForm"),
fieldsEdit = [
    "#editPlayerId",
    "#editPlayerName",
    "#editPlayerPosition"   
];

editPlayerForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    const hasEmptyFields = fieldsEdit.some(id =>document.querySelector(id)?.value === "");

    if(hasEmptyFields) {
        alert('Chatel, no pueden haber capos vacios.');
        return;
    }
    else {

        let editPlayer = {
            "_id": document.querySelector('#editPlayerId')?.value,
            "name": document.querySelector('#editPlayerName')?.value,
            "position": document.querySelector('#editPlayerPosition')?.value
        }

        player.update(editPlayer);
        satinizer(fieldsEdit);


        // Cerrar el modal de editar.
        const modalElement = document.getElementById('editPlayerModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

        if (modalElement.contains(document.activeElement)) {
            document.activeElement.blur();
        }

        modalInstance.hide();


    }
});


const satinizer = (data)=>{
    data.forEach(id =>{
        const field = document.querySelector(id);

        if(field){
            field.value = "";
        }
    });
}

//escuchador
player.listener(printPlayers);