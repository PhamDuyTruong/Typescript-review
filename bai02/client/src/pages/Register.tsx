import { Box, Button, FormControl, Spinner } from "@chakra-ui/react";
import { Formik, Form, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import {MeDocument, MeQuery, RegisterInput, useRegisterMutation} from '../generated/graphql'
import { mapFieldError } from "../helpers/mapFieldErrors";
import { useChekAuth } from "../utils/useCheckAuth";

const Register = () => {
    const router = useRouter();
    const {data: authData, loading: authLoading} = useChekAuth();

    const initialValues: RegisterInput = { username: "", email: "", password: "" }

    const [registerUser, {loading: _registerUserLoading, data, error}] = useRegisterMutation()

    const handleRegisterSubmit = async (values: RegisterInput, {setErrors}: FormikHelpers<RegisterInput>) => {
        const response = await registerUser({
            variables: {
                registerInput: values
            },
            update(cache, {data}){
              if(data?.register.success){
                  cache.writeQuery<MeQuery>({
                      query: MeDocument,
                      data: {me: data.register.user}
                  })
              }
          }
        })
        if(response.data?.register.errors){
           setErrors(mapFieldError(response.data.register.errors))
        }else if(response.data?.register.user){
          router.push('/');
        }
    }
    if(authLoading || (!authLoading && authData?.me)){
      return <Spinner />
  }
  return (
      <Wrapper>
        {error && <p>Failed to register</p>}
        {data && data.register.success ? <p>Registered successfully {JSON.stringify(data)}</p> : null}
        <Formik
        initialValues={initialValues}
        onSubmit={handleRegisterSubmit}
      >
        {({isSubmitting}) => (
          <Form>
            <FormControl isInvalid={!!error}>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
                type="text"
              ></InputField>
               <Box mt="4">
                <InputField
                    name="email"
                    placeholder="email"
                    label="Email"
                    type="text"
                ></InputField>
               </Box>
               <Box mt="4">
                <InputField
                    name="password"
                    placeholder="password"
                    label="Password"
                    type="password"
                ></InputField>
               </Box>
              
              <Button type="submit" colorScheme='teal' mt="4" isLoading={isSubmitting}>
                   Register
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
      </Wrapper>
     
  );
};

export default Register;
