import {Player, Game, TypePoint, Puntuation} from '../../../model/schemas.js'

const _read = {
        player: {
            find: async (socket)=>{
                socket.on('client:allPlayers', async ()=>{
                        try {
                            const dataPlayers = await Player.find().lean();

                            socket.emit('server:allPlayers', dataPlayers);
                        } catch (error) {
                            console.log('Error al cargar los jugadores: ', error);
                            socket.emit('server:allPlayers', []);
                        }
                });
            }
        },
        game: {
            find: async (socket)=>{
                socket.on('client:allGames', async ()=>{
                    try {
                        const data = await Game.find().sort({startDate: -1}).lean();

                        const puntuation = await Promise.all(data.map( async(g) =>{
                            g.player = await Puntuation.findOne({gameId: g._id})
                                                .populate('playerId', 'name position').lean();
                            return g;
                        }));

                        socket.emit('server:allGames', puntuation);
                    } catch (error) {
                        console.log('Error al cargar los partidos: ', error);
                        socket.emit('server:allGames', []);
                    }
                });
            },

            hasGameOnline: async (socket)=>{
                socket.on('client:hasGameOnline', async ()=>{
                    try {
                        const game = await Game.findOne({status: true});

                        if(game){
                            socket.emit('server:hasGameOnline', true);
                        }
                        else{
                            socket.emit('server:hasGameOnline', false);
                        }
                        
                    } catch (error) {
                        console.log('Error al buscar el partido en linea: ', error);
                        socket.emit('server:hasGameOnline', false);
                    }
                });
            },

            gameOnline: async (socket) =>{
                socket.on("client:gameOnline", async ()=>{
                    try {
                        const gameOnline = await Game.findOne({status: true}).lean();

                        const puntuations = await Puntuation.find({gameId: gameOnline._id})
                        .populate('playerId', 'name position')
                        .sort({points: -1})
                        .lean();

                        socket.emit("server:gameOnline", {gameOnline, puntuations});


                } catch (error) {
                    console.log('Error al cargar el partido en curso: ', error);
                    socket.emit('server:gameOnline', []);
                }

                });
            }
        }, 

        puntuation: {
            find: async (socket) =>{
                socket.on("client:puntuation", async gameId =>{
                    try {
                        const puntuation = await Puntuation.find({gameId: gameId})
                                            .populate("playerId", 'name position')
                                            .populate("gameId", "startDate, status")
                                            .sort({points: -1});

                        socket.emit('server:puntuation', puntuation);
                    } catch (error) {
                        console.log('Error al cargar la puntuación: ', error);
                        socket.emit('server:puntuation', []);
                    }
                });
            }
        }
    }

export default _read;


