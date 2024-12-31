import React from 'react';
import Providers from './providers';
import "./globals.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Todo List</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-100">
        <Providers>
          <div>
            <header className="flex justify-center">
              <h1 
                className="text-4xl font-extrabold text-center text-gray-950 " 
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                LISTA DE TAREFAS
              </h1>
            </header>
            <main className="w-full max-w-sm m-auto mt-5">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
