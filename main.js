const urlCrates = 'http://localhost:3000/crates';
const urlTrucks = 'http://localhost:3000/trucks';
const urlConveyors = 'http://localhost:3000/conveyors';
const urlDeliveries = 'http://localhost:3000/deliveries';
const template = `
      <div class="crateinfo">
        <h3>CRATE NAME</h3>
        <p>CRATE DESCRIPTION</p>
        <p>CRATE WEIGHT</p>
        <p>CRATE VALUE</p>
        <p>DELIVERY TYPE</p>
        <p>CRATE STATUS</p>
      </div>
      <form>
        <!-- This form selects what truck and what conveyor should be used-->
        <select name="truck">
          <option value="no-truck">-- SELECT TRUCK --</option>
          <option class="validselection" value="truck1">Long-Distance 1</option>
          <option class="validselection" value="truck2">Long-Distance 2</option>
          <option class="validselection" value="truck3">Short-Distance 1</option>
          <option class="validselection" value="truck4">Short-Distance 2</option>
        </select>
        <select name="conveyor">
          <option class="goodselection" value="conveyor0">Manual-labor</option>
          <option class="validselection" value="conveyor1">Conveyor Alpha</option>
          <option class="validselection" value="conveyor2">Conveyor Bravo</option>
          <option class="validselection" value="conveyor3">Conveyor Charlie</option>
        </select>
        <input type="submit" value="SEND CRATE">
      </form>`;

async function sendCrate(crateElement) {
  const trucks = await fetchTrucks();
  const conveyors = await fetchConveyors();
  const truckElement = crateElement.querySelector('select[name="truck"]');
  const conveyorElement = crateElement.querySelector('select[name="conveyor"]');

  const truckId = truckElement.value;
  const conveyorId = conveyorElement.value;
  const truck = trucks.find(t => truckId.includes(t.id));
  const conveyor = conveyors.find(c => conveyorId.includes(c.id));

  const crateId = crateElement.dataset.id;
  if (truck && conveyor) {
    const response = await fetch(`${urlDeliveries}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        crateId,
        truckId,
        conveyorId
      })
    });
    if (response.ok) {
      crateElement.remove();
      let crates = await fetchCrates();
      updateProfits(crates, conveyors);
    } else {
      alert('Something went wrong');
    }
  }

}


// on document load, fetch crates and append them to the DOM
async function loadCrates(element) {
  const crates = await fetchCrates();
  const conveyors = await fetchConveyors();
  const deliveries = await fetchDeliveries();
  if (deliveries && deliveries.length > 0) {
    updateProfits(crates, conveyors);
  }
  crates.forEach(crate => {
    const crateElement = document.createElement('div');
    crateElement.classList.add('crate');
    crateElement.dataset.id = crate.id;
    crateElement.innerHTML = template;
    crateElement.querySelector('h3').innerText = crate.name;
    crateElement.querySelector('p:nth-of-type(1)').innerText = crate.description;
    crateElement.querySelector('p:nth-of-type(2)').innerText = crate.weight;
    crateElement.querySelector('p:nth-of-type(3)').innerText = crate.value;
    crateElement.querySelector('p:nth-of-type(4)').innerText = crate.deliverytype;
    crateElement.querySelector('p:nth-of-type(5)').innerText = crate.status;
    element.appendChild(crateElement);
    crateElement.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      sendCrate(crateElement);
    });
  });
}



async function fetchCrates() {
  const response = await fetch(urlCrates);
  const crates = await response.json();
  return crates;
}
const fetchTrucks = async () => {
  const response = await fetch(urlTrucks);
  const trucks = await response.json();
  return trucks;
}
const fetchConveyors = async () => {
  const response = await fetch(urlConveyors);
  const conveyors = await response.json();
  return conveyors;
}
const fetchDeliveries = async () => {
  const response = await fetch(urlDeliveries);
  const deliveries = await response.json();
  return deliveries;
}

// profits

async function updateProfits(crates, conveyors) {
  const deliveries = await fetchDeliveries();
  let crate, conveyor;
  const profits = deliveries.reduce((acc, delivery) => {
    crate = crates.find(c => delivery.crateId.includes(c.id));
    conveyor = conveyors.find(c => delivery.conveyorId.includes(c.id));
    const deliveryCost = conveyor.cost;
    const deliveryProfit = crate.value - deliveryCost;
    return acc + deliveryProfit;
  }, 0);
  const profitsElement = document.getElementById('profitList');
  profitsElement.innerText += `
    Total profits: ${profits}
    Crate: ${crate.name}->+$${crate.value},
    Conveyor: ${conveyor.name}->$${conveyor.cost},`;
  document.querySelector('.balance').querySelector('h1').innerText = `Balance: $${profits}`;
}






const crateDisplayer = document.getElementById("inputCrates");
loadCrates(crateDisplayer);