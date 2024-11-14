import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Contact } from '@/types'

interface ShareContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact
  onShare: (email: string) => Promise<void>
  isLoading: boolean
}

export function ShareContactDialog({
  open,
  onOpenChange,
  contact,
  onShare,
  isLoading,
}: ShareContactDialogProps) {
  const [email, setEmail] = useState('')

  const handleShare = async () => {
    await onShare(email)
    setEmail('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Contact</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Sharing contact details for:</Label>
            <p className="text-sm font-medium">
              {contact.firstName} {contact.lastName}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shareEmail">User Email</Label>
            <Input
              id="shareEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              className="col-span-3"
            />
          </div>
          <Button onClick={handleShare} className="w-full" disabled={isLoading}>
            {isLoading ? 'Sharing...' : 'Share Contact'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 