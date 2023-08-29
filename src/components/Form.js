const Form = (props) => {
    return(
        <form onSubmit={props.calculateWakeTime}>
            <label>
                <input 
                    type="text"
                    value={props.bedtime}
                    onChange={props.handleTimeChange}
                />
                <button type="submit">Calculate bed time!</button>
            </label>
        </form>
    )
}

export default Form