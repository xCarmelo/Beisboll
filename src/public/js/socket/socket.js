export const socket = io();

export const player = {
    all: ()=>{
        return new Promise((res)=>{
            socket.emit('client:allPlayers');
            socket.on('server:allPlayers', (dataPlayers)=>{
                res(dataPlayers);
            }); 
        });
    },
    
    create: (data)=>{
        socket.emit('client:playerCreate', data);
    },

    update: (data)=>{
        socket.emit('client:playerUpdate', data);
    },
    
    delete: (id)=>{
        socket.emit('client:playerDelete', id);
    },

    listener: (fn)=>{
        //limpiar eventos previos escuchados
        socket.off("server:playerCreate");
        socket.off("server:playerUpdate");
        socket.off("server:playerDelete");

        socket.on('server:playerCreate', (v)=>{
            if(v)
            fn();
        });

        socket.on('server:playerUpdate', (v)=>{
            if(v) 
                fn();
        });

        socket.on('server:playerDelete', (v)=>{
            if(v)
                fn()
        });
    }
}

export const game = {

    all: ()=>{
        return new Promise(re=>{
            socket.emit('client:allGames');
            socket.on('server:allGames', (data)=>{ 
                re(data);
            });
        })
    },

    hasGameOline: ()=>{
        return new Promise(res =>{
            socket.emit('client:hasGameOnline');
            socket.on('server:hasGameOnline', data =>{
                res(data);
            });
        });
    },

    endGame: (gameId)=>{
        socket.emit('client:endGame', gameId);  
    },

    deleteGame: (gameId)=>{
        socket.emit('client:deleteGame', gameId);
    },

    listenerEndGame: (fn) => {

        socket.on('server:endGame', (v) => {
            console.log('server:endGame recibido:', v);
            if (!v.result) {
                console.log('false');
                return;
            };
            fn(v);
        });
    },

    listener: (fn)=>{
        socket.off('server:deleteGame');
        socket.on('server:deleteGame', v =>{
            if(v.result){
                fn(v.result, v.gameId);
            }
        });
    }
}

export const puntuation = {
    gameOnlinePuntuation: ()=>{
            return new Promise((res)=>{
                socket.emit('client:gameOnline');
                socket.on('server:gameOnline', (data)=>{ 
                    res(data);
                });
            });
    },

    create: (data)=>{
        socket.emit('client:puntuationCreate', data);
    },

    update: (data)=>{
        socket.emit('client:puntuationUpdate', data);
    },

    updateStatistc: async (data)=>{
        try {
            const response = await socket.timeout(5000)
                            .emitWithack('client:statisticUpdate', data);

            return response;
        } catch (error) {
            return false;
        }
    },


    find: (idGame)=>{
        return new Promise(re =>{
            socket.emit('client:puntuation', idGame);
            socket.on('server:puntuation', data =>{
                re(data);
            });
            
        });
    },

    listenerCreateGame(fn){
        socket.off('server:puntuationCreate');
        socket.on('server:puntuationCreate', (v)=>{
            if(v)
                fn(v);
        });
    },

    listener: (fn)=>{
        
        socket.off('server:puntuationUpdate');
        socket.off('server:statisticUpdate');



        socket.on('server:puntuationUpdate', (v)=>{
            if(v)fn();
        });

        socket.on('server:statisticUpdate', (v)=>{
            if(v) fn();
        });
    }
}