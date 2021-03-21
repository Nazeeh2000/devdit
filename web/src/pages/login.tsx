import React from 'react';
import { Formik, Form } from 'formik';
import Wrapper from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Flex, Link } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();

  const [, login] = useLoginMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);

          if (response.data?.login.errors) {
            console.log('error response in register user : ', response.data);
            setErrors(toErrorMap(response.data.login.errors));
            // syntax we are getting from backend [{field: 'username', message: 'something wrong'}]
            // setErrors({
            //   username: 'username already taken'
            // })
          } else if (response.data?.login.user) {
            // worked
            router.push('/');
          }
          // console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='usernameOrEmail'
              placeholder='username or email'
              label='Username or Email'
            />
            <Box mt={4}>
              <InputField
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            </Box>
            <Flex mt={2}>
            <NextLink href='/forgot-password'>
              <Link ml='auto'>forgot password</Link>
            </NextLink>
            </Flex>
            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
