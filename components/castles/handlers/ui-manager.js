export default class UIManager {
    constructor(game) {
        this.game = game;
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

        this.game.shadowRoot.innerHTML = template;

        this.setupGameBoard();
        this.setupSolutionToggle();
    }

    renderBoard() {
        const gameBoard = this.game.shadowRoot.getElementById('game-board');
        gameBoard.style.gridTemplateColumns = `repeat(${this.game.boardManager.size}, 50px)`;
        gameBoard.style.gridTemplateRows = `repeat(${this.game.boardManager.size}, 50px)`;
        gameBoard.innerHTML = '';

        for (let i = 0; i < this.game.boardManager.size; i++) {
            for (let j = 0; j < this.game.boardManager.size; j++) {
                const cell = this.game.boardManager.board[i][j];
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.style.backgroundColor = cell?.color || '#ffffff';

                if (cell?.state === 'x') {
                    cellDiv.textContent = this.game.config.icons.x;
                } else if (cell?.state === 'c') {
                    cellDiv.textContent = this.game.config.icons.castle;
                    if (cell.invalid) {
                        cellDiv.classList.add('invalid');
                    }
                }
                
                cellDiv.addEventListener('click', () => this.game.gameLogic.handleClick(i, j));
                gameBoard.appendChild(cellDiv);
            }
        }
    }

    renderSolution() {
        const solutionContainer = this.game.shadowRoot.getElementById('solution-container');
        solutionContainer.style.gridTemplateColumns = `repeat(${this.game.boardManager.size}, 50px)`;
        solutionContainer.style.gridTemplateRows = `repeat(${this.game.boardManager.size}, 50px)`;
        solutionContainer.innerHTML = '';

        for (let i = 0; i < this.game.boardManager.size; i++) {
            for (let j = 0; j < this.game.boardManager.size; j++) {
                const cell = this.game.boardManager.board[i][j];
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.style.backgroundColor = cell?.color || '#ffffff';

                const castle = this.game.boardManager.solution.find(c => c.row === i && c.col === j);
                if (castle) {
                    cellDiv.textContent = this.game.config.icons.castle;
                }
                cellDiv.style.pointerEvents = 'none';
                solutionContainer.appendChild(cellDiv);
            }
        }
    }

    setupGameBoard() {
        this.renderBoard();
    }

    setupSolutionToggle() {
        const toggleButton = this.game.shadowRoot.getElementById('toggle-solution');
        const solutionContainer = this.game.shadowRoot.getElementById('solution-container');

        toggleButton.addEventListener('click', () => {
            if (solutionContainer.style.display === 'none') {
                solutionContainer.style.display = 'grid';
                toggleButton.textContent = 'Ocultar Solución';
                this.renderSolution();
            } else {
                solutionContainer.style.display = 'none';
                toggleButton.textContent = 'Mostrar Solución';
            }
        });
    }
} 