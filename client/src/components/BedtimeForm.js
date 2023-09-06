const { v4: uuidv4 } = require("uuid");

const BedtimeForm = (props) => {
    const handleSaveBedtimes = async (event) => {
        event.preventDefault();
        const newBedtimes = [...props.userBedtimes];
        const bedtimeId = uuidv4();
        newBedtimes.push({ 
            _id: bedtimeId,
            bedtime: props.bedtime + " " + props.timeDesignation 
        });
        props.setUserBedtimes(newBedtimes);
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

        const updatedBedtimes = newBedtimes;
        console.log(updatedBedtimes);

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