import React, { useState, useEffect, useCallback } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ImageBack from "../../assets/images/about.jpeg";
import Skeleton from "@material-ui/lab/Skeleton";
import { termsURL } from "../../constants";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
import OtherTop from "../../components/common/OtherTop";
import { Zoom, Slide } from "react-reveal";

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
      cursor: "pointer",
    },
  },
  cardHover2: {
    "&:hover": {
      backgroundColor: "#eef1f6",
      color: "#ffffff",
    },
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardMed: {
    paddingTop: "40%",
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
    opacity: 0.7,
    fontSize: "10vh",
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
  textTitle: {
    fontFamily: "calibri",
  },
}));

const Policy = () => {
  const classes = useStyles();
  const [state, setState] = useState({
    data: {},
    error: null,
    loading: false,
  });

  useEffect(() => {
    document.title = "Terms | DC Miner";
    fetchTerms();
  }, []);
  const fetchTerms = useCallback(() => {
    try {
      setState({ ...state, loading: true });
      axios
        .get(termsURL)
        .then((res) => {
          setState({
            ...state,
            data: { ...res.data },
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
  }, [state]);
  const { data, loading, error } = state;

  return (
    <React.Fragment>
      <CssBaseline />
      <main width="100%">
        <OtherTop link="/terms" linkName="Terms" image={ImageBack} />
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={6} justify="center">
            <Grid item sm={12} lg={12} xs={12} md={12}>
              <Card elevation={3}>
                <CardHeader
                  title={
                    loading ? (
                      <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                      />
                    ) : (
                      <Zoom duration={500}>
                        <Typography
                          variant="h3"
                          // color="textSecondary"
                          className="text-center text-uppercase"
                          component="p"
                          style={{
                            fontFamily:
                              "'Open Sans Bold', 'Arial', 'sans-serif'",
                            fontSize: "5vw",
                          }}
                        >
                          <b>{data && data.title}</b>
                        </Typography>
                      </Zoom>
                    )
                  }
                />
                <CardContent>
                  <Typography
                    variant="body1"
                    // color="textSecondary"
                    component="div"
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
                      <Slide left duration={1000}>
                        <div>{data && ReactHtmlParser(data.details)}</div>
                      </Slide>
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
      {/* Footer */}

      {/* End footer */}
    </React.Fragment>
  );
};
export default Policy;
