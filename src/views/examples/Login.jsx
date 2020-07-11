import React, { useContext } from "react";
import Joi from "@hapi/joi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import {
  Button,
  Card,
  // CardHeader,
  CardBody,
  FormGroup,
  FormText,
  Input,
  Form,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const Login = () => {
  const { login, isRequestLogin, isLoginError } = useContext(AuthenticationContext);

  const { errors, register, handleSubmit } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),    
    criteriaMode: "firstErrorDetected",    
  });

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with credentials</small>
            </div>
            <Form role="form" onSubmit={handleSubmit(data => login(data))}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <input
                    class="form-control"
                    placeholder="Email"
                    name="email"
                    type="email"
                    autoComplete="new-email"
                    ref={register}
                  />                  
                </InputGroup>                
                {errors.email && errors.email.message && (
                  <div className="alert alert-danger">{errors.email.message}</div>
                )}
              </FormGroup>

              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <input
                    class="form-control"
                    placeholder="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    ref={register}
                  />                  
                </InputGroup>                
                {errors.password && errors.password.message && (
                  <div className="alert alert-danger">{errors.password.message}</div>
                )}
              </FormGroup>
            
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  {isRequestLogin ? 'Please wait' : 'Sign in'}                  
                </Button>                
                {isLoginError && 
                  <div className="alert alert-danger">Invalid email or password</div>
                }
              </div>
            </Form>
          </CardBody>
        </Card>      
      </Col>
    </>
  );
};

export default Login;

