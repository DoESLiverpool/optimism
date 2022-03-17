function validatedId(id) {
    number = Number(id);
    if (Number.isNaN(number) || !Number.isInteger(number) || number < 0) {
        return null;
    }
    return number;
}

module.exports = validatedId;
