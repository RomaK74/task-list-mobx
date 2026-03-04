import { observer } from "mobx-react-lite";
import { useState } from "react";
import type { Task } from "../../models/Task";
import type { TaskStore } from "../../stores/TaskStore/TaskStore";
import type { TTaskPriority } from "../../types/task";

export interface ITaskItemProps {
  task: Task;
  store: TaskStore;
}

type THandleSaveFn = () => void;
type THandleCancelFn = () => void;
type TStartEditFn = () => void;

const priorityColors: Record<TTaskPriority, string> = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
};

export const TaskItem = observer(({ task, store }: ITaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleSave: THandleSaveFn = () => {
    task.updateTitle(editTitle);
    task.updateDescription(editDescription);
    setIsEditing(false);
  };

  const handleCancel: THandleCancelFn = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const handleStartEdit: TStartEditFn = () => {
    setIsEditing(true);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 border-l-4 ${
        priorityColors[task.priority]
      } ${task.completed ? "opacity-75" : ""}`}
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={editDescription}
            onChange={(event) => setEditDescription(event.target.value)}
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Сохранить
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={task.toggle}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <h4
                  className={`font-medium ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h4>
                {task.description && (
                  <p
                    className={`text-sm ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {task.priority}
              </span>
              {task.isOverdue && (
                <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                  Просрочено
                </span>
              )}
              <button
                onClick={handleStartEdit}
                className="text-blue-600 hover:text-blue-800"
              >
                ✏️
              </button>
              <button
                onClick={() => store.removeTask(task.id)}
                className="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Создано: {task.createdAt.toLocaleDateString()}
          </div>
        </>
      )}
    </div>
  );
});
