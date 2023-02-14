import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { MeDocument, MeQuery, useLogoutMutation, useMeQuery } from '../generated/graphql'

const Navbar = () => {
    const {data, loading} = useMeQuery();
    const [logout, {loading: useLogoutMutationLoading}] = useLogoutMutation();

    const logoutUser = async() => {
        await logout({update(cache, {data}){
            if(data?.logout){
                cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {me: null}
                })
            }
        }});
    }
    let body;
    if(loading){
        body = null;
    }else if(!data?.me){
        body = (<>
                <NextLink href="/Login">
                     <Link mr="2">Login </Link>
                </NextLink>
                <NextLink href="/Register">
                     <Link mr="2">Register</Link>
                </NextLink>
                
        </>)
    }else{
        body = <Button onClick={logoutUser} isLoading={useLogoutMutationLoading}>Logout</Button>
    }

  return (
    <Box bg="tan" p={4}>
        <Flex maxW={800} justifyContent="space-between" align="center" m="auto">
            <NextLink href="/">
                    <Heading>
                        Reddit
                     </Heading>
            </NextLink>
          
            <Box>
                {body}
            </Box>
        </Flex>
    </Box>
  )
}

export default Navbar