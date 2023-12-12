import { urlCrates } from "../main";

export async function fetchCrates() {
  const response = await fetch(urlCrates);
  const crates = await response.json();
  return crates;
}
