import { Plus, Trash2, BookOpen, X } from 'lucide-react';
import { Subject } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
  onAddSubject: () => void;
  onDeleteSubject: (subject: Subject) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  onAddSubject,
  onDeleteSubject,
  isOpen,
  onClose
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

      {/* Sidebar */}
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

          {/* Subjects list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {subjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No subjects yet. Add one to get started!
              </p>
            ) : (
              subjects.map((subject) => (
                <div
                  key={subject.subject_id}
                  className={cn(
                    "group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200",
                    selectedSubject?.subject_id === subject.subject_id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                      : "hover:bg-sidebar-accent/50"
                  )}
                  onClick={() => {
                    onSelectSubject(subject);
                    onClose();
                  }}
                >
                  <span className="font-medium truncate">{subject.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSubject(subject);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Add subject button */}
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
