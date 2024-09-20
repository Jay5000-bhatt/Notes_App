import React from "react";
import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";
import { BsCheckSquare } from "react-icons/bs";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  isCompleted,
  onEdit,
  onDelete,
  onPinNote,
  onToggleComplete,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        <MdOutlinePushPin
          className={`jjj ${
            isPinned ? "text-primary" : "text-slate-300 cursor-pointer"
          }`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">{tags}</div>

        <div className="flex items-center gap-2">
          <span
            onClick={onToggleComplete}
            className={`icon-btn ${
              isCompleted ? "text-yellow-600" : "text-slate-300"
            } hover:text-yellow-600`}
          >
            {isCompleted ? (
              <IoCheckmarkDoneCircleOutline size={28} />
            ) : (
              <BsCheckSquare />
            )}
          </span>
          <MdCreate
            onClick={onEdit}
            className="icon-btn hover:text-green-600"
          />
          <MdDelete
            onClick={onDelete}
            className="icon-btn hover:text-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
