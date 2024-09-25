import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { checkLogin, fetch_URL_GET, fetch_URL_POST } from '../utils';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function SelectAMeal() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
    checkLogin(navigate, token); // בדיקה שהמשתמש מחובר והתוקן תקין

    const [data, setData] = useState(null); // מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); // עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); // עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    const initialFormData = {};
    for (let i = 1; i <= 4; i++) {
        initialFormData[`option${i}`] = {
            firstMeal: '',
            secondMeal: '',
            salad: '',
            amount: '',
            price: '0'
        };
    }
    const [formData, setFormData] = useState(initialFormData); // עבור התיבות בחירה

    // מכיל את כל המידע של המוצרים
    const [products, setProducts] = useState([])

    //window.location.search - (?eventID=abc&name=bbb לדוגמה )מכילה את החלק שאני שולחת בניתוב במקרה שלי אני יקבל 
    // URLSearchParams - הצבת הערך שמתקבל בבנאי זה על מנת לשלוף ולעדכין מאת המידע בצורה מסודרת 
    const queryParameters = new URLSearchParams(window.location.search)
    // שליפת הערך של איבנת אי די ושמירתו במשתנה 
    const query_eventid = queryParameters.get("eventid")


    // מטרת הפונקציה זה להחזיר את המוצרים עם כל הפרטים על כל מוצר לפי קטגוריה 
    async function fetch_findProductByCategory(category) {
        try {
            // פניה לשרת
            const fetchData = await fetch_URL_GET(`http://localhost:5000/product/findProductByCategory`, token);
            // הצוות נתונים במשתנים
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setProducts(fetchData.data)
        } catch (error) {
            console.error(`[Error] ${error}`);
        }
    }
    // הפונקציה הזו נועדה להביא נתונים על אירוע מסוים מהשרת ולעדכן את המצב בהתאם
    async function fetchData(eventID) {
        try {
            const fetchData = await fetch_URL_GET(`http://localhost:5000/event/findOneEvent?eventID=${eventID}`, token);
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);
            // עובר על כל הארוחות באירוע ומעדכן את המצב בהתאם
            fetchData.data.meals.forEach((meal, index) => {
                if (meal != null) {
                    // מציב את המידע של הארוחה בשדות המתאים 
                    const option = `option${index + 1}`;
                    handleChange({ target: { name: `${option}.firstMeal`, value: meal.firstMeal } });
                    handleChange({ target: { name: `${option}.secondMeal`, value: meal.secondMeal } });
                    handleChange({ target: { name: `${option}.salad`, value: meal.salad } });
                    handleChange({ target: { name: `${option}.amount`, value: meal.amount } });
                    handleChange({ target: { name: `${option}.price`, value: meal.price } });
                }
            });
        } catch (error) {
            console.error(error); // מדפיס שגיאה אם יש
        }
    }

    useEffect(() => {
        fetch_findProductByCategory();
    }, []);

    useEffect(() => {
        console.log("Products: " + JSON.stringify(products));
        console.log("Event ID: " + query_eventid);
        fetchData(query_eventid)
    }, [products]); //  משתנה products אפקט זה פועל בכל פעם ש 

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
        //לא לבצע רענון לעמוד
        // על מנת לא לאבד את הנתונים שהצבנו באינפותים ועל מנת לעדכין את השינויים בשרת 
        event.preventDefault();
        try {
            for (let i = 1; i <= 4; i++) { //  Object.keys(formData).forEach(key => {
                let meal = formData[`option${i}`] //  let meal = formData[key];
                if (meal != null) {
                    // מסנן את רשימת הארוחות לפי הארוחה הראשונה והשנייה
                    // על מנת להעזר בה בלדעת את מחיר המוצר
                    if (meal.firstMeal == "" || meal.secondMeal == "" || meal.salad == "")
                        return
                    const filter_firstMeal = products.filter(item => item._id === meal.firstMeal);
                    const filter_secondMeal = products.filter(item => item._id === meal.secondMeal);
                    const filter_salad = products.filter(item => item._id === meal.salad);
                    meal.price = (filter_firstMeal[0].price + filter_secondMeal[0].price + filter_salad[0].price) * meal.amount;
                }
            }

            // מידע להעברה
            let tempData = {
                eventID: query_eventid,
                data: JSON.stringify({ meals: formData }),
            };
            // פניה לשרת
            const fetchData = await fetch_URL_POST("http://localhost:5000/event/updateMealsOrDecoration", token, tempData);
            // הצוות נתונים במשתנים
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);

            //fetchData(query_eventid); //טעינה מחדש לנתונים מהשרת
        } catch (error) {
            console.error(`[Error] ${error}`);
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
                        <select name="option1.firstMeal" value={formData.option1.firstMeal} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "First Meal")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Second Meal:
                        <select name="option1.secondMeal" value={formData.option1.secondMeal} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Second Meal")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Salad:
                        <select name="option1.salad" value={formData.option1.salad} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Salad")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="option1.amount" value={formData.option1.amount} onChange={handleChange} min="1" required />
                    </label>
                    <label>
                        Total Price:
                        <input disabled type="number" name="option1.price" value={formData.option1.price} />
                    </label>
                    <h5>Option 2</h5>
                    <label>
                        First Meal:
                        <select name="option2.firstMeal" value={formData.option2.firstMeal} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "First Meal")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Second Meal:
                        <select name="option2.secondMeal" value={formData.option2.secondMeal} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Second Meal")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Salad:
                        <select name="option2.salad" value={formData.option2.salad} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Salad")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="option2.amount" value={formData.option2.amount} onChange={handleChange} min="1" required />
                    </label>
                    <label>
                        Total Price:
                        <input disabled type="number" name="option2.price" value={formData.option2.price} />
                    </label>
                    <h5>Option 3</h5>
                    <label>
                        First Meal:
                        <select name="option3.firstMeal" value={formData.option3.firstMeal} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "First Meal")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select></label>
                    <label>
                        Second Meal:
                        <select name="option3.secondMeal" value={formData.option3.secondMeal} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Second Meal")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Salad:
                        <select name="option3.salad" value={formData.option3.salad} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Salad")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="option3.amount" value={formData.option3.amount} onChange={handleChange} min="1" required />
                    </label>
                    <label>
                        Total Price:
                        <input disabled type="number" name="option3.price" value={formData.option3.price} />
                    </label>
                    <h5>Option 4</h5>
                    <label>
                        First Meal:
                        <select name="option4.firstMeal" value={formData.option4.firstMeal} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "First Meal")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select></label>
                    <label>
                        Second Meal:
                        <select name="option4.secondMeal" value={formData.option4.secondMeal} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Second Meal")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Salad:
                        <select name="option4.salad" value={formData.option4.salad} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Salad")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="option4.amount" value={formData.option4.amount} onChange={handleChange} min="1" required />
                    </label>
                    <label>
                        Total Price:
                        <input disabled type="number" name="option4.price" value={formData.option4.price} />
                    </label>
                    <Container fluid>
                        <Row className="justify-content-center">
                            <Col xs={12} md={10}>
                                {Object(data).status === "Open" ?
                                    <input type="submit" value="Update" />
                                    : (<Alert variant="danger" className="text-center">אירוע זה סגור.</Alert>)
                                }
                                {query_eventid ?
                                    <Button variant="primary" size="lg" onClick={() => navigate(`/selectADecoration?eventid=${query_eventid}`)} >Next Page</Button>
                                    : <></>
                                }
                            </Col>
                        </Row>
                    </Container>
                    <p>[MESSAGE] {message}</p>
                    {process.env.REACT_APP_TESTING === 'TRUE' ?
                        <>
                            <h5>Testing Mode</h5>
                            <p>[STATUS] {status}</p>
                            <p>[JSON] {JSON.stringify(data)}</p>
                        </> : null
                    }
                </form>
            </MainContent>
        </div>
    );
}

export default SelectAMeal;
