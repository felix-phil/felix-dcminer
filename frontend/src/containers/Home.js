import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ImageBack2 from "../assets/images/image2.jpg";
import GroupAddRoundedIcon from "@material-ui/icons/GroupAddRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import { articleListURL } from "../constants";
import axios from "axios";
import Post from "../components/common/Post";
import HomeTop from "../components/Home/HomeTop";
import Mission from "../components/Home/Mission";
import {Zoom, LightSpeed, Fade} from 'react-reveal'

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

const Home = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    data: [],
    error: null,
    loading: false,
    next: null,
    count: null,
    prev: null,
  });
  useEffect(() => {
    document.title = 'Home | DC Miner'
  }, [])
  useEffect(() => {
    fetchArticles();
  }, []);
  const fetchArticles = useCallback(() => {
    try {
      setState({ ...state, loading: true });
      axios
        .get(articleListURL)
        .then((res) => {
          setState({
            ...state,
            data: res.data.results,
            next: res.data.next,
            prev: res.data.previous,
            count: res.data.count,
            error: null,
            loading: false,
          });
          console.log("fetch successful!");
        })
        .catch((err) => {
          setState({
            ...state,
            error: err,
            loading: false,
          });
        });
    } catch (err) {
      setState({
        ...state,
        error: "Unable to fetch data",
        loading: false,
      });
    }
  }, [state]);

  const { data, loading, prev, next, error } = state;

  return (
    <React.Fragment>
      {/* <CssBaseline /> */}
      <div>
        <main width="100%">
          {/* Carousel */}
          <Fade cascade duration={1000} count={2}>
            <HomeTop className="homeTop" />
          </Fade>
          <Mission className="mission" />
          <Fade duration={1000}>
            <div className={classes.heroContent} className="contextImage">
              <Grid container>
                <Grid
                  item
                  xs={12}
                  lg={12}
                  md={12}
                  sm={12}
                  style={{ border: "none" }}
                >
                  <Card
                    className={classes.card}
                    style={{ position: "relative" }}
                  >
                    <CardMedia
                      image={ImageBack2}
                      title="DC Miner"
                      style={{ height: "50vh" }}
                    />
                    <CardActions
                      className="mt-auto ml-auto mr-auto"
                      style={{ zIndex: "99", backgroundColor: "none" }}
                    >
                      {props.isAuthenticated ? (
                        <React.Fragment></React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Link to="/auth/login">
                            <Button
                              size="large"
                              className="mybtn text-white"
                              variant="outlined"
                              color="primary"
                              startIcon={
                                <ExitToAppRoundedIcon fontSize="large" />
                              }
                            >
                              Sign In
                            </Button>
                          </Link>
                          <Link to="/auth/register">
                            <Button
                              size="large"
                              className="mybtn"
                              variant="contained"
                              color="primary"
                              startIcon={
                                <GroupAddRoundedIcon fontSize="large" />
                              }
                            >
                              Sign Up
                            </Button>
                          </Link>
                        </React.Fragment>
                      )}
                    </CardActions>
                    <div className={classes.topCon}></div>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </Fade>

          <Container className={classes.cardGrid} maxWidth="lg">
            {data.length !== 0 ? (
              // <Zoom>
                <Post data={data} loading={loading} />
              // </Zoom>
              
            ) : (
              <center>
                <h3>No Articles found</h3>
              </center>
            )}
            <Link to="/articles" className="ml-auto mr-auto">
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "5%" }}
              >
                See more...
              </Button>
            </Link>
          </Container>
        </main>
      </div>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
});
export default connect(mapStateToProps, {})(Home);
