import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, Redirect, useLocation, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useAlert } from "react-alert";
import {
  articleDetail,
  articleComment,
  submitNewComment,
  subcatDetailURL,
  deleteCommentURL,
} from "../../constants";
import axios from "axios";
import Skeleton from "@material-ui/lab/Skeleton";
import ReactHtmlParser from "react-html-parser";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AccountCircle from "@material-ui/icons/AccountCircle";
import InsertCommentRoundedIcon from "@material-ui/icons/InsertCommentRounded";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ReplyAllRoundedIcon from "@material-ui/icons/ReplyAllRounded";
import { Menu, MenuItem } from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import { Zoom, Fade, Slide } from "react-reveal";

import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterIcon,
  TwitterShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import Divider from "@material-ui/core/Divider";
import HelmetMetaData from "../../hocs/Helmet";
import Hidden from "@material-ui/core/Hidden";
import CardActionArea from "@material-ui/core/CardActionArea";
import LinearProgress from "@material-ui/core/LinearProgress";
import Color from "../../constants/Color";
import ConfirmDialog from "../../components/ConfirmDialog";
import EditCommentDialog from "../../components/EditComment";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import ErrorPage from "../ErrorPage";
import Loading from "../../components/Loading";

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
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
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
  reply: {
    marginLeft: "auto",
  },
  card2: {
    display: "flex",
    maxHeight: "40vh",
  },
  cardDetails2: {
    flex: 1,
  },
  cardMedia2: {
    width: 140,
  },
}));

