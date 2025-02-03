import BoardManager from './handlers/board-manager.js';
import GameLogic from './handlers/game-logic.js';
import UIManager from './handlers/ui-manager.js';

class CastlesGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.config = this.loadConfig();
        this.boardManager = new BoardManager(this);
        this.gameLogic = new GameLogic(this);
        this.uiManager = new UIManager(this);
        this.init();
    }

    loadConfig() {
        return {
            difficulty: this.getAttribute('difficulty') || 'medium',
            icons: JSON.parse(this.getAttribute('icons') || 'null') || { x: '❌', castle: '🏰' },
        };
    }

    init() {
        this.boardManager.createBoard();
        this.uiManager.render();
    }

    connectedCallback() {
        this.uiManager.render();
    }

    getSizeBasedOnDifficulty() {
        const random = Math.floor(Math.random() * 10) % 2;
        switch (this.config.difficulty) {
            case 'easy':
                return random ? 4 : 5;
            case 'medium':
                return random ? 6 : 7;
            case 'hard':
                return random ? 8 : 9;
            default:
                return Math.floor(Math.random() * 6) + 4;
        }
    }

    render() {
        const template = `
            <link rel="stylesheet" href="components/castles/castles.css">
            <div class="game-container">
                <div class="board" id="game-board"></div>
                <button class="toggle-button" id="toggle-solution">Mostrar Solución</button>
                <div class="board" id="solution-container" style="display: none;"></div>
            </div>
        `;

        this.shadowRoot.innerHTML = template;

        this.uiManager.setupGameBoard();
        this.uiManager.setupSolutionToggle();
    }
}

export default CastlesGame;
