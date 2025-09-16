import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const RestoreLastRoute = () => {

  const navigate = useNavigate();
  const restored = useRef(false);

  useEffect(()=>{

    setTimeout(()=>{
     const lastPath = localStorage.getItem('lastPath');
    if (lastPath && lastPath !== window.location.pathname) {
      restored.current = true; 
      navigate(lastPath, { replace: true });
    } else {
      restored.current = true; 
    }
    })
    localStorage.setItem('lastPath', window.location.pathname)
  },[])

  return null
}