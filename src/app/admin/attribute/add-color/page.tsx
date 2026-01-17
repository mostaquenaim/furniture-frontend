"use client";

import LoadingDots from "@/component/Loading/LoadingDS";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import axios from "axios";
import React, { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

interface ColorForm {
  name: string;
  hexCode: string;
  sortOrder: number;
  isActive: boolean;
}

const AddColor: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [formData, setFormData] = useState<ColorForm>({
    name: "",
    hexCode: "#000000",
    sortOrder: 0,
    isActive: true,
  });
  const axiosSecure = useAxiosSecure();

  //   handle change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    let checked = null;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      checked = e.target.checked;
      console.log(name, checked);
    } else {
      console.log(name, value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //   handle submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosSecure.post("/color", {
        name: formData.name,
        hexCode: formData.hexCode,
        sortOrder: formData.sortOrder,
      });

      toast.success("Color added successfully");
      setFormData({
        name: "",
        hexCode: "#000000",
        sortOrder: 0,
        isActive: true,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(
          (err.response?.data as { message?: string })?.message ||
            "Failed to add color"
        );
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to add color");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add Color</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Color Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Color Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Royal Blue"
          />
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>

          <input
            type="color"
            name="hexCode"
            value={formData.hexCode}
            onChange={handleChange}
            className="w-full h-10 border rounded cursor-pointer"
          />

          <input
            type="text"
            name="hexCode"
            value={formData.hexCode}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mt-2"
            placeholder="#0000FF"
          />
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium mb-1">Sort Order</label>
          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span className="text-sm">Active</span>
        </div>
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : success ? (
          <p className="text-green-500 text-sm">{success}</p>
        ) : null}

        {/* Submit */}
        {isLoading ? (
          <LoadingDots></LoadingDots>
        ) : (
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Add Color
          </button>
        )}
      </form>
    </div>
  );
};

export default AddColor;
