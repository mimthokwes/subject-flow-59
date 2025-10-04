import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TaskCard } from '@/components/TaskCard';
import { SubjectModal } from '@/components/SubjectModal';
import { TaskModal } from '@/components/TaskModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Subject, Task, subjectApi, taskApi } from '@/lib/api';

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  // Load subjects on mount
  useEffect(() => {
    loadSubjects();
  }, []);

  // Load tasks when subject changes
  useEffect(() => {
    if (selectedSubject) {
      loadTasks(selectedSubject.subject_id);
    } else {
      setTasks([]);
    }
  }, [selectedSubject]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await subjectApi.getAll();
      setSubjects(data);
      if (data.length > 0 && !selectedSubject) {
        setSelectedSubject(data[0]);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load subjects. Please check your API connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (subjectId: number) => {
    try {
      setLoading(true);
      const data = await taskApi.getBySubject(subjectId);
      setTasks(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load tasks.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (name: string) => {
    try {
      const newSubject = await subjectApi.create(name);
      setSubjects([...subjects, newSubject]);
      setSelectedSubject(newSubject);
      toast({
        title: 'Success',
        description: 'Subject added successfully!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add subject.',
      });
    }
  };

  const handleDeleteSubject = async (subject: Subject) => {
    try {
      await subjectApi.delete(subject.subject_id);
      const newSubjects = subjects.filter(s => s.subject_id !== subject.subject_id);
      setSubjects(newSubjects);
      if (selectedSubject?.subject_id === subject.subject_id) {
        setSelectedSubject(newSubjects[0] || null);
      }
      toast({
        title: 'Success',
        description: 'Subject deleted successfully!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete subject.',
      });
    }
  };

  const handleAddTask = async (taskData: Omit<Task, 'task_id' | 'subject_id' | 'created_at'>) => {
    if (!selectedSubject) return;
    try {
      const newTask = await taskApi.create(selectedSubject.subject_id, taskData);
      setTasks([...tasks, newTask]);
      toast({
        title: 'Success',
        description: 'Task added successfully!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add task.',
      });
    }
  };

  const handleUpdateTask = async (taskData: Omit<Task, 'task_id' | 'subject_id' | 'created_at'>) => {
    if (!selectedSubject || !editingTask) return;
    try {
      const updatedTask = await taskApi.update(
        selectedSubject.subject_id,
        editingTask.task_id,
        taskData
      );
      setTasks(tasks.map(t => t.task_id === editingTask.task_id ? updatedTask : t));
      setEditingTask(null);
      toast({
        title: 'Success',
        description: 'Task updated successfully!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update task.',
      });
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!selectedSubject) return;
    try {
      await taskApi.delete(selectedSubject.subject_id, task.task_id);
      setTasks(tasks.filter(t => t.task_id !== task.task_id));
      toast({
        title: 'Success',
        description: 'Task deleted successfully!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete task.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          onAddSubject={() => setSubjectModalOpen(true)}
          onDeleteSubject={handleDeleteSubject}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-6 md:p-8 mt-16 md:ml-0">
          {selectedSubject ? (
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{selectedSubject.name}</h2>
                  <p className="text-muted-foreground mt-1">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setEditingTask(null);
                    setTaskModalOpen(true);
                  }}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-muted-foreground mb-4">No tasks yet for this subject.</p>
                  <Button
                    onClick={() => {
                      setEditingTask(null);
                      setTaskModalOpen(true);
                    }}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Task
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.task_id}
                      task={task}
                      onEdit={(task) => {
                        setEditingTask(task);
                        setTaskModalOpen(true);
                      }}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-2">No Subject Selected</h3>
                <p className="text-muted-foreground mb-6">
                  {subjects.length === 0 
                    ? 'Add a subject to get started with your tasks!'
                    : 'Select a subject from the sidebar to view tasks.'}
                </p>
                {subjects.length === 0 && (
                  <Button
                    onClick={() => setSubjectModalOpen(true)}
                    className="bg-gradient-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Subject
                  </Button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <SubjectModal
        isOpen={subjectModalOpen}
        onClose={() => setSubjectModalOpen(false)}
        onSave={handleAddSubject}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleUpdateTask : handleAddTask}
        task={editingTask}
      />
    </div>
  );
};

export default Index;
