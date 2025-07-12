import { 
    makeObservable, 
    observable, 
    action, 
    computed, 
    runInAction, 
    reaction, 
    when, 
    autorun,
    flow
  } from "mobx";
  import { Task } from "../../models/Task";
  
  export class TaskStore {
    tasks = [];
    filter = 'all';
    searchTerm = '';
    isLoading = false;
    error = null;
    stats = {
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
      autorun(() => {
        this.updateStats();
      });
    }
  
    setupReactions() {
      // Реакция на изменение задач
      reaction(
        () => this.tasks.length,
        (length) => {
          console.log(`Количество задач изменилось: ${length}`);
        }
      );
  
      // Реакция на завершение задач
      reaction(
        () => this.tasks.filter(task => task.completed).length,
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
    }
  
    updateStats = () => {
      this.stats.totalTasks = this.tasks.length;
      this.stats.completedTasks = this.tasks.filter(task => task.completed).length;
      this.stats.pendingTasks = this.tasks.filter(task => !task.completed).length;
      this.stats.overdueTasks = this.tasks.filter(task => task.isOverdue).length;
    }
  
    addTask = (title, description, priority) => {
      const task = new Task(title, description, priority);
      this.tasks.push(task);
      return task;
    }
  
    removeTask = (taskId) => {
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index > -1) {
        this.tasks.splice(index, 1);
      }
    }
  
    setFilter = (filter) => {
      this.filter = filter;
    }
  
    setSearchTerm = (term) => {
      this.searchTerm = term;
    }
  
    clearCompleted = () => {
      this.tasks = this.tasks.filter(task => !task.completed);
    }
  
    setLoading = (loading) => {
      this.isLoading = loading;
    }
  
    setError = (error) => {
      this.error = error;
    }
  
    // Flow для асинхронных операций
    *loadTasks() {
      this.setLoading(true);
      this.setError(null);
      
      try {
        yield new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTasks = [
          { title: 'Изучить MobX', description: 'Освоить основы MobX', priority: 'high' },
          { title: 'Создать pet-проект', description: 'Реализовать проект с MobX', priority: 'medium' },
          { title: 'Написать документацию', description: 'Задокументировать проект', priority: 'low' }
        ];
  
        runInAction(() => {
          mockTasks.forEach(taskData => {
            const task = new Task(taskData.title, taskData.description, taskData.priority);
            this.tasks.push(task);
          });
        });
  
      } catch (error) {
        runInAction(() => {
          this.setError('Ошибка при загрузке задач');
        });
      } finally {
        runInAction(() => {
          this.setLoading(false);
        });
      }
    }
  
    // Computed values
    get filteredTasks() {
      let filtered = this.tasks;
  
      switch (this.filter) {
        case 'completed':
          filtered = filtered.filter(task => task.completed);
          break;
        case 'pending':
          filtered = filtered.filter(task => !task.completed);
          break;
        case 'overdue':
          filtered = filtered.filter(task => task.isOverdue);
          break;
        default:
          break;
      }
  
      if (this.searchTerm) {
        filtered = filtered.filter(task =>
          task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
  
      return filtered;
    }
  
    get completedTasksCount() {
      return this.tasks.filter(task => task.completed).length;
    }
  
    get pendingTasksCount() {
      return this.tasks.filter(task => !task.completed).length;
    }
  
    get overdueTasksCount() {
      return this.tasks.filter(task => task.isOverdue).length;
    }
  
    get tasksByPriority() {
      return {
        high: this.tasks.filter(task => task.priority === 'high').length,
        medium: this.tasks.filter(task => task.priority === 'medium').length,
        low: this.tasks.filter(task => task.priority === 'low').length
      };
    }
  
    get searchResults() {
      if (!this.searchTerm) return [];
      return this.tasks.filter(task =>
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  export const taskStore = new TaskStore();
