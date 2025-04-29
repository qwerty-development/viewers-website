// This is a template for creating new additions
// 1. Copy this file and rename it to match your addition (e.g., RainbowText.tsx)
// 2. Customize the content inside the component
// 3. Import and add it to InfiniteCanvas.tsx with proper positioning

export default function Template() {
    return (
      <div className="p-6 border-2 border-qwerty-dark-blue rounded-lg bg-qwerty-white shadow-md">
        <h3 className="text-lg font-telegraph-bold text-qwerty-dark-blue mb-3">
          Addition Title
        </h3>
        
        {/* Add your content here */}
        <div className="my-4">
          {/* This is where you'll implement whatever the comment requested */}
          <p className="text-qwerty-dark-blue font-telegraph-medium">
            Example content goes here
          </p>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-qwerty-gray text-sm italic">
            Added from [Username]&apos;s comment - [Date]
          </p>
        </div>
        
        {/* Add any custom styles if needed */}
        <style jsx>{`
          /* Your custom CSS here */
        `}</style>
      </div>
    );
  }