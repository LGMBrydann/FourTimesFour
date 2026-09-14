import {
    dateSeed,
    markCompleted
} from "../app.js";


export function startThirty(container) {

    const seed = dateSeed();

    let score = 0;

    let questionIndex = 0;

    let timeLeft = 30;

    let timer;


    const challenges = generateChallenges(seed);


    container.innerHTML = `

        <div class="game-header">
            <p class="eyebrow">GAME 04</p>

            <h1 class="game-title">
                30 SECONDS
            </h1>

            <p class="game-description">
                Answer as many as you can.
            </p>
        </div>

        <div class="game-panel">

            <div
                class="timer"
                id="thirtyTimer"
            >
                30
            </div>

            <div id="thirtyChallenge"></div>

        </div>
    `;


    const timerElement =
        document.getElementById(
            "thirtyTimer"
        );

    const challengeElement =
        document.getElementById(
            "thirtyChallenge"
        );


    showChallenge();


    timer =
        setInterval(
            () => {

                timeLeft--;

                timerElement.textContent =
                    timeLeft;


                if (timeLeft <= 0) {

                    clearInterval(timer);

                    finish();

                }

            },
            1000
        );


    function showChallenge() {

        if (
            questionIndex >=
            challenges.length
        ) {

            questionIndex = 0;

        }


        const challenge =
            challenges[questionIndex];


        challengeElement.innerHTML = `

            <div class="challenge">

                <div class="challenge-question">
                    ${challenge.question}
                </div>

                <div class="challenge-options">

                    ${challenge.options.map(
                        option => `

                        <button
                            class="challenge-option"
                            data-answer="${option}"
                        >
                            ${option}
                        </button>

                    `
                    ).join("")}

                </div>

            </div>
        `;


        challengeElement
            .querySelectorAll(
                ".challenge-option"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            button.dataset.answer ===
                            String(challenge.answer)
                        ) {

                            score++;

                        }

                        questionIndex++;

                        showChallenge();

                    }
                );

            });

    }


    function finish() {

        markCompleted(
            "thirty",
            score
        );


        container.innerHTML = `

            <div class="game-header">
                <p class="eyebrow">
                    GAME 04 COMPLETE
                </p>

                <h1 class="game-title">
                    30 SECONDS
                </h1>
            </div>

            <div class="game-panel">

                <div class="result">

                    <h2>
                        ${score} correct.
                    </h2>

                    <p>
                        Not bad for 30 seconds.
                    </p>

                    <button
                        class="primary-button share-button"
                        id="thirtyShare"
                    >
                        Share result
                    </button>

                </div>

            </div>
        `;


        document
            .getElementById("thirtyShare")
            .addEventListener(
                "click",
                async () => {

                    const text =
                        `Four Times Four — 30 SECONDS: ${score} correct ⚡`;

                    if (navigator.share) {

                        await navigator.share({
                            title: "Four Times Four",
                            text
                        });

                    } else {

                        await navigator.clipboard
                            .writeText(text);

                        alert("Result copied!");

                    }

                }
            );

    }


    function generateChallenges() {

        const list = [];

        for (let i = 0; i < 50; i++) {

            const a =
                Math.floor(
                    Math.random() * 20
                ) + 1;

            const b =
                Math.floor(
                    Math.random() * 20
                ) + 1;

            const answer =
                a + b;


            const options = [
                answer,
                answer + 1,
                answer - 1,
                answer + 3
            ].sort(
                () =>
                    Math.random() - 0.5
            );


            list.push({

                question: `${a} + ${b} = ?`,

                answer,

                options

            });

        }

        return list;

    }

}
