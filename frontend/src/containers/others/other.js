<Card>
  <Grid container justify="center">
    <Grid item xs={12} md={12} lg={12} sm={12}></Grid>
  </Grid>
  <Divider />
  {userPackage === null ? (
    <>
      <Grid container>
        <Grid item xs={12} md={12} lg={12} sm={12}>
          <Card style={{ padding: 40 }} className={classes.card2}>
            <CardHeader
              title="Hey there!"
              subheader="You haven't choosen any package yet!"
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                fullWidth
                style={{
                  backgroundColor: Color.dcminer,
                  color: "white",
                }}
                onClick={() => history.push("/payment/packages")}
              >
                Choose a package to start earning
              </Button>
            </div>
          </Card>
        </Grid>
      </Grid>
    </>
  ) : (
    <React.Fragment>
      <Card style={{ padding: 40 }} className={classes.card2}>
        <CardHeader title="Amount Earned" />
        <CardContent>
          <Grid
            container
            className="mt-5"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <Grid
              item
              className="text-center text-capitalize"
              xs={6}
              sm={6}
              lg={6}
              md={6}
              style={{ flex: 1 }}
            >
              <Typography variant="h4">{state && state.comments}</Typography>
              <Typography component="p">Ads</Typography>
            </Grid>
            <Grid
              item
              className="text-center text-capitalize"
              xs={6}
              sm={6}
              lg={6}
              md={6}
              style={{ flex: 1 }}
            >
              <Typography variant="h4">
                {state && state.referrals.length}
              </Typography>
              <Typography component="p">Referrals</Typography>
            </Grid>
            <Grid
              container
              className="mt-5"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <Grid
                item
                className="text-center text-capitalize"
                xs={12}
                sm={12}
                lg={12}
                md={12}
                style={{ flex: 1 }}
              >
                <Typography variant="h2">
                  <del style={{ textDecorationStyle: "double" }}>N</del>
                </Typography>
                <Typography variant="h3">
                  {amount.toLocaleString("en-US")}
                </Typography>
                <Typography component="p">Total</Typography>
              </Grid>
              <Button
                style={{
                  backgroundColor: Color.dcminer,
                  color: "white",
                }}
                fullWidth
              >
                Withdraw
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Divider />
      <Card style={{ padding: 40 }} className={classes.card2}>
        <Grid item xs={12} md={12} lg={12} sm={12}>
          <Referrals referrals={state.referrals} />
        </Grid>
      </Card>
    </React.Fragment>
  )}
</Card>;
