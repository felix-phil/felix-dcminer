import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  makeStyles,
  Paper,
  Grid,
  Typography,
  Hidden,
} from "@material-ui/core";
import ImageBack from "../../assets/images/home.jpg";
import Carousel from "react-material-ui-carousel";
import ArrowRightAltRoundedIcon from "@material-ui/icons/ArrowRightAltRounded";
import KeyboardBackspaceRoundedIcon from "@material-ui/icons/KeyboardBackspaceRounded";
import Color from "../../constants/Color";
import Slide from "react-reveal/Slide";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "40%", // 16:9
  },
  card: {
    position: "relative",
    backgroundColor: "#2E3B55",
  },
  overlay: {
    position: "absolute",
    top: "70%",
    left: "20px",
    color: "white",
    // textAlign: "center",
    // justifyContent: "flex-end",
  },
  overlay2: {
    position: "absolute",
    top: "40px",
    left: "40px",
    color: "white",
    // textAlign: "center",
    // justifyContent: "flex-end",
  },
  text: {
    color: Color.dcminer,
    fontFamily: "Calibri",
    fontSize: "10vw",
    textAlign: "center",
  },
  dc: {
    color: '#0099ff'
  }
}));

const Item = (props) => {
  const classes = useStyles();
  return (
    <div>
      <Slide>
        <Typography compnent="h1" variant="h4" style={{ color: "#0099ff" }}>
          <b>{props.item.title.toUpperCase()}</b>
        </Typography>
      </Slide>
      <Typography compnent="h6" variant="h6"  style={{ color: "white" }}>
        <small style={{ lineHeight: 1 }}>
          {props.item.description}
        </small>
      </Typography>
    </div>
  );
};

const HomeTop = () => {
  const classes = useStyles();
  var items = [
    {
      title: "Vision",
      description:
        "Showing the world especially Africans what the future holds inplaces of finances, business and Information Technologies",
    },
    {
      title: "Mission",
      description:
        "Help people raise capitals to start and also sustain their business even while learning!",
    },
    {
      title: "Purpose",
      description: "To help you raise daily upkeep money while also learning.",
    },
  ];
  return (
    <Paper>
      <Card className={classes.card} style={{ backgroundColor: Color.dcminer }}>
        <CardMedia image={ImageBack} className={classes.media} />
        <Hidden smDown>
        <div className={classes.overlay}>
          <Slide top duration={3000}>
            <Typography component="h1" style={{ fontSize: "10vh" }}>
              <div className="typing">
                DC
                <span>
                {" "} MINER
                </span>
              </div>
              <div className="crow">|</div>
            </Typography>
          </Slide>
        </div>
        </Hidden>
        <div className={classes.overlay2}>
          <Carousel
            NextIcon={<ArrowRightAltRoundedIcon />}
            PrevIcon={<KeyboardBackspaceRoundedIcon />}
            navButtonsProps={{
              style: {
                backgroundColor: Color.dcminer,
                borderRadius: 0,
              },
            }}
            activeIndicatorIconButtonProps={{
              style: {
                display: "none",
              },
            }}
            indicatorContainerProps={{
              style: {
                display: "none"
              }
            }}
            interval={4000}
            animation="fade"
            timeout={1000}
          >
            {items.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        </div>
      </Card>
    </Paper>
  );
};

export default HomeTop;
