import { Plus, Trash2, BookOpen, X } from 'lucide-react';
import { Subject } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SidebarProps {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
  onAddSubject: () => void;
  onDeleteSubject: (subject: Subject) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Komponen konfirmasi hapus
const ConfirmDeleteDialog = ({
  title,
  description,
  onConfirm,
  triggerIcon,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  triggerIcon: React.ReactNode;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button>{triggerIcon}</button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const Sidebar = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  onAddSubject,
  onDeleteSubject,
  isOpen,
  onClose,
}: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar utama */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen w-64 border-r border-border bg-sidebar transition-transform duration-300 ease-in-out",
          "md:translate-x-0 md:top-16",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Subjects
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* List subjects */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {subjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No subjects yet. Add one to get started!
              </p>
            ) : (
              subjects.map((subject) => (
                <div
                  key={subject.id}
                  className={cn(
                    "group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200",
                    selectedSubject?.id === subject.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                      : "hover:bg-sidebar-accent/50"
                  )}
                  onClick={() => {
                    onSelectSubject(subject);
                    onClose();
                  }}
                >
                  <span className="font-medium truncate">{subject.name}</span>
                  <div
                    className="flex-shrink-0 ml-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ConfirmDeleteDialog
                      title={`Hapus ${subject.name}?`}
                      description="Tindakan ini tidak bisa dibatalkan dan semua task di dalamnya akan ikut terhapus."
                      onConfirm={() => onDeleteSubject(subject)}
                      triggerIcon={
                        <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600 transition-transform duration-200 hover:scale-110" />
                      }
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Tombol tambah subject */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              onClick={onAddSubject}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

