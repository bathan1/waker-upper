const { v4: uuidv4 } = require("uuid");

const BedtimeForm = (props) => {
    const handleSaveBedtimes = async (event) => {
        event.preventDefault(); // To prevent refreshing the page

        // Create newBedtimes array and push the current bedtime into it as an Object
        const newBedtimes = [...props.userBedtimes];
        const bedtimeId = uuidv4();
        newBedtimes.push({ 
            _id: bedtimeId,
            bedtime: props.bedtime + " " + props.timeDesignation 
        });
        // Set userBedtimes state to new array
        props.setUserBedtimes(newBedtimes);

        // Get the signInData as a JSON
        const signInData = {
            username: props.currentUser.username,
            password: props.currentUser.plainTextPassword
        };
        
        try {
            // Send a POST to the /signin route
            // Essentially running a signin request internally
            const response = await fetch("/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signInData)
            });
            
            // If we don't get 201 returned, then something went wrong
            if (response.status !== 201) {
                console.log(response.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }

        // If we made it this far, then the internal sign in request was valid
        try {
            const response = await fetch(`/api/users/${props.currentUser._id}/bedtimes`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: props.currentUser.userId,
                    bedtimes: newBedtimes
                }),
            });
            
            // If the response status returned 200, then we know the bedtime was saved to DB.
            if (response.status === 200) {
                console.log("Bedtime saved successfully");
            } else {
                console.log("Failed to update bedtime");
            }
        } catch (error) {
            console.error("Error:", error);
        }
        
    };

    // Conditionally have the save bedtime button show only if user is signed in
    let saveButton = null;
    if (props.isSignedIn) {
        saveButton = <button type="submit" onClick={handleSaveBedtimes}>Save bedtime</button>
    } else {
        saveButton = null;
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