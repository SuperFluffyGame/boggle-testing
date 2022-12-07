const API = "https://api.yourdictionary.com/wordfinder/v1/unscrambler/";

import { Board } from "./board";
import "./style.css";

const ELEMENT = document.querySelector(".board") as HTMLDivElement;

const INPUT = document.querySelector("input") as HTMLInputElement;

const board = new Board(ELEMENT);

INPUT.addEventListener("input", () => {
    let words = board.getWordPositions(INPUT.value);
    board.highlight(words[0]);
});

INPUT.addEventListener("change", async () => {
    if (board.getWordPositions(INPUT.value).length === 0) {
        alert("Bad Word");
        return;
    }

    let wordIsValid = await checkWord(INPUT.value);
    if (wordIsValid) alert("YAY");
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
