import { MemoryRouter } from 'react-router-dom';
import { TadcApp } from "./tadc-app.js";
    
export const TadcAppBasic = () => {
  return (
    <MemoryRouter>
      <TadcApp />
    </MemoryRouter>
  );
}