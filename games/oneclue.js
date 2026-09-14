import {
    dateSeed,
    markCompleted
} from "../app.js";


const puzzles = [

    {
        clue: "I have keys, but I cannot open a single door. What am I?",
        answer: "keyboard"
    },

    {
        clue: "I get wetter the more I dry. What am I?",
        answer: "towel"
    },

    {
        clue: "I have hands but cannot clap. What am I?",
        answer: "clock"
    },

    {
        clue: "I have a face and two hands, but no arms or legs. What am I?",
        answer: "clock"
    },

    {
        clue: "I have many teeth but cannot bite. What am I?",
        answer: "comb"
    },

    {
        clue: "I have a neck but no head. What am I?",
        answer: "bottle"
    },

    {
        clue: "I can travel around the world while staying in one corner. What am I?",
        answer: "stamp"
    }

];


export function startOneClue(container) {

    const index =
        dateSeed() % puzzles.length;

    const puzzle =
        puzzles[index];


    container.innerHTML = `

        <div class="game-header">
            <p class="eyebrow">GAME 02</p>

            <h1 class="game-title">
                ONE CLUE
            </h1>

            <p class="game-description">
                One clue. One answer.
            </p>
        </div>

        <div class="game-panel">

            <div class="clue-question">
                ${puzzle.clue}
            </div>

            <input
                class="answer-input"
                id="clueAnswer"
                placeholder="Your answer..."
                autocomplete="off"
                spellcheck="false"
            >

            <br><br>

            <button
                class="primary-button"
                id="clueSubmit"
            >
                Submit
            </button>

            <div id="clueResult"></div>

        </div>
    `;


    const input =
        document.getElementById("clueAnswer");

    const submit =
        document.getElementById("clueSubmit");

    const result =
        document.getElementById("clueResult");


    function check() {

        const answer =
            input.value
                .trim()
                .toLowerCase();


        if (!answer) {
            return;
        }


        const correct =
            answer === puzzle.answer;


        if (correct) {

            markCompleted(
                "oneclue",
                100
            );


            result.innerHTML = `

                <div class="result">

                    <h2>Correct. 🧠</h2>

                    <p>
                        You got today's clue.
                    </p>

                    <button
                        class="secondary-button share-button"
                        id="clueShare"
                    >
                        Share result
                    </button>

                </div>
            `;


            document
                .getElementById("clueShare")
                .addEventListener(
                    "click",
                    async () => {

                        const text =
                            "Four Times Four — ONE CLUE: ✓ 🧠";

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

        } else {

            result.innerHTML = `

                <div class="result">

                    <h2>Not quite.</h2>

                    <p>
                        Try again.
                    </p>

                </div>
            `;

        }

    }


    submit.addEventListener(
        "click",
        check
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                check();
            }

        }
    );
}
