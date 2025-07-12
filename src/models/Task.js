import { makeObservable, observable, action, computed } from "mobx";

export class Task {
  id = Math.random();
  title = "";
  description = "";
  completed = false;
  priority = "medium";
  createdAt = new Date();
  dueDate = null;
  tags = [];

  constructor(title, description = "", priority = "medium") {
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

  toggle = () => {
    this.completed = !this.completed;
  }

  updateTitle = (newTitle) => {
    this.title = newTitle;
  }

  updateDescription = (newDescription) => {
    this.description = newDescription;
  }

  setPriority = (priority) => {
    this.priority = priority;
  }

  setDueDate = (date) => {
    this.dueDate = date;
  }

  addTag = (tag) => {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag = (tag) => {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
  }

  get isOverdue() {
    if (!this.dueDate) return false;
    return new Date() > new Date(this.dueDate) && !this.completed;
  }

  get formattedDueDate() {
    if (!this.dueDate) return "No due date";
    return new Date(this.dueDate).toLocaleDateString();
  }
}