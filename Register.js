import React from 'react'
import { useState } from 'react';
import { UNSET_ERRORS } from '../actions/constants'
import { useDispatch, useSelector } from "react-redux";
import { setError } from '../actions/auth';
import { disableOTPmodal, enableOTPmodal } from '../actions/otpModal'
import Axios from 'axios';


export const useRegisterForm = (callback, userType, initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const error = useSelector(state => state.auth.error);
  const modal = useSelector(state => state.otpModal.modal);
  const [formError, setFormError] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", passcode: "" })
  const dispatch = useDispatch();
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onChange = (event) => {
    dispatch({ type: UNSET_ERRORS });
    const { name, value } = event.target;
    let formErrors = { ...formError };
    switch (name) {
      case "name":
        formErrors.name = value.length < 6 ? "Minimum 6 characters required for Name" : '';
        break;
      case "email":
        formErrors.email = re.test(String(value).toLowerCase()) ? "" : 'Enter a valid Email';
        break;
      case "phone":
        formErrors.phone = value.length <= 0
          ? "Phone Number Required"
          : value.length < 10
            ? "Maximum 10 characters allowed for a phone number"
            : "";
        break;
      case "password":
        formErrors.password = value.length < 6 ? "Minimum 6 characters required for Password" : '';
        break;
      case "passcode":
        formErrors.passcode = '';
        break;
      case "confirmPassword":
        formErrors.confirmPassword = value !== values.password ? 'Passwords do not match' : '';
        break;
      default:
        break;
    }
    setFormError(formErrors)
    setValues({ ...values, [name]: value });
  };

  const formValid = (formError, values) => {
    let valid = true;
    // validate form errors being empty
    Object.values(formError).forEach(val => {
      val.length > 0 && (valid = false);
    });
    // validate the form was filled out
    Object.values(values).forEach(val => {
      val === null && (valid = false);
    });
    return valid;
  };

  const onSubmit = (event) => {
    dispatch({ type: UNSET_ERRORS });
    if(event) {
        event.preventDefault();
    }
    
    values.userType = userType;
    console.log("values ======>", values);
    if (formValid(formError, values) &&  values.password != "" && values.confirmPassword != "" 
      &&  values.password === values.confirmPassword && values.email !== '' && values.phone !== '') {
      dispatch(callback(values)).then((data) => {
        dispatch(enableOTPmodal(!!data));
      });
    }
    else {
      dispatch(setError("passwords doesn't match"));
      let formErrors = { ...formError };
      if(values.name == "") {
        formErrors.name = values.name.length < 6 ? "Minimum 6 characters required for Name" : '';
      }

      if(values.email == "") {
        formErrors.email = re.test(String(values.email).toLowerCase()) ? "" : 'Enter a valid Email';
      }

      if(values.phone == "") {
        formErrors.phone = values.phone.length <= 0
        ? "Phone Number Required"
        : values.phone.length < 10
          ? "Maximum 10 characters allowed for a phone number"
          : "";
      }

      if(values.password == "") {
        formErrors.password = values.password.length < 6 ? "Minimum 6 characters required for Password" : '';
      }
      setFormError(formErrors)
    }
  }

  return {
    onChange,
    onSubmit,
    values,
    error,
    formError,
    modal
  };
};


export const useForm = (callback, userType, initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const modal = useSelector(state => state.otpModal.modal);
  const error = useSelector(state => state.auth.error)
  const dispatch = useDispatch();

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const onSubmit = (event) => {
    dispatch({ type: UNSET_ERRORS });
    event.preventDefault();
    // values.userType = userType;
    dispatch(callback(values)).then((data) => {
      console.log(data)
      dispatch(disableOTPmodal(!!data));
    });

  };

  return {
    onChange,
    onSubmit,
    values,
    error,
    modal
  };
};


export const useProfile = (callback, logo, initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const error = useSelector(state => state.auth.error)
  const dispatch = useDispatch();

  const onChange = (event, result) => {
    console.log(event, result);
    dispatch({ type: UNSET_ERRORS });
    const { name, value } = result || event.target;
    if (name === 'linkedIn') {
      setValues({ ...values, url: { linkedIn: value }});
      return;
    }
    setValues({ ...values, [name]: value });
  };

  const updateValue = (object) => {
    console.log("========", object)
    setValues(object)
  }

  const onSubmit = (event) => {
    dispatch({ type: UNSET_ERRORS });
    event.preventDefault();

    if (!!logo) {
      dispatch(callback({ ...values, logo })).then(console.log);
    } else {
      dispatch(callback(values)).then(console.log);
    }
  };

  return {
    onChange,
    onSubmit,
    values,
    updateValue,
    error,
  };
};
