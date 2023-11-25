import React, { useState, useEffect, useContext } from 'react';
import firebase from '../../config/Fire';
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loader from '../../common/Loader/Loader';
import { AuthContext } from '../../context/Auth';
import depositData from '../../components/DepositData/DepositData'

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

  const getDepositData = () => {
    firebase
      .database()
      .ref(`deposits`)
      .get()
      .then((response) => {
        setTimeout(setDepositData(response.val()), 5000);
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
                  <Loader></Loader>
                ) : (
                  <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Email</th>
                        {/* <th scope="col">Amount</th> */}
                        <th scope="col">Pending Amount</th>
                        {/* <th scope="col">Date</th> */}
                        <th scope="col">Pending Days</th>
                      </tr>
                    </thead>
                    <tbody id="c">
                      {depositData ?
                        Object.entries(depositData)
                          .filter((item) => item[1].email === currentUser.email)
                          .map((item) => (
                            <>
                              <tr key={item[0]} className="job-open ">
                                <td>{item[1].email}</td>
                                {/* <td>{item[1].amount} /-</td> */}
                                <td>{item[1].pendingAmount} /-</td>
                                {/* <td>{formatDate(item[1].postTimestamp)}</td> */}
                                <td>{item[1].pendingDays} Days Left</td>
                              </tr>
                            </>

                          )) :
                        <span>We'll notify you as soon as something becomes available.</span>
                      }
                    </tbody>
                  </table>
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
