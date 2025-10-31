import { AppDispatch, RootState } from '@/components/store/store';
import { getUserProfile } from '@/reducer/userProfile';
import React, { useEffect, useMemo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

const useUserProfile = (username?:string) => {
    const dispatch=useDispatch<AppDispatch>();
    const lowerUsername = useMemo(
        () => (typeof username === "string" ? username.toLowerCase() : ""),
        [username]
      );
    const { cache, loading, error } = useSelector(
        (s: RootState) => s.userProfile,
        shallowEqual
      );

     const profile = lowerUsername ? cache[lowerUsername] : null;
   
     useEffect(() => {
        if (lowerUsername && !profile && !loading) {
          dispatch(getUserProfile({ name: lowerUsername }));
        }
      }, [lowerUsername, profile, dispatch,loading]);

      return {
        profile,
        loading,
        error,
        retry: () => dispatch(getUserProfile({ name: lowerUsername })),
      };
}

export default useUserProfile