import React, { useEffect, useState } from "react";
import "./profile.css";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/esm/Row";
import Spiner from "../../components/Spinner/Spinner";
import { useParams } from "react-router-dom";
import { singleUserDataFunc } from "../../services/Apis";
import { BASE_URL } from "../../services/helper";
import moment from "moment";

const Profile = () => {
  const [showSpin, setShowSpin] = useState(true);
  const [singleUser, setSingleUser] = useState([]);

  const { id } = useParams();

  const getSingleUser = async () => {
    const response = await singleUserDataFunc(id);
    if (response.status === 200) {
      setSingleUser(response?.data[0]);
    } else {
      console.log("Error while fecthing single user");
    }
  };

  useEffect(() => {
    getSingleUser();
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [id]);

  console.log("singleUser", singleUser);

  return (
    <>
      {showSpin ? (
        <Spiner />
      ) : (
        <div className="container">
          <Card className="card-profile shadow col-lg-6 mx-auto mt-5">
            <Card.Body>
              <Row>
                <div className="col">
                  <div className="card-profile-stats d-flex justify-content-center">
                    <img
                      src={`${BASE_URL}/uploads/${singleUser.profile}`}
                      alt="img"
                    />
                  </div>
                </div>
              </Row>
              <div className="text-center">
                <h3>{singleUser.fname + singleUser.lname}</h3>
                <h4>
                  <i class="fa-solid fa-envelope"></i>
                  &nbsp;:- <span>{singleUser.email}</span>
                </h4>
                <h5>
                  <i class="fa-solid fa-mobile"></i>
                  &nbsp;:- <span>{singleUser.mobile}</span>
                </h5>
                <h4>
                  <i class="fa-solid fa-person"></i>
                  &nbsp;:- <span>{singleUser.gender}</span>
                </h4>
                <h4>
                  <i class="fa-solid fa-location-dot"></i>
                  &nbsp;:- <span>{singleUser.location}</span>
                </h4>
                <h4>
                  Status&nbsp;:- <span>{singleUser.status}</span>
                </h4>
                <h4>
                  <i class="fa-solid fa-calendar-days"></i>
                  &nbsp;Date Created&nbsp;:-
                  <span>
                    {moment(singleUser.dateCreated).format("DD-MM-YYYY")}
                  </span>
                </h4>
                <h4>
                  <i class="fa-solid fa-calendar-days"></i>
                  &nbsp;Date Updated&nbsp;:-
                  <span>{singleUser.dateUpdated}</span>
                </h4>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
};

export default Profile;
