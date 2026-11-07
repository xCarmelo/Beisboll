import mongoose, {Schema, model} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const schemaPlayer = new Schema({
    name: {
        required: true,
        type: String,
        trim: true
    },
    position: {
        type: String,
        trim: true
    }},
{
    timestamps: true,
    versionKey: false
});


const schemaGame = new Schema({
    startDate: {
        required: true,
        type: Date
    },

    status: { 
        required: true,
        type: Boolean,
        enum: [true, false]
    }

});

const schemaTypePoint = new Schema({
    name: {
        type: String,
        required: true,
        enum: ['Turno', 'Hit', 'Jonrón']
    }
});

const schemaPuntuation = new Schema({
    gameId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'game',
        required: true
    },
    playerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'player',
        required: true
    },
    turno: {
        type: Number,
        default: 0,
    },
    hits:{
        type: Number, 
        default: 0  
    },
    jonron: {
        type: Number,
        default: 0
    },

    points: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0
    }
    
});



schemaPlayer.plugin(mongoosePaginate);
schemaGame.plugin(mongoosePaginate);

const {
    Player,
    Game,
    TypePoint,
    Puntuation
} = 
{
    Player: model('player', schemaPlayer),
    Game: model('game', schemaGame),
    TypePoint: model('typePoint', schemaTypePoint),
    Puntuation: model('puntuation', schemaPuntuation)
};

export {
    Player,
    Game,
    TypePoint,
    Puntuation
}