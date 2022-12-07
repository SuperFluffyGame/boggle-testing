const _LETTERS = "abcdefghijklmnopqrstuvwxyz";
function randomLetter(): string {
    const rand = Math.floor(Math.random() * _LETTERS.length);
    return _LETTERS[rand];
}
function arraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1 === arr2) {
        return true;
    }
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        const el1 = arr1[i];
        const el2 = arr2[i];
        if (el1 !== el2) {
            return false;
        }
    }
    return true;
}
function arrayIncludesArray(arr: any[][], includes: any[]): boolean {
    if (arr == null) {
        return false;
    }
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (arraysEqual(element, includes)) {
            return true;
        }
    }
    return false;
}

const EXAMPLE_BOARD = [
    ["t", "i", "t", "t"],
    ["u", "o", "z", "g"],
    ["c", "r", "m", "c"],
    ["i", "k", "x", "w"],
] as const;

type Index = [number, number];

export class Board {
    private board: string[][];

    constructor(private elem: HTMLDivElement) {
        this.board = [];
        for (let i = 0; i < 4; i++) {
            this.board.push([]);
            for (let j = 0; j < 4; j++) {
                this.board[i].push(randomLetter());
            }
        }
        // this.board = structuredClone(EXAMPLE_BOARD);

        for (let char of this.board.flat()) {
            let div = document.createElement("div");
            div.textContent = char;
            elem.appendChild(div);
        }
    }

    getCharPositions(char: string): Index[] {
        let indices: Index[] = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[j][i] == char) {
                    indices.push([i, j]);
                }
            }
        }
        return indices;
    }

    highlight(indices: Index[]) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const child = this.elem.children[j * 4 + i];
                child.classList.remove("highlight");
                if (arrayIncludesArray(indices, [i, j]))
                    child.classList.add("highlight");
            }
        }
    }

    getCharPositionsNextTo(
        char: string,
        nextTo: Index,
        exclude: Index[]
    ): Index[] {
        let indices: Index[] = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let neighborPos: Index = [nextTo[0] + i, nextTo[1] + j];
                if (
                    neighborPos[0] < 0 ||
                    neighborPos[0] > 3 ||
                    neighborPos[1] < 0 ||
                    neighborPos[1] > 3
                ) {
                    continue;
                }

                if (arrayIncludesArray(exclude, neighborPos)) {
                    continue;
                }

                let neighborChar = this.board[neighborPos[1]][neighborPos[0]];
                if (neighborChar == char) {
                    indices.push(neighborPos);
                }
            }
        }
        return indices;
    }

    getWordPositions(word: string): Index[][] {
        let words = this.getCharPositions(word[0]).map(v => [v]);

        for (let i = 1; i < word.length; i++) {
            const newList: typeof words = [];

            const letterToLookFor = word[i];

            // iterate over each word and see if the next letter is next to the end
            for (let j = 0; j < words.length; j++) {
                const word = words[j];
                const lastIndexInWord = word[word.length - 1];

                let nextLetters = this.getCharPositionsNextTo(
                    letterToLookFor,
                    lastIndexInWord,
                    word
                );
                for (let k = 0; k < nextLetters.length; k++) {
                    const nextLetter = nextLetters[k];
                    newList.push([...word, nextLetter]);
                }
            }

            words = newList;
        }

        return words;
    }
}
