import React from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import { Zoom, Fade } from "react-reveal";

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

String.prototype.replaceAll = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};

const Post = (props) => {
  const classes = useStyles();
  return (
    <Grid container spacing={6}>
      {props.data &&
        props.data.map((art: any, index: any) => (
          <Grid item xs={12} md={6} sm={6} lg={4} className="mt-5" key={art.id}>
            <Zoom duration={500}>
              <Card key={index} elevation={6} className={classes.cardHover2}>
                <Link
                  to={`/article/read/${art.id}/${art.title
                    .replaceAll(" ", "-")
                    .toLowerCase()}`}
                  className={classes.art}
                  style={{ textDecorationLine: "none" }}
                >
                  <CardHeader
                    avatar={
                      props.loading ? (
                        <Skeleton
                          animation="wave"
                          variant="circle"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <Avatar
                          aria-label="recipe"
                          className={classes.avatar}
                          src={art.author.avatar}
                        />
                      )
                    }
                    title={
                      props.loading ? (
                        <Skeleton
                          animation="wave"
                          height={10}
                          width="80%"
                          style={{ marginBottom: 6 }}
                        />
                      ) : (
                        art.author.first_name + " " + art.author.last_name
                      )
                    }
                    subheader={
                      props.loading ? (
                        <Skeleton
                          animation="wave"
                          height={10}
                          width="80%"
                          style={{ marginBottom: 6 }}
                        />
                      ) : (
                        new Date(Date.parse(art.date_created)).toUTCString()
                      )
                    }
                  />
                  {props.loading ? (
                    <Skeleton
                      animation="wave"
                      variant="rect"
                      className={classes.media}
                    />
                  ) : (
                    <Fade duration={1000}>
                      <CardMedia
                        className={classes.media}
                        image={art.article_image}
                        title={art.title}
                      />
                    </Fade>
                  )}
                  <CardContent>
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      style={{ height: "10vh", maxHeigh: "15vh" }}
                    >
                      {props.loading ? (
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
                        art.title
                      )}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button fullWidth className="mybtn">
                      Read More...
                    </Button>
                  </CardActions>
                </Link>
              </Card>
            </Zoom>
          </Grid>
        ))}
    </Grid>
  );
};

export default Post;
