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

    endGame: (gameId)=>{
        socket.emit('client:endGame', gameId);
    },

    listener: (fn)=>{
        socket.off('server:endGame');

        socket.on('server:endGame', (v)=>{
            fn(v);
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
    }
    ,

    listener: (fn)=>{
        socket.off('server:puntuationCreate');
        socket.off('server:puntuationUpdate');

        socket.on('server:puntuationCreate', (v)=>{
                fn(v);
        });

        socket.on('server:puntuationUpdate', (v)=>{
            fn(v);
        });
    }
}