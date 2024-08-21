/**
 * Return string of digits. First number in line > 0
 * @param length
 */
export function getSetOfDigits(length: number): string {
    let phoneNumber;
    phoneNumber = (1 + Math.floor(Math.random() * 9)).toString();
    for (let i = 0; i < length - 1; i++) {
        phoneNumber += Math.floor(Math.random() * 10);
    }
    return phoneNumber;
}


// Set up to a real inbox on our servers
export function generateEmail(): string {
    return `gamedom+${makeid(10)}@gamedom.com`;
}

export function makeid(length: number): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

