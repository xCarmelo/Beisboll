export const controller = (router, urls)=>{

    //Home
    router.get('/', (req, res)=>{
        res.render("home");
    });

    //Players
    router.get(urls.loggedin.players.players, (req, res)=>{
        res.render('loggedin/players/players');
    });

    //Honrones
    router.get(urls.loggedin.players.honrones, (req, res)=>{
        res.render('loggedin/players/honrones');
    });

    //Game
    router.get(urls.loggedin.game.view, (req, res)=>{
        res.render('loggedin/game/index');
    });

    //estadísticas de juego
    router.get(urls.loggedin.game.statistics, (req, res)=>{
        res.render('loggedin/game/statistic');
    });

    //puntuacion
    router.get(urls.loggedin.puntuation.view, (req, res)=>{
        res.render('loggedin/puntuation/index');
    });


}
