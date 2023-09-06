//www..
const WakeUpViewer = ({wakeUpTimes}) => {
    if (wakeUpTimes.length === 0) {
        return (
            <div>Write your bedtime!</div>
        )
    } else {
        return(
            <div>
                <p>Your wakeup times are {wakeUpTimes.join(", ")}</p>
            </div>
        )
    }
}

export default WakeUpViewer