/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Edit3, Save, RotateCcw, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import useFetchSeries from "@/hooks/Categories/Series/useFetchSeries";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { cn } from "@/utils/mergeTailwind";

const AllSeriesComp = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { seriesList: initialSeries, isLoading } = useFetchSeries({
    isActive: null,
  });

  // Local state for the draggable list
  const [list, setList] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync local state when data fetches
  useEffect(() => {
    if (initialSeries) {
      // Sort by sortOrder initially
      const sorted = [...initialSeries].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );
      setList(sorted);
    }
  }, [initialSeries]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sortOrder values locally based on new index
    const updatedItems = items.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    setList(updatedItems);
    setHasChanges(true);
  };

  const saveNewOrder = async () => {
    setIsSaving(true);
    try {
      // Create a payload of just IDs and their new sortOrder
      const orderPayload = list.map((item) => ({
        id: item.id,
        sortOrder: item.sortOrder,
      }));

      await axiosSecure.patch("/series/reorder", { orders: orderPayload });
      toast.success("Order updated successfully");
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save new order");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Product Series</h1>
          <p className="text-sm text-slate-500">
            Drag items to reorder how they appear on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={saveNewOrder}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Order"}
            </button>
          )}
          <button
            onClick={() => router.push("/admin/series/add")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>
      </div>

      {/* Draggable Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Series Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <Droppable droppableId="series-list">
              {(provided) => (
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="divide-y divide-slate-200"
                >
                  {list.map((series, index) => (
                    <Draggable
                      key={series.id}
                      draggableId={series.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "transition-colors",
                            snapshot.isDragging
                              ? "bg-indigo-50/50 shadow-inner"
                              : "hover:bg-slate-50/50",
                          )}
                        >
                          <td className="px-4 py-4">
                            <div
                              {...provided.dragHandleProps}
                              className="text-slate-400 hover:text-indigo-600 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical size={20} />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                                {series.image ? (
                                  <img
                                    src={series.image}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400 italic">
                                    No Img
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900">
                                  {series.name}
                                </div>
                                <div className="text-xs text-slate-500 truncate max-w-[200px]">
                                  {series.notice || "No notice"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                            /{series.slug}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                series.isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-500",
                              )}
                            >
                              {series.isActive ? "Active" : "Hidden"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/series/update/${series.slug}`,
                                )
                              }
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>

        {list.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-sm italic">
              No series found in the catalog.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSeriesComp;
