import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 160px; // Adjust this value as needed
`;

function Login() {
    const [inputs, setInputs] = useState({}); //עבור התיבות טקסט
    const [data, setData] = useState(null); //מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); //עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); //עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    const navigate = useNavigate(); // פונקציה של רייאקט דום להעברת מידע בזמן מעבר לעמוד אחר   

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); //לא לבצע רענון לעמוד
        try {
            //העברת מידע מהטופס לשרת בצורת גסון
            const fetchResponse = await fetch("http://localhost:5000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: inputs.username,
                    password: inputs.password
                })
            });

            setData(null);//TEMP
            setStatus(`${fetchResponse.status}`);
            if (!fetchResponse.ok) {
                let responseText = await fetchResponse.text();
                setMessage(responseText);
                throw new Error(`[Error] Status: ${fetchResponse.status} Message: ${responseText}`);
            }

            const dataJSON = await fetchResponse.json(); //TEMP
            setMessage("Success"); //TEMP
            setData([dataJSON.data]); //TEMP
            localStorage.setItem("jwt-token", dataJSON.token);
            navigate("/profile");
        } catch (error) {
            console.error(`[HandleSubmit Error] ${error}`);
        }
    }

    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <br></br>
                <form class="form" onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={inputs.username || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Password</label>
                    <input
                        type="text"
                        name="password"
                        value={inputs.password || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <input type="submit" value="Login" />
                    <div>
                        <p>[STATUS] {status}</p>
                        <p>[MESSAGE] {message}</p>
                        <p>[JSON] {JSON.stringify(data) /*TEMP*/}</p>
                    </div>
                </form>

                {/*data !== null && data.map((item, index) => (
                    item.name === inputs.name ? <div style={{ color: 'green' }}>Found user with this name!</div> : <div style={{ color: 'red' }}>Not the user!</div>
                ))*/}
                {/*data ? data.map((item, index) => (
                    <form>
                        <table style={{ width: '100%' }}>
                            <tr>
                                <td style={{ width: "100px" }} >Index: {index}</td>
                                <td style={{ width: "100px" }} >ID: {item._id}</td>
                                <td style={{ width: "100px" }}>Username: {item.username}</td>
                                <td style={{ width: "100px" }}>Password: {item.password}</td>
                                <td style={{ width: "100px" }}>First Name: {item.firstName}</td>
                                <td style={{ width: "100px" }}>Last Name: {item.lastName}</td>
                                <td style={{ width: "100px" }}>Email: {item.email}</td>
                            </tr>
                        </table>
                    </form>
                )) : <p>Loading...</p>
                */}
            </MainContent>
        </div >
    );
}

// Example 
/* const Select = ({ label, value, options, onChange }) => {
    return (
        <label>
            <select style={{ marginLeft: '10px' }} value={value} onChange={onChange}>
                {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                ))}
            </select>
        </label>
    );
};*/

export default Login;