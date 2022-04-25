import { Alert, AlertIcon } from '@chakra-ui/react'

type AlertMessageProps = {
  message: string
}

export default function AlertMessage({ message }: AlertMessageProps) {
  return (
    <Alert status='error'>
      <AlertIcon />
      {message}
    </Alert>
  )
}
