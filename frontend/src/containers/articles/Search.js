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
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import ShareIcon from "@material-ui/icons/Share";
import ThumbDownAltOutlinedIcon from "@material-ui/icons/ThumbDownAltOutlined";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import { searchURL } from "../../constants";
import axios from "axios";
import Skeleton from "@material-ui/lab/Skeleton";
import InsertCommentRoundedIcon from "@material-ui/icons/InsertCommentRounded";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { useAlert } from "react-alert";
import { withRouter } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import LinearProgress from "@material-ui/core/LinearProgress";
import Color from "../../constants/Color";
import Post from "../../components/common/Post";
import ErrorPage from "../ErrorPage";
import Loading from "../../components/Loading";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#2E3B55",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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
  formGrid: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-end",
  },
}));

function Search(props) {
  const alert = useAlert();
  const classes = useStyles();
  const [orderBy, setOrderBy] = useState("date_created");
  const [asc, setAsc] = useState("-");
  const [state, setState] = useState({
    data: [],
    error: null,
    loading: false,
    next: null,
    count: null,
    prev: null,
  });
  useEffect(() => {
    // console.log(props.match.params.search)
    fetchArticles(props.match.params.search, asc + orderBy);
  }, [props.match.params.search, asc, orderBy]);
  useEffect(() => {
    document.title = "DC Miner | Search";
  }, []);
  const fetchArticles = useCallback(
    (searchText, ordering) => {
      try {
        setState({ ...state, loading: true });
        axios
          .get(searchURL(searchText, ordering))
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

  // console.log(next)

  const handleChange = (e) => {
    setOrderBy(e.target.value);
    // console.log(orderBy)
  };
  const handleChange2 = (e) => {
    setAsc(e.target.value);
    // console.log(orderBy)
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
      <Container maxWidth="lg">
        <Grid container justify="flex-end">
          <Grid item lg={3} xs={12} sm={6} md={4}>
            <div className={classes.formGrid}>
              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="demo-simple-select-filled-label">
                  Order
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={orderBy}
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"date_created"}>Date Posted</MenuItem>
                  <MenuItem value={"title"}>Article Title</MenuItem>
                  <MenuItem value={"body"}>Article Body</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="demo-simple-select-filled-label1">
                  By
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label1"
                  id="demo-simple-select-filled1"
                  value={asc}
                  onChange={(e) => handleChange2(e)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="+">Ascending</MenuItem>
                  <MenuItem value="-">Descending</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Grid>
        </Grid>
        {data.length !== 0 ? (
          <Post loading={loading} data={data} />
        ) : (
          <center>No data Found!</center>
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
                <React.Fragment></React.Fragment>
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
export default connect(null, {
  /*getArticlesUsers*/
})(Search);
