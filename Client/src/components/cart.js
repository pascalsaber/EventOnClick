import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Cart() {
  ////////////////////////////// משתנים ///////////////////////////////////
  let [totalPrice, setTotalPrice] = useState(0)
  let [productsList, setProductsList] = useState({})
  let [cartList, setCartList] = useState({})
  let [cartDisplay, setCartDisplay] = useState({})   // משתנה למען יצירת מבנה להצגת רשימת הקניות בצורה עיצובית 

  ////////////////////////////// קבלת מידע מעמוד אחר //////////////////////////////
  const location = useLocation(); //  מכיל את  המידע שהתקבל מעמוד ששיגר תמידע  על ידי הפונקציה נביגת
  if (location.state == null) {   // במידה ורשימת המוצרים ורשימת סל הקניות אינה קיימת מעביר לעמוד הראשי
    window.location = '/products'; //מעבר לעמוד הראשי כדי לקבל את המידע ההתחלתי של רשימת המוצרים
  }
  if (location.state.cartList != null) {
    cartList = JSON.parse(location.state.cartList)
  }
  if (location.state.productsList != null) {
    productsList = JSON.parse(location.state.productsList)
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
  const removeFromCart = item => event => {
    event.preventDefault()
    const index = cartList.findIndex(({ id }) => id === item.id);
    cartList.splice(index, 1);
    sendDataUrl('/cart')
  }

  ////////////////////////////// עיצוב המידע לתצוגה //////////////////////////////
  cartDisplay = cartList.map((item) => (
    <form>
      <table>
        <tr>
          <td style={{ width: "60px" }} >ID: {item.id}</td>
          <td style={{ width: "100px" }}><img src={item.image} width={40} height={40} /></td>
          <td style={{ width: "250px" }}>Product: {item.product}</td>
          <td style={{ width: "250px" }}>Notes: {item.notes}</td>
          <td style={{ width: "100px" }} >Price: {item.price}</td>
          <td style={{ width: "100px" }} ><input type="submit" value="X" onClick={removeFromCart(item)} /></td>
        </tr>
      </table>
    </form>
  ))
  cartList.map((item) => {
    totalPrice += parseFloat(item.price)
  })
  ////////////////////////////// תצוגת המידע במסך הלקוח //////////////////////////////
  return (
    <div>
      <header className="navbar">
        <nav>
          <ul>
            <li><button style={{ height: "35px", width: "200px" }} onClick={() => sendDataUrl('/products')}>Products</button></li>
            <li><button style={{ height: "35px", width: "200px" }} onClick={() => sendDataUrl('/EditProduct')}>Manage</button></li>
          </ul>
        </nav>
      </header>
      <h1>Cart</h1>
      <div>{cartDisplay}</div>
      <h1>Total Price: {totalPrice}</h1>
      <button style={{ height: "35px", width: "200px" }} onClick={() => sendDataUrl('/pay')}>Pay</button>
    </div>
  );
}

