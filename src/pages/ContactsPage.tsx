/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-constant-binary-expression */
import { useEffect, useState } from 'react'
import { Contact } from '../types'
import {  ContactFormData, useContactStore } from '../stores/useContactStore'
import { ContactCard } from '../components/contacts/ContactCard'
import { ContactFormDialog } from '../components/contacts/ContactFormDialog'
import { ShareContactDialog } from '../components/contacts/ShareContactDialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthUser, useAuthStore } from '../stores/useAuthStore'
import { toast } from 'sonner'
import { SharedUsersDialog } from '@/components/contacts/SharedUsersDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useNavigate } from "react-router-dom";
export function ContactsPage() {
  const { 
    contacts, 
    getContacts, 
    deleteContact,
    shareContact,
    createContact,
    updateContact,
    unshareContact
  } = useContactStore()

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSharedUserOpen, setIsSharedUserOpen] = useState(false)
  const [sharedUsersContact, setSharedUsersContact] = useState<Contact | null>(null)
  const [contactToDelete, setContactToDelete] = useState<string | null>(null)

  const { getCurrentUser } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      const user = getCurrentUser();
    
      setCurrentUser(user);
      await getContacts();
    }
    
    fetchData();
  }, [getContacts, getCurrentUser, navigate])


  const filteredContacts = contacts?.filter(contact => {
    if (!currentUser) return false;
    switch (activeTab) {
      case "my-contacts":
        return contact.owner === currentUser.id 
      case "shared":
        return contact.sharedWith?.some(share => share.userId === currentUser.id)
      default:
        return true
    }
  }) || []

  const handleDelete = async (id: string) => {
    setContactToDelete(id)
  }

  console.log('from contacts', currentUser)

  const confirmDelete = async () => {
    if (!contactToDelete) return
    
    try {
      await deleteContact(contactToDelete)
      await getContacts()
      toast.success('Contact deleted successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete contact'
      toast.error(errorMessage)
    } finally {
      setContactToDelete(null)
    }
  }

  const handleSubmit = async (data: ContactFormData) => {
    try {
      if (selectedContact) {
        await updateContact(selectedContact._id, data)
        toast.success('Contact updated successfully!')
      } else {
        await createContact(data)
        toast.success('Contact created successfully!')
      }
      await getContacts()
      setIsFormOpen(false)
      setSelectedContact(null)
    } catch (err) {
      console.error('Failed to save contact:', err)
    }
  }

  const handleShare = async (email: string) => {
    if (!selectedContact) return;
    if (!currentUser) return;
    
    // Prevent sharing with self
    if (email === currentUser.email) {
      toast.error("You cannot share a contact with yourself");
      return;
    }
    
    try {
      setIsLoading(true)
      await shareContact(selectedContact._id, email)
      
      await getContacts()
      setIsShareOpen(false)
      setSelectedContact(null)
      toast.success('Contact shared successfully!')
    } catch (error) {
      toast.error(error as string) 
    } finally {
      setIsLoading(false)
    }
  }

  const handleView = (contactId: string) => {
    const contact = contacts.find(c => c._id === contactId);
    console.log(contact)
    if (contact) {
      setSharedUsersContact(contact as unknown as Contact);
      setIsSharedUserOpen(true);
    }
  }

  const handleUnshare = async (email: string,) => {
    if (!sharedUsersContact) return;
    console.log('clicked')

    
    try {
      console.log('here')
      setIsLoading(true);
      await unshareContact(sharedUsersContact._id, email);
      await getContacts();
      setSharedUsersContact(null);
      setIsSharedUserOpen(false);
      toast.success('Contact unshared successfully!');
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  }

  const ContactGrid = ({ contacts }: { contacts: any }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact: Contact) => (
        <ContactCard
          key={contact._id}
          contact={contact}
          onShare={(contact) => {
            setSelectedContact(contact)
            setIsShareOpen(true)
          } }
          onEdit={(contact) => {
            setSelectedContact(contact)
            setIsFormOpen(true)
          } }
          onDelete={() => handleDelete(contact._id)}
          onView={() => handleView(contact._id)} 
          isOwner={currentUser?.id === contact.owner}        />
      ))}
    </div>
  )

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="my-contacts">My Contacts</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ContactGrid contacts={filteredContacts} />
        </TabsContent>

        <TabsContent value="my-contacts">
          <ContactGrid contacts={filteredContacts} />
        </TabsContent>
        <TabsContent value="shared">
          <ContactGrid contacts={filteredContacts} />
        </TabsContent>
      </Tabs>

      {isFormOpen && selectedContact !== null && (
        <ContactFormDialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open)
            if (!open) {
              setSelectedContact(null)
            }
          }}
          data={selectedContact}
          mode="edit"
          onSubmit={handleSubmit}
        />
      )}

      {isFormOpen && selectedContact === null && (
        <ContactFormDialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open)
          }}
          mode="add"
          onSubmit={handleSubmit}
        />
      )}

      {selectedContact && (
        <ShareContactDialog
          open={isShareOpen}
          onOpenChange={(open) => {
            setIsShareOpen(open)
            if (!open) setSelectedContact(null)
          }}
          contact={selectedContact}
          onShare={handleShare}
          isLoading={isLoading}
        />
      )}
      {isSharedUserOpen && (
        <SharedUsersDialog
          open={isSharedUserOpen}
          onOpenChange={(open) => {
            setIsSharedUserOpen(open)
            if (!open) setSharedUsersContact(null)
          }}
          contact={sharedUsersContact as unknown as Contact}
          onUnshare={handleUnshare}
          currentUserEmail={currentUser?.email}
        />
      )}

      <AlertDialog open={!!contactToDelete} onOpenChange={(open) => !open && setContactToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-400 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 