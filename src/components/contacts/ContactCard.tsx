import { Contact } from '@/types'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share, Edit, Trash, Users } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ContactCardProps {
  contact: Contact
  onShare: (contact: Contact) => void
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
  isOwner: boolean
}

export function ContactCard({ contact, onShare, onEdit, onDelete, onView, isOwner }: ContactCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          <img 
            src={contact.photo || '/default-avatar.png'} 
            alt={`${contact.firstName}'s photo`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{`${contact.firstName} ${contact.lastName}`}</h3>
          <p className="text-sm text-gray-500">{contact.emailAddress}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{contact.contactNumber}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isOwner && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => onShare(contact)}>
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => onEdit(contact)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="icon" onClick={() => onDelete(contact._id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => onView(contact._id)}>
                    <Users className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shared with</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </CardFooter>
    </Card>
  )
} 