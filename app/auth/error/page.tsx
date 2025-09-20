"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import Link from "next/link"

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An unexpected error occurred during authentication.",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") as keyof typeof errorMessages

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h1>
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2 text-red-600">
              <ExclamationTriangleIcon className="h-5 w-5" />
              Sign In Failed
            </CardTitle>
            <CardDescription className="text-center">
              {errorMessages[error] || errorMessages.Default}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-700">
                {error === "AccessDenied" && (
                  <p>You don't have permission to access this application. Please contact the administrator.</p>
                )}
                {error === "Configuration" && (
                  <p>There's a configuration issue. Please try again later or contact support.</p>
                )}
                {error === "Verification" && (
                  <p>The verification link has expired. Please try signing in again.</p>
                )}
                {(!error || error === "Default") && (
                  <p>Something went wrong during the authentication process. Please try again.</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  Try Again
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
