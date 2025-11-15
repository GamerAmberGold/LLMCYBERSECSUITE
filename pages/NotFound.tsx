
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
        <h1 className="text-9xl font-black text-primary-800">404</h1>
        <p className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Page Not Found
        </p>
        <p className="mt-4 text-muted-foreground">
            Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Link to="/dashboard">
            <Button className="mt-6">Go back home</Button>
        </Link>
    </div>
  );
};

export default NotFound;
