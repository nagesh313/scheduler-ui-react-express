const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;
//this line is required to parse the request body
app.use(express.json());

/* Create - POST method */
app.post("/staff/add", (req, res) => {
  //get the existing staff data
  const existStaffs = getStaffData();

  //get the new staff data from post request
  const staffData = req.body;

  //check if the staffData fields are missing
  if (staffData.name == null || staffData.load == null) {
    return res.status(401).send({ error: true, msg: "Staff data missing" });
  }

  //check if the staffname exist already
  const findExist = existStaffs.find(
    (staff) => staff.staffname === staffData.staffname
  );
  if (findExist) {
    return res
      .status(409)
      .send({ error: true, msg: "staffname already exist" });
  }

  //append the staff data
  existStaffs.push(staffData);

  //save the new staff data
  saveStaffData(existStaffs);
  res.send({ success: true, msg: "Staff data added successfully" });
});

app.post("/schedule/save", (req, res) => {
  const scheduleData = req.body;
  saveScheduleData(scheduleData);
  res.send({ success: true, msg: "Schedule data added successfully" });
});
app.post("/staff/save", (req, res) => {
  const staffData = req.body;
  saveStaffData(staffData);
  res.send({ success: true, msg: "Staff data added successfully" });
});
/* Read - GET method */
app.get("/staff/list", (req, res) => {
  const staffs = getStaffData();
  res.send(staffs);
});
app.get("/schedule/list", (req, res) => {
  const schedules = getSchedules();
  res.send(schedules);
});

/* Update - Patch method */
app.patch("/staff/update/:staffname", (req, res) => {
  //get the staffname from url
  const staffname = req.params.staffname;

  //get the update data
  const staffData = req.body;

  //get the existing staff data
  const existStaffs = getStaffData();

  //check if the staffname exist or not
  const findExist = existStaffs.find((staff) => staff.staffname === staffname);
  if (!findExist) {
    return res.status(409).send({ error: true, msg: "staffname not exist" });
  }

  //filter the staffdata
  const updateStaff = existStaffs.filter(
    (staff) => staff.staffname !== staffname
  );

  //push the updated data
  updateStaff.push(staffData);

  //finally save it
  saveStaffData(updateStaff);

  res.send({ success: true, msg: "Staff data updated successfully" });
});

/* Delete - Delete method */
app.delete("/staff/delete/:staffname", (req, res) => {
  const staffname = req.params.staffname;

  //get the existing staffdata
  const existStaffs = getStaffData();

  //filter the staffdata to remove it
  const filterStaff = existStaffs.filter(
    (staff) => staff.staffname !== staffname
  );

  if (existStaffs.length === filterStaff.length) {
    return res
      .status(409)
      .send({ error: true, msg: "staffname does not exist" });
  }

  //save the filtered data
  saveStaffData(filterStaff);

  res.send({ success: true, msg: "Staff removed successfully" });
});

/* util functions */

//read the staff data from json file

const saveStaffData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("staffs.json", stringifyData);
};
const saveScheduleData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("schedules.json", stringifyData);
};

//get the staff data from json file
const getStaffData = () => {
  const jsonData = fs.readFileSync("staffs.json");
  return JSON.parse(jsonData);
};
const getSchedules = () => {
  const jsonData = fs.readFileSync("schedules.json");
  return JSON.parse(jsonData);
};
/* util functions ends */

//configure the server port
app.listen(port, () => {
  console.log("Server runs on port " + port);
});
