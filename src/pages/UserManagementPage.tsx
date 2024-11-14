import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { User } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUserStore } from '@/stores/useUserStore'
import { AuthUser, useAuthStore } from '../stores/useAuthStore'
import { toast } from "sonner"
import { SignUpForm } from '@/components/auth/SignUpForm'

export function UserManagementPage() {
  const { users, loading, getUsers, updateUser, deleteUser, activateUser, deactivateUser } = useUserStore()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false)

  const { getCurrentUser } = useAuthStore();
  
  useEffect(() => {
    getUsers()
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user)
    }
  }, [])


  console.log(currentUser)

  const handleApproveUser = async (user_id: string) => {
    try {
      await activateUser(user_id)
      toast.success("User activated successfully")
    } catch (error) {
      toast.error("Failed to activate user")
      console.error('Failed to approve user:', error)
    }
  }

  const handleDeactivateUser = async (user_id: string) => {
    try {
      await deactivateUser(user_id)
      toast.success("User deactivated successfully")
    } catch (error) {
      toast.error("Failed to deactivate user")
      console.error('Failed to deactivate user:', error)
    }
  }

  const handleDeleteUser = async (user_id: string) => {
    try {
      await deleteUser(user_id)
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Failed to delete user")
      console.error('Failed to delete user:', error)
    }
  }

  const handleModifyUser = async (updatedUser: User) => {
    try {
      await updateUser(updatedUser._id, updatedUser)
      setIsDialogOpen(false)
      toast.success("User updated successfully")
    } catch (error) {
      toast.error("Failed to modify user")
      console.error('Failed to modify user:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setIsCreateUserDialogOpen(true)}>
          Create User
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">User ID</TableHead>
              <TableHead className="w-[20%]">Name</TableHead>
              <TableHead className="w-[30%]">Email</TableHead>
              <TableHead className="w-[10%]">Role</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  {currentUser?.id !== user._id && user.role !== 'super-admin' ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="z-50 bg-white">
                        {user.status === 'inactive' && (
                          <DropdownMenuItem onClick={() => handleApproveUser(user._id)} className="hover:bg-gray-100">
                            Activate
                          </DropdownMenuItem>
                        )}
                        {user.status === 'active' && (
                          <DropdownMenuItem onClick={() => handleDeactivateUser(user._id)} className="hover:bg-gray-100">
                            Deactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(user)
                            setIsDialogOpen(true)
                          }}
                          className="hover:bg-gray-100"
                        >
                          Modify User
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 hover:bg-gray-100"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Permanently Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modify User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="firstName">First Name</label>
                <Input
                  id="firstName"
                  defaultValue={selectedUser.firstName}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    firstName: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="lastName">Last Name</label>
                <Input
                  id="lastName"
                  defaultValue={selectedUser.lastName}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    lastName: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  defaultValue={selectedUser.email}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    email: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="role">Role</label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => {
                    if (value === "user" || value === "admin" || value === "super-admin") {
                      setSelectedUser({
                        ...selectedUser,
                        role: value
                      });
                    }
                  }}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user" className="bg-white">User</SelectItem>
                    <SelectItem value="admin" className="bg-white">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleModifyUser(selectedUser)}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <SignUpForm 
            hideCard 
            onSuccess={() => {
              setIsCreateUserDialogOpen(false)
              getUsers() // Refresh the users list
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 