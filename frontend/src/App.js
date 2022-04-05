import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Activate from "./containers/auth/Activate";
import Login from "./containers/auth/Login";
import Register from "./containers/auth/Register";
import ResetPassword from "./containers/auth/ResetPassword";
import ResetPasswordConfirm from "./containers/auth/ResetPasswordConfirm";
import Home from "./containers/Home";
import Page404 from "./containers/Page404";
import Layout from "./hocs/Layout";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import Alerts from "./components/Alert";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import PrivateRoute from "./components/common/PrivateRoute";
import Dashboard from "./containers/others/Dashboard";
import Navbar from "./components/Navbar";
import Articles from "./containers/articles/Articles";
import Category from "./containers/articles/Category";
import Subacategory from "./containers/articles/Subcategory";
import Read from "./containers/articles/Read";
import About from "./containers/others/About";
import Contact from "./containers/others/Contact";
import Search from "./containers/articles/Search";

// import PropTypes from 'prop-types'
import "./assets/css/main.css";
import HelmetMetaData from "./hocs/Helmet";
import Packages from "./containers/payment/Packages";
import Checkout from "./containers/payment/Checkout";
import Upgrade from "./containers/payment/Upgrade";
import UpgradeCheckout from "./containers/payment/UpgradeCheckout";
import AdminRoute from "./components/common/AdminRoute";
import Withdrawals from "./containers/payment/Withdrawals";
import Terms from "./containers/others/Terms";
import Policy from "./containers/others/Policy";
import GoogleOAuth from "./containers/auth/GoogleOAuth";
import ErrorPage from "./containers/ErrorPage";
import Loading from "./components/Loading";

const alertOpions = {
  timeout: 6000,
  position: "top center",
  offset: "10px",
  containerStyle: {
    zIndex: 100000000,
  },
};

const App = () => {
  return (
    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...alertOpions}>
        <Router>
          {/* <HelmetMetaData></HelmetMetaData> */}
          <Layout>
            <Navbar>
              <Alerts />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/auth/Oauth" component={GoogleOAuth} />
                <Route exact path="/articles" component={Articles} />
                <Route
                  exact
                  path="/articles/category/:catID/:catName"
                  component={Category}
                />
                <Route
                  exact
                  path="/articles/subcategory/:subcatID/:subcatName"
                  component={Subacategory}
                />
                <Route exact path="/search/:search?" component={Search} />
                <Route
                  exact
                  path="/article/read/:aid/:title"
                  component={Read}
                />
                <Route
                  exact
                  path="/activate/:uid/:token"
                  component={Activate}
                />
                <Route exact path="/auth/login" component={Login} />
                <Route exact path="/auth/register/:ref?" component={Register} />
                <Route
                  exact
                  path="/auth/password/reset"
                  component={ResetPassword}
                />
                <Route exact path="/about" component={About} />
                <Route exact path="/contact" component={Contact} />
                <Route exact path="/policy" component={Policy} />
                <Route exact path="/terms" component={Terms} />

                <Route
                  exact
                  path="/password/reset/confirm/:uid/:token"
                  component={ResetPasswordConfirm}
                />
                <PrivateRoute
                  exact
                  path="/dashboard/index"
                  component={Dashboard}
                />

                <PrivateRoute
                  exact
                  path="/payment/packages"
                  component={Packages}
                />

                <PrivateRoute
                  exact
                  path="/payment/packages/upgrade"
                  component={Upgrade}
                />

                <PrivateRoute
                  exact
                  path="/payment/checkout/:tier"
                  component={Checkout}
                />

                <PrivateRoute
                  exact
                  path="/payment/upgrade/checkout/:tier"
                  component={UpgradeCheckout}
                />
                <AdminRoute
                  exact
                  path="/management/withdrawals"
                  component={Withdrawals}
                />
                <Route component={Page404} />
              </Switch>
            </Navbar>
          </Layout>
        </Router>
      </AlertProvider>
    </Provider>
  );
};

export default App;
