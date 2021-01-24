function checkDay(date, slot) {
    // isoWeekday returns a number between
    // 1 (Monday) and 7 (Sunday).
    isoDay = date.isoWeekday();

    return true;
}

module.exports = {checkDay}