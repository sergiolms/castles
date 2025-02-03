export default class BoardManager {
    constructor(game) {
        this.game = game;
        this.size = game.getSizeBasedOnDifficulty();
        this.board = [];
        this.colors = this.generateColors();
    }

    generateColors() {
        const colors = [];
        for (let i = 0; i < this.size; i++) {
            const hue = Math.floor((i * 360) / this.size);
            colors.push(`hsl(${hue}, 70%, 80%)`);
        }
        return colors;
    }

    createBoard() {
        for (let i = 0; i < this.size; i++) {
            this.board[i] = new Array(this.size).fill(null);
        }
        this.solution = this.generateCastleSolution();
        this.createZonesFromSolution();
    }

    generateCastleSolution() {
        const solution = new Array(this.size);
        const usedRows = new Set();
        const usedCols = new Set();
        const allPositions = [];

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                allPositions.push({ row: i, col: j });
            }
        }

        allPositions.sort(() => Math.random() - 0.5);

        for (let colorIndex = 0; colorIndex < this.size; colorIndex++) {
            let positionFound = false;
            let attempts = 0;

            while (!positionFound && attempts < 100) {
                const pos = allPositions[Math.floor(Math.random() * allPositions.length)];

                if (!usedRows.has(pos.row) && !usedCols.has(pos.col)) {
                    let valid = true;
                    for (let i = pos.row - 1; i <= pos.row + 1; i++) {
                        for (let j = pos.col - 1; j <= pos.col + 1; j++) {
                            if (i >= 0 && i < this.size && j >= 0 && j < this.size) {
                                const existingCastle = solution.find(c => c?.row === i && c?.col === j);
                                if (existingCastle) {
                                    valid = false;
                                    break;
                                }
                            }
                        }
                        if (!valid) break;
                    }

                    if (valid) {
                        solution[colorIndex] = { row: pos.row, col: pos.col, color: this.colors[colorIndex] };
                        usedRows.add(pos.row);
                        usedCols.add(pos.col);
                        positionFound = true;
                    }
                }
                attempts++;
            }

            if (!positionFound) {
                return this.generateCastleSolution();
            }
        }
        return solution;
    }

    createZonesFromSolution() {
        this.solution.forEach((castle) => {
            const { row, col, color } = castle;
            this.board[row][col] = { color };
            this.paintZone(row, col, color);
        });

        this.fillRemainingCells();
    }

    paintZone(startRow, startCol, color) {
        const directions = [
            { row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }
        ];

        const stack = [{ row: startRow, col: startCol }];

        while (stack.length > 0) {
            const { row, col } = stack.pop();

            if (this.board[row][col]?.color) continue;

            this.board[row][col] = { color, state: null };

            for (const dir of directions) {
                const newRow = row + dir.row;
                const newCol = col + dir.col;

                if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size && !this.board[newRow][newCol]) {
                    stack.push({ row: newRow, col: newCol });
                }
            }
        }
    }

    fillRemainingCells() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.board[i][j]) {
                    const adjacentColors = this.getAdjacentColors(i, j);
                    const randomColor = adjacentColors.length > 0
                        ? adjacentColors[Math.floor(Math.random() * adjacentColors.length)]
                        : this.colors[Math.floor(Math.random() * this.size)];
                    this.board[i][j] = { color: randomColor, state: null };
                }
            }
        }
    }

    getAdjacentColors(row, col) {
        const colors = new Set();
        const directions = [
            { row: row - 1, col }, { row: row + 1, col }, { row, col: col - 1 }, { row, col: col + 1 }
        ];

        for (const dir of directions) {
            if (dir.row >= 0 && dir.row < this.size && dir.col >= 0 && dir.col < this.size && this.board[dir.row][dir.col]) {
                colors.add(this.board[dir.row][dir.col].color);
            }
        }

        return [...colors];
    }
} 