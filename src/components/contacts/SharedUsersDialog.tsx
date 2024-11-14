import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash,} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Contact } from "../../types/index"


interface SharedUsersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact
  onUnshare: (email: string) => void
  currentUserEmail?: string
}

export function SharedUsersDialog({
  open,
  onOpenChange,
  contact,
  onUnshare,
  currentUserEmail
}: SharedUsersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shared With</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[300px] pr-4">
          {contact.sharedWith?.map((shared) => (
            <div key={`${shared.email}`+1} className="flex items-center justify-between py-2">
              <span>{shared.email}</span>
              {shared.email !== currentUserEmail && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUnshare(shared.email)}
                >
                 <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 