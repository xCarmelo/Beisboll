import mongoose from "mongoose";
import { Game, Player, Puntuation } from "../../../model/schemas.js";

const _update = {
    player: {
        update: async (io, socket)=>{
            socket.on('client:playerUpdate', async data =>{

                try {
                const { _id, ...datas} = data;

                    await Player.findByIdAndUpdate(
                        {_id: _id},
                        {
                            $set: datas
                        }
                    );

                    //actualizar todos los registros de los usuarios
                    io.emit('server:playerUpdate', true);

                } catch (error) {
                    console.log("Error U P:", error);
                    socket.emit("server:playerUpdate", false);
                }
            });
        }
    },

    puntuation: {
        update: async(io, socket) =>{
            socket.on('client:puntuationUpdate', async data =>{
                try {
                    const puntuation = await Puntuation.findOne({gameId: data.gameId, playerId: data.playerId});

                    if(!puntuation){
                        socket.emit("server:puntuationUpdate", false);
                        return;
                    }

                    if(data.hits){
                        puntuation.hits += 1;
                    }
                    
                    if(data.jonron){
                        puntuation.jonron += 1; 
                    }

                    puntuation.turno += 1;

                    const points = (puntuation.hits  + puntuation.jonron) / puntuation.turno;

                    puntuation.points = mongoose.Types.Decimal128.fromString(points.toFixed(3));

                    await puntuation.save();
                    io.emit("server:puntuationUpdate", true);

                } catch (error) {
                    console.log("Error U P:", error);
                    socket.emit("server:puntuationUpdate", false);
                }
            });
        },

        updateStatistc: async (io, socket)=>{
            socket.on('client:statisticUpdate', async (v, callback) =>{
                try {
                    const {_id, ...data} = v;

                    data.points = (data.hits + data.jonron) / data.turno;
                    data.points = mongoose.Types.Decimal128.fromString(data.points.toFixed(3));

                    const result = await Puntuation.findOneAndUpdate({_id: _id}, {$set: data});

                    if(!result){
                        return callback(false);
                    }

                    callback(true);

                    socket.brodcast.emit('server:puntuationUpdate', true);
                } catch (error) {
                    console.log("Error U P:", error);
                    callback(false);
                }
            });
        }
    },

    game: {
        endGame: (io, socket)=>{
            socket.on('client:endGame', async (gameId)=>{
                try {
                  const result = await Game.updateOne(
                        {_id: gameId},
                        {$set: {
                            status: false
                        }}
                    );

                    if(result.matchedCount === 0){
                        socket.emit('server:endGame', false);
                        return;
                    }

                    io.emit('server:endGame', {result: true, gameId: gameId});

                } catch (error) {
                    console.error('Error al finalizar el partido: ', error);
                    socket.emit('server:endGame', {result: false});
                }
            });
        }
    }
}

export default _update;