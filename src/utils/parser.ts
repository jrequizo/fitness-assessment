


const vowels = ["a", "e", "i", "o", "u"];

export function parseGivenName(str: string) {
    let sum = 0;

    str.split("").forEach(letter => {
        if (vowels.includes(letter)) {
            sum++;
        }
    });

    return sum;
}


// https://www.quora.com/What-is-the-average-length-of-last-names-in-the-United-States
const surname_length_distribution = [0, 0, 0.12, 1.29, 8.41, 17.65, 20.82, 15.55, 9.69, 4.07, 1.48, 0.41, 0.08, 0.03, 20.41];

export function parseSurname(surname: string) {
    const length = surname.length;

    if (length < 2) {
        return 100;
    }

    const sum = surname_length_distribution.slice(length).reduce((sum, value) => {
        return sum + value;
    }, 0);

    return sum;
}


export type BmiCategory = "Underweight" | "Normal" | "Overweight" | "Obese" | "Extremely Obese"

/**
 * 
 * @param bmi 
 * @returns The BMI category of the given BMI.
 */
export function getBmiCategory(bmi: number): BmiCategory {
    switch (true) {
        case (bmi < 18.5):
            return "Underweight";
        case (bmi < 25):
            return "Normal";
        case (bmi < 30):
            return "Overweight";
        case (bmi < 35):
            return "Obese"
        default:
            return "Extremely Obese";
    }
}

/**
 * 
 * @param height In centimetres
 * @param weight In kilograms
 */
export function calculateBmi(height: number, weight: number): number {
    const bmi = weight / Math.pow((height / 100), 2);

    return bmi;
}




function daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
}


interface Age {
    years: number,
    months: number,
    days: number
}
/**
 * Calculates the number of years, months, and days since the `dob`.
 * @param   {Date}  dob     Date of birth
 * @returns {Age}           An Age object with the delta of each property from today.
 */
export function calculateAge(dob: Date): Age {
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < dob.getDate())) {
        years -= 1;
        months += 12;
    }

    let days = today.getDate() - dob.getDate();

    if (days < 0) {
        months -= 1;
        days += daysInMonth(today.getMonth(), today.getFullYear());
    }
    
    return {
        years: years,
        months: months,
        days: days
    };
}

export { }