import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { configure, spy } from "mobx";
import { taskStore } from "./stores/TaskStore/TaskStore";
import { StatsPanel } from "./components/StatsPanel/StatsPanel";
import { TaskForm } from "./components/TaskForm/TaskForm";
import { TaskItem } from "./components/TaskItem/TaskItem";

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true
});


const App = observer(() => {
  useEffect(() => {
    // Загрузка начальных задач
    taskStore.loadTasks();
    
    // Включение отслеживания MobX (для отладки)
    const dispose = spy((event) => {
      if (event.type === "action") {
        console.log(`MobX Action: ${event.name}`, event.arguments);
      }
    });

    return () => dispose();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Task List MobX
            </h1>
            <p className="text-gray-600 mt-2">
              Демонстрация возможностей MobX
            </p>
          </header>
          <StatsPanel store={taskStore} />
          <TaskForm store={taskStore} />
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Поиск задач..."
                  value={taskStore.searchTerm}
                  onChange={(e) => taskStore.setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => taskStore.setFilter("all")}
                  className={`px-4 py-2 rounded-md ${
                    taskStore.filter === "all" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => taskStore.setFilter("pending")}
                  className={`px-4 py-2 rounded-md ${
                    taskStore.filter === "pending" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  В процессе
                </button>
                <button
                  onClick={() => taskStore.setFilter("completed")}
                  className={`px-4 py-2 rounded-md ${
                    taskStore.filter === "completed" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Выполнено
                </button>
              </div>
            </div>
          </div>

          {/* Список задач */}
          {taskStore.isLoading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Загрузка задач...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {taskStore.filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} store={taskStore} />
              ))}
            </div>
          )}
          
          <footer className="mt-12 text-center text-sm text-gray-500">
            <p>
              Этот проект демонстрирует: Observable, Actions, Computed Values, 
              Reactions, Flows, Autorun, When, Spy, Configure
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
});

export default App;