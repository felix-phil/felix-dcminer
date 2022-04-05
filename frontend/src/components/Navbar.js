import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import clsx from "clsx";
import { connect } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import { logout } from "../actions/authActions";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Collapse, Menu, MenuItem, Slide } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import DirectionsRunRoundedIcon from "@material-ui/icons/DirectionsRunRounded";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Tooltip from "@material-ui/core/Tooltip";
import MoreIcon from "@material-ui/icons/MoreVert";
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";
import AssignmentIcon from "@material-ui/icons/Assignment";
import InfoIcon from "@material-ui/icons/Info";
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import axios from "axios";
import { adminUrl, catListURL, subcatListURL } from "../constants";
import DescriptionIcon from "@material-ui/icons/Description";
import Avatar from "@material-ui/core/Avatar";
import Hidden from "@material-ui/core/Hidden";
import { Alert as MuiAlert, AlertTitle } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import Color from "../constants/Color";
import TelegramIcon from "@material-ui/icons/Telegram";
import SupervisorAccountRoundedIcon from "@material-ui/icons/SupervisorAccountRounded";
import Footer from "./Footer";
import { CategorySharp } from "@material-ui/icons";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  textIcon: {
    color: "#2E3B55",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#2E3B55",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    // marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(1) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(0.5) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(1),
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  paydialog: {
    position: "fixed",
    zIndex: theme.zIndex.appBar + theme.zIndex.drawer,
    width: "100%",
    height: "10vh",
    bottom: 0,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-around",
  },
}));

