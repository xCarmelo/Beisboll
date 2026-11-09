import _read from './crud/read/read.js'
import _create from './crud/create/create.js'
import _delete from './crud/delete/delete.js'
import _update from './crud/update/update.js'

export default (io)=>{
    io.on('connection', (socket)=>{

        //Lectura de la lista de jugadores
        _read.player.find(socket);

        //Lectura de la lista de partidos
        _read.game.find(socket);

        //Lectura de la partida en curso
        _read.game.gameOnline(socket);

        //visualizar estadisticas
        _read.puntuation.find(socket);

        //crear nuevo jugador
        _create.player.create(io, socket);

        //crear tabla de puntuacion
        _create.puntuations.create(io, socket); 


        //eliminar a un jugador
        _delete.player.delete(io, socket);

        //eliminar un juego
        _delete.game.delete(io, socket);

        //actualiar jugador
        _update.player.update(io, socket);

        //actualizar puntuacion
        _update.puntuation.update(io, socket);
        
        //actualizar estadistica
        _update.puntuation.updateStatistc(io, socket);

        //finalizar partido
        _update.game.endGame(io, socket);


    });
}
