import { Game, Player, Puntuation } from "../../../model/schemas.js";

const _create = {
    player: {
        create: async (io, socket)=>{
            socket.on('client:playerCreate', async data=>{
                try {
                    const v = new Player(data);
                    
                    await v.save();

                    io.emit('server:playerCreate', true);
                } catch (error) {
                    
                    console.error("Error C P", error);
                    socket.emit('server:playerCreate', false);
                }
            });
        }
    },
    puntuations: {
        create: async (io, socket)=>{
            socket.on('client:puntuationCreate', async data=>{
                try {
                    const {players} = data;

                    if(!players || players.length === 0) {
                        socket.emit('server:puntuationCreate', false);
                        return;
                    }

                    const existingGame = await Game.findOne({status: true});

                    if (existingGame) {
                        socket.emit('server:puntuationCreate', false);
                        return;
                    }

                    const newGame = new Game({
                        startDate: new Date(),
                        status: true,
                    });

                    const savedGame = await newGame.save();

                    const puntuationsDocs = players.map(playerId =>({
                        gameId: savedGame._id,
                        playerId: playerId
                    }));

                    await Puntuation.insertMany(puntuationsDocs);

                    io.emit('server:puntuationCreate', true);

                    socket.emit('server:puntuationCreate', true);
                } catch (error) {
                    
                }
            });
        }
    }
}

export default _create;