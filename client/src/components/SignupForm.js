import React, { useState } from 'react';

const SignupForm = (props) => {
    const [buttonPressed, setButtonPressed] = useState("signUp");

    const handleChange = (event) => {
        const {name, value}  = event.target;
        props.setFormData({ ...props.formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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
            } else {
                    await fetch("/signin", {
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
                            props.setCurrentUser(user);
                            props.setIsSignedIn(true);
                        }
                    })
                    .catch((error) => {
                        console.error("Invalid username or password")
                    });
            }
            
        } catch (error) {
            console.log('Error:', error);
        }
    };

    let savedBedtimesView = null;
    if (props.isSignedIn) {
        savedBedtimesView = 
        <div>  
            <div>Welcome {props.formData.username}</div>
            <div>Your saved bedtimes: </div>
            <ul>
                {props.userBedtimes.map((bedtime, index) => {
                    return <li key={index}>{bedtime}</li>
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