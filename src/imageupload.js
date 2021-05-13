import { useEffect } from 'react';

const ImageUpload = ({
  selectedFile,
  setSelectedFile,
  preview,
  setPreview,
}) => {
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="flex flex-col file-input py-1 my-4 text-center font-spartan text-md font-bold text-gray-50">
      <input
        className="py-3 text-center  w-full font-bold rounded-md text-gray-900 tracking-wide "
        type="file"
        id="file"
        className="file"
        onChange={onSelectFile}
      />
      <label
        className="bg-blue-300 btn hover:bg-blue-400 transition shadow-md cursor-pointer  text-gray-700 tracking-wide font-bold rounded-md py-3 block"
        htmlFor="file"
      >
        Wybierz zdjęcie
      </label>

      {selectedFile && (
        <img
          src={preview}
          className="mt-5 h-32 w-32 m-auto object-cover object-center"
        />
      )}
    </div>
  );
};

export default ImageUpload;
