import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface IWrapperProps{
    children: ReactNode
}

const Wrapper = ({children}: IWrapperProps) => {
  return (
    <Box maxW="800px" w="100%" mt="8" mx="auto">{children}</Box>
  )
}

export default Wrapper