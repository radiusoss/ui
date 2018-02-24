export let stripString = (str: string, maxChars: number) => {
    if (str.length <= maxChars) return str
    if (str.length > maxChars) return str.substring(0,maxChars - 3) + '...'
}
