'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, XCircle } from 'lucide-react'

export default function DatabaseConnectionCheck() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const checkConnection = async () => {
    setConnectionStatus('loading')
    try {
      const response = await fetch('/api/check-connection')
      const data = await response.json()
      if (data.status === 'success') {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('error')
      }
      setMessage(data.message)
    } catch (error) {
      setConnectionStatus('error')
      setMessage('An error occurred while checking the connection')
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={checkConnection} disabled={connectionStatus === 'loading'}>
        {connectionStatus === 'loading' ? 'Checking...' : 'Check Database Connection'}
      </Button>
      {connectionStatus !== 'idle' && (
        <Alert variant={connectionStatus === 'success' ? 'default' : 'destructive'}>
          {connectionStatus === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {connectionStatus === 'success' ? 'Connection Successful' : 'Connection Failed'}
          </AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}