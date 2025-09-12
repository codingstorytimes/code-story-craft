//=====================

import { useState } from "react";
import {
  AdvancedRichTextEditor,
  defaultToolbarGroups,
  defaultTools,
} from "./Example";

//=====================
export default function Example() {
  const [value, setValue] = useState<string>("");

  const handleSave = () => {
    console.log("Saving...", value);
  };

  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl p-0 transition-all duration-300 transform scale-95 md:scale-100">
        <h1 className="text-3xl font-bold text-center p-6 text-gray-800 border-b border-gray-200">
          Advanced Rich Text Editor
        </h1>
        <AdvancedRichTextEditor
          value={value}
          onChange={setValue}
          onSave={handleSave}
          height={600}
          tools={defaultTools}
          groups={defaultToolbarGroups}
        />
      </div>
    </div>
  );
}
