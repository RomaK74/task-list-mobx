import {
  action,
  autorun,
  computed,
  flow,
  makeObservable,
  observable,
  reaction,
  runInAction,
  when
} from "mobx";
import { Task } from "../../models/Task";
import type {
  TStoreAddTaskFn,
  TStoreRemoveTaskFn,
  TStoreSetErrorFn,
  TStoreSetFilterFn,
  TStoreSetLoadingFn,
  TStoreSetSearchTermFn,
  TTaskFilter,
  TTaskPriority,
  TTaskStats,
  TTasksByPriority
} from "../../types/task";

type TTaskPayload = {
  title: string;
  description: string;
  priority: TTaskPriority;
};

type TUpdateStatsFn = () => void;
type TClearCompletedFn = () => void;
type TSetupReactionsFn = () => void;
type TLoadTasksGeneratorFn = () => Generator<Promise<void>, void, void>;

export class TaskStore {
  tasks: Task[] = [];
  filter: TTaskFilter = "all";
  searchTerm = "";
  isLoading = false;
  error: string | null = null;
  stats: TTaskStats = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  };

  constructor() {
    makeObservable(this, {
      tasks: observable,
      filter: observable,
      searchTerm: observable,
      isLoading: observable,
      error: observable,
      stats: observable,
      addTask: action,
      removeTask: action,
      setFilter: action,
      setSearchTerm: action,
      clearCompleted: action,
      setLoading: action,
      setError: action,
      loadTasks: flow,
      filteredTasks: computed,
      completedTasksCount: computed,
      pendingTasksCount: computed,
      overdueTasksCount: computed,
      tasksByPriority: computed,
      searchResults: computed
    });

    this.setupReactions();

    // Автоматическое обновление статистики
    autorun(() => this.updateStats());
  }

  setupReactions: TSetupReactionsFn = () => {
    // Реакция на изменение задач
    reaction(
      () => this.tasks.length,
      (length) => {
        console.log(`Количество задач изменилось: ${length}`);
      }
    );

    // Реакция на завершение задач
    reaction(
      () => this.tasks.filter((task) => task.completed).length,
      (completedCount) => {
        if (completedCount > 0) {
          console.log(`Завершено задач: ${completedCount}`);
        }
      }
    );

    // Ожидание определенного условия
    when(
      () => this.tasks.length >= 10,
      () => console.log("Достигнуто 10 задач!")
    );
  };

  updateStats: TUpdateStatsFn = () => {
    this.stats.totalTasks = this.tasks.length;
    this.stats.completedTasks = this.tasks.filter((task) => task.completed).length;
    this.stats.pendingTasks = this.tasks.filter((task) => !task.completed).length;
    this.stats.overdueTasks = this.tasks.filter((task) => task.isOverdue).length;
  };

  addTask: TStoreAddTaskFn = (title, description, priority) => {
    const task = new Task(title, description, priority);
    this.tasks.push(task);
    return task;
  };

  removeTask: TStoreRemoveTaskFn = (taskId) => {
    const index = this.tasks.findIndex((task) => task.id === taskId);
    if (index > -1) {
      this.tasks.splice(index, 1);
    }
  };

  setFilter: TStoreSetFilterFn = (filter) => {
    this.filter = filter;
  };

  setSearchTerm: TStoreSetSearchTermFn = (term) => {
    this.searchTerm = term;
  };

  clearCompleted: TClearCompletedFn = () => {
    this.tasks = this.tasks.filter((task) => !task.completed);
  };

  setLoading: TStoreSetLoadingFn = (loading) => {
    this.isLoading = loading;
  };

  setError: TStoreSetErrorFn = (error) => {
    this.error = error;
  };

  // Flow для асинхронных операций
  loadTasks: TLoadTasksGeneratorFn = function* loadTasks(this: TaskStore) {
    this.setLoading(true);
    this.setError(null);

    try {
      yield new Promise<void>((resolve) => setTimeout(resolve, 1000));

      const mockTasks: TTaskPayload[] = [
        { title: 'Изучить MobX', description: 'Освоить основы MobX', priority: 'high' },
        { title: 'Создать pet-проект', description: 'Реализовать проект с MobX', priority: 'medium' },
        { title: 'Написать документацию', description: 'Задокументировать проект', priority: 'low' }
      ];

      runInAction(() => {
        mockTasks.forEach((taskData) => {
          this.tasks.push(new Task(taskData.title, taskData.description, taskData.priority));
        });
      });
    } catch (error: unknown) {
      runInAction(() => {
        this.setError("Ошибка при загрузке задач");
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };

  get filteredTasks(): Task[] {
    let filtered = this.tasks;

    switch (this.filter) {
      case "completed":
        filtered = filtered.filter((task) => task.completed);
        break;
      case "pending":
        filtered = filtered.filter((task) => !task.completed);
        break;
      case "overdue":
        filtered = filtered.filter((task) => task.isOverdue);
        break;
      default:
        break;
    }

    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerSearchTerm) ||
          task.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    return filtered;
  }

  get completedTasksCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  get pendingTasksCount(): number {
    return this.tasks.filter((task) => !task.completed).length;
  }

  get overdueTasksCount(): number {
    return this.tasks.filter((task) => task.isOverdue).length;
  }

  get tasksByPriority(): TTasksByPriority {
    return {
      high: this.tasks.filter((task) => task.priority === "high").length,
      medium: this.tasks.filter((task) => task.priority === "medium").length,
      low: this.tasks.filter((task) => task.priority === "low").length
    };
  }

  get searchResults(): Task[] {
    if (!this.searchTerm) {
      return [];
    }

    const lowerSearchTerm = this.searchTerm.toLowerCase();
    return this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerSearchTerm) ||
        task.description.toLowerCase().includes(lowerSearchTerm)
    );
  }
}

export const taskStore = new TaskStore();
