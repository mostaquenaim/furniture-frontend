"use client";

import { Popover } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <div className="border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

        <div className="text-2xl tracking-wide font-semibold">
          SAKIGAI
        </div>

        <div className="hidden md:flex gap-6 text-sm">
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-1 hover:text-gray-600">
              New! <ChevronDownIcon className="h-4 w-4" />
            </Popover.Button>

            <Popover.Panel className="absolute left-0 mt-2 bg-white shadow-xl p-4 rounded w-56">
              <div className="flex flex-col gap-2">
                <a className="hover:text-gray-600" href="#">New Arrivals</a>
                <a className="hover:text-gray-600" href="#">Trending</a>
              </div>
            </Popover.Panel>
          </Popover>

          <a href="#" className="hover:text-gray-600">Holiday</a>
          <a href="#" className="hover:text-gray-600">Furniture</a>
          <a href="#" className="hover:text-gray-600">Décor & Pillows</a>
          <a href="#" className="hover:text-gray-600">Lighting</a>
          <a href="#" className="hover:text-gray-600">Rugs</a>
        </div>

        <div>
          <input 
            placeholder="What are you looking for?"
            className="border px-3 py-1 rounded text-sm w-64"
          />
        </div>

      </div>
    </div>
  );
}
