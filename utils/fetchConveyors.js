import { urlConveyors } from "../main";

export const fetchConveyors = async () => {
  const response = await fetch(urlConveyors);
  const conveyors = await response.json();
  return conveyors;
};
