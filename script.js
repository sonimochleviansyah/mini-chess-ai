const board = [
    ["♜", "♚", "", ""],
    ["♟", "♟", "", ""],
    ["", "", "♙", "♙"],
    ["", "", "♔", "♖"]
];

const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const nodesText = document.getElementById("nodes");
const prunedText = document.getElementById("pruned");
const historyElement = document.getElementById("history");

let selectedPiece = null;
let currentTurn = "white";
let nodeCount = 0;
let prunedNodes = 0;
const MAX_DEPTH = 3;

// Fungsi utilitas untuk konversi koordinat ke Notasi Catur (A1 - D4)
function getNotation(row, col) {
    const cols = ["A", "B", "C", "D"];
    const rows = ["4", "3", "2", "1"];
    return cols[col] + rows[row];
}

// Fungsi otomatis mencatat riwayat ke panel UI kanan
function addHistory(message) {
    if (historyElement) {
        const p = document.createElement("p");
        p.textContent = message;
        historyElement.appendChild(p);
        historyElement.scrollTop = historyElement.scrollHeight; // Auto scroll ke bawah
    }
}

// =========================
// RENDER BOARD UI
// =========================
function renderBoard() {
    boardElement.innerHTML = "";

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if ((row + col) % 2 === 0) {
                cell.classList.add("white");
            } else {
                cell.classList.add("black");
            }

            // Seleksi warna highlight royalblue yang rapi
            if (
                selectedPiece &&
                selectedPiece.row === row &&
                selectedPiece.col === col
            ) {
                cell.style.backgroundColor = "royalblue";
            }

            cell.textContent = board[row][col];
            cell.addEventListener("click", () => handleCellClick(row, col));
            boardElement.appendChild(cell);
        }
    }
}

// =========================
// PLAYER MOUSE CLICK LOGIC
// =========================
function handleCellClick(row, col) {
    if (currentTurn !== "white") return;

    const piece = board[row][col];

    // Memilih Bidak Putih Player
    if (piece === "♙" || piece === "♖" || piece === "♔") {
        selectedPiece = { row, col };
        renderBoard();
        return;
    }

    // Eksekusi Langkah Pergerakan Bidak
    if (selectedPiece) {
        const fromRow = selectedPiece.row;
        const fromCol = selectedPiece.col;
        const movingPiece = board[fromRow][fromCol];

        if (isValidMove(movingPiece, fromRow, fromCol, row, col)) {
            // Validasi: Tidak boleh memakan teman sendiri
            if (piece === "♙" || piece === "♖" || piece === "♔") {
                return;
            }

            // Tambahkan data ke Log riwayat langkah
            addHistory(`Player: ${movingPiece} (${getNotation(fromRow, fromCol)} ➔ ${getNotation(row, col)})`);

            // Update posisi papan catur
            board[row][col] = movingPiece;
            board[fromRow][fromCol] = "";
            selectedPiece = null;
            renderBoard();

            if (checkGameOver()) return;

            // Alihkan giliran ke Bot AI
            currentTurn = "black";
            statusText.textContent = "AI Thinking...";

            setTimeout(() => {
                aiMove();
            }, 500);
        } else {
            // Jika klik area tidak valid, lepas seleksi agar game tidak terasa stuck
            selectedPiece = null;
            renderBoard();
        }
    }
}

// =========================
// VALIDASI PERGERAKAN PUTIH
// =========================
function isValidMove(piece, fromRow, fromCol, toRow, toCol) {
    if (fromRow === toRow && fromCol === toCol) return false;

    // Logic Pion Putih
    if (piece === "♙") {
        if (toRow === fromRow - 1 && toCol === fromCol && board[toRow][toCol] === "") {
            return true;
        }
        if (toRow === fromRow - 1 && Math.abs(toCol - fromCol) === 1) {
            const target = board[toRow][toCol];
            if (target === "♟" || target === "♜" || target === "♚") return true;
        }
    }

    // Logic Benteng Putih (Aturan Mini Game: Bisa Melompat Bebas Hambatan)
    if (piece === "♖") {
        if (fromRow === toRow || fromCol === toCol) return true;
    }

    // Logic Raja Putih
    if (piece === "♔") {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        if (rowDiff <= 1 && colDiff <= 1) return true;
    }

    return false;
}

// =========================
// VALIDASI PERGERAKAN HITAM
// =========================
function isValidBlackMove(piece, fromRow, fromCol, toRow, toCol) {
    if (fromRow === toRow && fromCol === toCol) return false;

    const target = board[toRow][toCol];
    if (target === "♟" || target === "♜" || target === "♚") return false;

    // Logic Pion Hitam
    if (piece === "♟") {
        if (toRow === fromRow + 1 && toCol === fromCol && target === "") {
            return true;
        }
        if (toRow === fromRow + 1 && Math.abs(toCol - fromCol) === 1) {
            if (target === "♙" || target === "♖" || target === "♔") return true;
        }
    }

    // Logic Benteng Hitam (Aturan Mini Game: Bisa Melompat Bebas Hambatan)
    if (piece === "♜") {
        if (fromRow === toRow || fromCol === toCol) return true;
    }

    // Logic Raja Hitam
    if (piece === "♚") {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        if (rowDiff <= 1 && colDiff <= 1) return true;
    }

    return false;
}

// ===================================
// GENERASI DAFTAR LANGKAH (ALL MOVES)
// ===================================
function getAllBlackMoves() {
    let moves = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const piece = board[row][col];
            if (piece === "♟" || piece === "♜" || piece === "♚") {
                for (let toRow = 0; toRow < 4; toRow++) {
                    for (let toCol = 0; toCol < 4; toCol++) {
                        if (isValidBlackMove(piece, row, col, toRow, toCol)) {
                            moves.push({ fromRow: row, fromCol: col, toRow, toCol });
                        }
                    }
                }
            }
        }
    }
    return moves;
}

