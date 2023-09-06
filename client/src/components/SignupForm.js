import React, { useState } from 'react';

const SignupForm = (props) => {
    const [buttonPressed, setButtonPressed] = useState("signUp");

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (event) => {
        const {name, value}  = event.target;
        setFormData({ ...formData, [name]: value });
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
                    body: JSON.stringify(formData)
                });
                if (response.status === 201) {
                    console.log("Registration success");
                } else {
                    console.log("Registration failed :(");
                }
            } else {
                const response = await fetch("/signin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData)
                });

                if (response.status === 201) {
                    console.log("Signed in!");
                    props.setIsSignedIn(true);
                } else {
                    console.log("Invalid username or password");
                }
            }
            
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
            />
            <br></br>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <br></br>
            <button type="submit" onClick={() => setButtonPressed("signUp")}>Sign up</button>
            <button type="submit" onClick={() => setButtonPressed("signIn")}>Sign in</button>
        </form>
    );
};

export default SignupForm