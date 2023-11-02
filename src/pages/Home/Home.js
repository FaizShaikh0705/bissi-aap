import React from 'react';
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import logo from '../../assets/logo.jpeg';

function Home(props) {

  return(
    <>
        <Navbar />
        <div className="wrapper d-flex align-items-stretch">
        <Sidebar />
            <div className="container main bg-light py-5">
                <img src={logo} width="300" alt="icon"/>
                <div className="our-achivements py-3">
                    <h4 className="text-primary">React Common dashboard</h4>
                </div>
            </div>
        </div>
    </>
  );

}

export default Home;
