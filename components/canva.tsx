import { useState, useEffect, useRef } from "react";
import QwertyLogo from "@/components/additions/QwertyLogo";
import BitcoinPrice from "@/components/additions/BitcoinPrice";
import DancingCat from "./additions/DancingCat";
// Import all additions here as you create them

// Grid configuration
const GRID = {
  cellSize: 400, // Size of each grid cell in pixels
  centerX: 5000,  // Center X coordinate of the canvas
  centerY: 5000,  // Center Y coordinate of the canvas
  showGridLines: true, // Set to true to show grid lines (helpful during development)
  showCoordinates: true // Set to true to show grid coordinates (helpful during development)
};

// Zoom configuration
const ZOOM = {
  min: 0.2,  // Minimum zoom level (50% of original size)
  max: 2.0,  // Maximum zoom level (200% of original size)
  step: 0.1, // Step size for zoom changes
  default: 1.0 // Default/initial zoom level
};

// Helper function to convert grid coordinates to pixel positions
const gridToPixel = (gridX: number, gridY: number) => {
  return {
    x: GRID.centerX + gridX * GRID.cellSize,
    y: GRID.centerY + gridY * GRID.cellSize
  };
};

// Addition positions defined using grid coordinates
const ADDITIONS = [
  { component: QwertyLogo, gridX: 0, gridY: 0, label: "QWERTY Logo" }, 
  { component: DancingCat, gridX: 1, gridY: 0, label: "Dancing Cat" }, 
  { component: BitcoinPrice, gridX: 1, gridY: -1, label: "Bitcoin Price" },  // Top right
  // Add more additions here with grid coordinates
];