const Navbar = ({
  logout,
  isAuthenticated,
  user,
  perm,
  children,
  userImage,
  userPackage,
  upgradeAble,
}) => {
  const ibRef = useRef();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElCat, setAnchorElCat] = React.useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const openCat = Boolean(anchorElCat);
  const [openPayDialog, setOpenPayDialog] = useState(true);
  const logoutFunc = () => {
    logout();
    setRedirect(true);
  };
  const handleClickCat = (event) => {
    setAnchorElCat(event.currentTarget);
  };

  const handleCloseCat = () => {
    setAnchorElCat(null);
  };
  const [anchorElSub, setAnchorElSub] = React.useState(null);
  const openSub = Boolean(anchorElSub);
  const handleClickSub = (event) => {
    setAnchorElSub(event.currentTarget);
  };

  const handleCloseSub = () => {
    setAnchorElSub(null);
  };
  //Mbres
  const [anchorEla, setAnchorEla] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEla);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [upgradeStatus, setUpgradeStatus] = useState(false);
  const [openD, setOpenD] = useState(false);
  const [openDr, setOpenDr] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [search, setSearch] = useState("");

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDrawerOpen = () => {
    setOpenDr(true);
  };
  const handleDrawerClose = () => {
    setOpenDr(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickOpen = () => {
    setOpenD(true);
  };
  const handleClickClose = () => {
    setOpenD(false);
  };
  //MobileRes
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEla(null);
    handleMobileMenuClose();
  };
  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      history.push(`/search/${search.replaceAll(" ", "+")}`);
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const classes = useStyles();
  const [catsub, setCatsub] = useState({
    optionCat: [],
    loading: false,
    error: null,
  });
  const [catsubs, setCatsubs] = useState({
    optionSub: [],
    loading2: false,
    error2: null,
  });
  //DSMENU
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEla}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );
  //MB Menu
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      getContentAnchorEl={null}
    >
      <Link
        to="/"
        style={{ textDecorationLine: "none", textDecorationColor: null }}
        color="inherit"
      >
        <MenuItem className={classes.textIcon}>
          <ListItemIcon>
            <HomeRoundedIcon />
          </ListItemIcon>
          Home
        </MenuItem>
      </Link>
      <Link
        to="/articles"
        style={{ textDecorationLine: "none", textDecorationColor: "inherit" }}
      >
        <MenuItem className={classes.textIcon}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          Articles
        </MenuItem>
      </Link>
      <Link
        to="/about"
        style={{ textDecorationLine: "none", textDecorationColor: null }}
        color="inherit"
      >
        <MenuItem className={classes.textIcon}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          About Us
        </MenuItem>
      </Link>
      <Link
        to="/contact"
        style={{ textDecorationLine: "none", textDecorationColor: null }}
        color="inherit"
      >
        <MenuItem className={classes.textIcon}>
          <ListItemIcon>
            <PermContactCalendarIcon />
          </ListItemIcon>
          Contact Us
        </MenuItem>
      </Link>
    </Menu>
  );
  useEffect(() => {
    fetchCats();
    fetchSubs();
    userImage && setImageFile(userImage.image);
  }, [userImage]);
  // console.log(checkUpgradeStatus());
  const fetchCats = useCallback(() => {
    try {
      setCatsub({ ...catsub, loading: true });
      axios
        .get(catListURL)
        .then((res) => {
          setCatsub({
            ...catsub,
            optionCat: res.data,
            error: null,
            loading: false,
          });
          // console.log(res.data)
        })
        .catch((err) => {
          setCatsub({
            ...catsub,
            error: err,
            loading: false,
          });
        });
    } catch (err) {
      setCatsub({
        ...catsub,
        error: "Unable to fetch data",
        loading: false,
      });
    }
  }, [catsub]);
  const fetchSubs = useCallback(() => {
    try {
      setCatsubs({ ...catsubs, loading2: true });
      axios
        .get(subcatListURL)
        .then((res) => {
          setCatsubs({
            ...catsub,
            optionSub: res.data,
            error2: null,
            loading2: false,
          });
          // console.log(res.data)
        })
        .catch((err) => {
          setCatsub({
            ...catsubs,
            error2: err,
            loading2: false,
          });
        });
    } catch (err) {
      setCatsubs({
        ...catsubs,
        error2: "Unable to fetch data",
        loading2: false,
      });
    }
  }, [catsubs]);
  const authLinks = () => (
    <Fragment>
      <Tooltip
        title={
          isAuthenticated &&
          user &&
          `${user.first_name} ${user.last_name} \n (${user.email})`
        }
        placement="bottom"
      >
        <IconButton
          aria-label="account of current user"
          aria-controls={ibRef}
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          className="mybtn"
        >
          <Avatar src={imageFile}></Avatar>
          {/* <AccountCircle /> */}
        </IconButton>
      </Tooltip>
      <Menu
        ref={ibRef}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={open}
        onClose={handleClose}
        getContentAnchorEl={null}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            history.push("/dashboard/index");
          }}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          Account
        </MenuItem>
        {upgradeAble ? (
          <MenuItem
            onClick={() => {
              handleClose();
              history.push("/payment/packages/upgrade");
            }}
          >
            <ListItemIcon>
              <TelegramIcon />
            </ListItemIcon>
            Upgrade ?
          </MenuItem>
        ) : (
          <div></div>
        )}
        {perm && perm.is_staff ? (
          <MenuItem
            onClick={() => {
              handleClose();
              window.open(adminUrl);
            }}
          >
            <ListItemIcon>
              <SupervisorAccountRoundedIcon />
            </ListItemIcon>
            Management
          </MenuItem>
        ) : (
          <div></div>
        )}
        {perm && perm.is_staff && perm.is_superuser ? (
          <MenuItem
            onClick={() => {
              handleClose();
              history.push("/management/withdrawals");
            }}
          >
            <ListItemIcon>
              <CategorySharp />
            </ListItemIcon>
            Admin Withdrawal Management
          </MenuItem>
        ) : (
          <div></div>
        )}
        <MenuItem
          onClick={() => {
            handleClose();
            handleClickOpen();
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <DirectionsRunRoundedIcon />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </Fragment>
  );
  const guestLinks = () => (
    <Fragment>
      <Link to="/auth/login">
        <Button size="medium" color="primary" className="mybtn text-white">
          Sign in
        </Button>
      </Link>
    </Fragment>
  );
  const { optionCat, error, loading } = catsub;
  const { optionSub, error2, loading2 } = catsubs;
  return (
    <React.Fragment>
      {(isAuthenticated && userPackage) === null ? (
        <Collapse in={openPayDialog}>
          <MuiAlert
            severity="info"
            style={{ marginTop: "5%" }}
            className={classes.paydialog}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                className="mybtn"
                onClick={() => setOpenPayDialog(false)}
              >
                <CloseIcon />
              </IconButton>
            }
          >
            Welcome! Please choose a package to get started.
            <Button
              variant="contained"
              style={{ backgroundColor: Color.dcminer, color: "white" }}
              className="mybtn"
              onClick={() => history.push("/payment/packages")}
            >
              Get Started
            </Button>
          </MuiAlert>
        </Collapse>
      ) : (
        <React.Fragment></React.Fragment>
      )}
      <div className={classes.root}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openDr,
          })}
        >
          <Toolbar>
            <Fragment>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="end"
                className={
                  clsx(classes.menuButton, {
                    [classes.hide]: openDr,
                  }) + " mybtn"
                }
              >
                <MenuIcon />
              </IconButton>
            </Fragment>
            <Typography
              className={classes.title + " text-uppercase"}
              variant="h5"
              noWrap
            >
              <Link to="/">
                <Typography className="text-light">DC Miner</Typography>
              </Link>
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                value={search}
                onChange={(e) => onSearchChange(e)}
                inputProps={{ "aria-label": "search" }}
                onKeyDown={handleSearch}
              />
            </div>
            <div className={classes.sectionDesktop}>
              <Tooltip title="Read Articles" placement="bottom" arrow>
                <Link
                  to="/articles"
                  style={{
                    textDecorationLine: "none",
                    textDecorationColor: "inherit",
                  }}
                >
                  <IconButton
                    color="primary"
                    className="mybtn text-white"
                    fontSize="xl"
                  >
                    <AssignmentIcon />
                  </IconButton>
                </Link>
              </Tooltip>

              <Tooltip title="About us" placement="bottom" arrow>
                <Link
                  to="/about"
                  style={{
                    textDecorationLine: "none",
                    textDecorationColor: "inherit",
                  }}
                >
                  <IconButton color="primary" className="mybtn text-white">
                    <InfoIcon />
                  </IconButton>
                </Link>
              </Tooltip>
              <Tooltip title="Contact us" placement="bottom" arrow>
                <Link
                  to="/contact"
                  style={{
                    textDecorationLine: "none",
                    textDecorationColor: "inherit",
                  }}
                >
                  <IconButton color="primary" className="mybtn text-white">
                    <PermContactCalendarIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                className="mybtn"
              >
                <MoreIcon />
              </IconButton>
            </div>
            {isAuthenticated ? authLinks() : guestLinks()}
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        <Drawer
          variant="permanent"
          transitionDuration={5000}
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: openDr,
            [classes.drawerClose]: !openDr,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: openDr,
              [classes.drawerClose]: !openDr,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose} className="mybtn">
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />

          {isAuthenticated ? (
            <React.Fragment>
              <List>
                <ListItem
                  button
                  onClick={() => history.push("/dashboard/index")}
                >
                  <ListItemIcon>
                    <DashboardRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Dashboard"} />
                </ListItem>
              </List>
              <Divider />
            </React.Fragment>
          ) : (
            <React.Fragment></React.Fragment>
          )}
          <List>
            <ListItem>
              <Hidden xsDown>
                <strong>
                  <ListItemText primary={"Articles"} />
                </strong>
              </Hidden>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleClickCat}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary={"Categories"} />
            </ListItem>
            <Menu
              id="long-menu1"
              anchorEl={anchorElCat}
              keepMounted
              open={openCat}
              onClose={handleCloseCat}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: "20ch",
                },
              }}
            >
              {optionCat &&
                optionCat.map((option) => (
                  <Link
                    key={option.id}
                    to={`/articles/category/${option.id}/${option.name.replace(
                      " ",
                      "-"
                    )}`}
                  >
                    <MenuItem onClick={handleCloseCat}>{option.name}</MenuItem>
                  </Link>
                ))}
            </Menu>
            <ListItem button onClick={handleClickSub}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary={"Subcategories"} />
            </ListItem>
            <Menu
              id="long-menu"
              anchorEl={anchorElSub}
              keepMounted
              open={openSub}
              onClose={handleCloseSub}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: "20ch",
                },
              }}
            >
              {optionSub &&
                optionSub.map((option) => (
                  <Link
                    key={option.id}
                    to={`/articles/subcategory/${
                      option.id
                    }/${option.name.replace(" ", "-")}`}
                  >
                    <MenuItem onClick={handleCloseSub}>{option.name}</MenuItem>
                  </Link>
                ))}
            </Menu>
          </List>
          <Divider />
          <List>
            <Hidden xsDown>
              <ListItem>
                <strong>
                  <ListItemText primary={"DC Miner"} />
                </strong>
              </ListItem>
            </Hidden>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={() => history.push("/about")}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary={"About Us"} />
            </ListItem>
            <ListItem button onClick={() => history.push("/contact")}>
              <ListItemIcon>
                <PermContactCalendarIcon />
              </ListItemIcon>
              <ListItemText primary={"Contact Us"} />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>

        <Dialog
          fullScreen={fullScreen}
          open={openD}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Sign Out?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to sign out of this device?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleClickClose}
              color="secondary"
              className="mybtn"
            >
              No
            </Button>
            <Button
              onClick={() => {
                handleClickClose();
                logoutFunc();
              }}
              color="primary"
              className="mybtn"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Footer />
      {redirect ? <Redirect to="/" /> : <Fragment></Fragment>}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  perm: state.authReducer.permissions,
  userImage: state.authReducer.userImage,
  userPackage: state.authReducer.package,
  upgradeAble: state.authReducer.upgradeAble,
});
export default connect(mapStateToProps, { logout })(Navbar);
