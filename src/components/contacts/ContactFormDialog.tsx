import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Contact } from '@/types'
import { ContactFormData } from '@/stores/useContactStore'

interface ContactFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: Contact
  mode: 'edit' | 'add'
  onSubmit: (data: ContactFormData) => Promise<void>
}

export function ContactFormDialog({ 
  open, 
  onOpenChange, 
  data,
  onSubmit
}: ContactFormDialogProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: data || {
      firstName: '',
      lastName: '',
      contactNumber: '',
      emailAddress: '',
      photo: undefined,
    }
  })

  const onSubmitHandler = async (formData: ContactFormData) => {
    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to save contact:', err)
      // You might want to show an error toast here
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                {...register('contactNumber')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('emailAddress')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                type="file"
                {...register('photo')}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 