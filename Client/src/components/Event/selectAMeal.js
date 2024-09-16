import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ודא שהייבוא נכון
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;
function MyForm() {
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   

    const [inputs, setInputs] = useState({}); // עבור התיבות טקסט
    const [data, setData] = useState(null); // מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); // עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); // עבור הודעה שיצרנו שמתקבלת בפניה לשרת
    const [formData, setFormData] = useState({
        option1: {
            firstMeal: '',
            secondMeal: '',
            amount: '',
            price: ''
        },
        option2: {
            firstMeal: '',
            secondMeal: '',
            amount: '',
            price: ''
        }
    });

    useEffect(() => {
        function checkLogin() {
            const token = localStorage.getItem('jwt-token');
            if (!token) navigate("/login");
        }
        checkLogin();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [option, field] = name.split('.');
        setFormData(prevState => ({
            ...prevState,
            [option]: {
                ...prevState[option],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt-token');
        const data = JSON.stringify(formData);

        try {
            const fetchResponse = await fetch('http://localhost:5000/event/updateMeals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            setData(null);
            setStatus(`${fetchResponse.status}`);
            if (!fetchResponse.ok) {
                let responseText = await fetchResponse.text();
                setMessage(`Error: ${responseText}`);
                throw new Error(`[Error] Status: ${fetchResponse.status} Message: ${responseText}`);
            }

            const dataJSON = await fetchResponse.json();
            setMessage("Data sent successfully!");
            setData([dataJSON]);
        } catch (error) {
            setMessage("There was an error sending the data!");
            console.error(`[HandleSubmit Error] ${error}`);
        }
    };

    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
            <form onSubmit={handleSubmit}>
                <h2>Option 1</h2>
                <label>
                    First Meal:
                    <input type="text" name="option1.firstMeal" value={formData.option1.firstMeal} onChange={handleChange} />
                </label>
                <label>
                    Second Meal:
                    <input type="text" name="option1.secondMeal" value={formData.option1.secondMeal} onChange={handleChange} />
                </label>
                <label>
                    Amount:
                    <input type="number" name="option1.amount" value={formData.option1.amount} onChange={handleChange} />
                </label>
                <label>
                    Price:
                    <input type="number" name="option1.price" value={formData.option1.price} onChange={handleChange} />
                </label>

                <h2>Option 2</h2>
                <label>
                    First Meal:
                    <input type="text" name="option2.firstMeal" value={formData.option2.firstMeal} onChange={handleChange} />
                </label>
                <label>
                    Second Meal:
                    <input type="text" name="option2.secondMeal" value={formData.option2.secondMeal} onChange={handleChange} />
                </label>
                <label>
                    Amount:
                    <input type="number" name="option2.amount" value={formData.option2.amount} onChange={handleChange} />
                </label>
                <label>
                    Price:
                    <input type="number" name="option2.price" value={formData.option2.price} onChange={handleChange} />
                </label>

                <button type="submit">Submit</button>
                <div>
                    <p>[STATUS] {status}</p>
                    <p>[MESSAGE] {message}</p>
                    <p>[JSON] {JSON.stringify(data)}</p>
                    <p>{JSON.stringify()}</p>
                </div>
            </form> 
            </MainContent>
    </div>
    );
}

export default MyForm;
