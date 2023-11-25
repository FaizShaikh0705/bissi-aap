import React, { useState, useEffect, useContext } from 'react';
import firebase from '../../config/Fire';
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import logo from '../../assets/logo.jpeg';
import $ from 'jquery';
import Loader from '../../common/Loader/Loader';
import { AuthContext } from '../../context/Auth';

function Home(props) {

  const [depositData, setDepositData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    getDepositData(currentUser.displayName); // Pass the user's name
  }, [currentUser.displayName]);


  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    return dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDepositData = (userName) => {
    firebase
      .database()
      .ref('deposits')
      .orderByChild('name')
      .equalTo(userName)
      .get()
      .then((response) => {
        const userDepositData = response.val() || {};
        if (userDepositData) {
          // Convert the userDepositData object into an array
          const depositArray = Object.keys(userDepositData).map((key) => ({
            id: key,
            ...userDepositData[key],
          }));
          setDepositData(depositArray);
        } else {
          setDepositData([]);
        }

        setLoading(false);
      })
      .catch((error) => console.log(error));
  };



  return (
    <>
      <Navbar />
      <div className="wrapper d-flex align-items-stretch">
        <Sidebar />
        <div className="container-fluid main bg-light py-5">
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="form-row">
                <div className="form-group col-md-11">
                  <label htmlFor="search-input">Search based on User Name</label>
                  <input type="text" className="form-control" placeholder="Search data" id="search-input" />
                </div>
                <div className="form-group col-md-1 reset-btn">
                  <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
                    Reset
                  </button>
                </div>
              </div>

              <div className="view-post">
                {loading ? (
                  <Loader />
                ) : depositData.length > 0 ? (
                  <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Pending Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">Pending Days</th>
                      </tr>
                    </thead>
                    <tbody id="c">
                      {depositData.map((item) => (
                        <tr key={item.id} className="job-open">
                          <td>{item && item.name ? item.name : "Name Not Available"}</td>
                          <td>{item && item.amount ? `${item.amount} /-` : "Amount Not Available"}</td>
                          <td>{item && item.pendingAmount ? `${item.pendingAmount} /-` : "Pending Amount Not Available"}</td>
                          <td>{item && item.postTimestamp ? formatDate(item.postTimestamp) : "Date Not Available"}</td>
                          <td>{item && item.pendingDays ? `${item.pendingDays} Days Left` : "Pending Days Not Available"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No data available for {currentUser.displayName}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}

export default Home;
