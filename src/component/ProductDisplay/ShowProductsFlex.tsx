import React from "react";

const ShowProductsFlex = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="group cursor-pointer">
          <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
            <div className="w-full h-full bg-gray-200" />{" "}
            {/* Replace with trending items images */}
          </div>
          <h3 className="text-[11px] font-medium leading-tight mb-1">
            Recommended Item {i}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default ShowProductsFlex;
