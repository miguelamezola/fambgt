export const recurrenceRates = {
    NONE: "None",
    SEMI_MONTHLY: "2 weeks",
    MONTHLY: "1 month"
}

export const transactionTypes = {
    EXPENSE: "Expense",
    INCOME: "Income"
}

export const getDateString = (date) => {
    let result = '';    
    if(date) {
        const yyyy = date.getFullYear();

        let MM = `${date.getMonth() + 1}`;
        if (MM.length < 2) {
            MM = '0' + MM;
        }
    
        let dd = `${date.getDate()}`;
        if (dd.length < 2) {
            dd = '0' + dd;
        }
    
        result = `${yyyy}-${MM}-${dd}`;
    }
    return result;
}