import React from "react";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src={imgSrc} alt="No Notes" className="w-96" />

      <p className="w-3/4 text-sm font-medium text-slate-700 text-center leading-7 mt-2">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
 