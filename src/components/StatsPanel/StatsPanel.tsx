import { observer } from "mobx-react-lite";
import type { TaskStore } from "../../stores/TaskStore/TaskStore";
import { FC } from "react";

export interface IStatsPanelProps {
  store: TaskStore;
}

export const StatsPanel: FC<IStatsPanelProps> = observer(({ store }) => {
  const { stats, tasksByPriority } = store;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Статистика</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalTasks}
          </div>
          <div className="text-sm text-gray-600">Всего задач</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.completedTasks}
          </div>
          <div className="text-sm text-gray-600">Выполнено</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats.pendingTasks}
          </div>
          <div className="text-sm text-gray-600">В процессе</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {stats.overdueTasks}
          </div>
          <div className="text-sm text-gray-600">Просрочено</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="font-medium mb-2">По приоритету:</h4>
        <div className="flex space-x-4">
          <span className="text-sm">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1" />
            Высокий: {tasksByPriority.high}
          </span>
          <span className="text-sm">
            <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1" />
            Средний: {tasksByPriority.medium}
          </span>
          <span className="text-sm">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1" />
            Низкий: {tasksByPriority.low}
          </span>
        </div>
      </div>
    </div>
  );
});
