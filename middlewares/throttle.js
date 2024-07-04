const throttle = (req, res, next) => {
    // pause for random from 0 to 1000 ms
    const pause = Math.floor(Math.random() * 5000);
    console.log(pause);
    setTimeout(next, pause);
}

module.exports = throttle