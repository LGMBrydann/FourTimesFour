import {
    dateSeed,
    dailyRandom,
    markCompleted
} from "../app.js";


export function startRemember(container) {

    const seed = dateSeed();

    const objects = [
        "🍎",
        "🚀",
        "🐸",
        "⭐",
        "🎸",
        "🍕",
        "🚲",
        "🌙",
        "🐶",
        "⚽",
        "🎮",
        "🍩"
    ];


    const shuffled = [...objects]
        .sort(
            () =>
                dailyRandom(
                    seed + Math.random()
                ) - 0.5
        )
        .slice(0, 8);


    const target =
        shuffled[
            Math.floor(
                dailyRandom(seed + 50) *
                shuffled.length
            )
        ];


    container.innerHTML = `

        <div class="game-header">
            <p class="eyebrow">GAME 03</p>

            <h1 class="game-title">
                REMEMBER
            </h1>

            <p class="game-description">
                Remember what you see.
            </p>
        </div>

        <div class="game-panel">

            <div
                class="memory-display"
                id="memoryDisplay"
            >

                <div class="memory-countdown">
                    3
                </div>

            </div>

        </div>
    `;


    const display =
        document.getElementById(
            "memoryDisplay"
        );


    let countdown = 3;


    const countdownTimer =
        setInterval(
            () => {

                countdown--;

                if (countdown > 0) {

                    display.innerHTML = `
                        <div class="memory-countdown">
                            ${countdown}
                        </div>
                    `;

                } else {

                    clearInterval(
                        countdownTimer
                    );

                    showMemory();

                }

            },
            1000
        );


    function showMemory() {

        display.innerHTML = `

            <div class="memory-grid">

                ${shuffled.map(item => `
                    <div class="memory-item">
                        ${item}
                    </div>
                `).join("")}

            </div>
        `;


        setTimeout(
            askQuestion,
            2500
        );

    }


    function askQuestion() {

        display.innerHTML = `

            <div style="width:100%;text-align:center">

                <p style="color:var(--muted)">
                    Which of these appeared?
                </p>

                <div class="challenge-options">

                    ${objects
                        .sort(
                            () =>
                                Math.random() - 0.5
                        )
                        .slice(0, 4)
                        .map(item => `

                            <button
                                class="challenge-option"
                                data-answer="${item}"
                            >
                                ${item}
                            </button>

                        `).join("")}

                </div>

            </div>
        `;


        display
            .querySelectorAll(
                ".challenge-option"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const answer =
                            button.dataset.answer;

                        finish(
                            answer === target
                        );

                    }
                );

            });

    }


    function finish(correct) {

        if (correct) {

            markCompleted(
                "remember",
                100
            );


            container.innerHTML = `

                <div class="game-header">
                    <p class="eyebrow">GAME 03 COMPLETE</p>

                    <h1 class="game-title">
                        REMEMBER
                    </h1>
                </div>

                <div class="game-panel">

                    <div class="result">

                        <h2>Good memory. 👀</h2>

                        <p>
                            You remembered it.
                        </p>

                    </div>

                </div>
            `;

        } else {

            container.innerHTML = `

                <div class="game-header">
                    <p class="eyebrow">GAME 03</p>

                    <h1 class="game-title">
                        REMEMBER
                    </h1>
                </div>

                <div class="game-panel">

                    <div class="result">

                        <h2>Almost.</h2>

                        <p>
                            The answer was
                            <strong>${target}</strong>.
                        </p>

                    </div>

                </div>
            `;

        }

    }

}
