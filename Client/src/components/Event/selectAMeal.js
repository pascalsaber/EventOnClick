import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ודא שהייבוא נכון
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;
function MyForm() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   

    const [inputs, setInputs] = useState({}); // עבור התיבות טקסט
    const [data, setData] = useState(null); // מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); // עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); // עבור הודעה שיצרנו שמתקבלת בפניה לשרת


    const initialFormData = {};
    for (let i = 1; i <= 4; i++) {
        initialFormData[`option${i}`] = {
            firstMeal: '',
            secondMeal: '',
            amount: '',
            price: ''
        };
    }
    const [formData, setFormData] = useState(initialFormData); // עבור התיבות בחירה


    const [firstMealList, setFirstMealList] = useState([{ value: "", label: "Error Loading from Database..." }])
    const [secondMealList, setSecondMealList] = useState([{ value: "", label: "Error Loading from Database..." }])

    //NEW
    //window.location.search - (?eventID=abc&name=bbb לדוגמה )מכילה את החלק שאני שולחת בניתוב במקרה שלי אני יקבל 
    // URLSearchParams - הצבת הערך שמתקבל בבנאי זה על מנת לשלוף ולעדכין מאת המידע בצורה מסודרת 
    const queryParameters = new URLSearchParams(window.location.search)
    // שליפת הערך של איבנת אי די ושמירתו במשתנה 
    const query_eventid = queryParameters.get("eventid")

    useEffect(() => {
        function checkLogin() {
            if (!token)
                navigate("/login");
        }
        async function fetch_enum(category) {
            const fetchResponse = await fetch(`http://localhost:5000/product/returnArryByCategory?category=${category}`);
            if (fetchResponse.ok) {
                let responseJSON = await fetchResponse.json();
                console.log("responseJSON: " + responseJSON);
                let list = [{ value: "", label: "Select..." }];
                responseJSON.map((item) => {
                    list.push({
                        value: item,
                        label: item
                    });
                });
                if (category == "First Meal")
                    setFirstMealList(list);
                else if (category == "Second Meal")
                    setSecondMealList(list);
            }
        }
        async function fetchData(eventID) {
            try {
                const fetchResponse = await fetch(`http://localhost:5000/event/findOneEvent?eventID=${eventID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                });
                setStatus(`${fetchResponse.status}`);
                if (!fetchResponse.ok) {
                    let responseText = await fetchResponse.text();
                    setMessage(responseText);
                    throw new Error(`[Error] Status: ${fetchResponse.status} Message: ${responseText}`);
                }
                const dataJSON = await fetchResponse.json();
                setMessage("Success"); //TEMP
                setData(dataJSON);

                dataJSON.meals.forEach((meal, index) => {
                    if (meal != null) {
                        const option = `option${index + 1}`;
                        handleChange({ target: { name: `${option}.firstMeal`, value: meal.firstMeal } });
                        handleChange({ target: { name: `${option}.secondMeal`, value: meal.secondMeal } });
                        handleChange({ target: { name: `${option}.amount`, value: meal.amount } });
                        handleChange({ target: { name: `${option}.price`, value: meal.price } });
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
        checkLogin();
        fetch_enum("First Meal");
        fetch_enum("Second Meal");
        console.log("Event ID: " + query_eventid);
        fetchData(query_eventid)
    }, []);

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

    const handleSubmit = async (event) => {
        event.preventDefault(); //לא לבצע רענון לעמוד
        try {
            const fetchResponse = await fetch("http://localhost:5000/event/updateMeals", { // לאיזה כתובת לפנות 
                method: "POST", // שיטה הפניה
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`// שיטת ההצפנה 
                },
                body: JSON.stringify(
                    { // המרת המידעה שנשלח כבדי מהטופס לאקספרס
                        // האינפוט הוא המידעה שנרשם בטופס
                        eventID: query_eventid,
                        meals: JSON.stringify({ formData })
                    })
            });

            setData(null);
            setStatus(`${fetchResponse.status}`);
            //ok אם הסטטוס שונה מ200 שהוא
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

    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <br></br>
                <form class="form" onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <h5>Option 1</h5>
                    <label>
                        First Meal:
                        <select name="option1.firstMeal" value={formData.option1.firstMeal} onChange={handleChange}>
                            {firstMealList.map((item) => (
                                <option value={item.value}>{item.label}</option>
                            ))}
                        </select>
                        {/*<input type="text" name="option1.firstMeal" value={formData.option1.firstMeal} onChange={handleChange} />*/}
                    </label>
                    <label>
                        Second Meal:
                        <select name="option1.secondMeal" value={formData.option1.secondMeal} onChange={handleChange}>
                            {secondMealList.map((item) => (
                                <option value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="option1.amount" value={formData.option1.amount} onChange={handleChange} />
                    </label>
                    <label>
                        Price:
                        <input type="number" name="option1.price" value={formData.option1.price} onChange={handleChange} />
                    </label>

                    <h5>Option 2</h5>
                    <label>
                        First Meal:
                        <select name="option2.firstMeal" value={formData.option2.firstMeal} onChange={handleChange}>
                            {firstMealList.map((item) => (
                                <option value={item.value}>{item.label}</option>
                            ))}
                        </select></label>
                    <label>
                        Second Meal:
                        <select name="option2.secondMeal" value={formData.option2.secondMeal} onChange={handleChange}>
                            {secondMealList.map((item) => (
                                <option value={item.value}>{item.label}</option>
                            ))}
                        </select></label>
                    <label>
                        Amount:
                        <input type="number" name="option2.amount" value={formData.option2.amount} onChange={handleChange} />
                    </label>
                    <label>
                        Price:
                        <input type="number" name="option2.price" value={formData.option2.price} onChange={handleChange} />
                    </label>
                    <h5>Option 3</h5>
                    <label>
                        First Meal:
                        <select name="option3.firstMeal" value={formData.option3.firstMeal} onChange={handleChange}>
                            {firstMealList.map((item) => (
                                <option value={item.value}>{item.label}</option>
                            ))}
                        </select></label>
                    <label>
                        Second Meal:
                        <select name="option3.secondMeal" value={formData.option3.secondMeal} onChange={handleChange}>
                            {secondMealList.map((item) => (
                                <option value={item.value}>{item.label}</option>
                            ))}
                        </select></label>
                    <label>
                        Amount:
                        <input type="number" name="option3.amount" value={formData.option3.amount} onChange={handleChange} />
                    </label>
                    <label>
                        Price:
                        <input type="number" name="option3.price" value={formData.option3.price} onChange={handleChange} />
                    </label>
                    <h5>Option 4</h5>
                    <label>
                        First Meal:
                        <select name="option4.firstMeal" value={formData.option4.firstMeal} onChange={handleChange}>
                            {firstMealList.map((item) => (
                                <option value={item.value}>{item.label}</option>
                            ))}
                        </select></label>
                    <label>
                        Second Meal:
                        <select name="option4.secondMeal" value={formData.option4.secondMeal} onChange={handleChange}>
                            {secondMealList.map((item) => (
                                <option value={item.value}>{item.label}</option>
                            ))}
                        </select></label>
                    <label>
                        Amount:
                        <input type="number" name="option4.amount" value={formData.option4.amount} onChange={handleChange} />
                    </label>
                    <label>
                        Price:
                        <input type="number" name="option4.price" value={formData.option4.price} onChange={handleChange} />
                    </label>
                    <input type="submit" value="Update" />
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
