import { useState, useEffect, useCallback, useMemo } from "react";

interface UseInfiniteScrollProps<T> {
    items: T[];
    batchSize: number;
  }


  export const useInfiniteScroll = <T>({items,batchSize}:UseInfiniteScrollProps<T>)=>{
    const [displayedItems, setDisplayedItems] = useState<T[]>([]);

    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (items.length > 0) {
          setDisplayedItems(items.slice(0, batchSize));
          setHasMore(items.length > batchSize);
        } else {
          setDisplayedItems([]);
          setHasMore(false);
        }
      }, [items, batchSize]);


        // Load next batch
  const loadNextBatch = useCallback(() => {
    setDisplayedItems(prev => {
      const nextBatch = items.slice(prev.length, prev.length + batchSize);
      const newList = [...prev, ...nextBatch];
      setHasMore(newList.length < items.length);
      return newList;
    });
  }, [items, batchSize]);

  const handleScroll = useCallback(() => {
    if (!hasMore) return;

    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollY + clientHeight >= scrollHeight - 250) {
      loadNextBatch();
    }
  }, [hasMore, loadNextBatch]);
  

    // Attach scroll listener
    useEffect(() => {
        let ticking = false;
    
        const onScroll = () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              handleScroll();
              ticking = false;
            });
            ticking = true;
          }
        };
    
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
      }, [handleScroll]);

      return useMemo(() => ({ displayedItems, hasMore }), [displayedItems, hasMore]);

  }