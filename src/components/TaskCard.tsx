import { Edit2, Trash2, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Task } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: AlertCircle,
    className: 'bg-pending/10 text-pending border-pending/20',
    gradient: 'bg-gradient-pending',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20',
    gradient: 'bg-gradient-warning',
  },
  done: {
    label: 'Done',
    icon: CheckCircle2,
    className: 'bg-success/10 text-success border-success/20',
    gradient: 'bg-gradient-success',
  },
};

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  return (
    <div className="group relative bg-card border border-border rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 animate-fade-in">
      {/* Status indicator bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-xl", config.gradient)} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-card-foreground mb-2 truncate">
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {/* Status badge */}
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
              config.className
            )}>
              <StatusIcon className="h-3.5 w-3.5" />
              {config.label}
            </span>

            {/* Due date */}
            {task.due_date && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task)}
            className="h-8 w-8 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
