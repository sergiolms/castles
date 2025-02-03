const castleChar = 'c';
const xChar = 'x';

export default class GameLogic {
    constructor(game) {
        this.game = game;
    }

    handleClick(row, col) {
        const cell = this.game.boardManager.board[row][col];
        const previousState = cell.state;
        
        if (cell.state === null) cell.state = xChar;
        else if (cell.state === xChar) cell.state = castleChar;
        else cell.state = null;
        
        if (cell.state === castleChar) {
            this.markAffectedCells(row, col, xChar);
        }
        else if (previousState === castleChar) {
            this.clearAffectedCells(row, col);
        }
        
        this.validateBoard();
        this.game.uiManager.renderBoard();
        this.checkWin();
    }

    markAffectedCells(row, col, state) {
        for (let i = 0; i < this.game.boardManager.size; i++) {
            if (i !== col && this.game.boardManager.board[row][i].state !== castleChar) {
                this.game.boardManager.board[row][i].state = state;
            }
        }
        
        for (let i = 0; i < this.game.boardManager.size; i++) {
            if (i !== row && this.game.boardManager.board[i][col].state !== castleChar) {
                this.game.boardManager.board[i][col].state = state;
            }
        }
        
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < this.game.boardManager.size && j >= 0 && j < this.game.boardManager.size &&
                    !(i === row && j === col) && this.game.boardManager.board[i][j].state !== castleChar) {
                    this.game.boardManager.board[i][j].state = state;
                }
            }
        }
    }

    clearAffectedCells(row, col) {
        for (let i = 0; i < this.game.boardManager.size; i++) {
            if (i !== col && this.game.boardManager.board[row][i].state === xChar) {
                if (!this.isCellAffectedByOtherCastles(row, i)) {
                    this.game.boardManager.board[row][i].state = null;
                }
            }
        }
        
        for (let i = 0; i < this.game.boardManager.size; i++) {
            if (i !== row && this.game.boardManager.board[i][col].state === xChar) {
                if (!this.isCellAffectedByOtherCastles(i, col)) {
                    this.game.boardManager.board[i][col].state = null;
                }
            }
        }
        
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < this.game.boardManager.size && j >= 0 && j < this.game.boardManager.size &&
                    !(i === row && j === col) && this.game.boardManager.board[i][j].state === xChar) {
                    if (!this.isCellAffectedByOtherCastles(i, j)) {
                        this.game.boardManager.board[i][j].state = null;
                    }
                }
            }
        }
    }

    isCellAffectedByOtherCastles(row, col) {
        for (let i = 0; i < this.game.boardManager.size; i++) {
            for (let j = 0; j < this.game.boardManager.size; j++) {
                if (this.game.boardManager.board[i][j].state === castleChar && !(i === row && j === col)) {
                    if (i === row || j === col || Math.abs(i - row) <= 1 && Math.abs(j - col) <= 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    validateBoard() {
        this.game.boardManager.board.forEach(row => row.forEach(cell => cell.invalid = false));

        for (let i = 0; i < this.game.boardManager.size; i++) {
            const rowCastles = [];
            const colCastles = [];
            for (let j = 0; j < this.game.boardManager.size; j++) {
                if (this.game.boardManager.board[i][j].state === castleChar) rowCastles.push({row: i, col: j});
                if (this.game.boardManager.board[j][i].state === castleChar) colCastles.push({row: j, col: i});
            }
            if (rowCastles.length > 1) rowCastles.forEach(pos => this.game.boardManager.board[pos.row][pos.col].invalid = true);
            if (colCastles.length > 1) colCastles.forEach(pos => this.game.boardManager.board[pos.row][pos.col].invalid = true);
        }

        for (let i = 0; i < this.game.boardManager.size; i++) {
            for (let j = 0; j < this.game.boardManager.size; j++) {
                if (this.game.boardManager.board[i][j].state === castleChar) {
                    for (let x = i - 1; x <= i + 1; x++) {
                        for (let y = j - 1; y <= j + 1; y++) {
                            if (x >= 0 && x < this.game.boardManager.size && y >= 0 && y < this.game.boardManager.size && 
                                !(x === i && y === j) && this.game.boardManager.board[x][y].state === castleChar) {
                                this.game.boardManager.board[i][j].invalid = true;
                                this.game.boardManager.board[x][y].invalid = true;
                            }
                        }
                    }
                }
            }
        }
    }

    checkWin() {
        let validCastles = 0;
        this.game.boardManager.board.forEach(row => row.forEach(cell => {
            if (cell.state === castleChar && !cell.invalid) validCastles++;
        }));
        
        if (validCastles === this.game.boardManager.size) {
            const winMessage = document.createElement('div');
            winMessage.textContent = '¡Felicidades! Has ganado';
            winMessage.style.fontSize = '24px';
            winMessage.style.fontWeight = 'bold';
            winMessage.style.color = 'green';
            winMessage.style.textAlign = 'center';
            winMessage.style.margin = '20px 0';
            
            const gameBoard = this.game.shadowRoot.getElementById('game-board');
            gameBoard.style.pointerEvents = 'none';
            gameBoard.style.opacity = '0.7';
            
            const toggleButton = this.game.shadowRoot.getElementById('toggle-solution');
            
            this.game.shadowRoot.appendChild(winMessage);
        }
    }
} 