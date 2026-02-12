/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import useFetchSeries from "@/hooks/Categories/useFetchSeries";
import { useRouter } from "next/navigation";
import React from "react";

const AllSeriesComp = () => {
  const router = useRouter();
  const { seriesList, isLoading } = useFetchSeries();

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading series...</div>
    );
  }

  const handleSeriesView = (slug: string) => {
    router.push(`/admin/series/update/${slug}`);
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-3 border-b">#</th>
              <th className="px-4 py-3 border-b">Name</th>
              <th className="px-4 py-3 border-b">Slug</th>
              <th className="px-4 py-3 border-b">Image</th>
              <th className="px-4 py-3 border-b">Notice</th>
              <th className="px-4 py-3 border-b text-center">Action</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {seriesList?.map((series: any, index: number) => (
              <tr key={series.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border-b">{index + 1}</td>

                <td className="px-4 py-3 border-b font-medium">
                  {series.name}
                </td>

                <td className="px-4 py-3 border-b text-gray-600">
                  {series.slug}
                </td>

                <td className="px-4 py-3 border-b">
                  {series.image ? (
                    <img
                      src={series.image}
                      alt={series.name}
                      className="h-10 w-14 object-cover rounded border"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>

                <td className="px-4 py-3 border-b">
                  {series.notice || (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </td>

                <td className="px-4 py-3 border-b text-center">
                  <button
                    className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    onClick={() => handleSeriesView(series.slug)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {!seriesList?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No series found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllSeriesComp;
