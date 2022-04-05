import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import { catDetailURL } from "../../constants";
import axios from "axios";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { useAlert } from "react-alert";
import { withRouter } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import Post from "../../components/common/Post";
import ErrorPage from "../ErrorPage";
import Loading from "../../components/Loading";

// import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#2E3B55",
  },
  card: {
    display: "flex",
    border: "0.1rem solid",
    borderRadius: "0.5rem",
    borderColor: "#2E3B55",
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  paper: {
    backgroundColor: "#2E3B55",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: theme.spacing(8, 4),
    height: "70vh",
    backgroundImage: `url(${Image})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  cardHover2: {
    "&:hover": {
      backgroundColor: "#eef1f6",
      color: "#ffffff",
      // opacity: 0.7,
    },
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "#2E3B55",
  },
  button: {
    outline: null,
  },
  art: {
    textDecoration: "none",
  },
}));

function Category(props) {
  const alert = useAlert();
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
    fetchArticles(props.match.params.catID);
  }, [props.match.params.catID, props.match.params.catName]);
  const fetchArticles = useCallback(
    (id) => {
      try {
        setState({ ...state, loading: true });
        axios
          .get(catDetailURL(id))
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
    },
    [state]
  );
  useEffect(() => {
    document.title = `DC Miner | ${props.match.params.catName.replaceAll(
      "-",
      " "
    )}`;
  }, [props.match.params.catName]);
  // console.log(next)
  const handleClose = () => {
    // setLoading(false);
    setState({
      ...state,
      loading: false,
    });
  };

  const { data, loading, prev, next, error } = state;

  const fetchMore = useCallback(
    (next) => {
      try {
        setState({ ...state, loading: true });
        axios
          .get(next)
          .then((res) => {
            setState({
              ...state,
              data: [...data, ...res.data.results],
              next: res.data.next,
              prev: res.data.previous,
              count: res.data.count,
              error: null,
              loading: false,
            });
          })
          .catch((err) => {
            setState({
              ...state,
              error: err.response,
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
    },
    [state]
  );

  if (error != null) {
    alert.error("An error occured fetching data!");
  }
  if (loading) {
    return <Loading type="many" />;
  }
  if (data.length === 0 || !data) {
    return <ErrorPage />;
  }

  return (
    <React.Fragment>
      {loading ? <LinearProgress /> : <React.Fragment></React.Fragment>}
      <Container>
        <Typography align="center" variant="h3" className="text-capitalize">
          {props.match.params.catName.replaceAll("-", " ")}
        </Typography>
        {/* <Backdrop className={classes.backdrop} open={loading} onClick={handleClose}>
                    <CircularProgress color="inherit" />
                </Backdrop> */}
        {data.length !== 0 ? (
          <Post data={data} loading={loading} />
        ) : (
          <center>No data!</center>
        )}
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={6}>
            <Paper className="mt-5 mb-5">
              {next === null ? (
                <React.Fragment>
                  {/*<Button type="button" disabled>LOAD MORE</Button>*/}
                </React.Fragment>
              ) : loading ? (
                <CircularProgress color="inherit" />
              ) : (
                <Button
                  className="mybtn"
                  fullWidth
                  color="primary"
                  onClick={(nex) => {
                    fetchMore(next);
                  }}
                >
                  SEE MORE
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  // articlesUsers: state.articleUserReducer.articleList
});
export default withRouter(
  connect(null, {
    /*getArticlesUsers*/
  })(Category)
);
