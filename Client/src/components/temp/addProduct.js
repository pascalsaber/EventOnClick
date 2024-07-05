import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import SplitPane from 'react-split-pane';

export default function AddProducts() {

    ////////////////////////////// משתנים //////////////////////////////
    let [cartList, setCartList] = useState({})
    let [productsList, setProductsList] = useState({})
    const [inputs, setInputs] = useState({});

    ////////////////////////////// קבלת מידע מעמוד אחר //////////////////////////////
    const location = useLocation(); //  מכיל את  המידע שהתקבל מעמוד ששיגר תמידע  על ידי הפונקציה נביגת
    if (location.state == null) {   // במידה ורשימת המוצרים ורשימת סל הקניות אינה קיימת מעביר לעמוד הראשי
        window.location = '/products'; //מעבר לעמוד הראשי כדי לקבל את המידע ההתחלתי של רשימת המוצרים
    }
    if (location.state.productsList != null) {
        productsList = JSON.parse(location.state.productsList)
    }
    if (location.state.cartList != null) {
        cartList = JSON.parse(location.state.cartList)
    }

    ////////////////////////////// העברת מידע בין עמודים //////////////////////////////
    const navigate = useNavigate(); // פונקציה של רייאקט דום להעברת מידע בזמן מעבר לעמוד אחר
    function sendDataUrl(url) { //פונקציה שמעבירה לעמוד אחר עם מידע
        navigate(url, { //URL העבמוד אליו מנתבים
            state: { //משתנה המכיל את המידע שמועבר
                cartList: JSON.stringify(cartList),
                productsList: JSON.stringify(productsList)
            }
        });
    }

    ////////////////////////////// פונקציות עבור טפסים//////////////////////////////
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault() //חובה כדי להישאר באותו עמוד ולא לבצע שליחה חדשה ולאבד נתונים קיימים
        productsList.push({
            id: event.currentTarget.elements.id.value,
            product: event.currentTarget.elements.product.value,
            image: event.currentTarget.elements.image.value,
            notes: event.currentTarget.elements.notes.value,
            price: parseFloat(event.currentTarget.elements.price.value)
        });
        alert("added")
    }

    ////////////////////////////// תצוגת המידע במסך הלקוח //////////////////////////////
    return (
        <div>
            <header className="navbar">
                <nav>
                    <ul>
                        <li><button style={{ height: "35px", width: "200px" }} onClick={() => sendDataUrl('/cart')}>Cart</button></li>
                        <li><button style={{ height: "35px", width: "200px" }} onClick={() => sendDataUrl('/products')}>Products</button></li>
                    </ul>
                </nav>
            </header>
            <SplitPane split="vertical" minSize={"90%"}>

                < div style={{ background: 'white', height: '100%' }}>
                    <h1>Add Product</h1>
                    <form onSubmit={handleSubmit}>
                        <div>Enter your Id:
                            <input
                                type="number"
                                name="id"
                                value={inputs.id || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>Enter your Product:
                            <input
                                type="text"
                                name="product"
                                value={inputs.product || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>Enter your image:
                            <input
                                type="text"
                                name="image"
                                value={inputs.image || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>Enter your notes:
                            <input
                                type="text"
                                name="notes"
                                value={inputs.notes || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>Enter your price:
                            <input
                                type="number"
                                name="price"
                                value={inputs.price || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <input style={{ height: "25px", width: "150px" }} type="submit" value="Add Product" />
                    </form>
                </div>
                <div style={{ background: 'lightgrey', height: '100%' }}>
                    <div><button style={{ height: "35px", width: "100%" }} onClick={() => sendDataUrl('/editProduct')}>Edit Product</button></div>
                    <div><button style={{ height: "35px", width: "100%" }} onClick={() => sendDataUrl('/addProduct')}>Add Product</button></div>
                </div>
            </SplitPane>
        </div>
    );
}
