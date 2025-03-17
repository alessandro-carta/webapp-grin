#!/bin/bash

cd backend
npm start &

cd ../frontend
npm run dev &

cd ..

echo "Web app avviata con successo!"