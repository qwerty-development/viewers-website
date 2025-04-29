export default function FeaturedComment({ comment }:any) {
    return (
      <div className="pt-8 px-4 bg-gradient-to-r bg-qwerty-dark-blue relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-qwerty-white rounded-2xl shadow-lg p-1 transform -translate-y-4">
            <div className="bg-gradient-to-r from-qwerty-dark-blue to-[#024A61] rounded-xl p-1">
              <div className="bg-qwerty-white rounded-xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-telegraph-bold text-qwerty-dark-blue">Today&apos;s Top Comment:</h3>
                  <div className="flex items-center space-x-1">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="text-qwerty-gray font-telegraph-medium">{comment.likes}</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-qwerty-dark-blue rounded-full flex items-center justify-center">
                    <span className="text-qwerty-white font-telegraph-bold">
                      {comment.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xl font-telegraph-medium text-qwerty-dark-blue leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 text-qwerty-gray text-sm">
                      <p className="font-telegraph-medium">@{comment.author}</p>
                      <p>{comment.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }