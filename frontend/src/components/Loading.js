import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Skeleton from "@material-ui/lab/Skeleton";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Card, CardContent, CardHeader, makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 345,
    margin: theme.spacing(2),
  },
  media: {
    height: 190,
  },
}));
const LoadingCard = () => {
  const classes = useStyles;
  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Skeleton animation="wave" variant="circle" width={40} height={40} />
        }
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      <Skeleton
        animation="wave"
        variant="rect"
        className={classes.media}
        height={200}
      />

      <CardContent>
        <React.Fragment>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </React.Fragment>
      </CardContent>
    </Card>
  );
};
const Loading = (props) => {
  if (props.type && props.type === "many") {
    return (
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {["1", "2", "3"].map((item) => (
            <Grid item xs={12} lg={4} md={4} sm={12} key={item}>
              <LoadingCard />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }
  if (props.type && props.type === "single") {
    return (
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7} md={9} sm={10}>
            <LoadingCard />
          </Grid>
        </Grid>
      </Container>
    );
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6} md={6} sm={12}>
            <Skeleton animation="wave" height={500} />
          </Grid>
          <Grid item xs={12} lg={6} md={6} sm={12}>
            <Skeleton animation="wave" height={500} />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Loading;
