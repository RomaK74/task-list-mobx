import { action, computed, makeObservable, observable } from "mobx";
import type {
  TTaskDueDate,
  TTaskPriority,
  TTaskSetDueDateFn,
  TTaskSetPriorityFn,
  TTaskTagFn,
  TTaskToggleFn,
  TTaskUpdateTextFn
} from "../types/task";

export class Task {
  id = Math.random();
  title = "";
  description = "";
  completed = false;
  priority: TTaskPriority = "medium";
  createdAt = new Date();
  dueDate: TTaskDueDate = null;
  tags: string[] = [];

  constructor(title: string, description = "", priority: TTaskPriority = "medium") {
    makeObservable(this, {
      title: observable,
      description: observable,
      completed: observable,
      priority: observable,
      dueDate: observable,
      tags: observable,
      toggle: action,
      updateTitle: action,
      updateDescription: action,
      setPriority: action,
      setDueDate: action,
      addTag: action,
      removeTag: action,
      isOverdue: computed,
      formattedDueDate: computed
    });

    this.title = title;
    this.description = description;
    this.priority = priority;
  }

  toggle: TTaskToggleFn = () => {
    this.completed = !this.completed;
  };

  updateTitle: TTaskUpdateTextFn = (newTitle) => {
    this.title = newTitle;
  };

  updateDescription: TTaskUpdateTextFn = (newDescription) => {
    this.description = newDescription;
  };

  setPriority: TTaskSetPriorityFn = (priority) => {
    this.priority = priority;
  };

  setDueDate: TTaskSetDueDateFn = (date) => {
    this.dueDate = date;
  };

  addTag: TTaskTagFn = (tag) => {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  };

  removeTag: TTaskTagFn = (tag) => {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
  };

  get isOverdue(): boolean {
    if (!this.dueDate) {
      return false;
    }

    return new Date() > new Date(this.dueDate) && !this.completed;
  }

  get formattedDueDate(): string {
    if (!this.dueDate) {
      return "Отсутствует дата";
    }

    return new Date(this.dueDate).toLocaleDateString();
  }
}
