export default function DancingCat() {
    return (
      <div className="p-6 border-2 border-qwerty-dark-blue rounded-lg bg-qwerty-white shadow-md">
        <h3 className="text-lg font-telegraph-bold text-qwerty-dark-blue mb-3">Dancing Cat</h3>
        
        <div className="w-40 h-40 mx-auto">
          <div className="dancing-cat">
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <g className="cat">
                {/* Cat head */}
                <circle cx="50" cy="40" r="20" fill="#333" />
                {/* Cat ears */}
                <polygon points="35,25 30,5 45,20" fill="#333" />
                <polygon points="65,25 70,5 55,20" fill="#333" />
                {/* Cat eyes */}
                <circle cx="40" cy="35" r="3" fill="#fff" />
                <circle cx="60" cy="35" r="3" fill="#fff" />
                {/* Cat body */}
                <ellipse cx="50" cy="70" rx="25" ry="20" fill="#333" />
                {/* Cat tail */}
                <path d="M75,65 Q95,55 90,40" stroke="#333" strokeWidth="5" fill="none" className="tail" />
                {/* Cat legs */}
                <rect x="30" y="85" width="5" height="15" fill="#333" className="leg-left" />
                <rect x="65" y="85" width="5" height="15" fill="#333" className="leg-right" />
              </g>
            </svg>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-qwerty-gray text-sm italic">
            Added from CatLover99&apos;s comment - April 29, 2025
          </p>
        </div>
        
        <style jsx>{`
          .dancing-cat .cat {
            animation: dance 2s infinite alternate ease-in-out;
            transform-origin: center bottom;
          }
          
          .dancing-cat .tail {
            animation: sway 1.5s infinite alternate ease-in-out;
            transform-origin: 75px 65px;
          }
          
          .dancing-cat .leg-left {
            animation: legMove 1s infinite alternate ease-in-out;
            transform-origin: top center;
          }
          
          .dancing-cat .leg-right {
            animation: legMove 1s infinite alternate-reverse ease-in-out;
            transform-origin: top center;
          }
          
          @keyframes dance {
            0% { transform: translateY(0) rotate(-5deg); }
            100% { transform: translateY(-10px) rotate(5deg); }
          }
          
          @keyframes sway {
            0% { transform: rotate(-20deg); }
            100% { transform: rotate(20deg); }
          }
          
          @keyframes legMove {
            0% { transform: rotate(-5deg); }
            100% { transform: rotate(5deg); }
          }
        `}</style>
      </div>
    );
  }