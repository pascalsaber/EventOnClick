import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function SelectAMeal() {
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

    //מכיל את כל המידע של המוצרים בקטגוריה של מנה ראשית
    const [firstMealProducts, setFirstMealProducts] = useState([]);
    const [secondMealProducts, setSecondMealProducts] = useState([])

    const [firstMealList, setFirstMealList] = useState([{ value: "", label: "Error Loading from Database..." }])
    const [secondMealList, setSecondMealList] = useState([{ value: "", label: "Error Loading from Database..." }])

    //window.location.search - (?eventID=abc&name=bbb לדוגמה )מכילה את החלק שאני שולחת בניתוב במקרה שלי אני יקבל 
    // URLSearchParams - הצבת הערך שמתקבל בבנאי זה על מנת לשלוף ולעדכין מאת המידע בצורה מסודרת 
    const queryParameters = new URLSearchParams(window.location.search)
    // שליפת הערך של איבנת אי די ושמירתו במשתנה 
    const query_eventid = queryParameters.get("eventid")

    // מטרת הפונקציה זה להחזיר את המוצרים עם כל הפרטים על כל מוצר לפי קטגוריה 
    async function fetch_findProductByCategory(category) {
        //לשרת עם הקטגוריה שנבחרה POST שולח בקשת
        const fetchResponse = await fetch(`http://localhost:5000/product/findProductByCategory`, {
            method: "POST", // שיטה הפניה
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`// שיטת ההצפנה 
            },
            body: JSON.stringify(
                { //JSON המרת המידע שנשלח כגוף הבקשה ל
                    //הקטגוריה שנבחרה
                    category: category
                })
        });
        // בודק אם הבקשה הצליחה
        if (fetchResponse.ok) {
            //JSON- ממיר את התגובה ל
            let responseJSON = await fetchResponse.json();
            console.log("responseJSON: " + JSON.stringify(responseJSON));
            // יוצר רשימה חדשה עם אפשרות בחירה ריקה
            let list = [{ value: "", label: "Select..." }];
            // ממפה את המוצרים לרשימה עם שם ומחיר
            responseJSON.map((item) => {
                list.push({
                    value: item.name,
                    // מה שיוצג למשתמש ברשימת הבחירה
                    label: [`${item.name} (${item.price}₪)`]
                });
            });
            if (category == "First Meal") {
                // מכיל את הרשימה המלאה של המוצרים שהם מנות ראשונות
                setFirstMealProducts(responseJSON);
                console.log("setFirstMealProducts: " + JSON.stringify(firstMealProducts));
                // מכיל את הרשימה שתוצג בתפריט הבחירה של מוצרים של מנות ראשונות
                setFirstMealList(list);
            }
            else if (category == "Second Meal") {
                setSecondMealProducts(responseJSON);
                setSecondMealList(list);
            }
        }
    }
    // הפונקציה הזו נועדה להביא נתונים על אירוע מסוים מהשרת ולעדכן את המצב בהתאם
    async function fetchData(eventID) {
        try {
            //eventID לשרת עם get שולח בקשת 
            const fetchResponse = await fetch(`http://localhost:5000/event/findOneEvent?eventID=${eventID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });
            // מעדכן את הסטטוס של הבקשה
            setStatus(`${fetchResponse.status}`);
            // בודק אם הבקשה לא הצליחה
            if (!fetchResponse.ok) {
                let responseText = await fetchResponse.text();
                setMessage(responseText);
                throw new Error(`[Error] Status: ${fetchResponse.status} Message: ${responseText}`);
            }
            //JSON -ממיר את התגובה ל
            const dataJSON = await fetchResponse.json();
            setMessage("Success"); //TEMP
            setData(dataJSON);
            // עובר על כל הארוחות באירוע ומעדכן את המצב בהתאם
            dataJSON.meals.forEach((meal, index) => {
                if (meal != null) {
                    // מסנן את רשימת הארוחות לפי הארוחה הראשונה והשנייה
                    // על מנת להעזר בה בלדעת את מחיר המוצר
                    const filter_firstMeal = firstMealProducts.filter(item => item.name === meal.firstMeal);
                    const filter_secondMeal = secondMealProducts.filter(item => item.name === meal.secondMeal);
                    console.log("filtered..." + JSON.stringify(filter_firstMeal))
                    console.log("filtered..." + filter_firstMeal[0].price)
                    // מעדכן את המצב של הארוחות והמחיר
                    const option = `option${index + 1}`;
                    handleChange({ target: { name: `${option}.firstMeal`, value: meal.firstMeal } });
                    handleChange({ target: { name: `${option}.secondMeal`, value: meal.secondMeal } });
                    handleChange({ target: { name: `${option}.amount`, value: meal.amount } });
                    let totalPrice = (filter_firstMeal[0].price + filter_secondMeal[0].price) * meal.amount;
                    handleChange({ target: { name: `${option}.price`, value: totalPrice } });
                }
            });
        } catch (error) {
            // מדפיס שגיאה אם יש
            console.error(error);
        }
    }
    // useEffect- קומפוננטה המופעלת לאחר פעולה שמתבצעת 
    // במקרה הזה זה קורה פעם אחת כשמעלים את העמוד 
    useEffect(() => {
        //  מוודא שהתוקן של המשתמש עדיין בתוקף אחרת מחזירה את המשתמש לעמוד ההתחברות מחדש
        function checkLogin() {
            if (!token)
                navigate("/login");
        }
        checkLogin();
        fetch_findProductByCategory("First Meal");
    }, []); // מערך ריק פירושו שהאפקט הזה פועל פעם אחת בהעלעת העמוד

    useEffect(() => {
        console.log('firstMealProducts updated:', firstMealProducts);
        fetch_findProductByCategory("Second Meal");
    }, [firstMealProducts]); // This effect runs whenever firstMealProducts changes

    useEffect(() => {
        console.log('secondMealProducts updated:', secondMealProducts);
        console.log("Event ID: " + query_eventid);
        fetchData(query_eventid)
    }, [secondMealProducts]); // This effect runs whenever secondMealProducts changes

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
            fetchData(query_eventid)
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
                        Total Price:
                        <input disabled type="number" name="option1.price" value={formData.option1.price} />
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
                        Total Price:
                        <input disabled type="number" name="option2.price" value={formData.option2.price} />
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
                        Total Price:
                        <input disabled type="number" name="option3.price" value={formData.option3.price} />
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
                        Total Price:
                        <input disabled type="number" name="option4.price" value={formData.option4.price} />
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

export default SelectAMeal;