function getAllWhiteMoves() {
    let moves = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const piece = board[row][col];
            if (piece === "♙" || piece === "♖" || piece === "♔") {
                for (let toRow = 0; toRow < 4; toRow++) {
                    for (let toCol = 0; toCol < 4; toCol++) {
                        if (isValidMove(piece, row, col, toRow, toCol)) {
                            const target = board[toRow][toCol];
                            if (target === "♙" || target === "♖" || target === "♔") continue;
                            moves.push({ fromRow: row, fromCol: col, toRow, toCol });
                        }
                    }
                }
            }
        }
    }
    return moves;
}

// ===================================
// FUNGSI EVALUASI STATIS NILAI MATRIKS
// ===================================
function evaluateBoard() {
    let score = 0;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const piece = board[row][col];
            if (piece === "♚") score += 100;
            if (piece === "♜") score += 50;
            if (piece === "♟") score += 10;

            if (piece === "♔") score -= 100;
            if (piece === "♖") score -= 50;
            if (piece === "♙") score -= 10;
        }
    }
    return score;
}

// ===================================
// CORE MINIMAX WITH ALPHA-BETA PRUNING
// ===================================
function minimaxAlphaBeta(depth, alpha, beta, isMaximizing) {
    nodeCount++;

    if (depth === 0) {
        return evaluateBoard();
    }

    if (isMaximizing) {
        let bestScore = -9999;
        const moves = getAllBlackMoves();

        for (let move of moves) {
            const originalBoard = JSON.parse(JSON.stringify(board));
            const piece = board[move.fromRow][move.fromCol];

            board[move.toRow][move.toCol] = piece;
            board[move.fromRow][move.fromCol] = "";

            const score = minimaxAlphaBeta(depth - 1, alpha, beta, false);

            // Backtracking / Restore Board State
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    board[r][c] = originalBoard[r][c];
                }
            }

            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, score);

            if (beta <= alpha) {
                prunedNodes++;
                break; // Alpha-Beta Pruning Triggered
            }
        }
        return bestScore;
    } else {
        let bestScore = 9999;
        const moves = getAllWhiteMoves();

        for (let move of moves) {
            const originalBoard = JSON.parse(JSON.stringify(board));
            const piece = board[move.fromRow][move.fromCol];

            board[move.toRow][move.toCol] = piece;
            board[move.fromRow][move.fromCol] = "";

            const score = minimaxAlphaBeta(depth - 1, alpha, beta, true);

            // Backtracking / Restore Board State
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    board[r][c] = originalBoard[r][c];
                }
            }

            bestScore = Math.min(bestScore, score);
            beta = Math.min(beta, score);

            if (beta <= alpha) {
                prunedNodes++;
                break; // Alpha-Beta Pruning Triggered
            }
        }
        return bestScore;
    }
}

// ===================================
// EKSEKUSI BOT AI JALAN
// ===================================
function aiMove() {
    nodeCount = 0;
    prunedNodes = 0;
    const moves = getAllBlackMoves();

    let bestMove = null;
    let bestScore = -9999;

    for (let move of moves) {
        const originalBoard = JSON.parse(JSON.stringify(board));
        const piece = board[move.fromRow][move.fromCol];

        board[move.toRow][move.toCol] = piece;
        board[move.fromRow][move.fromCol] = "";

        const score = minimaxAlphaBeta(MAX_DEPTH, -9999, 9999, false);

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                board[r][c] = originalBoard[r][c];
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    if (bestMove) {
        const movingPiece = board[bestMove.fromRow][bestMove.fromCol];

        // Cetak riwayat pergerakan AI sebelum memodifikasi array utama
        addHistory(`AI: ${movingPiece} (${getNotation(bestMove.fromRow, bestMove.fromCol)} ➔ ${getNotation(bestMove.toRow, bestMove.toCol)})`);

        board[bestMove.toRow][bestMove.toCol] = movingPiece;
        board[bestMove.fromRow][bestMove.fromCol] = "";
    }

    renderBoard();

    // Tampilkan data kalkulasi murni tanpa double-string text bugs
    nodesText.textContent = nodeCount;
    prunedText.textContent = prunedNodes;

    if (checkGameOver()) return;

    currentTurn = "white";
    statusText.textContent = "Player Turn";
}

// =========================
// VALIDASI KONDISI SELESAI
// =========================
function checkGameOver() {
    let whiteKing = false;
    let blackKing = false;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === "♔") whiteKing = true;
            if (board[row][col] === "♚") blackKing = true;
        }
    }

    if (!whiteKing) {
        statusText.textContent = "AI Wins!";
        addHistory("Game Over: AI Wins!");
        return true;
    }

    if (!blackKing) {
        statusText.textContent = "Player Wins!";
        addHistory("Game Over: Player Wins!");
        return true;
    }

    return false;
}

// =========================
// FITUR RESTART GAME
// =========================
const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", restartGame);

function restartGame() {
    board[0] = ["♜", "♚", "", ""];
    board[1] = ["♟", "♟", "", ""];
    board[2] = ["", "", "♙", "♙"];
    board[3] = ["", "", "♔", "♖"];

    selectedPiece = null;
    currentTurn = "white";
    nodeCount = 0;
    prunedNodes = 0;

    nodesText.textContent = "0";
    prunedText.textContent = "0";
    statusText.textContent = "Player Turn";

    if (historyElement) {
        historyElement.innerHTML = "<p>Game Started</p>";
    }

    renderBoard();
}

// Jalankan inisialisasi awal saat web dimuat pertama kali
renderBoard();