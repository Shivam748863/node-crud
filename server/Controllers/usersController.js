const users = require("../models/userSchema");
const moment = require("moment");
const csv = require("fast-csv");
const fs = require("fs");

// register user
exports.userPost = async (req, res) => {
  // console.log(req.file);
  // console.log(req.body);
  const file = req.file.filename;
  const { fname, lname, email, mobile, gender, location, status } = req.body;

  if (
    !fname ||
    !lname ||
    !email ||
    !mobile ||
    !gender ||
    !location ||
    !status ||
    !file
  ) {
    return res.status(401).json("All fields are required");
  }

  try {
    const preUser = await users.findOne({ email: email });
    if (preUser) {
      return res.status(401).json("This user already exists in our database");
    } else {
      const dateCreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
      const newUser = new users({
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        status,
        profile: file,
        dateCreated,
      });

      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (error) {
    res.status(401).json(error);
    console.log(error);
  }
};

// get user
exports.userGet = async (req, res) => {
  // console.log(req.query);
  const search = req.query.search || "";
  const gender = req.query.gender || "";
  const status = req.query.status || "";
  const sort = req.query.sort || "";
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 4;

  const query = {
    fname: { $regex: search, $options: "i" },
  };

  if (gender !== "All") {
    query.gender = gender;
  }

  if (status !== "All") {
    query.status = status;
  }

  try {
    // skip is used for pagination
    const skip = (page - 1) * ITEM_PER_PAGE;
    // this will give total users
    const count = await users.countDocuments(query);

    const userData = await users
      .find(query)
      .sort({ dateCreated: sort === "new" ? -1 : 1 })
      .limit(ITEM_PER_PAGE)
      .skip(skip);

    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    res.status(200).json({
      Pagination: { count, pageCount },
      userData,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

// get single user
exports.getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const singleUserData = await users.find({ _id: id });
    res.status(200).json(singleUserData);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.userEdit = async (req, res) => {
  const { id } = req.params;
  const {
    fname,
    lname,
    email,
    mobile,
    gender,
    location,
    status,
    user_profile,
  } = req.body;
  const file = req.file ? req.file.filename : user_profile;

  const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
  try {
    const updateUserData = await users.findByIdAndUpdate(
      { _id: id },
      {
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        status,
        profile: file,
        dateUpdated,
      },
      {
        new: true,
      }
    );
    await updateUserData.save();
    res.status(200).json(updateUserData);
  } catch (error) {
    console.log("error", error);
    res.status(401).json(error);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await users.findByIdAndDelete({ _id: id });
    res.status(200).json(deleteUser);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.userStatus = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  try {
    const userStatusUpdate = await users.findByIdAndUpdate(
      { _id: id },
      { status: data },
      { new: true }
    );
    res.status(200).json(userStatusUpdate);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.userExport = async (req, res) => {
  try {
    const usersData = await users.find();
    const csvStream = csv.format({ headers: true });

    // creating a folder file and export, if not present inside public
    if (!fs.existsSync("public/files/export")) {
      if (!fs.existsSync("public/files")) {
        fs.mkdirSync("public/files");
      }

      if (!fs.existsSync("public/files/export")) {
        fs.mkdirSync("./public/files/export");
      }
    }

    // creating a stream for csv
    const writableStream = fs.createWriteStream(
      "public/files/export/users.csv"
    );

    csvStream.pipe(writableStream);

    writableStream.on("finish", function () {
      res.json({
        downloadUrl: `http://localhost:6010/files/export/users.csv`,
      });
    });

    // making data how it will look like in csv report
    if (usersData.length > 0) {
      usersData.map((user) => {
        csvStream.write({
          FirstName: user.fname ? user.fname : "-",
          LastName: user.lname ? user.lname : "-",
          Email: user.email ? user.email : "-",
          Phone: user.mobile ? user.mobile : "-",
          Gender: user.gender ? user.gender : "-",
          Status: user.status ? user.status : "-",
          Profile: user.profile ? user.profile : "-",
          Location: user.location ? user.location : "-",
          DateCreated: user.dateCreated ? user.dateCreated : "-",
          dateUpdated: user.dateUpdated ? user.dateUpdated : "-",
        });
      });
    }

    csvStream.end();
    writableStream.end();
  } catch (error) {
    console.log("error", error);
    res.status(401).json(error);
  }
};
