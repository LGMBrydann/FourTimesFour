import {
    dateSeed,
    dailyRandom,
    markCompleted
} from "../app.js";


export function startShift(container) {

    const seed = dateSeed();

    const symbols = [
        "◆",
        "●",
        "▲",
        "■",
        "★",
        "✦",
        "✚",
        "⬟",
        "⬢"
    ];

    let board = [...symbols];

    let moves = 0;

    const target = [...symbols]
        .sort(
            () => dailyRandom(seed + Math.random()) - 0.5
        );


    container.innerHTML = `

        <div class="game-header">
            <p class="eyebrow">GAME 01</p>

            <h1 class="game-title">
                SHIFT
            </h1>

            <p class="game-description">
                Get the board from START to TARGET.
                Click two tiles to swap them.
            </p>
        </div>

        <div class="game-panel">

            <div class="shift-target">
                TARGET
            </div>

            <div class="shift-target-grid">
                ${target.map(symbol => `
                    <div class="shift-target-cell">
                        ${symbol}
                    </div>
                `).join("")}
            </div>

            <div
                class="shift-board"
                id="shiftBoard"
            ></div>

            <p style="text-align:center;color:var(--muted)">
                Moves: <strong id="shiftMoves">0</strong>
            </p>

            <button
                class="secondary-button"
                id="shiftReset"
            >
                Reset
            </button>

        </div>
    `;


    const boardElement =
        document.getElementById("shiftBoard");

    const movesElement =
        document.getElementById("shiftMoves");

    let selected = null;


    function render() {

        boardElement.innerHTML =
            board.map((symbol, index) => `

                <button
                    class="shift-cell ${
                        selected === index
                            ? "selected"
                            : ""
                    }"
                    data-index="${index}"
                >
                    ${symbol}
                </button>

            `).join("");


        boardElement
            .querySelectorAll(".shift-cell")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        handleClick(index);

                    }
                );

            });
    }


    function handleClick(index) {

        if (selected === null) {

            selected = index;

            render();

            return;
        }


        if (selected === index) {

            selected = null;

            render();

            return;
        }


        [
            board[selected],
            board[index]
        ] = [
            board[index],
            board[selected]
        ];


        selected = null;

        moves++;

        movesElement.textContent = moves;

        render();

        checkWin();
    }


    function checkWin() {

        const won =
            board.every(
                (symbol, index) =>
                    symbol === target[index]
            );

        if (!won) {
            return;
        }


        markCompleted(
            "shift",
            Math.max(1, 100 - moves)
        );


        container.innerHTML = `

            <div class="game-header">
                <p class="eyebrow">GAME 01 COMPLETE</p>

                <h1 class="game-title">
                    SHIFT
                </h1>
            </div>

            <div class="game-panel">

                <div class="result">

                    <h2>Nice. 🔥</h2>

                    <p>
                        You solved today's board
                        in <strong>${moves}</strong> moves.
                    </p>

                    <div class="streak-result">
                        Come back tomorrow.
                    </div>

                    <button
                        class="primary-button share-button"
                        id="shiftShare"
                    >
                        Share result
                    </button>

                </div>

            </div>
        `;


        document
            .getElementById("shiftShare")
            .addEventListener(
                "click",
                () => {

                    share(
                        `Four Times Four — SHIFT: ${moves} moves 🟦`
                    );

                }
            );
    }


    document
        .getElementById("shiftReset")
        .addEventListener(
            "click",
            () => {

                board = [...symbols];

                moves = 0;

                selected = null;

                movesElement.textContent = "0";

                render();

            }
        );


    render();
}


async function share(text) {

    if (navigator.share) {

        await navigator.share({
            title: "Four Times Four",
            text
        });

        return;
    }

    await navigator.clipboard.writeText(text);

    alert("Result copied!");
}
