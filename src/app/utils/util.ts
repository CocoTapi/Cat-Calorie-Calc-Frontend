export function calcMonthYear(birthday: Date) {
    const today = new Date();

    let years = today.getFullYear() - birthday.getFullYear();
    let months = today.getMonth() - birthday.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }
    return { years, months }
}