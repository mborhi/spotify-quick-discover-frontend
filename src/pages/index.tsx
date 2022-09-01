import React, { useEffect, useState } from 'react';
import {
  Link,
  Heading,
  HStack,
  Container,
  SimpleGrid,
  GridItem,
  Box,
  Button
} from '@chakra-ui/react';
import { withRouter, NextRouter } from 'next/router';
import Login from '../components/Login';
import { parseCookies } from '../../utils/parseCookies';
import Cookie from 'js-cookie';
import setupPlayer from '../../utils/setup-player';

interface WithRouterProps {
  router: NextRouter,
  initialLoggedIn: any,
}

const Index = ({ initialLoggedIn = false, router }: WithRouterProps) => {

  const [loggedIn, setLoggedIn] = useState(() => initialLoggedIn);

  useEffect(() => {
    const session_id = router.query.session_id;
    if (session_id !== undefined || Cookie.get('session_id') === "") {
      Cookie.set('session_id', session_id);
      setLoggedIn(true);
      router.push('/');
    }

  }, []);

  return (
    <Container>
      <SimpleGrid columns={3} spacing={4}>
        <GridItem>
          <Link href='/playlist'>
            <Box w='100%' h='100px' bg='gray.100' borderRadius='lg' as='button' >My Finds</Box>
          </Link>
        </GridItem>
        <GridItem>
          <Link href='/categories'>
            <Box w='100%' h='100px' bg='gray.100' borderRadius='lg' as='button' >Categories</Box>
          </Link>
        </GridItem>
        <GridItem>
          <Link href='/genres'>
            <Box w='100%' h='100px' bg='gray.100' borderRadius='lg' as='button' >Genres</Box>
          </Link>
        </GridItem>
      </SimpleGrid>
      {loggedIn ? <></> : <Login />}
    </Container>
  )
}

Index.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req);

  return {
    initialLoggedIn: cookies.session_id
  }

}

export default withRouter(Index)
