import { Button } from '@mui/material';
import React from 'react';

const UniversityHero: React.FC = () => {
  return (
    <div className="relative bg-university-blue text-white py-16">
      <div className="absolute inset-0 bg-gradient-to-r from-university-blue to-university-green opacity-90"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            Welcome to GlobalU University
          </h1>
          <p className="text-xl mb-8">
            Where knowledge meets innovation. Explore our programs and discover how our AI-assisted
            learning environment can help shape your future.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-university-gold text-university-dark hover:bg-university-gold/90">
              Explore Programs
            </Button>
            <Button  className="bg-transparent border-white text-white hover:bg-white hover:text-university-blue">
              Virtual Campus Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityHero;
