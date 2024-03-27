import { useState, useEffect } from 'react';

export default function useWindowDimentions() {
    
        //function to get current window dimentions
        function getWindowDimensions() {
            const { innerWidth: width, innerHeight: height } = window;
            return {
            width,
            height
            };
        }

        // state for window dimentions 
        const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
 
        useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        //add event listener for resize of window dimentions.s
        window.addEventListener('resize', handleResize);

        //cleanup function to remove resize event listener
        return () => window.removeEventListener('resize', handleResize);
        }, []);
            
      return windowDimensions;
    }