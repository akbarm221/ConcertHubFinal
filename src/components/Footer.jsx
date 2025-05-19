import React from 'react';
import logo from '../assets/logo.svg'

const Footer = () => {
   const currentYear = new Date().getFullYear();
 
   return (
   
     <footer className="bg-slate-900 text-gray-400 mt-auto">
      
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
 
      
         <div className="mb-8"> 
          
           <div className="flex items-center space-x-3 mb-4">
            
              <img
                src={logo} 
                alt="ConcertHub Logo"
                className="h-8 w-auto" 
              />
         
             <span className="text-2xl font-bold text-white">ConcertHub</span>
           </div>

           <p className="text-sm max-w-md"> 
             Your premier destination for concert tickets. We connect fans with their favorite artists through seamless booking experiences.
           </p>
         </div>
 
  
         <hr className="border-gray-700 my-8" /> 
 
  
         <div className="text-center text-sm"> 
           &copy; {currentYear} ConcertHub. All rights reserved.
         </div>
 
       </div>
     </footer>
   );
 };
 
 export default Footer;