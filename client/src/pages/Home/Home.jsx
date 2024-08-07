import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import Tables from "../../components/Table/Tables";
import Spiner from "../../components/Spinner/Spinner";
import {
  addData,
  deleteData,
  updateData,
} from "../../components/Context/ContextProvider";
import Alert from "react-bootstrap/Alert";
import {
  deleteFunc,
  exportUsersCsvReportFunc,
  userGetFun,
} from "../../services/Apis";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [showSpin, setShowSpin] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const { userAdd, setUserAdd } = useContext(addData);
  const { userUpdate, setUserUpdate } = useContext(updateData);
  const { userDelete, setDeletedUser } = useContext(deleteData);

  const addUser = () => {
    navigate("/register");
  };

  const getUsers = async () => {
    const response = await userGetFun(search, gender, status, sort, page);
    // console.log(response);
    if (response.status === 200) {
      setUsers(response?.data?.userData);
      setPageCount(response?.data?.Pagination?.pageCount);
    } else {
      console.log("error while fetching users");
    }
  };

  const deleteUser = async (id) => {
    const response = await deleteFunc(id);
    if (response.status === 200) {
      getUsers();
      setDeletedUser(response?.data);
      toast.success("CSV downloaded successfully");
    } else {
      toast.error("error while deleting");
    }
  };

  const exportUsersCsvReport = async () => {
    const response = await exportUsersCsvReportFunc();
    if (response.status === 200) {
      window.open(response.data.downloadUrl, "blank");
    } else {
      toast.error("error while fetching csv");
    }
  };

  // handlePagination
  // handle previous btn
  const handlePrevious = () => {
    setPage(() => {
      if (page === 1) return page;
      return page - 1;
    });
  };

  // handle next btn
  const handleNext = () => {
    setPage(() => {
      if (page === pageCount) return page;
      return page + 1;
    });
  };

  useEffect(() => {
    getUsers();
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [search, gender, status, sort, page]);

  return (
    <>
      {userAdd ? (
        <Alert variant="primary" onClose={() => setUserAdd("")} dismissible>
          {userAdd?.fname.toUpperCase()} Successfully Added
        </Alert>
      ) : (
        ""
      )}
      {userUpdate ? (
        <Alert variant="primary" onClose={() => setUserUpdate("")} dismissible>
          {userUpdate?.fname.toUpperCase()} Successfully Updated
        </Alert>
      ) : (
        ""
      )}
      {userDelete ? (
        <Alert variant="danger" onClose={() => setDeletedUser("")} dismissible>
          {userDelete?.fname.toUpperCase()} Deleted Successfully
        </Alert>
      ) : (
        ""
      )}
      <div className="container">
        <div className="main_div">
          {/* search and add btn */}
          <div className="search_add mt-4 d-flex justify-content-between">
            <div className="search">
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button className="search_btn">Search</Button>
              </Form>
            </div>
            <div className="add_btn">
              <Button variant="primary" className="" onClick={addUser}>
                <i class="fa-solid fa-plus"></i>&nbsp;Add
              </Button>
            </div>
          </div>
          {/* export, gender, status */}
          <div className="filter_div mt-5 d-flex justify-content-between flex-wrap">
            <div className="export_csv">
              <Button className="export_btn" onClick={exportUsersCsvReport}>
                Export to CSV
              </Button>
            </div>
            <div className="filter_gender">
              <div className="filter">
                <h3>Filter By Gender</h3>
                <div className="gender d-flex justify-content-between">
                  <Form.Check
                    type={"radio"}
                    label={`All`}
                    name="gender"
                    value={"All"}
                    onChange={(e) => setGender(e.target.value)}
                    defaultChecked
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Male`}
                    name="gender"
                    value={"Male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Female`}
                    name="gender"
                    value={"Female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* short by value */}
            <div className="filter_newold">
              <h3>Short By Value</h3>
              <Dropdown className="text-center">
                <Dropdown.Toggle className="dropdown_btn" id="dropdown-basic">
                  <i class="fa-solid fa-sort"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSort("new")}>
                    New
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSort("old")}>
                    Old
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {/* filter by status */}
            <div className="filter_status">
              <div className="status">
                <h3>Filter By Status</h3>
                <div className="status_radio d-flex justify-content-between flex-wrap">
                  <Form.Check // prettier-ignore
                    type={"radio"}
                    label={`All`}
                    name="status"
                    value={"All"}
                    onChange={(e) => setStatus(e.target.value)}
                    defaultChecked
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Active`}
                    name="status"
                    value={"Active"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <Form.Check
                    type={"radio"}
                    label={`InActive`}
                    name="status"
                    value={"InActive"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {showSpin ? (
          <Spiner />
        ) : (
          <Tables
            users={users}
            deleteUser={deleteUser}
            getUsers={getUsers}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            page={page}
            pageCount={pageCount}
            setPage={setPage}
          />
        )}
      </div>
    </>
  );
};

export default Home;
