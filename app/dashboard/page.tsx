import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { 
  FileTextIcon, 
  PlusIcon, 
  MixerHorizontalIcon, 
  PersonIcon, 
  DashboardIcon 
} from "@radix-ui/react-icons"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="restaurant-gradient rounded-2xl p-8 text-primary-foreground shadow-lg">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back!</h1>
            <p className="text-xl text-primary-foreground/90">
              {session.user.name || session.user.email}
            </p>
            <p className="text-primary-foreground/80 mt-2">
              Ready to manage your delicious menu items?
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="food-card border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileTextIcon className="h-4 w-4 text-primary" />
                </div>
                Menu Items
              </CardTitle>
              <CardDescription>
                Delicious dishes in your menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">0</div>
              <p className="text-sm text-muted-foreground mb-4">
                Total items ready to serve
              </p>
              <Button className="w-full shadow-sm hover:shadow-md transition-shadow" variant="outline">
                Manage Items
              </Button>
            </CardContent>
          </Card>

          <Card className="food-card border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <MixerHorizontalIcon className="h-4 w-4 text-success" />
                </div>
                Categories
              </CardTitle>
              <CardDescription>
                Organized menu sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success mb-2">0</div>
              <p className="text-sm text-muted-foreground mb-4">
                Menu categories created
              </p>
              <Button className="w-full shadow-sm hover:shadow-md transition-shadow" variant="outline">
                Manage Categories
              </Button>
            </CardContent>
          </Card>

          <Card className="food-card border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <PersonIcon className="h-4 w-4 text-warning" />
                </div>
                Public Menu
              </CardTitle>
              <CardDescription>
                Customer-facing menu display
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 bg-success rounded-full"></div>
                <span className="text-2xl font-bold text-success">Live</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your menu is published and ready
              </p>
              <Button className="w-full shadow-sm hover:shadow-md transition-shadow" variant="outline">
                View Public Menu
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="food-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>
              Jump straight into managing your restaurant menu
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="justify-start h-auto p-4 food-card border shadow-sm hover:shadow-md" variant="ghost">
              <div className="flex flex-col items-start w-full">
                <PlusIcon className="h-5 w-5 text-primary mb-2" />
                <span className="font-medium">Add New Item</span>
                <span className="text-xs text-muted-foreground">Create menu item</span>
              </div>
            </Button>
            <Button className="justify-start h-auto p-4 food-card border shadow-sm hover:shadow-md" variant="ghost">
              <div className="flex flex-col items-start w-full">
                <MixerHorizontalIcon className="h-5 w-5 text-success mb-2" />
                <span className="font-medium">Create Category</span>
                <span className="text-xs text-muted-foreground">Organize menu</span>
              </div>
            </Button>
            <Button className="justify-start h-auto p-4 food-card border shadow-sm hover:shadow-md" variant="ghost">
              <div className="flex flex-col items-start w-full">
                <FileTextIcon className="h-5 w-5 text-warning mb-2" />
                <span className="font-medium">Upload Images</span>
                <span className="text-xs text-muted-foreground">Add photos</span>
              </div>
            </Button>
            <Button className="justify-start h-auto p-4 food-card border shadow-sm hover:shadow-md" variant="ghost">
              <div className="flex flex-col items-start w-full">
                <DashboardIcon className="h-5 w-5 text-muted-foreground mb-2" />
                <span className="font-medium">Settings</span>
                <span className="text-xs text-muted-foreground">Configure</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}