import { initNavigation, setHeaderLiveGame} from './navigation.js';
import './modal-focus.js';

document.addEventListener('DOMContentLoaded', ()=>{
    initNavigation();
    setHeaderLiveGame(true, '/puntuacion');
});