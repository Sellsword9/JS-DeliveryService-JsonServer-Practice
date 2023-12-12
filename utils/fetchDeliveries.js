import { urlDeliveries } from "../main";

export const fetchDeliveries = async () => {
  const response = await fetch(urlDeliveries);
  const deliveries = await response.json();
  return deliveries;
};
