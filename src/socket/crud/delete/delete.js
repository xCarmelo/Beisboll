import { Player } from "../../../model/schemas.js";

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
    }

}

export default _delete;