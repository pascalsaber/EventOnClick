import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { checkLogin, fetch_URL_GET, fetch_URL_POST } from '../utils';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function Profile() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
    checkLogin(navigate, token); // בדיקה שהמשתמש מחובר והתוקן תקין

    const [data, setData] = useState(null);
    const [inputs, setInputs] = useState({});
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault(); //לא לבצע רענון לעמוד
        try {
            if (inputs.password != inputs.retypePassword) //בדיקה שהסיסמא זהה בשתי השדות
                return setMessage("Password do not match.");

            // מידע להעברה
            let tempData = {
                firstName: inputs.firstName,
                lastName: inputs.lastName,
                email: inputs.email,
                password: inputs.password
            };
            // פניה לשרת
            const fetchData = await fetch_URL_POST("http://localhost:5000/user/updateUserByID", token, tempData);
            // הצוות נתונים במשתנים
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);
        } catch (error) {
            console.error(`[Error] ${error}`);
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
                const fetchData = await fetch_URL_GET(`http://localhost:5000/user/profile`, token);
                setStatus(fetchData.status);
                setMessage(fetchData.message);
                setData(fetchData.data);

                setInputs(values => ({ ...values, ['username']: fetchData.data.userData.username }))
                setInputs(values => ({ ...values, ["firstName"]: fetchData.data.userData.firstName }))
                setInputs(values => ({ ...values, ["lastName"]: fetchData.data.userData.lastName }))
                setInputs(values => ({ ...values, ["email"]: fetchData.data.userData.email }))
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
                        required
                        type="text"
                        name="username"
                        value={inputs.username || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Password</label>
                    <input
                        required
                        type="password"
                        name="password"
                        value={inputs.password || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Retype Password</label>
                    <input
                        required
                        type="password"
                        name="retypePassword"
                        value={inputs.retypePassword || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>First Name</label>
                    <input
                        required
                        type="text"
                        name="firstName"
                        value={inputs.firstName || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Last Name</label>
                    <input
                        required
                        type="text"
                        name="lastName"
                        value={inputs.lastName || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Email</label>
                    <input
                        required
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
