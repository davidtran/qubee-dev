import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

import { AuthenticationContext } from "../../contexts/AuthenticationContext";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  name: yup.string().required(),
  agreement: yup.bool().oneOf([true], 'You must agree with our Privacy Policy').required(),
});

const Register = () => {
  const { register: registerAccount, isRegisterError, isRequestRegister } = useContext(
    AuthenticationContext
  );
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
    resolver: yupResolver(schema),
    criteriaMode: "firstErrorDetected",
  });
  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign up with credentials</small>
            </div>
            <Form role="form" onSubmit={handleSubmit(registerAccount)}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <input
                    className="form-control"
                    placeholder="Name"
                    type="text"
                    name="name"
                    ref={register}
                  />
                </InputGroup>
                {errors.name && (
                  <div className="alert alert-danger">
                    {errors.name.message}
                  </div>
                )}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <input
                    className="form-control"
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    name="email"
                    ref={register}
                  />
                </InputGroup>
                {errors.email && (
                  <div className="alert alert-danger">
                    {errors.email.message}
                  </div>
                )}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <input
                    className="form-control"
                    placeholder="Password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    ref={register}
                  />
                </InputGroup>
                {errors.password && (
                  <div className="alert alert-danger">
                    {errors.password.message}
                  </div>
                )}
              </FormGroup>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                      name="agreement"
                      ref={register}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                  {errors.agreement && (
                    <div className="alert alert-danger">
                      {errors.agreement.message}
                    </div>
                  )}
                </Col>
              </Row>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  {isRequestRegister ? "Please wait" : "Create account"}
                </Button>
                {isRegisterError && (
                  <div className="alert alert-danger">
                    Error while create new user account
                  </div>
                )}
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
