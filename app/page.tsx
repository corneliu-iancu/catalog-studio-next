import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Restaurant Menu Studio
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Create and manage beautiful digital menus for your restaurant
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Get Started</CardTitle>
              <CardDescription className="text-center">
                Sign in to start managing your restaurant menu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  Sign In to Dashboard
                </Link>
              </Button>
              
              <div className="text-center text-sm text-gray-600 space-y-1">
                <p className="font-semibold">Demo Account:</p>
                <p>Email: admin@restaurant.com</p>
                <p>Password: password123</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center">
                  <h3 className="font-semibold">Easy Menu Management</h3>
                  <p className="text-sm text-gray-600">
                    Add, edit, and organize your menu items with ease
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">Category Organization</h3>
                  <p className="text-sm text-gray-600">
                    Group your items into logical categories
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">Public Menu Display</h3>
                  <p className="text-sm text-gray-600">
                    Beautiful public-facing menu for your customers
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">Responsive Design</h3>
                  <p className="text-sm text-gray-600">
                    Works perfectly on all devices
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
