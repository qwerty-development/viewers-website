"use client";


import Footer from '@/components/footer';
import FeaturedComment from '@/components/comment';
import InfiniteCanvas from '@/components/canva';

export default function Home() {
  // Just the latest comment - update this daily
  const latestComment = { 
    text: "Add a dancing cat animation to the website!", 
    author: "CatLover99", 
    likes: 1243, 
    date: "April 29, 2025" 
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-telegraph-ultralight">

      <FeaturedComment comment={latestComment} />
      <InfiniteCanvas />
      <Footer />
    </div>
  );
}