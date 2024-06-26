import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Ordernow() {
    ////////////////////////////// משתנים //////////////////////////////
    let [cartDisplay, setCartDisplay] = useState({})   // משתנה למען יצירת מבנה להצגת רשימת הקניות בצורה עיצובית 
    let [cartList, setCartList] = useState({})
    let [moreData, setMoreData] = useState({})

    //////////////////////////////ניתובים ומעברי עמוד//////////////////////////////
    const location = useLocation(); //  מכיל את  המידע שהתקבל מעמוד ששיגר תמידע  על ידי הפונקציה נביגת
    if (location.state == null) {   // במידה ורשימת המוצרים ורשימת סל הקניות אינה קיימת מעביר לעמוד הראשי
        window.location = '/products'; //מעבר לעמוד הראשי כדי לקבל את המידע ההתחלתי של רשימת המוצרים
    }

    ////////////////////////////// קבלת מידע מעמוד אחר //////////////////////////////
    if (location.state.cartList != null) {
        cartList = JSON.parse(location.state.cartList)
    }
    if (location.state.moreData != null) {
        moreData = JSON.parse(location.state.moreData)
    }

    ////////////////////////////// עיצוב המידע לתצוגה //////////////////////////////
    cartDisplay = cartList.map(item => (
        <table>
            <tr>
                <td style={{ width: "60px" }} >ID: {item.id}</td>
                <td style={{ width: "100px" }}><img src={item.image} width={40} height={40} /></td>
                <td style={{ width: "250px" }}>Product: {item.product}</td>
                <td style={{ width: "250px" }}>Notes: {item.notes}</td>
                <td style={{ width: "100px" }} >Price: {item.price}</td>
            </tr>
        </table>
    ))

    ////////////////////////////// תצוגת המידע במסך הלקוח //////////////////////////////
    return (
        <div>
            <h1>Order</h1>
            <div>ID: {moreData[0].id}</div>
            <div>Address: {moreData[0].address}</div>
            <div>TotalPrice: {moreData[0].totalPrice}</div>
            <h2>Cart</h2>
            <div>{cartDisplay}</div>
        </div>
    )
}