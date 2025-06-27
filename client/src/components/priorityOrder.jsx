import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function PriorityOrder({ targetItems, setTargetItems }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTargetItems((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={targetItems.map((item) => item._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 p-4 h-[150px] border lg:h-[190px]  overflow-y-auto">
          {targetItems.map((item, index) => (
            <SortableItem
              key={item._id}
              id={item._id}
              task={item}
              index={index}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, task, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex items-center gap-2 border border-gray-200 p-2 rounded-lg bg-gray-50 cursor-grab touch-none w-full"
    >
      <span className="font-semibold">{index + 1}</span>
      <span>{task.title}</span>
    </div>
  );
}
