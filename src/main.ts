const API = "https://api.yourdictionary.com/wordfinder/v1/unscrambler/";

import { Board } from "./board";
import "./style.css";

const ELEMENT = document.querySelector(".board") as HTMLDivElement;

const INPUT = document.querySelector("input") as HTMLInputElement;
const WORDS = document.querySelector(".words") as HTMLDivElement;

const board = new Board(ELEMENT);

const prevWords: string[] = [];

INPUT.addEventListener("input", () => {
    let words = board.getWordPositions(INPUT.value);
    board.highlight(words[0]);
});

INPUT.addEventListener("change", async () => {
    const word = INPUT.value;
    if (board.getWordPositions(word).length === 0 || prevWords.includes(word)) {
        return;
    }

    let wordIsValid = await checkWord(word);
    if (wordIsValid) {
        prevWords.push(word);
        const wordEl = document.createElement("div");
        wordEl.textContent = word;
        WORDS.appendChild(wordEl);
    }

    INPUT.value = "";
});

async function checkWord(word: string): Promise<boolean> {
    if (word.length < 3) {
        return false;
    }
    const endpoint = API + "?check_exact_match=true&tiles=" + INPUT.value;
    const res = await (await fetch(endpoint)).json();
    console.log(res);
    if (res.data._exact_match) {
        console.log("MATCH");
        return true;
    }
    return false;
}
