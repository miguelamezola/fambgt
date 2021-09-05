export const recurrenceRates = {
    NONE: "None",
    SEMI_MONTHLY: "Every 2 weeks",
    MONTHLY: "Monthly"
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

export const modifyActions = {
    addOrUpdate: "addOrUpdate",
    delete: "delete"
}

export const addMonths = (date, numMonths) => {
    const d = date.getDate();
    date.setMonth(date.getMonth() + numMonths);
    if (date.getDate() !== d) {
        date.setDate(0);
    }
    return date;
}