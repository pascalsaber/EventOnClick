import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function Profile() {
    const token = localStorage.getItem('jwt-token');
    const [data, setData] = useState(null);
    const [inputs, setInputs] = useState({});
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault(); //לא לבצע רענון לעמוד
        try {
            setData(null);
            if (inputs.password != inputs.retypePassword) //בדיקה שהסיסמא זהה בשתי השדות
                return setMessage("Password do not match.");
            const fetchResponse = await fetch("http://localhost:5000/user/updateUserByID", { // לאיזה כתובת לפנות 
                method: "POST", // שיטה הפניה 
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`// שיטת ההצפנה 
                },
                body: JSON.stringify({ // המרת המידעה שנשלח כבדי מהטופס לאקספרס
                    // האינפוט הוא המידעה שנרשם בטופס
                    username: inputs.username,
                    firstName: inputs.firstName,
                    lastName: inputs.lastName,
                    email: inputs.email,
                })
            });

            setStatus(`${fetchResponse.status}`);
            //ok אם הסטטוס שונה מ200 שהוא
            if (!fetchResponse.ok) {
                let responseText = await fetchResponse.text();
                setMessage(responseText);
                throw new Error(`[Error] Status: ${fetchResponse.status} Message: ${responseText}`);
            }
            // מכיל את המידע שחוזר מהאקספרס שהוא בעצם האירוע החדש שיצרנו
            const dataJSON = await fetchResponse.json();
            setMessage("Success");
            setData([dataJSON]);
        } catch (error) {
            console.error(`[HandleSubmit Error] ${error}`);
        }
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchResponse = await fetch("http://localhost:5000/user/profile", { // לאיזה כתובת לפנות 
                    method: "GET", // שיטה הפניה 
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`// שיטת ההצפנה 
                    }
                });

                setStatus(`${fetchResponse.status}`);
                if (!fetchResponse.ok) {
                    let responseText = await fetchResponse.text();
                    setMessage(responseText);
                    throw new Error(`[Error] Status: ${fetchResponse.status} Response: ${responseText}`);
                }

                const dataJSON = await fetchResponse.json();
                setMessage("Success");
                setData([dataJSON]);

                setInputs(values => ({ ...values, ['username']: dataJSON.userData.username }))
                setInputs(values => ({ ...values, ["firstName"]: dataJSON.userData.firstName }))
                setInputs(values => ({ ...values, ["lastName"]: dataJSON.userData.lastName }))
                setInputs(values => ({ ...values, ["email"]: dataJSON.userData.email }))
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();

    }, []); // Empty array means this effect runs once on mount

    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <br></br>
                <form class="form" onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <label>Username</label>
                    <input
                        disabled
                        type="text"
                        name="username"
                        value={inputs.username || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={inputs.password || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Retype Password</label>
                    <input
                        type="password"
                        name="retypePassword"
                        value={inputs.retypePassword || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={inputs.firstName || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={inputs.lastName || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={inputs.email || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <input type="submit" value="Update" />
                    <div>
                        <p>[MESSAGE] {message}</p>
                        {process.env.REACT_APP_TESTING === 'TRUE' ?
                            <>
                                <h5>Testing Mode</h5>
                                <p>[STATUS] {status}</p>
                                <p>[JSON] {JSON.stringify(data) /*TEMP*/}</p>
                            </> : null
                        }
                    </div>
                </form>
            </MainContent>
        </div>
    );
}

export default Profile;
