import { TaskStore } from "./TaskStore";

describe("Тестирование стора TaskStore", () => {
  let store: TaskStore;

  beforeEach(() => {
    store = new TaskStore();
  });

  test("Должна добавить задачу", () => {
    store.addTask("Test Task", "Test Description", "high");
    expect(store.tasks).toHaveLength(1);
    expect(store.tasks[0].title).toBe("Test Task");
  });

  test("Должна отфильтровать задачи", () => {
    store.addTask("Task 1", "", "high");
    store.addTask("Task 2", "", "medium");
    store.tasks[0].toggle();

    store.setFilter("completed");
    expect(store.filteredTasks).toHaveLength(1);
    expect(store.filteredTasks[0].completed).toBe(true);
  });

  test("Должна обновить статистику", () => {
    store.addTask("Task 1", "", "high");
    store.addTask("Task 2", "", "medium");
    store.tasks[0].toggle();

    expect(store.stats.totalTasks).toBe(2);
    expect(store.stats.completedTasks).toBe(1);
    expect(store.stats.pendingTasks).toBe(1);
  });
});
