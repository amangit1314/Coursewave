import { dmSans } from "@/lib/config/fonts";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const TagInput = ({
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ElementType;
}) => {
  const [inputValue, setInputValue] = useState("");
  const tags = value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)
    : [];

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      onChange(newTags.join(", "));
    }
    setInputValue("");
  };

  const removeTag = (
    tagToRemove:
      | string
      | number
      | bigint
      | boolean
      | React.ReactPortal
      | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | Promise<
          | string
          | number
          | bigint
          | boolean
          | React.ReactPortal
          | React.ReactElement<
              unknown,
              string | React.JSXElementConstructor<any>
            >
          | Iterable<React.ReactNode>
          | null
          | undefined
        >
      | null
      | undefined
  ) => {
    const newTags = tags.filter(
      (
        tag:
          | string
          | number
          | bigint
          | boolean
          | React.ReactPortal
          | React.ReactElement<
              unknown,
              string | React.JSXElementConstructor<any>
            >
          | Iterable<React.ReactNode>
          | Promise<
              | string
              | number
              | bigint
              | boolean
              | React.ReactPortal
              | React.ReactElement<
                  unknown,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | null
              | undefined
            >
          | null
          | undefined
      ) => {
        return tag !== tagToRemove;
      }
    );
    onChange(newTags.join(", "));
  };

  return (
    <div className="space-y-2">
      <div className="relative flex-1 flex items-center">
        <Icon className="absolute left-3 text-gray-400" size={18} />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(inputValue.trim());
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-transparent"
        />

        <button
          type="button"
          onClick={() => addTag(inputValue.trim())}
          className="ml-4 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map(
            (
              tag:
                | string
                | number
                | bigint
                | boolean
                | React.ReactElement<
                    unknown,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactPortal
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined,
              index: React.Key | null | undefined
            ) => (
              <span
                key={index}
                className={`${dmSans.className} inline-flex font-medium items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200`}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TagInput;