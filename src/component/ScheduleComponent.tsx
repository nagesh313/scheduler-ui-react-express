import { Divider, IconButton, Tooltip } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Fastfood, LocationOff, WatchLater } from "@material-ui/icons";
import { withSnackbar } from "notistack";
import React from "react";

export function ScheduleComponent(props: any) {
  const total = (staff: any) => {
    const total =
      staff.load[0] +
      staff.load[1] +
      staff.load[2] +
      staff.load[3] +
      staff.load[4];
    if (total > 7) {
      return (
        <>
          {total}
          <Tooltip title={"Total Cannot be Greater than 7"}>
            <IconButton
              aria-label="Error"
              size="small"
              style={{ marginBottom: "4px" }}
            >
              <WatchLater color="action" style={{ fontSize: "1rem" }} />
            </IconButton>
          </Tooltip>
        </>
      );
    } else {
      return total;
    }
  };
  const displayShiftCountWithError = (staff: any, count: any, day: number) => {
    const result = [];
    const staffAtlunchForTheDaY = props.schedules
      .filter((d: any) => d.name.startsWith("Lunch"))
      .map((schedule: any) => schedule.staff)
      .map((d: any) => d[day]);
    result.push(<>{count}</>);
    if (staffAtlunchForTheDaY.filter((x: any) => x === staff.name).length > 1) {
      result.push(
        <Tooltip title={"Cannot have more than one lunch per day"}>
          <IconButton
            aria-label="Error"
            size="small"
            style={{ marginBottom: "4px" }}
          >
            <Fastfood color="action" style={{ fontSize: "1rem" }} />
          </IconButton>
        </Tooltip>
      );
    }
    if (count > 2) {
      result.push(
        <Tooltip title={"Shift per day cannot be greater than 2"}>
          <IconButton
            aria-label="Error"
            size="small"
            style={{ marginBottom: "4px" }}
          >
            <WatchLater color="action" style={{ fontSize: "1rem" }} />
          </IconButton>
        </Tooltip>
      );
    } else {
    }
    const staffInMorningSchedule = props.schedules
      .filter((d: any) => d.name.startsWith("Morning"))
      .map((schedule: any) => schedule.staff)
      .map((d: any) => d[day]);
    const staffInEveningSchedule = props.schedules
      .filter((d: any) => d.name.startsWith("Afternoon"))
      .map((schedule: any) => schedule.staff)
      .map((d: any) => d[day]);
    if (
      staffInMorningSchedule.filter((x: any) => x === staff.name).length > 1 ||
      staffInEveningSchedule.filter((x: any) => x === staff.name).length > 1
    ) {
      result.push(
        <Tooltip title={"Staff cannot be at two places in a shift"}>
          <IconButton
            aria-label="Error"
            size="small"
            style={{ marginBottom: "4px" }}
          >
            <LocationOff color="action" style={{ fontSize: "1rem" }} />
          </IconButton>
        </Tooltip>
      );
    }
    return result;
  };

  return (
    <Container component="main" style={{ marginTop: "1rem" }}>
      <Grid container>
        <Grid item xs={8}>
          <Divider light />
        </Grid>
      </Grid>
      <Grid container style={{ textAlign: "left" }}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            Load
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={8}>
          <Divider light />
        </Grid>
      </Grid>
      <Grid container style={{ minHeight: "30px" }}>
        <Grid item xs={2} style={{ textAlign: "left" }}>
          Staff Member
        </Grid>
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
        <Grid item xs={1}>
          Totals
        </Grid>
      </Grid>
      {props.staffMembers.map((staff: any, index: any) => {
        return (
          <Grid container key={index} style={{ minHeight: "30px" }}>
            <Grid item xs={2} style={{ textAlign: "left" }}>
              {staff.name}
            </Grid>
            <Grid item xs={1}>
              {displayShiftCountWithError(staff, staff.load[0], 0)}
            </Grid>
            <Grid item xs={1}>
              {displayShiftCountWithError(staff, staff.load[1], 1)}
            </Grid>
            <Grid item xs={1}>
              {displayShiftCountWithError(staff, staff.load[2], 2)}
            </Grid>
            <Grid item xs={1}>
              {displayShiftCountWithError(staff, staff.load[3], 3)}
            </Grid>
            <Grid item xs={1}>
              {displayShiftCountWithError(staff, staff.load[4], 4)}
            </Grid>
            <Grid item xs={1}>
              {total(staff)}
            </Grid>
          </Grid>
        );
      })}
      <Grid container>
        <Grid item xs></Grid>
      </Grid>
    </Container>
  );
}
export const Schedule = withSnackbar(ScheduleComponent);
