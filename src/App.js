import React, { useState, useRef } from 'react';
import './App.css';

const FILTERS = {
  NINGUNO: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  PROTANOPÍA: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  DEUTERANOPÍA: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  TRITANOPÍA: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
};

function App() {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target.result);
    reader.readAsDataURL(file);
  };

  const applyFilter = (matrix) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        data[i]   = r * matrix[0] + g * matrix[1] + b * matrix[2];
        data[i+1] = r * matrix[3] + g * matrix[4] + b * matrix[5];
        data[i+2] = r * matrix[6] + g * matrix[7] + b * matrix[8];
      }
      ctx.putImageData(imageData, 0, 0);
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 app-container">
  <h1 className="text-3xl font-bold text-blue-900 mb-6">Daltonism Filter Tool</h1>
  <input 
    type="file" 
    onChange={handleUpload} 
    accept="image/*" 
    className="mb-6 p-3 border-2 border-dashed border-blue-400 rounded-lg bg-white shadow-sm cursor-pointer hover:border-blue-600 transition"
  />
  <div className="flex flex-wrap justify-center gap-4 mb-6">
    {Object.keys(FILTERS).map(type => (
      <button 
        key={type} 
        onClick={() => applyFilter(FILTERS[type])} 
        disabled={!image}
        className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 transition"
      >
        {type}
      </button>
    ))}
  </div>
  <canvas 
    ref={canvasRef} 
    className="max-w-full border-2 border-gray-300 rounded-lg shadow-lg"
  />
</div>

  );
}

export default App;
