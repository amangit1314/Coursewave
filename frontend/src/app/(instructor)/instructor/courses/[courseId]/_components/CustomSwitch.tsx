const CustomSwitch = ({
  checked,
  color,
  disabled,
  onCheckedChange,
}: {
  checked: boolean;
  color: string;
  disabled: boolean;
  onCheckedChange: any;
}) => {
  return (
    <button
      type="button"
      onClick={onCheckedChange}
      disabled={disabled}
      className={`
    relative inline-flex h-5 w-9 items-center rounded-full 
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500
    ${checked ? `bg-${color}-500` : "bg-gray-300 dark:bg-gray-600"}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `}
    >
      {/* Switch Knob */}
      <span
        className={`absolute inline-block ml-1  h-3 w-3 rounded-full bg-white shadow transition-all duration-200 ${checked ? "right-1" : "left-1"}`}
      />
    </button>
  );
};

export default CustomSwitch;
