import { observer } from "mobx-react-lite";
import { FC, FormEvent, useState } from "react";
import type { TaskStore } from "../../stores/TaskStore/TaskStore";
import type { TTaskPriority } from "../../types/task";

export interface ITaskFormProps {
  store: TaskStore;
}

type TPriorityChangeFn = (value: TTaskPriority) => void;

export const TaskForm: FC<ITaskFormProps> = observer(({ store }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TTaskPriority>("medium");

  const handlePriorityChange: TPriorityChangeFn = (value) => {
    setPriority(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim()) {
      store.addTask(title.trim(), description.trim(), priority);
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Создать задачу</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Название задачи"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Описание задачи"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="flex gap-4">
          <select
            value={priority}
            onChange={(event) =>
              handlePriorityChange(event.target.value as TTaskPriority)
            }
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Низкий приоритет</option>
            <option value="medium">Средний приоритет</option>
            <option value="high">Высокий приоритет</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Добавить задачу
          </button>
        </div>
      </form>
    </div>
  );
});
