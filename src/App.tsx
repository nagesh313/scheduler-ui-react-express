import { withSnackbar } from "notistack";
import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import { dashboardRoutes } from "./routes/routes";

export function AppComponent() {
  return (
    <div className="App">
      <Switch>
        {dashboardRoutes.map((route: any) => {
          return (
            <Route path={route.path} key={route.path}>
              {route.component}
            </Route>
          );
        })}
      </Switch>
    </div>
  );
}
export const App = withSnackbar(AppComponent);
