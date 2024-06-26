import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Pay() {
    ////////////////////////////// משתנים //////////////////////////////
    let [totalPrice, setTotalPrice] = useState(0)
    let [productsList, setProductsList] = useState({})
    let [cartList, setCartList] = useState({})
    const [inputs, setInputs] = useState({});

    //////////////////////////////ניתובים ומעברי עמוד//////////////////////////////
    const location = useLocation(); //  מכיל את  המידע שהתקבל מעמוד ששיגר תמידע  על ידי הפונקציה נביגת
    if (location.state == null) {   // במידה ורשימת המוצרים ורשימת סל הקניות אינה קיימת מעביר לעמוד הראשי
        window.location = '/products'; //מעבר לעמוד הראשי כדי לקבל את המידע ההתחלתי של רשימת המוצרים
    }
    const navigate = useNavigate();
    function sendDataUrl(url) {
        navigate(url, {
            state: {
                cartList: JSON.stringify(cartList),
                productsList: JSON.stringify(productsList)
            }
        });
    }
    function sendDataUrlOrder(url, moreData) {
        navigate(url, {
            state: {
                cartList: JSON.stringify(cartList),
                productsList: JSON.stringify(productsList),
                moreData: JSON.stringify(moreData)
            }
        });
    }

    ////////////////////////////// קבלת מידע מעמוד אחר //////////////////////////////
    if (location.state.cartList != null) {
        cartList = JSON.parse(location.state.cartList)
        cartList.map((item) => {
            totalPrice += item.price
        })
    }
    if (location.state.productsList != null) {
        productsList = JSON.parse(location.state.productsList)
    }

    ////////////////////////////// פונקציות עבור טפסים//////////////////////////////
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }
    const handleSubmit = (event) => {
        const arr = [{
            id: event.currentTarget.elements.id.value,
            address: event.currentTarget.elements.address.value,
            totalPrice: totalPrice
        }]
        sendDataUrlOrder("/ordernow", arr)
    }
    ////////////////////////////// תצוגת המידע במסך הלקוח //////////////////////////////
    return (
        <div>
            <header className="navbar">
                <nav>
                    <ul>
                        <li>
                            <button style={{ height: "35px", width: "200px" }} onClick={() => sendDataUrl('/products')}>Products</button>
                        </li>
                        <li>
                            <button style={{ height: "35px", width: "200px" }} onClick={() => sendDataUrl('/cart')}>Cart</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <h1>Total Price: {totalPrice}</h1>
            <form onSubmit={handleSubmit}>
                <div>Enter your Id:
                    <input
                        type="number"
                        name="id"
                        value={inputs.id || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>Enter your Address:
                    <input
                        type="text"
                        name="address"
                        value={inputs.address || ""}
                        onChange={handleChange}
                    />
                </div>
                <br />
                <input style={{ height: "25px", width: "150px" }} type="submit" value="Order Now" />
            </form>
        </div>
    )
}