export default function InfiniteCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(ZOOM.default);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  const [showTip, setShowTip] = useState(true);
  const [showDebug, setShowDebug] = useState(false); // Toggle for debug info
  const [showZoomControls, setShowZoomControls] = useState(false); // Show zoom controls on mobile

  // Center the canvas initially
  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
  
      setPosition({
        x: viewportWidth / 2 - GRID.centerX,
        y: viewportHeight / 2 - GRID.centerY
      });
  
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('debug') === 'true') {
        setShowDebug(true);
      }
  
      setShowZoomControls(window.innerWidth < 768);
    }
  }, []);
  

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle debug mode with "D" key
      if (e.key === 'd' || e.key === 'D') {
        setShowDebug(prev => !prev);
      }
      
      // Return to center with "C" key
      if (e.key === 'c' || e.key === 'C') {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        setPosition({
          x: viewportWidth / 2 - GRID.centerX,
          y: viewportHeight / 2 - GRID.centerY
        });
      }

      // Reset zoom with "R" key
      if (e.key === 'r' || e.key === 'R') {
        setZoomLevel(ZOOM.default);
      }

      // Zoom in with "+" key
      if (e.key === '+' || e.key === '=') {
        setZoomLevel(prev => Math.min(prev + ZOOM.step, ZOOM.max));
      }

      // Zoom out with "-" key
      if (e.key === '-' || e.key === '_') {
        setZoomLevel(prev => Math.max(prev - ZOOM.step, ZOOM.min));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle mouse wheel for zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't zoom if ctrl key isn't pressed (for better accessibility)
      if (!e.ctrlKey) return;
      
      e.preventDefault();
      
      // Calculate new zoom level based on wheel delta
      const delta = e.deltaY * -0.01;
      const newZoomLevel = Math.max(
        ZOOM.min, 
        Math.min(ZOOM.max, zoomLevel + delta * ZOOM.step)
      );
      
      // Apply zoom centered on mouse position
      if (newZoomLevel !== zoomLevel) {
        // Calculate mouse position relative to canvas
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate new position to keep mouse over same point
        const scaleFactor = newZoomLevel / zoomLevel;
        const newPosition = {
          x: mouseX - (mouseX - position.x) * scaleFactor,
          y: mouseY - (mouseY - position.y) * scaleFactor
        };
        
        setZoomLevel(newZoomLevel);
        setPosition(newPosition);
      }
    };

    // Add passive: false to prevent default browser zoom behavior
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoomLevel, position]);

  // Handle mouse/touch events for dragging and pinch zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    
    // Early return if canvas ref is null
    if (!canvas) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      // Handle pinch-to-zoom with two fingers
      if (e.touches.length === 2) {
        // Prevent default browser behavior (zooming the page)
        e.preventDefault();
        
        // Calculate initial distance between fingers
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const initialDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        setLastDistance(initialDistance);
      }
      // Handle single finger drag
      else if (e.touches.length === 1) {
        setIsDragging(true);
        setStartPos({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      // Handle pinch-to-zoom with two fingers
      if (e.touches.length === 2 && lastDistance !== null) {
        // Prevent default browser behavior
        e.preventDefault();
        
        // Calculate current distance between fingers
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        
        // Calculate zoom change
        const ratio = currentDistance / lastDistance;
        const newZoomLevel = Math.max(
          ZOOM.min, 
          Math.min(ZOOM.max, zoomLevel * ratio)
        );
        
        // Calculate midpoint between fingers (center of zoom)
        const midX = (touch1.clientX + touch2.clientX) / 2;
        const midY = (touch1.clientY + touch2.clientY) / 2;
        
        // Calculate new position to keep midpoint at the same position
        const rect = canvas.getBoundingClientRect();
        const midpointX = midX - rect.left;
        const midpointY = midY - rect.top;
        
        const scaleFactor = newZoomLevel / zoomLevel;
        const newPosition = {
          x: midpointX - (midpointX - position.x) * scaleFactor,
          y: midpointY - (midpointY - position.y) * scaleFactor
        };
        
        // Update state
        setZoomLevel(newZoomLevel);
        setPosition(newPosition);
        setLastDistance(currentDistance);
      }
      // Handle single finger drag
      else if (e.touches.length === 1 && isDragging) {
        // Prevent default to stop scrolling
        e.preventDefault();
        
        setPosition({
          x: e.touches[0].clientX - startPos.x,
          y: e.touches[0].clientY - startPos.y
        });
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      // If we're ending a pinch and there are no more touches, reset lastDistance
      if (e.touches.length < 2) {
        setLastDistance(null);
      }
      
      // If all fingers are lifted, end dragging
      if (e.touches.length === 0) {
        setIsDragging(false);
      }
    };
    
    // Add event listeners with correct typecasting
    canvas.addEventListener('mousedown', handleMouseDown as EventListener);
    window.addEventListener('mousemove', handleMouseMove as EventListener);
    window.addEventListener('mouseup', handleMouseUp as EventListener);
    
    canvas.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
    window.addEventListener('touchend', handleTouchEnd as EventListener);
    
    // Auto-hide the tip after 5 seconds
    const timeout = setTimeout(() => {
      setShowTip(false);
    }, 5000);
    
    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown as EventListener);
      window.removeEventListener('mousemove', handleMouseMove as EventListener);
      window.removeEventListener('mouseup', handleMouseUp as EventListener);
      
      canvas.removeEventListener('touchstart', handleTouchStart as EventListener);
      canvas.removeEventListener('touchmove', handleTouchMove as EventListener);
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
      
      clearTimeout(timeout);
    };
  }, [isDragging, position, startPos, zoomLevel, lastDistance]);

  // Zoom in function
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + ZOOM.step, ZOOM.max));
  };

  // Zoom out function
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - ZOOM.step, ZOOM.min));
  };

  // Reset zoom function
  const resetZoom = () => {
    setZoomLevel(ZOOM.default);
  };

  // Generate grid lines for the canvas
  const renderGridLines = () => {
    if (!GRID.showGridLines && !showDebug) return null;
    
    const gridLines = [];
    const gridSize = 10; // How many grid cells to show in each direction
    
    // Vertical lines
    for (let i = -gridSize; i <= gridSize; i++) {
      const x = GRID.centerX + i * GRID.cellSize;
      gridLines.push(
        <div 
          key={`v-${i}`}
          className="absolute top-0 bottom-0 border-l border-gray-300 opacity-30"
          style={{ left: `${x}px` }}
        />
      );
    }
    
    // Horizontal lines
    for (let i = -gridSize; i <= gridSize; i++) {
      const y = GRID.centerY + i * GRID.cellSize;
      gridLines.push(
        <div 
          key={`h-${i}`}
          className="absolute left-0 right-0 border-t border-gray-300 opacity-30"
          style={{ top: `${y}px` }}
        />
      );
    }
    
    return gridLines;
  };
  
  // Generate coordinate labels for the grid
  const renderCoordinates = () => {
    if (!GRID.showCoordinates && !showDebug) return null;
    
    const coordinates = [];
    const gridSize = 10; // How many grid cells to show in each direction
    
    // Generate coordinate labels
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let y = -gridSize; y <= gridSize; y++) {
        // Skip the very dense inner coordinates for clarity
        if (Math.abs(x) < 3 && Math.abs(y) < 3 && !(x === 0 && y === 0)) continue;
        
        const pixelPos = gridToPixel(x, y);
        coordinates.push(
          <div 
            key={`coord-${x}-${y}`}
            className="absolute bg-white bg-opacity-70 px-1 text-xs text-gray-600 rounded"
            style={{ 
              left: `${pixelPos.x}px`, 
              top: `${pixelPos.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {x},{y}
          </div>
        );
      }
    }
    
    return coordinates;
  };

  return (
    <div className="flex-grow relative overflow-hidden bg-qwerty-white">
      {/* Draggable Canvas */}
      <div 
        ref={canvasRef}
        className={`absolute inset-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          width: '10000px', 
          height: '10000px',
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`
        }}
      >
        {/* Grid Pattern for Visual Reference */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, #ddd 1px, transparent 1px)', 
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0',
          width: '100%',
          height: '100%',
          opacity: 0.3
        }}></div>
        
        {/* Grid Lines */}
        {renderGridLines()}
        
        {/* Grid Coordinates */}
        {renderCoordinates()}
        
        {/* Render all additions from the ADDITIONS array */}
        {ADDITIONS.map((addition, index) => {
          const { component: Component, gridX, gridY, label } = addition;
          const pixelPos = gridToPixel(gridX, gridY);
          
          return (
            <div 
              key={`addition-${index}`}
              className="absolute"
              style={{ 
                left: `${pixelPos.x}px`, 
                top: `${pixelPos.y}px`, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              {showDebug && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                  {label} ({gridX}, {gridY})
                </div>
              )}
              <Component />
            </div>
          );
        })}
      </div>
      
      {/* Instruction Overlay - Appears for 5 seconds */}
      {showTip && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-20 bg-qwerty-dark-blue text-qwerty-white px-6 py-3 rounded-full shadow-lg text-center">
          <p className="text-sm font-telegraph-medium">
            Drag to explore the infinite canvas!
            <br />
            <span className="text-xs opacity-80 mt-1 inline-block">
              {window.innerWidth < 768 ? 
                "Pinch with two fingers to zoom in and out" : 
                "Hold Ctrl and use mouse wheel to zoom"}
            </span>
          </p>
        </div>
      )}
      
      {/* Zoom Controls for Mobile */}
      {showZoomControls && (
        <div className="fixed bottom-16 right-4 z-30 flex flex-col gap-2">
          <button 
            onClick={zoomIn}
            className="w-10 h-10 rounded-full bg-qwerty-dark-blue text-white flex items-center justify-center shadow-lg"
            aria-label="Zoom in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <button 
            onClick={resetZoom}
            className="w-10 h-10 rounded-full bg-qwerty-dark-blue text-white flex items-center justify-center shadow-lg text-xs font-telegraph-bold"
            aria-label="Reset zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          
          <button 
            onClick={zoomOut}
            className="w-10 h-10 rounded-full bg-qwerty-dark-blue text-white flex items-center justify-center shadow-lg"
            aria-label="Zoom out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed bottom-4 right-4 z-30 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-xs">
          <div className="font-bold mb-1">Debug Mode</div>
          <div>Press D to toggle debug view</div>
          <div>Press C to center canvas</div>
          <div>Press R to reset zoom</div>
          <div>Press +/- to zoom in/out</div>
          <div className="mt-2">
            <span className="font-medium">Current View:</span> 
            X: {Math.round(-position.x + window.innerWidth/2)}, 
            Y: {Math.round(-position.y + window.innerHeight/2)}
          </div>
          <div>
            <span className="font-medium">Zoom:</span> {Math.round(zoomLevel * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}