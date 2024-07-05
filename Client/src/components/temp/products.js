import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";

export default function Products() {

    ////////////////////////////// משתנים //////////////////////////////
    // מערך שמכיל רשימת אובייקטים של המוצרים שנוספו לסל
    let [cartList, setCartList] = useState([])
    // מערך אובייקטים של מוצרי החנות  
    let [productsList, setProducts] = useState([
        {
            id: 1,
            product: "Pencils",
            image: "https://cdn-icons-png.flaticon.com/256/563/563028.png",
            notes: "2 Pencils",
            price: 2.70
        },
        {
            id: 2,
            product: "Papers",
            image: "https://cdn-icons-png.flaticon.com/512/7638/7638005.png",
            notes: "1 Professional Paper Clip",
            price: 10.60
        },
        {
            id: 3,
            product: "Pencil Box",
            image: "https://cdn-icons-png.flaticon.com/512/2200/2200432.png",
            notes: "1 Pencil Box",
            price: 12.90
        },
        {
            id: 4,
            product: "Pencil Case",
            image: "https://cdn-icons-png.flaticon.com/128/207/207166.png",
            notes: "1 Pencil Case",
            price: 15.90
        },
        {
            id: 5,
            product: "Backpack",
            image: "https://cdn-icons-png.flaticon.com/128/3429/3429142.png",
            notes: "1 Backpack",
            price: 50.90
        },
        {
            id: 6,
            product: "Crayons",
            image: "https://cdn-icons-png.flaticon.com/128/3311/3311533.png",
            notes: "4 Crayons",
            price: 11.90
        },
        {
            id: 7,
            product: "Books",
            image: "https://cdn-icons-png.flaticon.com/128/3413/3413535.png",
            notes: "2 Books",
            price: 49.90
        },
        {
            id: 8,
            product: "Rulers",
            image: "https://cdn-icons-png.flaticon.com/128/3976/3976515.png",
            notes: "3 Rulers",
            price: 14.90
        },
        {
            id: 9,
            product: "Scissors",
            image: "https://cdn-icons-png.flaticon.com/128/10774/10774493.png",
            notes: "1 Scissors ",
            price: 14.90
        },
        {
            id: 10,
            product: "Board",
            image: "https://cdn-icons-png.flaticon.com/128/544/544322.png",
            notes: "1 Board ",
            price: 29.90
        }
    ]);

    ////////////////////////////// קבלת מידע מעמוד אחר //////////////////////////////
    //  מכיל את  המידע שהתקבל מעמוד ששיגר תמידע  על ידי הפונקציה נביגת
    const location = useLocation();
    // אם המידע שקיבלתי מהנביגת ששיך לרשימת המוצרים  אינו ריק 
    // עידכון רשימת המוצרים התשובה חוזרת מעמוד הניהול 
    if (location.state != null) {
        if (location.state.productsList != null) {
            productsList = JSON.parse(location.state.productsList)
        }
        // אם המידע שקיבלתי מהנביגת ששיך לרשימת הקניות  אינו ריק 
        // ? עידכון לרשימת הקניות  התשובה חוזרת מעמוד הניהול 
        if (location.state.cartList != null) {
            cartList = JSON.parse(location.state.cartList)
        }
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
    // פונקציה לקבלת מוצר שנבחר להוספה לסל הקניות 
    const addToCart = item => event => {
        event.preventDefault()
        //alert("Adding: " + item.id)

        cartList.push({
            id: item.id,
            image: item.image,
            product: item.product,
            notes: item.notes,
            price: item.price
        });
    }

    ////////////////////////////// עיצוב המידע לתצוגה //////////////////////////////
    //DO NOW 
    let productItems = productsList.map(item => (
        <form onSubmit={addToCart(item)}>
            <table>
                <tr>
                    <td style={{ width: "60px" }} >ID: {item.id}</td>
                    <td style={{ width: "100px" }}><img src={item.image} width={40} height={40} /></td>
                    <td style={{ width: "250px" }}>Product: {item.product}</td>
                    <td style={{ width: "250px" }}>Notes: {item.notes}</td>
                    <td style={{ width: "100px" }} >Price: {item.price}</td>
                    <td style={{ width: "100px" }} ><input type="submit" value="Add" /></td>
                </tr>
            </table>
        </form>
    ))

    ////////////////////////////// תצוגת המידע במסך הלקוח //////////////////////////////
    return (
        <div>
            <header className="navbar" >
                <nav>
                    <ul>
                        <li><button style={{ height: "35px", width: "200px" }} onClick={() => sendDataUrl('/cart')}>Cart</button></li>
                        <li><button style={{ height: "35px", width: "200px" }} onClick={() => sendDataUrl('/EditProduct')}>Manage</button></li>
                    </ul>
                </nav>
            </header>
            <div>
                <h1>Products</h1>
                <div>{productItems}</div>
            </div>
        </div>
    )
}