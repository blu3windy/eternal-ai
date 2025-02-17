import {ABC} from "./constants.ts";

export function setupCounter(element: HTMLButtonElement) {
    let counter = 0
    const setCounter = (count: number) => {
        counter = count
        element.innerHTML = `count is ${counter}`
        console.log("load const ABC", ABC);
    }
    element.addEventListener('click', () => setCounter(counter + 1))
    setCounter(0)
}
