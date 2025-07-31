import React from "react";
import { Provider } from 'react-redux';
import ReactDOM from "react-dom/client";
import { AppRouter } from "./routes";
import reportWebVitals from "./reportWebVitals";
import { PrimeReactProvider } from "primereact/api";
import "./index.css";
import 'primereact/resources/primereact.css';
import "primeicons/primeicons.css";
import { store } from './store/store';
import { ILoggedInUser } from "./models";
import { AuthService } from "./services/authServices";
import { loginSuccess } from "./store/slices/authSlice";
export const user: ILoggedInUser | null = store.getState().auth.user;
const authToken = localStorage.getItem("authToken");

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const renderApp = () => {
  console.log("renderApp")
  return root.render(
    <Provider store={store}>
      <PrimeReactProvider>
        <AppRouter />
      </PrimeReactProvider>
    </Provider>
  );
}

if (user) {
  console.log("authToken", authToken)
  renderApp();
} else {

  if (authToken) {
    new AuthService().loginWithToken().then((response) => {
      if (response) {
        localStorage.setItem("authToken", response.data.token);

        console.log("response", response)
        store.dispatch(loginSuccess(response.data.user));
        //webSocketServer.connectsocket(response.user._id, response.token)
        return renderApp();
    }
      return renderApp();
    })
    .catch((error) => {
      console.log("error", error)
      localStorage.removeItem("authToken");
      window.location.href = "/login";
      renderApp();
    });

  } else {
    renderApp();
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
