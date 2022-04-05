import React from "react";
import {
  Container,
  Grid,
  Typography,
  makeStyles,
  Box,
} from "@material-ui/core";
import { Fade, Slide } from "react-reveal";
import { Link } from "react-router-dom";

import BugReportRoundedIcon from "@material-ui/icons/BugReportRounded";
function Copyright() {
  return (
    <Typography
      variant="body2"
      style={{ color: "white" }}
      color="textSecondary"
      align="center"
    >
      {"Copyright © "}
      <Link color="inherit" to="/">
        DC Miner
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const useStyles = makeStyles((theme) => ({
  footer: {
    // bottom: 0,
    backgroundColor: "#2E3B55",
    color: "white",
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  const footers = [
    {
      title: "DC Miner",
      description: [{ name: "About Us", link: "/about", isExternal: false }],
    },

    {
      title: "Support",
      description: [
        {
          name: process.env.REACT_APP_SUPPORT_MAIL,
          link: `mailto:${process.env.REACT_APP_SUPPORT_MAIL}`,
          isExternal: true,
        },
        { name: "Contact us", link: "/contact", isExternal: false },
        // { name: "Contact us", link: "/contact", isExternal: false },
      ],
    },
    {
      title: "Legal",
      description: [
        { name: "Privacy Policy", link: "/policy", isExternal: false },
        { name: "Terms of Use", link: "/terms", isExternal: false },
      ],
    },
  ];
  return (
    <Container maxWidth="xl" component="footer" className={classes.footer}>
      <Grid container spacing={4} justify="space-evenly">
        {footers.map((footer) => (
          <Grid item xs={6} sm={3} key={footer.title}>
            <Typography
              variant="h6"
              color="textPrimary"
              style={{ color: "white" }}
              gutterBottom
            >
              {footer.title}
            </Typography>
            <Fade duration={1000}>
              <ul>
                {footer.description.map((item) => (
                  <li key={item.name}>
                    {item.isExternal ? (
                      <a
                        href={item.link}
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: "white" }}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        to={item.link}
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: "white" }}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </Fade>
          </Grid>
        ))}
      </Grid>
      <Slide up duration={1000}>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Slide>
      <Box>
        <small className="ml-auto">
          <BugReportRoundedIcon />{" "}
          <a href="mailto:www.felix4real98@gmail.com">Report Error</a>
        </small>
      </Box>
    </Container>
  );
};

export default Footer;
