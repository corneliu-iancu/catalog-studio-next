"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/app/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  HamburgerMenuIcon,
  PersonIcon,
  ExitIcon,
  DashboardIcon,
  MixerHorizontalIcon,
  FileTextIcon,
  PlusIcon
} from "@radix-ui/react-icons"

interface HeaderProps {
  className?: string
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className }, ref) => {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    
    const isLoading = status === "loading"
    const isAuthenticated = !!session
    const isDashboardRoute = pathname?.startsWith('/dashboard')
    const isPublicMenuRoute = pathname?.startsWith('/menu/')
    
    // Get user initials for avatar fallback
    const getUserInitials = (name?: string | null, email?: string | null) => {
      if (name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      }
      if (email) {
        return email.slice(0, 2).toUpperCase()
      }
      return 'U'
    }

    const handleSignOut = async () => {
      await signOut({ callbackUrl: '/auth/signin' })
    }

    // Dashboard navigation items
    const dashboardNavItems = [
      { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
      { href: '/dashboard/items', label: 'Menu Items', icon: FileTextIcon },
      { href: '/dashboard/categories', label: 'Categories', icon: MixerHorizontalIcon },
      { href: '/showcase', label: 'Theme Showcase', icon: MixerHorizontalIcon },
    ]

    // Mobile menu component
    const MobileMenu = () => (
      <div className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden",
        !mobileMenuOpen && "hidden"
      )}>
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-card border-l p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HamburgerMenuIcon className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          
          <div className="mt-6 space-y-1">
            {isDashboardRoute && isAuthenticated && (
              <>
                {dashboardNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleSignOut()
                    }}
                  >
                    <ExitIcon className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PersonIcon className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    )

    return (
      <>
        <header 
          ref={ref}
          className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-sm", className)}
        >
            <div className="container flex h-16 max-w-7xl items-center justify-between px-4">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl restaurant-gradient text-primary-foreground shadow-md group-hover:shadow-lg transition-all">
                  <FileTextIcon className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight">Menu Studio</span>
                  <span className="text-xs text-muted-foreground -mt-1">Restaurant Management</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {isDashboardRoute && isAuthenticated && (
                <NavigationMenu>
                  <NavigationMenuList>
                    {dashboardNavItems.map((item) => (
                      <NavigationMenuItem key={item.href}>
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink className={cn(
                            navigationMenuTriggerStyle(),
                            pathname === item.href && "bg-accent text-accent-foreground"
                          )}>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    ))}
                    
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Quick Actions</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-6 w-[450px] grid-cols-2">
                          <div className="row-span-3">
                            <NavigationMenuLink asChild>
                              <Link
                                className="flex h-full w-full select-none flex-col justify-end rounded-lg restaurant-gradient p-6 no-underline outline-none focus:shadow-md text-primary-foreground shadow-md hover:shadow-lg transition-all"
                                href="/dashboard/items/new"
                              >
                                <PlusIcon className="h-6 w-6 mb-2" />
                                <div className="mb-2 mt-4 text-lg font-semibold">
                                  Add Menu Item
                                </div>
                                <p className="text-sm leading-tight text-primary-foreground/90">
                                  Create a new delicious item for your restaurant menu.
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </div>
                          <div className="grid gap-1">
                            <NavigationMenuLink asChild>
                              <Link
                                className="food-card block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                href="/dashboard/categories/new"
                              >
                                <div className="text-sm font-semibold leading-none">New Category</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Organize menu items into logical categories
                                </p>
                              </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                              <Link
                                className="food-card block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                href="/dashboard/settings"
                              >
                                <div className="text-sm font-semibold leading-none">Restaurant Settings</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Configure your restaurant profile and preferences
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>

            {/* User Menu / Auth Actions */}
            <div className="flex items-center space-x-4">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || ''} />
                              <AvatarFallback className="text-xs">
                                {getUserInitials(session.user?.name, session.user?.email)}
                              </AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                          <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {session.user?.name || 'User'}
                              </p>
                              <p className="text-xs leading-none text-muted-foreground">
                                {session.user?.email}
                              </p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard">
                              <DashboardIcon className="mr-2 h-4 w-4" />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings">
                              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                              Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleSignOut}>
                            <ExitIcon className="mr-2 h-4 w-4" />
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <div className="hidden md:flex items-center space-x-2">
                      <Button variant="ghost" asChild>
                        <Link href="/auth/signin">Sign In</Link>
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <HamburgerMenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </header>
        
        <MobileMenu />
      </>
    )
  }
)

Header.displayName = "Header"

export { Header }
