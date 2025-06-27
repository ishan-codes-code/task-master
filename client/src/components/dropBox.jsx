import { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useMyContext } from "../context/Context";
import { Loader } from "./item";
// import { ScrollItem } from "./scrollItem";

function DraggableItem({ id, task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`border border-gray-200 p-2 rounded-lg bg-gray-50 cursor-grab touch-none w-full ${isDragging ? "opacity-0" : ""}`}
    >
      {task.title}
    </div>
  );
}

function DroppableContainer({ id, children, title }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="w-full">
      <h3 className="font-semibold mb-2 text-md sm:text-lg">{title}</h3>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 items-center py-4 px-6 rounded-lg border border-gray-600 h-[150px] lg:h-[250px] overflow-y-auto overflow-x-hidden ${isOver ? "bg-green-100 border-dashed" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

export default function DragDropExample({
  hasMore,
  page,
  setPage,
  loading,
  sourceItems,
  setSourceItems,
  targetItems,
  setTargetItems,
}) {
  const { tasksData, setTasksData } = useMyContext();

  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    if (tasksData?.tasks) {
      setSourceItems(
        tasksData.tasks
          .filter((task) => task.projectId === null)
          .filter((task) => !targetItems.some((item) => item._id === task._id)),
      );
    }
  }, [tasksData]);

  function handleDragStart(event) {
    const { active } = event;

    // Find the task object by ID
    const fromSource = sourceItems.find((item) => item._id === active.id);
    const fromTarget = targetItems.find((item) => item._id === active.id);

    setActiveTask(fromSource || fromTarget || null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return; // dropped outside any droppable

    const draggedItemId = active.id;
    const overContainerId = over.id;
    // console.log(draggedItemId, overContainerId);

    // Check if the dragged item exists in source or target
    const fromSource = sourceItems.find((item) => item._id === draggedItemId);
    const fromTarget = targetItems.find((item) => item._id === draggedItemId);

    if (fromSource && overContainerId === "target") {
      // Move from source ➔ target
      setSourceItems((items) =>
        items.filter((item) => item._id !== draggedItemId),
      );
      setTargetItems((items) => [...items, fromSource]);
    } else if (fromTarget && overContainerId === "source") {
      // Move from target ➔ source
      setTargetItems((items) =>
        items.filter((item) => item._id !== draggedItemId),
      );
      setSourceItems((items) => [...items, fromTarget]);
    }
    setActiveTask(null);
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div
        className={`flex flex-col items-center justify-evenly items-center gap-4 sm:flex-row w-full  flex-1`}
      >
        <DroppableContainer id="source" title="Existing Tasks">
          {sourceItems.map((item) => (
            <DraggableItem key={item._id} id={item._id} task={item} />
          ))}
          {sourceItems.length === 0 && !hasMore && (
            <p className="text-sm text-gray-400 font-bold">No More Tasks</p>
          )}
          {sourceItems.length > 0 && !hasMore && (
            <p className="text-sm text-gray-400 font-bold">
              No more Tasks to load
            </p>
          )}
          {loading && <Loader type={3} />}

          {hasMore && (
            <button
              type="button"
              className="bg-transparent text-blue-500 hover:text-blue-700 font-semibold"
              onClick={() => setPage(page + 1)}
            >
              Load More
            </button>
          )}
        </DroppableContainer>
        <DroppableContainer id="target" title="Selected Tasks">
          {targetItems.map((item) => (
            <DraggableItem key={item._id} id={item._id} task={item} />
          ))}

          {targetItems.length === 0 && (
            <p className="text-sm text-gray-400 font-bold">Drag tasks here</p>
          )}
        </DroppableContainer>
        <DragOverlay>
          {activeTask ? (
            <div className="border border-gray-600 p-2 rounded-lg bg-white cursor-grabbing w-full">
              {activeTask.title}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
