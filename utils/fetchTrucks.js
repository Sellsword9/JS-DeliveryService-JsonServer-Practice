import { urlTrucks } from "../main";

export const fetchTrucks = async () => {
  const response = await fetch(urlTrucks);
  const trucks = await response.json();
  return trucks;
};
