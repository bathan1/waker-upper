const BedtimeForm = (props) => {
    const handleSaveBedtimes = async () => {
        props.userBedtimes.push(props.bedtime + " " + props.timeDesignation);
        props.setUserBedtimes(props.userBedtimes);
        const signInData = {
            username: props.currentUser.username,
            password: props.currentUser.plainTextPassword
        };
        
        try {
            const response = await fetch("/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signInData)
            });
            

            if (response.status !== 201) {
                console.log("Invalid username or password");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        const updatedBedtimes = props.userBedtimes;

        try {
            const response = await fetch(`/api/users/${props.currentUser._id}/bedtimes`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: props.currentUser.userId, // Assuming you have access to the user's ID
                    bedtimes: updatedBedtimes
                }),
            });
    
            if (response.status === 200) {
                console.log("Bedtime updated successfully");
                // Update your userBedtimes state here if needed
            } else {
                console.log("Failed to update bedtime");
            }
        } catch (error) {
            console.error("Error:", error);
        }
        
    };

    let saveButton = null;
    if (props.isSignedIn) {
        saveButton = <button type="submit" onClick={handleSaveBedtimes}>Save bedtime</button>
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

export default BedtimeForm