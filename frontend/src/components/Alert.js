import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Alerts extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, alert, message } = this.props;
    if (error !== prevProps.error) {
      if (error.msg.first_name)
        alert.error(`First Name: ${error.msg.first_name.join()}`);
      if (error.msg.last_name)
        alert.error(`Last Name: ${error.msg.last_name.join()}`);
      if (error.msg.email) alert.error(`Email: ${error.msg.email.join()}`);
      if (error.msg.password)
        alert.error(`Password: ${error.msg.password.join()}`);
      if (error.msg.new_password)
        alert.error(`Password: ${error.msg.new_password.join()}`);
      if (error.msg.re_new_password)
        alert.error(`Password: ${error.msg.re_new_password.join()}`);
      if (error.msg.current_password)
        alert.error(`Password: ${error.msg.current_password.join()}`);
      if (error.msg.token) alert.error(`Token: ${error.msg.token.join()}`);
      if (error.msg.uid) alert.error(`User ID: ${error.msg.uid.join()}`);
      if (error.msg.message)
        alert.error(`Message: ${error.msg.message.join()}`);
      if (error.msg.detail)
        error.msg.detail === "Given token not valid for any token type"
          ? alert.info("You have been logged out")
          : alert.error(error.msg.detail, {
              timeout: 8000,
            });
      // if (error.msg.detail)
      //     error.msg.detail == "Not found." ? console.log('Not found!') : alert.error(error.msg.detail);
      if (error.msg.new_password)
        alert.error(`Message: ${error.msg.new_password.join()}`);
      if (error.msg.username) alert.error(error.msg.username.join());
      if (error.msg.current_password)
        alert.error(error.msg.current_password.join());
      if (error.msg.non_field_errors)
        alert.error(error.msg.non_field_errors.join());
    }
    if (message !== prevProps.message) {
      // if (message.loaduser) alert.success(message.loaduser)
      // if (message.regSuccees) alert.success(message.regSuccees)
      if (message.passChangedSuc) alert.success(message.passChangedSuc);
      if (message.passChangedFail) alert.error(message.passChangedFail);
      if (message.loginError) alert.error(message.loginError);
      if (message.imageUploadSuc) alert.success(message.imageUploadSuc);
      if (message.updateUserSuc) alert.success(message.updateUserSuc);
      if (message.withdrawalApproved) alert.success(message.withdrawalApproved);
      if (message.updateUserFail) alert.error(message.updateUserFail);
      if (message.withdrawError) alert.error(message.withdrawError);
      if (message.withdrawalSuc) alert.success(message.withdrawalSuc);
    }
  }

  render() {
    return <Fragment />;
  }
}

const mapStateToProps = (state) => ({
  error: state.errorReducer,
  message: state.messageReducer,
});

export default connect(mapStateToProps)(withAlert()(Alerts));
