import {AirHockey} from './game/air-hockey.js';
import {HotSeatAirHockey} from "./multiPlayer/hot-seat.js";

const airHockey = document.createElement('air-hockey');

airHockey.setOpponentHandler();

document.querySelector("#game").appendChild(airHockey);
