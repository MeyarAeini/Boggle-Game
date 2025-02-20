'use client';
import { useState } from 'react';

export default function ButtonGrid() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [path, setPath] = useState([]);

  // Handle mouse down event
  const handleMouseDown = (row, col) => {
    setIsDrawing(true);
    setPath([{ row, col }]); // Start a new path
  };

  // Handle mouse over event
  const handleMouseOver = (row, col) => {
    if (isDrawing) {
      setPath((prevPath) => {
        // Avoid adding the same button multiple times
        if (!prevPath.some((p) => p.row === row && p.col === col)) {
          return [...prevPath, { row, col }];
        }
        return prevPath;
      });
    }
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDrawing(false);
    console.log('Final Path:', path); // Log or process the final path
  };

  return (
    <div>
      <h1>4x4 Button Grid</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 50px)', gap: '5px' }}>
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => (
            <button
              key={`${row}-${col}`}
              onMouseDown={() => handleMouseDown(row, col)}
              onMouseOver={() => handleMouseOver(row, col)}
              onMouseUp={handleMouseUp}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: path.some((p) => p.row === row && p.col === col) ? 'lightblue' : 'white',
              }}
            >
              {row},{col}
            </button>
          ))
        )}
      </div>
      <div>
        <h2>Traced Path:</h2>
        <ul>
          {path.map((p, index) => (
            <li key={index}>{`Row: ${p.row}, Col: ${p.col}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}