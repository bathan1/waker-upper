const Form = (props) => {
    const handleSaveBedtime = () => {
        props.userBedtimes.push(props.bedtime + " " + props.timeDesignation);
        props.setUserBedtimes(props.userBedtimes);
    };

    let saveButton = null;
    if (props.isSignedIn) {
        saveButton = <button type="submit" onClick={handleSaveBedtime}>Save bedtime</button>
    }

    return (
        <form onSubmit={props.calculateWakeTime}>
            <label>
                <input 
                    type="text"
                    value={props.bedtime}
                    onChange={props.handleTimeChange}
                />
                <select value={props.timeDesignation} onChange={(event) => props.setTimeDesignation(event.target.value)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
                <button type="submit">Calculate bed time!</button>
                {saveButton}
            </label>
        </form>
    )
}

export default Form