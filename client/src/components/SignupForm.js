import React, { useState } from 'react';

const SignupForm = (props) => {
    // useState to keep track of which button was pressed (sign up or sign in)  
    const [buttonPressed, setButtonPressed] = useState("signUp");

    // Handle change to the form text fields
    const handleChange = (event) => {
        const {name, value}  = event.target; // Destructure the event target to get the username and password
        props.setFormData({ ...props.formData, [name]: value });
    };


    // Handle submitting either the sign up button or sign in button
    const handleSubmit = async (event) => {
        event.preventDefault(); // To prevent refreshing
        try {
            if (buttonPressed === "signUp") {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(props.formData)
                });
                if (response.status === 201) {
                    console.log("Registration success");
                } else {
                    console.log("Registration failed :(");
                }
            } else { // If the "sign in" button was pressed
                await fetch("/signin", { // Post to /signin
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(props.formData)
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === "Logged in successfully" && data.user) {
                        console.log("Signed in!");
                        const user = data.user;
                        props.setCurrentUser(user); // Set current user to signed in user
                        props.setIsSignedIn(true); // Set isSignedIn state to true
                        props.setUserBedtimes(user.bedtimes); // Set the user bedtimes
                        event.preventDefault(); // To prevent refreshing again
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            }
            
        } catch (error) {
            console.log('Error:', error);
        }
    };

    // Conditionally render user's saved bedtimes if isSignedIn is true
    let savedBedtimesView = null;
    if (props.isSignedIn) {
        savedBedtimesView = 
        <div>  
            <div>Welcome {props.formData.username}</div>
            <div>Your saved bedtimes: </div>
            <ul>
                {props.userBedtimes.map((bedtimeObject, index) => {
                    return <li key={index}>{bedtimeObject.bedtime}</li>
                })}
            </ul>
        </div>
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={props.formData.username}
                onChange={handleChange}
                placeholder="Username"
            />
            <br></br>
            <input
                type="password"
                name="password"
                value={props.formData.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <br></br>
            <button type="submit" onClick={() => setButtonPressed("signUp")}>Sign up</button>
            <button type="submit" onClick={() => setButtonPressed("signIn")}>Sign in</button>
        </form>
        {savedBedtimesView}
        </div>
        
    );
};

export default SignupForm