import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { checkLogin, fetch_URL_GET } from '../utils';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;
function AllProducts() {
  const token = localStorage.getItem('jwt-token');
  const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
  checkLogin(navigate, token); // בדיקה שהמשתמש מחובר והתוקן תקין

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function main() {
      try {
        const fetchData = await fetch_URL_GET("http://localhost:5000/product/findProductByCategory", token);
        setStatus(fetchData.status);
        setMessage(fetchData.message);
        setData(fetchData.data);
      } catch (error) {
        console.error(`[Error] ${error}`);
      }
    }
    main();
  }, []); // Empty array means this effect runs once on mount

  return (
    <div>
      <Menu /> {/* Here's your NavBar component */}
      <MainContent>
        <br></br>
        <Container className="form" fluid>
          <Row className="justify-content-center">
            <Col xs={12} md={10}>
              <Table striped bordered hover size="sm" responsive="sm">
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data ? data.map((item, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{item._id}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.price}</td>
                    </tr>
                  )) : <tr><td colSpan="6">Loading...</td></tr>}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={12} md={10}>
              <p>[MESSAGE] {message}</p>
              {process.env.REACT_APP_TESTING === 'TRUE' && (
                <>
                  <h5>Testing Mode</h5>
                  <p>[STATUS] {status}</p>
                  <p>[JSON] {JSON.stringify(data)}</p>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </MainContent>
    </div>
  );
}

export default AllProducts;