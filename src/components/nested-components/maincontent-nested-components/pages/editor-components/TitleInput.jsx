export default function TitleInput({ title, onTitleChange }) {
  return (
    <div className="mb-3">
      <input
        type="text"
        value={title}
        onChange={onTitleChange}
        placeholder="Enter document title..."
        className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent px-1 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 rounded-md transition-all duration-200"
      />
    </div>
  );
}
