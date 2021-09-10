import { Divider, MenuItem, Select } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import * as _ from "lodash";
import { withSnackbar } from "notistack";
import React, { useEffect } from "react";
import useUndo from "use-undo";
import { failureToast, successToast } from "../util/util";
import { ScheduleComponent } from "./ScheduleComponent";

export function HomeComponent(props: any) {
  const [
    staffs,
    { set: setStaffs, reset: resetStaffs, undo: undoStaffs, redo: redoStaffs },
  ] = useUndo([]);
  const { present: presentStaffs } = staffs;
  const [
    schedules,
    {
      set: setSchedules,
      reset: resetSchedules,
      undo: undoSchedules,
      redo: redoSchedules,
    },
  ] = useUndo([]);
  const { present: presentSchedules } = schedules as any;
  const fetchData = () => {
    axios
      .get("/staff/list")
      .then((response: any) => {
        setStaffs(response.data);
      })
      .catch(() => {
        props.enqueueSnackbar("Unable to fetch the Staff List", failureToast);
      });
    axios
      .get("/schedule/list")
      .then((response: any) => {
        setSchedules(response.data);
      })
      .catch(() => {
        props.enqueueSnackbar(
          "Unable to fetch the schedule List",
          failureToast
        );
      });
  };

  useEffect(() => {
    fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const homeSubmit = () => {
    axios
      .post("/schedule/save", schedules)
      .then(() => {
        props.enqueueSnackbar("Successfully saved the Schedule", successToast);
      })
      .catch(() => {
        props.enqueueSnackbar("Unable To Save Schedule", failureToast);
      });
    axios
      .post("/staff/save", presentStaffs)
      .then(() => {
        props.enqueueSnackbar("Successfully saved the Staff", successToast);
      })
      .catch(() => {
        props.enqueueSnackbar("Unable To Save Staff", failureToast);
      });
  };
  const undo = () => {
    undoStaffs();
    undoSchedules();
  };
  const redo = () => {
    redoStaffs();
    redoSchedules();
  };
  const scheduleChange = (data: any, day: number, index: number) => {
    const newSchedule = _.cloneDeep(presentSchedules);
    newSchedule[index].staff[day] = data;
    calculateStaffLoad(newSchedule);
    setSchedules(newSchedule);
  };
  const calculateStaffLoad = (schedules: any) => {
    const newStaffLoads: any = _.cloneDeep(presentStaffs);
    newStaffLoads.forEach((staff: any) => {
      staff.load = [0, 0, 0, 0, 0];
    });
    schedules.forEach((schedule: any, index: number) => {
      schedule.staff.forEach((data: any, index2: number) => {
        const currentStaff = newStaffLoads.find((d: any) => d.name === data);
        if (currentStaff) {
          currentStaff.load[index2] = currentStaff.load[index2] + 1;
        }
      });
    });
    setStaffs(newStaffLoads);
  };

  const randomize = () => {
    console.log(randomize);
  };
  const clear = () => {
    const newSchedule = _.cloneDeep(presentSchedules);
    const newStaffMembers = _.cloneDeep(presentStaffs);
    newSchedule.forEach((data: any) => {
      data.staff = ["", "", "", "", ""];
    });
    newStaffMembers.forEach((data: any) => {
      data.load = [0, 0, 0, 0, 0];
    });
    resetStaffs([]);
    resetSchedules([]);
    setSchedules(newSchedule);
    setStaffs(newStaffMembers);
  };
  return (
    <React.Fragment>
      <Container component="main" style={{ marginTop: "10px" }}>
        <Grid container style={{ textAlign: "left" }}>
          <Grid item xs={3}>
            <Typography component="h1" variant="h5">
              Schedule
            </Typography>
          </Grid>
          <Grid item xs={7} style={{ textAlign: "center" }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={randomize}
            >
              Randomize
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={clear}
              style={{ marginLeft: "5px" }}
            >
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={homeSubmit}
              style={{ marginLeft: "5px" }}
            >
              Submit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={undo}
              style={{ marginLeft: "5px" }}
            >
              Undo
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={redo}
              style={{ marginLeft: "5px" }}
            >
              Redo
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={8}>
            <Divider light />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={3} style={{ textAlign: "left" }}></Grid>
          <Grid item xs={1}>
            Monday
          </Grid>
          <Grid item xs={1}>
            Tuesday
          </Grid>
          <Grid item xs={1}>
            Wednesday
          </Grid>
          <Grid item xs={1}>
            Thursday
          </Grid>
          <Grid item xs={1}>
            Friday
          </Grid>
        </Grid>
        {presentSchedules.map((schedule: any, index: any) => {
          return (
            <Grid
              container
              key={index}
              style={
                ["Lunch A", "Afternoon Up Stairs"].includes(schedule.name)
                  ? { marginTop: "1rem" }
                  : {}
              }
            >
              <Grid item xs={3} style={{ textAlign: "left" }}>
                {schedule.name}
              </Grid>
              <Grid item xs={1}>
                <Select
                  id={"select-monday" + index}
                  value={schedule.staff[0]}
                  onChange={(event: any, data: any) => {
                    scheduleChange(data.props.value, 0, index);
                  }}
                >
                  {presentStaffs.map((staff: any, index: any) => {
                    return (
                      <MenuItem value={staff.name} key={index}>
                        {staff.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid item xs={1}>
                <Select
                  id={"select-tuesday" + index}
                  value={schedule.staff[1]}
                  onChange={(event: any, data: any) => {
                    scheduleChange(data.props.value, 1, index);
                  }}
                >
                  {presentStaffs.map((staff: any, index: any) => {
                    return (
                      <MenuItem value={staff.name} key={index}>
                        {staff.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid item xs={1}>
                <Select
                  id={"select-wednesday" + index}
                  value={schedule.staff[2]}
                  onChange={(event: any, data: any) => {
                    scheduleChange(data.props.value, 2, index);
                  }}
                >
                  {presentStaffs.map((staff: any, index: any) => {
                    return (
                      <MenuItem value={staff.name} key={index}>
                        {staff.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid item xs={1}>
                <Select
                  id={"select-thursday" + index}
                  value={schedule.staff[3]}
                  onChange={(event: any, data: any) => {
                    scheduleChange(data.props.value, 3, index);
                  }}
                >
                  {presentStaffs.map((staff: any, index: any) => {
                    return (
                      <MenuItem value={staff.name} key={index}>
                        {staff.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid item xs={1}>
                <Select
                  id={"select-friday" + index}
                  value={schedule.staff[4]}
                  onChange={(event: any, data: any) => {
                    scheduleChange(data.props.value, 4, index);
                  }}
                >
                  {presentStaffs.map((staff: any, index: any) => {
                    return (
                      <MenuItem value={staff.name} key={index}>
                        {staff.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>
          );
        })}
      </Container>
      <ScheduleComponent
        schedules={presentSchedules}
        staffMembers={presentStaffs}
      ></ScheduleComponent>
    </React.Fragment>
  );
}
export const Home = withSnackbar(HomeComponent);
