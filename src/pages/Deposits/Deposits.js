import React, { useState, useEffect, useContext } from 'react';
import firebase from '../../config/Fire';
import fire, { storage } from "../../config/Fire";
import Axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { AuthContext } from '../../context/Auth';
import $ from 'jquery';
import Loader from "../../common/Loader/Loader";
import depositData from '../../components/DepositData/DepositData';



function Deposits(props) {

  const [showModal, setShowModal] = useState(false);

  const { currentUser, userRole } = useContext(AuthContext);

  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [pendingAmount, setPendingAmount] = useState('');
  const [pendingDays, setPendingDays] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [formIncompleteError, setFormIncompleteError] = useState(false);

  const [depositData, setDepositData] = useState({});
  const [isDepositAdded, setIsDepositAdded] = useState(false);
  const [isDepositEdited, setIsDepositEdited] = useState(false);
  const [isDepositDeleted, setIsDepositDeleted] = useState(false);
  const [postTimestamp, setPostTimestamp] = useState("");


  const [editDetails, setEditDetails] = useState(false);
  const [depositIdToEdit, setDepositIdToEdit] = useState(null);



  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsDepositAdded(false);
    setIsDepositEdited(false);
    setIsDepositDeleted(false);
    getDepositData();
  }, [isDepositAdded, isDepositEdited, isDepositDeleted]);



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

  const handleAddPostData = (e) => {
    //   check if all input is taken
    if (amount === '' || email === '' || pendingAmount === '' || pendingDays === '') {
      setFormComplete(false);
      setFormIncompleteError(true);
    } else {
      if (editDetails) {
        firebase.database().ref(`deposits/${depositIdToEdit}`).set(
          {
            amount: amount === "" ? amount : amount,
            email: email === "" ? email : email,
            pendingAmount: pendingAmount === "" ? pendingAmount : pendingAmount,
            pendingDays: pendingDays === "" ? pendingDays : pendingDays,
            postTimestamp: new Date().toUTCString(),
          }
        )
          .then((response) => {
            alert("deposits edited succesfully");
            window.location.reload();
            setIsDepositEdited(true);
          })
          .catch((error) => console.log("Error in editDetails" + error));
      }
      else {
        firebase.database().ref('deposits/').push(
          {
            amount: amount === "" ? amount : amount,
            email: email === "" ? email : email,
            pendingAmount: pendingAmount === "" ? pendingAmount : pendingAmount,
            pendingDays: pendingDays === "" ? pendingDays : pendingDays,
            postTimestamp: new Date().toUTCString(),
          }
        )
          .then((response) => {
            alert("blog added succesfully");
            window.location.reload();
            setIsDepositAdded(true);
          })
          .catch((error) => console.log("Error" + error));
      }

      setShowModal(false);

      setAmount('');
      setEmail('');
      setPendingAmount('');
      setPendingDays('');
      setDepositIdToEdit(null);
      setPostTimestamp("");

    }
  };

  const handleEditDeposit = (
    depositId
  ) => {
    const deposit = depositData[depositId];
    setAmount(deposit.amount);
    setEmail(deposit.email);
    setPendingAmount(deposit.pendingAmount);
    setPendingDays(deposit.pendingDays);
    setDepositIdToEdit(depositId);
    setEditDetails(true);
    setShowModal(true);
  };

  // handles archive on card archive click
  const handleDeleteDeposit = (depositId) => {
    if (window.confirm("Are you sure you want to delete the deposit?")) {
      firebase.database().ref(`deposits/${depositId}`).remove()
        .then((response) => {
          alert("Deposit deleted succesfully");
          window.location.reload();
          setIsDepositDeleted(true);
        })
        .catch((error) => console.log("Error" + error));
    }
  };

  $(document).ready(function () {
    $('#search-input').keyup(function () {
      // Search text
      var text = $(this).val();
      // Hide all content className element
      $('.session-card').hide();
      // Search and show
      $('.session-card:contains("' + text + '")').show();
    });
  });


  const modalCloseHandler = () => { setShowModal(false); handleEditDeposit(false) };

  let modalContent = showModal ?

    (
      <>
        <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{editDetails ? "Edit Deposit" : "Add Deposit"}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={modalCloseHandler}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    {formIncompleteError ? <p style={{ color: 'red' }}>Kindly complete the form before adding deposit</p> : null}
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label for="session">Email</label>
                      <input type="text" className="form-control" id="session"
                        defaultValue={editDetails ? email : ""}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter Email" />
                    </div>
                    <div className="form-group col-md-6">
                      <label for="topic">Amount</label>
                      <input type="text" className="form-control" id="topic"
                        defaultValue={editDetails ? amount : ""}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder="Enter Deposit Amount" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="date">Pending Amount</label>
                      <input
                        type="Number"
                        className="form-control"
                        id="date"
                        value={pendingAmount}
                        onChange={(event) => setPendingAmount(event.target.value)}
                        placeholder="Enter Date"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="pendingDays">Pending Days</label>
                      <input
                        type="number"
                        className="form-control"
                        id="pendingDays"
                        value={pendingDays}
                        onChange={(event) => setPendingDays(event.target.value)}
                        placeholder="Enter Pending Days"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" disabled={formComplete} onClick={handleAddPostData} className="btn btn-sm btn-primary">Post</button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
    : null;

  return (
    <>
      <Navbar />
      <div className="wrapper d-flex align-items-stretch">
        <Sidebar />

        <div className="container-fluid main bg-light py-5">
          <div className="row justify-content-center">
            <div className="col-lg-11">

              <div className="add-teacher-profile pb-3">
                <div className="d-flex justify-content-between">
                  <div className="title">
                    <h2 id="teach_profile">Deposits</h2>
                    {/* <p>International Early Years Programs from Zero to Six. At Home and Online</p> */}
                  </div>
                  <div className="add-post-button">
                    {userRole === 'admin' && (
                      <button onClick={() => setShowModal(true)} className="btn btn-dark btn-sm" data-toggle="modal" data-target="#exampleModal"><i className="fas fa-plus"></i></button>
                    )}
                  </div>
                </div>
                <div className="m-content">
                  {modalContent}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-11">
                  <label for="inputEmail4">Search based on Blog Name</label>
                  <input type="text" className="form-control" placeholder="search data" id="search-input" />
                </div>
                <div className="form-group col-md-1 reset-btn">
                  <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>Reset</button>
                </div>
              </div>

              <div className="view-post">
                {/* <div className="post-datas">
                        <div className="card-deck"> */}
                {loading ? (
                  <Loader></Loader>
                ) : (
                  <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Email</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Pending Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">Pending Days</th>
                        {userRole === 'admin' && <th scope="col">Action</th>}
                      </tr>
                    </thead>
                    <tbody id="c">
                      {depositData ?
                        Object.entries(depositData)
                          .filter((item) => userRole === 'admin' || item[1].email === currentUser.email)
                          .map((item) => (
                            // var x = {item[1].status}
                            <>
                              <tr key={item[0]} className="job-open ">
                                <td>{item[1].email}</td>
                                <td>{item[1].amount} /-</td>
                                <td>{item[1].pendingAmount} /-</td>
                                <td>{formatDate(item[1].postTimestamp)}</td>
                                <td>{item[1].pendingDays} Days Left</td>
                                {userRole === 'admin' && (
                                  <td>
                                    <a onClick={(e) => handleDeleteDeposit(item[0], e)}><i className="fas fa-trash-alt text-danger pl-2"></i></a>
                                    <a className="edit-btn ml-4" title="Edit Post" data-toggle="modal" data-target="#exampleModal"
                                      onClick={(e) =>
                                        handleEditDeposit
                                          (
                                            item[1].amount,
                                            item[1].email,
                                            item[0],
                                            e
                                          )
                                      }><i className="fas fa-pencil-alt"></i></a>
                                  </td>
                                )}
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

export default Deposits;
