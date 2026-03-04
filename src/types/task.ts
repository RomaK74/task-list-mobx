import type { Task } from "../models/Task";

export type TTaskPriority = "low" | "medium" | "high";
export type TTaskFilter = "all" | "completed" | "pending" | "overdue";
export type TTaskDueDate = Date | null;

export type TTaskStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
};

export type TTasksByPriority = {
  high: number;
  medium: number;
  low: number;
};

export type TTaskToggleFn = () => void;
export type TTaskUpdateTextFn = (value: string) => void;
export type TTaskSetPriorityFn = (priority: TTaskPriority) => void;
export type TTaskSetDueDateFn = (date: TTaskDueDate) => void;
export type TTaskTagFn = (tag: string) => void;

export type TStoreAddTaskFn = (
  title: string,
  description: string,
  priority: TTaskPriority
) => Task;

export type TStoreRemoveTaskFn = (taskId: number) => void;
export type TStoreSetFilterFn = (filter: TTaskFilter) => void;
export type TStoreSetSearchTermFn = (term: string) => void;
export type TStoreSetLoadingFn = (loading: boolean) => void;
export type TStoreSetErrorFn = (error: string | null) => void;
