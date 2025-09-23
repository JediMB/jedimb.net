const dateTimes = Array.from(document.getElementsByTagName('date-time'));

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

dateTimes.forEach(dateTime => {
    const serverTime = new Date(dateTime.getAttribute('server-time'));

    if (!serverTime)
        return;
    
    const hourDifference = (endOfDay - serverTime) / (1000 * 60 * 60);

    if (hourDifference < 24) {
        dateTime.textContent = 'today, ' + serverTime.toLocaleTimeString();
        return;
    }
    
    if (hourDifference < 48) {
        dateTime.textContent = 'yesterday, ' + serverTime.toLocaleTimeString();
        return;
    }

    dateTime.textContent = serverTime.toLocaleString();
});