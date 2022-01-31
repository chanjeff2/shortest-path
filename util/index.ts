export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export let interval: number = 200