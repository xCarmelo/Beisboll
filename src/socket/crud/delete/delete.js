import mongoose from "mongoose";
import { Game, Player, Puntuation } from "../../../model/schemas.js";

const _delete = {
    player: {
        delete: async (io, socket)=>{
            socket.on('client:playerDelete', async (id)=>{
                try {
                    await Player.findOneAndDelete({
                        _id: id
                    });

                    //Actualizar todos los registros de los jugadores
                    io.emit('server:playerDelete', true);
                } catch (error) {
                    socket.emit('server:playerDelete', false);
                    console.log('Error D P');
                }
            });
        }
    },

    game: {
        delete: async (io, socket)=>{
            socket.on('client:deleteGame', async gameId =>{
                
                const session = await mongoose.startSession();


                try {
                    const id = gameId;

                    session.startTransaction();
                    
                    await Puntuation.deleteMany({_id: id}, {session});
                    const deletedGame = await Game.findByIdAndDelete(id, {session});

                    if(!deletedGame){
                        socket.emit('server:deleteGame', false);
                    }

                    //si todo sale bien, confirmamos el (commit)
                    await session.commitTransaction();

                    io.emit('server:deleteGame', true);


                } catch (error) {
                    session.abortTransaction();
                    socket.emit('server:deleteGame', false);
                    console.log('Error D G');
                }
                finally{
                    session.endSession();
                }
            });
        }
    }

}

export default _delete;