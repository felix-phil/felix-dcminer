import React from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Container,
  makeStyles,
  Typography,
  Grid,
} from "@material-ui/core";
import VisibilityRoundedIcon from "@material-ui/icons/VisibilityRounded";
import AssignmentTurnedInRoundedIcon from "@material-ui/icons/AssignmentTurnedInRounded";
import FastForwardRoundedIcon from "@material-ui/icons/FastForwardRounded";
import { Slide, Zoom } from "react-reveal";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  avatar: {
    backgroundColor: " #121721",
    width: "12vh",
    height: "12vh",
  },
  avatarIcon: {
    width: "5vh",
    height: "5vh",
  },
  heroContent: {
    backgroundColor: "#e6e6e6",
    // padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardHover: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      backgroundColor: "#2E3B55",
      color: "#ffffff",
      // opacity: 0.7,
    },
  },
  cardHover2: {
    "&:hover": {
      backgroundColor: "#eef1f6",
      color: "#ffffff",
      // opacity: 0.7,
    },
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardMed: {
    paddingTop: "60%",
    backgroundColor: "#2E3B55",
    zIndex: theme.zIndex.card + 1,
  },
  cardContent: {
    flexGrow: 1,
  },
  topCon: {
    position: "absolute",
    zIndex: theme.zIndex.cardContent + 1,
    color: "white",
    // top: 'auto',
    // bottom: 'auto',
    left: "50%",
    width: "100%",
    height: "100%",
    paddingRight: "50%",
    paddingLeft: "50%",
    // paddingTop: '50%',
    paddingBottom: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#2E3B55",
    opacity: 0.4,
    fontSize: "10vw",
    // fontFamily: "Times New Roman",
  },
  card2: {
    display: "flex",
    border: "0.1rem solid",
    borderRadius: "0.5rem",
    borderColor: "#2E3B55",
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia2: {
    width: 160,
  },
  art: {
    textDecoration: "none",
  },
  avatar2: {
    backgroundColor: "#2E3B55",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
}));

const Mission = (props) => {
  const classes = useStyles();
  return (
    <Container className={classes.cardGrid} maxWidth="md">
      <Grid container spacing={4} justify="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.cardHover}>
            <CardHeader
              style={{
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: "5%",
                // icon: "4rem",
              }}
              avatar={
                <Zoom>
                  <Avatar aria-label="about" className={classes.avatar}>
                    <VisibilityRoundedIcon className={classes.avatarIcon} />
                  </Avatar>
                </Zoom>
              }
            />
            <Slide left duration={1000}>
              <CardContent className={classes.cardContent}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  className="text-center"
                >
                  Our Vision
                </Typography>
                <Typography className="text-center">
                  Showing the world especially Africans what the future holds in
                  places of finances, business and Information Technologies
                </Typography>
              </CardContent>
            </Slide>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.cardHover}>
            <CardHeader
              style={{
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: "5%",
                icon: "4rem",
              }}
              avatar={
                <Zoom>
                  <Avatar aria-label="about" className={classes.avatar}>
                    <AssignmentTurnedInRoundedIcon
                      className={classes.avatarIcon}
                    />
                  </Avatar>
                </Zoom>
              }
            />
            <Slide up duration={1000}>
              <CardContent className={classes.cardContent}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  className="text-center"
                >
                  Our Mission
                </Typography>
                <Typography className="text-center">
                  Help people raise capitals to start and also sustain their
                  business even while learning!
                </Typography>
              </CardContent>
            </Slide>
          </Card>
        </Grid>
        <Grid item xs={12} sm={9} md={4}>
          <Card className={classes.cardHover}>
            <CardHeader
              style={{
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: "5%",
                icon: "4rem",
              }}
              avatar={
                <Zoom>
                  <Avatar aria-label="about" className={classes.avatar}>
                    <FastForwardRoundedIcon className={classes.avatarIcon} />
                  </Avatar>
                </Zoom>
              }
            />
            <Slide right duration={1000}>
              <CardContent className={classes.cardContent}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  className="text-center"
                >
                  Our Purpose
                </Typography>
                <Typography className="text-center">
                  To help you raise daily upkeep money while also learning.
                </Typography>
              </CardContent>
            </Slide>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Mission;
