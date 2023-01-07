import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { logout } from "../../services/authentication";
import { useUserContext } from "../Context/Providers";
import { getLabel } from "../../data/labels";
import { labels, pathNames } from "@cosmocam/shared";

export const AccountButton = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { token, setIsLoggedIn, setToken } = useUserContext();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = async () => {
    handleClose();
    logout({ token })
      .then(() => {
        setIsLoggedIn(false);
        setToken("");
        navigate(pathNames.LOGIN, { replace: true });
      })
      .catch((err) => {
        setIsLoggedIn(false);
        setToken("");
        navigate(pathNames.LOGIN, { replace: true });
      });
  };

  const handleAccountClick = () => {
    handleClose();
    navigate(pathNames.ACCOUNT);
  };

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleAccountClick}>
          {getLabel(labels.ACCOUNT)}
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>
          {getLabel(labels.LOGOUT)}
        </MenuItem>
      </Menu>
    </div>
  );
};
