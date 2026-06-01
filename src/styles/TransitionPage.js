import { useState, useEffect } from 'react';
import { TransitionComponet } from './Components.styles';

export default function TransitionPage({ currentPageData, pageKey }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  
  useEffect(() => {
    setIsTransitioning(true);
    
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); 

    return () => clearTimeout(timer);
  }, [pageKey]); 

  return (
    <TransitionComponet className={`novel-container ${isTransitioning ? 'page-flip-effect' : ''}`}>
      
    
    </TransitionComponet>
  );
}