const Read = (props) => {
  const cumRef = React.useRef(null);
  const alert = useAlert();
  const ibRef = useRef();
  const topRef = useRef();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const [reply, setReply] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const location = useLocation();
  const history = useHistory();
  const [myLoading, setMyLoading] = useState(false);
  const [presentCommentID, setPresentCommentID] = useState(null);
  const [presentComment, setPresentComment] = useState(null);
  const [confirmDialog, setConfirmdialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);

  const [state, setState] = useState({
    selectedArticle: [],
    loading: false,
    error: null,
  });
  const [related, setRelated] = useState({
    data: [],
    isLoading: false,
    isError: null,
  });
  const openDialog = () => {
    setConfirmdialog(true);
  };
  const closeDialog = () => {
    setConfirmdialog(false);
  };
  const openEditDialog = () => {
    setEditDialog(true);
  };
  const closeEditDialog = () => {
    setEditDialog(false);
  };
  const deleComment = useCallback((cId) => {
    if (localStorage.getItem("access")) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
          // Accept: "application/json",
        },
      };
      try {
        setMyLoading(true);
        axios
          .delete(deleteCommentURL(cId), config)
          .then((res) => {
            fetchArticleComments(props.match.params.aid);
            setMyLoading(false);
            alert.success("Delete Successful!");
          })
          .catch((err) => {
            err && alert.error("Something went wrong");
            setMyLoading(false);
          });
      } catch (err) {
        alert.error("Something went wrong");
        setMyLoading(false);
      }
    } else {
      alert.error("Authentication not provided!");
    }
  }, []);
  const [comment, setComment] = useState({
    comments: [],
    cloading: false,
    cerror: null,
    next: null,
    prev: null,
    count: null,
  });
  const handleExpandClick = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);
  const handleShareMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseShare = () => {
    setAnchorEl(null);
  };
  const handleFormChange = useCallback(
    (e) => {
      setNewComment(e.target.value);
    },
    [newComment]
  );
  const scrollToComment = () => {
    cumRef.current.scrollIntoView();
  };
  const fetchSelectedArticle = useCallback(
    (aid) => {
      try {
        setState({ ...state, loading: true });
        axios
          .get(articleDetail(parseInt(aid)))
          .then((res) => {
            setState({
              ...state,
              selectedArticle: res.data,
              loading: false,
              error: null,
            });
            fetchRelated(parseInt(res.data.subcategory.id));
          })
          .catch((err) => {
            setState({ ...state, loading: false, error: err });
          });
      } catch (err) {
        setState({ ...state, loading: false, error: "Unable to fetch data!" });
      }
    },
    [state]
  );
  const fetchArticleComments = useCallback(
    (aid) => {
      try {
        setComment({ ...comment, cloading: true });
        axios
          .get(articleComment(parseInt(aid)))
          .then((res) => {
            setComment({
              ...comment,
              comments: res.data.results,
              cloading: false,
              next: res.data.next,
              count: res.data.count,
            });
          })
          .catch((err) => {
            setComment({ ...comment, cloading: false, cerror: err });
          });
      } catch (err) {
        setComment({
          ...comment,
          cloading: false,
          cerror: "Unable to fetch comments",
        });
      }
    },
    [comment]
  );

  const [expandedR, setExpandedR] = React.useState(null);

  const handleExpandRClick = useCallback(
    (index) => {
      if (expandedR === index) {
        setExpandedR(null);
      } else {
        setExpandedR(index);
      }
    },
    [expandedR]
  );
  const handleReplyChange = useCallback(
    (e, index) => {
      setReply({ ...reply, [index]: e.target.value });
    },
    [reply]
  );
  const submitReply = useCallback(
    (e, Comindex, aid) => {
      e.preventDefault();
      //   console.log(
      //     `ParentId: ${Comindex}, ArticleId: ${aid}, Reply: ${reply[Comindex]}`
      //   );
      if (localStorage.getItem("access") && props.isAuthenticated) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("access")}`,
            Accept: "application/json",
          },
        };
        const body = JSON.stringify({
          comment: reply[Comindex],
          article: aid,
          parent: Comindex,
        });
        try {
          setMyLoading(true);
          axios
            .post(submitNewComment, body, config)
            .then((res) => {
              fetchArticleComments(props.match.params.aid);
              setReply({ ...reply, [Comindex]: "" });
              setMyLoading(false);
            })
            .catch((err) => {
              err && error.response.status === 401 ? (
                <Redirect to="/auth/login" />
              ) : (
                <React.Fragment></React.Fragment>
              );
              err && alert.error("Something went wrong");
              setMyLoading(false);
            });
        } catch (err) {
          alert.error("Something went wrong");
          setMyLoading(false);
        }
      }
    },
    [reply]
  );
  const { selectedArticle, loading, error } = state;

  const { comments, cloading, cerror, next, prev, count } = comment;
  const fetchMoreComments = useCallback(
    (next) => {
      try {
        setComment({ ...comment, cloading: true });
        axios
          .get(next)
          .then((res) => {
            setComment({
              ...comment,
              comments: [...comments, ...res.data.results],
              cloading: false,
              next: res.data.next,
              count: res.data.count,
            });
          })
          .catch((err) => {
            setComment({ ...comment, cloading: false, cerror: err });
          });
      } catch (err) {
        setComment({
          ...comment,
          cloading: false,
          cerror: "Unable to load comments",
        });
      }
    },
    [comment]
  );
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (localStorage.getItem("access") && props.isAuthenticated) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
          Accept: "application/json",
        },
      };
      const body = JSON.stringify({
        comment: newComment,
        article: selectedArticle.id,
      });
      try {
        setMyLoading(true);
        axios
          .post(submitNewComment, body, config)
          .then((res) => {
            // console.log(res);
            fetchArticleComments(props.match.params.aid);
            setNewComment("");
            setMyLoading(false);
          })
          .catch((err) => {
            err && alert.error(err.response.data);
            // console.log(err)
            setMyLoading(false);
          });
      } catch (err) {
        alert.error("Something went wrong!");
        setMyLoading(false);
      }
    }
  };

  const { data, isLoading, isError } = related;
  const open = Boolean(anchorEl);
  const handleRedirect = () => {
    history.push(`/auth/login?redirectTo=${location.pathname}`);
  };
  const back = (e) => {
    e.stopPropagation();
    history.goBack();
  };
  useEffect(() => {
    document.title = `${props.match.params.title.replaceAll(
      "-",
      " "
    )} | DC Miner`;
    fetchSelectedArticle(props.match.params.aid);
    fetchArticleComments(props.match.params.aid);
    topRef && topRef.current && topRef.current.scrollIntoView();
    // if (selectedArticle !== undefined && selectedArticle.subcategory.id !== null) {
    // }
  }, [props.match.params.aid, props.match.params.title]);

  // console.log(selectedArticle.id)
  const fetchRelated = useCallback(
    (theId) => {
      try {
        setRelated({ ...related, isLoading: true });
        axios
          .get(subcatDetailURL(theId))
          .then((res) => {
            setRelated({
              ...related,
              data: res.data.results,
              isError: null,
              isLoading: false,
            });
          })
          .catch((err) => {
            setRelated({
              ...related,
              isError: err,
              isLoading: false,
            });
          });
      } catch (err) {
        setRelated({
          ...related,
          isError: "Unable to fetch data",
          isLoading: false,
        });
      }
    },
    [related]
  );
  if (error) {
    alert.error("Unable to fetch data!");
  }
  const post = () => (
    <Grid item xs={12} md={8} lg={7} className="mt-5">
      <Typography elevation={8}>
        <IconButton className="mybtn" onClick={back} title="Go back">
          <ChevronLeftIcon />
        </IconButton>
      </Typography>
      <Card elevation={6}>
        <CardHeader
          avatar={
            loading ? (
              <Skeleton
                animation="wave"
                variant="circle"
                width={40}
                height={40}
              />
            ) : (
              <Fade duration={200}>
                <Avatar
                  aria-label={selectedArticle.author.first_name}
                  className={classes.avatar}
                  src={selectedArticle.author.avatar}
                />
              </Fade>
            )
          }
          title={
            loading ? (
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{ marginBottom: 6 }}
              />
            ) : (
              <Zoom duration={5000}>
                {selectedArticle.author.first_name +
                  " " +
                  selectedArticle.author.last_name}
              </Zoom>
            )
          }
          subheader={
            loading ? (
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{ marginBottom: 6 }}
              />
            ) : (
              new Date(Date.parse(selectedArticle.date_created)).toUTCString()
            )
          }
        />
        <CardContent>
          {loading ? (
            <React.Fragment>
              <Skeleton
                animation="wave"
                height={10}
                style={{ marginBottom: 6 }}
              />
              <Skeleton animation="wave" height={10} width="80%" />
              <Skeleton
                animation="wave"
                height={10}
                style={{ marginBottom: 6 }}
              />
              <Skeleton animation="wave" height={10} width="80%" />
              <Skeleton animation="wave" height={10} width="80%" />
              <Skeleton
                animation="wave"
                height={10}
                style={{ marginBottom: 6 }}
              />
            </React.Fragment>
          ) : (
            <Zoom duration={500}>
              <Typography color="textSecondary" variant="h5" component="div">
                {selectedArticle.title}
              </Typography>
            </Zoom>
          )}
        </CardContent>
        {loading ? (
          <Skeleton animation="wave" variant="rect" className={classes.media} />
        ) : (
          <Zoom duration={700}>
            <CardMedia
              className={classes.media}
              image={selectedArticle.article_image}
              title={selectedArticle.title}
            />
          </Zoom>
        )}
        <Divider className="mt-5" />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography
              component="div"
              style={{
                display: "flex",
                justifyContent: "center",
                flex: 1,
                flexDirection: "column",
              }}
            >
              {loading ? (
                <React.Fragment>
                  <Skeleton
                    animation="wave"
                    height={10}
                    style={{ marginBottom: 6 }}
                  />
                  <Skeleton animation="wave" height={10} width="80%" />
                  <Skeleton
                    animation="wave"
                    height={10}
                    style={{ marginBottom: 6 }}
                  />
                </React.Fragment>
              ) : (
                <Slide left duration={500}>
                  <div>{ReactHtmlParser(selectedArticle.body)}</div>
                </Slide>
              )}
            </Typography>
          </CardContent>
        </Collapse>
        <CardActions disableSpacing>
          <IconButton className="mybtn" onClick={scrollToComment}>
            <InsertCommentRoundedIcon />
          </IconButton>
          <IconButton
            className={
              clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              }) + " mybtn"
            }
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            title="Continue Reading"
          >
            <ExpandMoreIcon />
          </IconButton>

          <IconButton
            aria-label="share"
            className="mybtn"
            style={{ marginLeft: "auto" }}
            title="Share"
            aria-controls={ibRef}
            aria-haspopup="true"
            onClick={(e) => handleShareMenu(e)}
            color="inherit"
            className="mybtn"
          >
            <ShareIcon />
          </IconButton>
          <Menu
            ref={ibRef}
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
            open={open}
            onClose={handleCloseShare}
            getContentAnchorEl={null}
          >
            <MenuItem
              // onClick={() => {
              //   handleCloseShare();
              // }}
              component="div"
              alignItems="center"
            >
              <FacebookShareButton
                url={document.baseURI}
                quote={"DC Miner - " + selectedArticle.title}
                className="mybtn"
              >
                <FacebookIcon size={36} round={true} />
              </FacebookShareButton>
              <WhatsappShareButton
                url={document.baseURI}
                title={"DC Miner - " + selectedArticle.title}
                separator=" :: "
                className="mybtn"
              >
                <WhatsappIcon size={36} round={true} />
              </WhatsappShareButton>
              <TwitterShareButton
                url={document.baseURI}
                title={"DC Miner - " + selectedArticle.title}
                className="mybtn"
              >
                <TwitterIcon size={36} round={true} />
              </TwitterShareButton>
              <LinkedinShareButton
                url={document.baseURI}
                title={"DC Miner - " + selectedArticle.title}
                className="mybtn"
              >
                <LinkedinIcon size={36} round={true} />
              </LinkedinShareButton>
              <EmailShareButton
                subject={selectedArticle.title}
                body={selectedArticle.title}
                url={document.baseURI}
                separator={", "}
                className="mybtn"
              >
                <EmailIcon size={36} round={true} />
              </EmailShareButton>
            </MenuItem>
          </Menu>
        </CardActions>
      </Card>
    </Grid>
  );
  if (loading) {
    return <Loading type="single" />;
  }
  return (
    <React.Fragment>
      {loading ? <LinearProgress /> : <React.Fragment></React.Fragment>}
      <Container maxWidth="xl" ref={topRef}>
        {/* <HelmetMetaData quote={selectedArticle.title}
                title={selectedArticle.title}
                image={selectedArticle.article_image}
                description={selectedArticle.title}
            >
            </HelmetMetaData> */}
        <Grid container spacing={3}>
          {selectedArticle.length !== 0 ? post() : <ErrorPage />}
          <Divider orientation="vertical" flexItem />

          <Grid item xs={12} md={3} lg={4} className="mt-5">
            <Typography variant="h4" align="center">
              Related
            </Typography>
            {data.slice(0, 5).map((relate) => (
              <div key={relate.id}>
                {relate.id !== parseInt(props.match.params.aid) ? (
                  <Slide right duration={500}>
                    <CardActionArea className="mt-3">
                      <Link
                        to={`/article/read/${
                          relate.id
                        }/${relate.title.replaceAll(" ", "-").toLowerCase()}`}
                        className={classes.art}
                        style={{ textDecorationLine: "none" }}
                        onClick={() => topRef.current.scrollIntoView()}
                      >
                        <Card className={classes.card2}>
                          <div className={classes.cardDetails2}>
                            <CardContent>
                              <h6 variant="h6">
                                {isLoading ? (
                                  <Skeleton
                                    animation="wave"
                                    height={10}
                                    width="80%"
                                  />
                                ) : (
                                  relate.title
                                )}
                              </h6>
                              <Typography
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                {isLoading ? (
                                  <Skeleton
                                    animation="wave"
                                    height={10}
                                    width="80%"
                                    style={{ marginBottom: 6 }}
                                  />
                                ) : (
                                  new Date(
                                    Date.parse(relate.date_created)
                                  ).toUTCString()
                                )}
                              </Typography>
                              <Typography variant="subtitle1" color="primary">
                                Continue reading...
                              </Typography>
                            </CardContent>
                          </div>
                          <Hidden xsDown>
                            {isLoading ? (
                              <Skeleton
                                animation="wave"
                                variant="rect"
                                className={classes.cardMedia2}
                              />
                            ) : (
                              <CardMedia
                                className={classes.cardMedia2}
                                image={relate.article_image}
                                title={selectedArticle.title}
                              />
                            )}
                          </Hidden>
                        </Card>
                      </Link>
                    </CardActionArea>
                  </Slide>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </Grid>
        </Grid>

        <hr style={{ marginTop: "5rem" }} />

        {/* Comments */}

        <Grid container spacing={6}>
          {comments.length !== 0 ? (
            comments.map((com, index) => (
              <Grid item xs={12} md={8} lg={7} key={com.id}>
                <Slide duration={700} left>
                  <Paper elevation={6}>
                    <Card>
                      <CardHeader
                        avatar={
                          loading ? (
                            <Skeleton
                              animation="wave"
                              variant="circle"
                              width={40}
                              height={40}
                            />
                          ) : (
                            <Avatar
                              aria-label=""
                              className={classes.avatar}
                              src={com.user_avatar}
                            />
                          )
                        }
                        title={
                          loading ? (
                            <Skeleton
                              animation="wave"
                              height={10}
                              width="80%"
                              style={{ marginBottom: 6 }}
                            />
                          ) : com.user_name == "" ? (
                            "User"
                          ) : (
                            com.user_name
                          )
                        }
                        subheader={
                          loading ? (
                            <Skeleton
                              animation="wave"
                              height={10}
                              width="80%"
                              style={{ marginBottom: 6 }}
                            />
                          ) : (
                            new Date(Date.parse(com.submit_date)).toUTCString()
                          )
                        }
                      />
                      <CardContent>
                        {loading ? (
                          <React.Fragment>
                            <Skeleton
                              animation="wave"
                              height={10}
                              style={{ marginBottom: 6 }}
                            />
                            <Skeleton
                              animation="wave"
                              height={10}
                              width="80%"
                            />
                          </React.Fragment>
                        ) : (
                          <Typography color="textSecondary" component="h6">
                            {com.comment}
                          </Typography>
                        )}
                      </CardContent>

                      <div>
                        {props.isAuthenticated ? (
                          // <CardContent>
                          <Grid
                            container
                            spacing={4}
                            style={{ marginRight: "auto", marginLeft: "auto" }}
                          >
                            <Grid item xs={11} lg={11} md={11} sm={11}>
                              <form
                                onSubmit={(e, Comindex, aid) =>
                                  submitReply(e, com.id, selectedArticle.id)
                                }
                                className={classes.reply}
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-around",
                                }}
                              >
                                <TextField
                                  variant="outlined"
                                  id={`reply${com.id}`}
                                  label={`Reply ${com.user_name}`}
                                  multiline
                                  name={`reply${com.id}`}
                                  rowsMax={2}
                                  style={{ borderRadius: 50 }}
                                  value={reply[com.id]}
                                  fullWidth
                                  required
                                  onChange={(e) => handleReplyChange(e, com.id)}
                                  style={{ flex: 1 }}
                                />
                                {/* </Grid> */}
                                {/* <Grid item xs={2}> */}
                                <Button
                                  type="submit"
                                  // variant="contained"
                                  style={{
                                    background: "none",
                                    color: "#2E3B55",
                                  }}
                                  className="mybtn"
                                  disabled={myLoading}
                                >
                                  {myLoading ? "..." : <SendRoundedIcon />}
                                </Button>
                              </form>
                            </Grid>
                          </Grid>
                        ) : (
                          // </CardContent>
                          <React.Fragment></React.Fragment>
                        )}
                        <CardActions>
                          <Grid container>
                            <Grid item sm={12}>
                              <div
                                className="ml-auto"
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                {/* <Typography> */}
                                {com.children && com.children.length > 0 ? (
                                  <Typography>
                                    <ReplyAllRoundedIcon /> &nbsp;
                                    <b>{com.children.length}</b>{" "}
                                    {com.children.length > 1
                                      ? "replies"
                                      : "reply"}
                                  </Typography>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )}
                                {props.user && props.user.id === com.user_id ? (
                                  <div className="ml-auto mr-auto">
                                    <IconButton
                                      title="Delete"
                                      className="mybtn"
                                      color="secondary"
                                      onClick={() => {
                                        setPresentCommentID(com.id);
                                        openDialog();
                                      }}
                                    >
                                      <DeleteRoundedIcon />
                                    </IconButton>
                                    <IconButton
                                      title="Edit Comment"
                                      className="mybtn"
                                      color="primary"
                                      onClick={() => {
                                        setPresentCommentID(com.id);
                                        setPresentComment(com.comment);
                                        openEditDialog();
                                      }}
                                    >
                                      <EditRoundedIcon />
                                    </IconButton>
                                  </div>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )}
                                {com.children && com.children.length > 0 ? (
                                  <Button
                                    aria-label="Show Replies"
                                    title="Replies"
                                    key={index}
                                    onClick={() => handleExpandRClick(index)}
                                    aria-expanded={expandedR}
                                    aria-label="show more"
                                    color="primary"
                                    className="mybtn ml-auto"
                                  >
                                    SHOW REPLIES
                                    <ExpandMoreIcon />
                                  </Button>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )}
                                {/* </Typography> */}
                              </div>
                            </Grid>
                          </Grid>
                        </CardActions>
                      </div>
                    </Card>
                  </Paper>
                </Slide>
                <Grid item xs={10} lg={10} md={10} className="ml-auto">
                  <Collapse
                    in={index === expandedR}
                    timeout="auto"
                    unmountOnExit
                  >
                    {com.children &&
                      com.children.map((child) => (
                        <Slide top duration={500}>
                          <Card
                            style={{ marginTop: "2%", borderRadius: 20 }}
                            color="secondary"
                            elevation={4}
                            key={child.id}
                          >
                            <CardHeader
                              avatar={
                                loading ? (
                                  <Skeleton
                                    animation="wave"
                                    variant="circle"
                                    width={40}
                                    height={40}
                                  />
                                ) : (
                                  <Avatar
                                    aria-label=""
                                    className={classes.avatar}
                                    src={child.user_avatar}
                                  />
                                )
                              }
                              title={
                                loading ? (
                                  <Skeleton
                                    animation="wave"
                                    height={10}
                                    width="80%"
                                    style={{ marginBottom: 6 }}
                                  />
                                ) : (
                                  child.user_name
                                )
                              }
                              subheader={
                                loading ? (
                                  <Skeleton
                                    animation="wave"
                                    height={10}
                                    width="80%"
                                    style={{ marginBottom: 6 }}
                                  />
                                ) : (
                                  new Date(
                                    Date.parse(child.submit_date)
                                  ).toUTCString()
                                )
                              }
                              className="mr-auto"
                            />
                            <CardContent>
                              {loading ? (
                                <React.Fragment>
                                  <Skeleton
                                    animation="wave"
                                    height={10}
                                    style={{ marginBottom: 6 }}
                                  />
                                  <Skeleton
                                    animation="wave"
                                    height={10}
                                    width="80%"
                                  />
                                </React.Fragment>
                              ) : (
                                <Typography
                                  color="textSecondary"
                                  component="h6"
                                >
                                  {child.comment}
                                </Typography>
                              )}
                            </CardContent>
                            <CardActions>
                              {props.user && props.user.id === child.user_id ? (
                                <div className="ml-auto mr-auto">
                                  <IconButton
                                    title="Delete"
                                    className="mybtn"
                                    color="secondary"
                                    onClick={() => {
                                      setPresentCommentID(child.id);
                                      openDialog();
                                    }}
                                  >
                                    <DeleteRoundedIcon />
                                  </IconButton>
                                  <IconButton
                                    title="Edit Reply"
                                    className="mybtn"
                                    color="primary"
                                    onClick={() => {
                                      setPresentCommentID(child.id);
                                      setPresentComment(child.comment);
                                      openEditDialog();
                                    }}
                                  >
                                    <EditRoundedIcon />
                                  </IconButton>
                                </div>
                              ) : (
                                <React.Fragment></React.Fragment>
                              )}
                            </CardActions>
                          </Card>
                        </Slide>
                      ))}
                  </Collapse>
                </Grid>
              </Grid>
            ))
          ) : (
            <Paper elevation={6}>
              <Typography className="text-center">No comments</Typography>
            </Paper>
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
                    {/*<Button type="button" disabled>SEE MORE COMMENTS</Button>*/}
                  </React.Fragment>
                ) : cloading ? (
                  <CircularProgress color="inherit" />
                ) : (
                  <Button
                    className="mybtn"
                    fullWidth
                    color="primary"
                    onClick={() => {
                      fetchMoreComments(next);
                    }}
                  >
                    SEE MORE COMMENTS
                  </Button>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <hr style={{ marginTop: "5rem" }} />
        <Grid container ref={cumRef}>
          <Grid item xs={12} md={9} lg={7}>
            {props.isAuthenticated ? (
              <form onSubmit={handleCommentSubmit}>
                <Slide duration={500} left>
                <TextField
                  variant="filled"
                  margin="normal"
                  required
                  fullWidth
                  multiline
                  rowsMax={3}
                  id="comment"
                  label="Leave a comment"
                  name="comment"
                  value={newComment}
                  onChange={handleFormChange}
                />
                </Slide>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{ backgroundColor: "#2E3B55", color: "white" }}
                  className={classes.submit}
                  disabled={myLoading}
                >
                  {myLoading ? "..." : "Submit"}
                </Button>
              </form>
            ) : (
              <Paper
                elevation={6}
                style={{
                  height: "10vh",
                  paddingRight: "auto",
                  paddingLeft: "auto",
                }}
              >
                <Typography variant="h6" className="text-center">
                  You need to sign in to leave a comment!
                  <Button
                    fullWidth
                    style={{ backgroundColor: Color.dcminer, color: "white" }}
                    onClick={handleRedirect}
                  >
                    Sign in
                  </Button>
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
      <ConfirmDialog
        openDialog={confirmDialog}
        dialogTitle="Delete Comment"
        dialogText="Are you sure you want to delete this comment ?"
        handleClose={closeDialog}
        confirmExecution={deleComment.bind(this, presentCommentID)}
      />
      <EditCommentDialog
        openDialog={editDialog}
        dialogTitle="Edit Comment"
        handleClose={closeEditDialog}
        comment={presentComment}
        id={presentCommentID}
        reload={() => fetchArticleComments(selectedArticle.id)}
      />
    </React.Fragment>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
});
export default connect(mapStateToProps, {})(Read);
