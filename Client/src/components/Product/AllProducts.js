import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { checkLogin } from '../utils';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function AllProducts() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
    checkLogin(navigate, token); // בדיקה שהמשתמש מחובר והתוקן תקין

    const [inputs, setInputs] = useState({}); //עבור התיבות טקסט
    const [data, setData] = useState(null); //מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); //עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); //עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    const handleSubmit = async (event) => {
        event.preventDefault(); //לא לבצע רענון לעמוד
        try {
            const token = localStorage.getItem('jwt-token');
            const fetchResponse = await fetch("http://localhost:5000/product/findProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    category: inputs.category
                })
            });

            setData(null);
            setStatus(`${fetchResponse.status}`);
            if (!fetchResponse.ok) {
                let responseText = await fetchResponse.text();
                setMessage(responseText);
                throw new Error(`[Error] Status: ${fetchResponse.status} Message: ${responseText}`);
            }

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

    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <div>
                    <br></br>
                    <p>[STATUS] {status}</p>
                    <p>[MESSAGE] {message}</p>
                    <p>[JSON] {JSON.stringify(data)}</p>
                    {data ? data.map((item, index) => (
                        <form>
                            <table style={{ width: '100%' }}>
                                <tr>
                                    <td style={{ width: "100px" }}>Index: {index}</td>
                                    <td style={{ width: "100px" }}>ID: {item._id}</td>
                                    <td style={{ width: "100px" }}>UserID: {item.userID}</td>
                                    <td style={{ width: "100px" }}>Name: {item.name}</td>
                                    <td style={{ width: "100px" }}>Date: {item.date}</td>
                                    <td style={{ width: "100px" }}>Location: {item.location}</td>
                                    <td style={{ width: "100px" }}>Type: {item.type}</td>
                                    <td style={{ width: "100px" }}>notes: {item.notes}</td>
                                </tr>
                            </table>
                        </form>
                    )) : <p>Loading...</p>
                    }
                    <form class="form" onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={inputs.category || ""}
                            onChange={handleChange}
                        />
                        <input type="submit" value="Search" />
                        <div>
                            <p>[STATUS] {status}</p>
                            <p>[MESSAGE] {message}</p>
                            <p>[JSON] {JSON.stringify(data)}</p>
                        </div>
                    </form>
                </div>
            </MainContent>
        </div >
    );

}

export default AllProducts;