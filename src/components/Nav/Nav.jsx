import React, { useState } from "react";
import "./styling.css";
import { Stack } from "@twilio-paste/core/stack";
import { Link, Outlet } from "react-router-dom";
import { Avatar } from "@twilio-paste/core/avatar";
import { UserIcon } from "@twilio-paste/icons/cjs/UserIcon";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Menu,
  MenuButton,
  MenuItem,
  useMenuState,
} from "@twilio-paste/core/menu";
import Footer from "../Footer/Footer";
import Modal from "../Modal/Modal";
import { Button } from "@twilio-paste/core/button";
import { deleteUser } from "../../services/userServices";

export default function Nav() {
  const {
    user,
    isAuthenticated: userIsAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
  } = useAuth0();
  const userAvatarMenu = useMenuState();
  const [alertModalIsOpen, setAlertModalIsOpen] = useState(false);

  function getUserAvatar() {
    if (userIsAuthenticated)
      return <Avatar size="sizeIcon40" name="user-avatar" src={user.picture} />;
    else return <Avatar size="sizeIcon40" name="user-avatar" icon={UserIcon} />;
  }

  function handleAccountDeletionNegotiation() {
    setAlertModalIsOpen(true);
  }

  async function handleAccountDeletionConfirmation() {
    const accessToken = await getAccessTokenSilently({
      audience: "https://safetynet-6147-dev.twil.io/",
      scope: "delete:users",
    });

    const response = await deleteUser(accessToken);

    if (response.status === 200) window.location.reload();

    setAlertModalIsOpen(false);
  }

  function handleAccountDeletionRejection() {
    setAlertModalIsOpen(false);
  }

  function getUserAvatarMenuOption() {
    if (userIsAuthenticated)
      return (
        <>
          <MenuItem {...userAvatarMenu} onClick={logout}>
            Logout
          </MenuItem>
          <MenuItem
            {...userAvatarMenu}
            onClick={handleAccountDeletionNegotiation}
          >
            Delete Account
          </MenuItem>
        </>
      );
    else
      return (
        <MenuItem {...userAvatarMenu} onClick={loginWithRedirect}>
          Login
        </MenuItem>
      );
  }

  function getLinks() {
    if (userIsAuthenticated) {
      return (
        <>
          <Link to="/">Home</Link>
          <Link to="contingents">Contingents</Link>
          <Link to="safety-deposit-boxes">Safety Deposit Boxes</Link>
        </>
      );
    }
  }

  return (
    <>
      <nav className="main-nav">
        <Stack orientation="horizontal" spacing="space30">
          {getLinks()}
        </Stack>
        <MenuButton {...userAvatarMenu} variant="secondary">
          {getUserAvatar()}
        </MenuButton>
        <Menu {...userAvatarMenu} aria-label="Login-Actions">
          {getUserAvatarMenuOption()}
        </Menu>
      </nav>
      <Modal
        title="Deletion Confirmation"
        content="Are you sure you want to delete your account? This action is irreversible!"
        isOpen={alertModalIsOpen}
        setIsOpen={setAlertModalIsOpen}
        canClickOK={true}
        options={() => [
          <Button
            variant="primary"
            onClick={() => {
              handleAccountDeletionConfirmation();
            }}
          >
            Yes
          </Button>,
          <Button
            variant="destructive_secondary"
            onClick={() => {
              handleAccountDeletionRejection();
            }}
          >
            No!
          </Button>,
        ]}
      />
      <Outlet />
      <Footer />
    </>
  );
}
