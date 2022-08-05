import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { Theme } from "@twilio-paste/core/theme";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      audience={`${window.location.origin}/`}
      scope="read:user delete:users"
    >
      <Theme.Provider theme="default">
        <HashRouter>
          <App />
        </HashRouter>
      </Theme.Provider>
    </Auth0Provider>
  </React.StrictMode>
);
