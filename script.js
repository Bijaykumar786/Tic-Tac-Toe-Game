document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const turnDisplay = document.getElementById('turn');
    const pvpBtn = document.getElementById('pvp-btn');
    const pvcBtn = document.getElementById('pvc-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = false;
    let vsComputer = false;
    
    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Initialize the board
    function initializeBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
    
    // Handle cell click
    function handleCellClick(e) {
        if (!gameActive) return;
        
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell is already filled or game is not active, ignore the click
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Update game state and UI
        updateGame(clickedCell, clickedCellIndex);
        
        // If playing against computer and game is still active, make computer move
        if (vsComputer && gameActive && currentPlayer === 'O') {
            setTimeout(makeComputerMove, 500);
        }
    }
    
    // Update game state
    function updateGame(cell, index) {
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        if (checkWin()) {
            status.textContent = `Player ${currentPlayer} wins!`;
            turnDisplay.textContent = '';
            gameActive = false;
            return;
        }
        
        if (checkDraw()) {
            status.textContent = 'Game ended in a draw!';
            turnDisplay.textContent = '';
            gameActive = false;
            return;
        }
        
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnDisplay();
    }
    
    // Check for win
    function checkWin() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] !== '' && 
                gameState[a] === gameState[b] && 
                gameState[a] === gameState[c]) {
                
                // Highlight winning cells
                document.querySelector(`[data-index="${a}"]`).classList.add('winning-cell');
                document.querySelector(`[data-index="${b}"]`).classList.add('winning-cell');
                document.querySelector(`[data-index="${c}"]`).classList.add('winning-cell');
                
                return true;
            }
        }
        return false;
    }
    
    // Check for draw
    function checkDraw() {
        return !gameState.includes('');
    }
    
    // Update turn display
    function updateTurnDisplay() {
        if (vsComputer && currentPlayer === 'O') {
            turnDisplay.textContent = 'Computer is thinking...';
        } else {
            turnDisplay.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
    
    // Computer move logic
    function makeComputerMove() {
        if (!gameActive) return;
        
        // Simple AI: first try to win, then block, then random move
        let bestMove = findWinningMove('O'); // Try to win
        if (bestMove === -1) bestMove = findWinningMove('X'); // Block player
        if (bestMove === -1) bestMove = findRandomMove(); // Random move
        
        const cell = document.querySelector(`[data-index="${bestMove}"]`);
        updateGame(cell, bestMove);
    }
    
    // Find winning move for a player
    function findWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            // Check if two cells are filled with player and third is empty
            if (gameState[a] === player && gameState[b] === player && gameState[c] === '') return c;
            if (gameState[a] === player && gameState[c] === player && gameState[b] === '') return b;
            if (gameState[b] === player && gameState[c] === player && gameState[a] === '') return a;
        }
        return -1;
    }
    
    // Find random available move
    function findRandomMove() {
        const availableMoves = gameState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        return availableMoves.length > 0 ? 
            availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
    }
    
    // Start a new game
    function startGame(againstComputer) {
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        vsComputer = againstComputer;
        
        initializeBoard();
        status.textContent = 'Game in progress';
        updateTurnDisplay();
    }
    
    // Event listeners
    pvpBtn.addEventListener('click', () => startGame(false));
    pvcBtn.addEventListener('click', () => startGame(true));
    restartBtn.addEventListener('click', () => {
        if (gameActive || gameState.some(cell => cell !== '')) {
            startGame(vsComputer);
        }
    });
    
    // Initialize UI
    initializeBoard();
});