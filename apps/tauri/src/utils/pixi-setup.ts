// This module must be imported BEFORE pixi-live2d-display
// pixi-live2d-display requires window.PIXI to be set globally
import * as PIXI from "pixi.js";

(window as any).PIXI = PIXI;

export { PIXI };
