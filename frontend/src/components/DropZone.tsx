import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const DropZone = () => {
  async function postGPXFilePath(gpx_file_path: string) {
    try {
      const response = await fetch("http://127.0.0.1:8080/upload-gpx/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gpx_file_path,
        }),
      });

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const { mutate } = useMutation({
    mutationFn: ({ gpx_file_path }: { gpx_file_path: string }) =>
      postGPXFilePath(gpx_file_path),
    onSuccess: () => {
      console.log("Success");
      setSelectedFileName(null);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { target } = event;
    const inputs = [...(target as unknown as HTMLInputElement[])];
    const formData = Object.fromEntries(
      inputs
        .filter((el) => el.name.length)
        .filter((el) => !el.name.includes("remember"))
        .map((el) => [el.name, el.value])
    );
    console.log(formData.gpx_file_path);
    mutate({ gpx_file_path: formData.gpx_file_path });
  };

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      setSelectedFileName(fileInput.files[0].name);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <form className="mt-8 space-y-6" action="#" onSubmit={handleSubmit}>
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-256 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center p-5">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {selectedFileName ? (
                <span className="font-semibold">{selectedFileName}</span>
              ) : (
                <span className="font-semibold">Click to upload</span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">GPX File</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            name="gpx_file_path"
            onChange={handleFileChange}
          />

          {selectedFileName && (
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              Upload
            </button>
          )}
        </label>
      </form>
    </div>
  );
};
