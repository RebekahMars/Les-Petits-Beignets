/*Global Variable Shop ID */
let shopID;

function getShopNames() 
{
  let shopNameDropdown = document.getElementById("shopName");

  fetch("https://donutshop-api.herokuapp.com/shops", {
      "method": "GET"
  })
.then(response => response.json())
.then(data => {
    let element;
    for(let i = 0; i < data.length; i++)
    {
       element = document.createElement("option");
       element.value = data[i];
       element.text = data[i];
       shopNameDropdown.add(element);

    }
})
.catch(err => {
  console.error(err);
});
}
function getShopID()
{
  let shopName = document.getElementById("shopName").value;

  fetch("https://donutshop-api.herokuapp.com/shop-id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: shopName
    })
  })
    .then((response) => response.json())
    .then((data) => {
      shopID = data.id;
    })
    .catch((err) => {
      console.error(err);
    });
}
function createNewShop()
{
  let donutShopModal = document.getElementById("addNewShopModal");
  let submitShopButton = document.getElementById("submitNewShop");
  let exitModalButton = document.getElementById("exitNewShop");
  let nameEntry = document.getElementById("donutNameEntry");

  donutShopModal.style.visibility = "visible";
  exitModalButton.onclick = function(){
    donutShopModal.style.visibility = "hidden";
  }
  submitShopButton.onclick = function(){  
    let newDonutShopName = nameEntry.value;
    if(newDonutShopName.length < 0 || newDonutShopName.length > 255)
    {
      alert("You must enter a valid name length");
    }
    if(!newDonutShopName.trim()) 
    {
      alert("Please enter a name that does not only contains whitespace");
    }
    else
    {
      alert(newDonutShopName + " has been created and added to the database.");
      fetch("https://donutshop-api.herokuapp.com/create-donut-shop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: newDonutShopName
    })
  })
    .then((response) => response.json())
    .then((data) => {
      shopID = data.id;
    })
    .catch((err) => {
      console.error(err);
    });
  }
    }   
}
function getShopDonuts(){
  let shopDonuts = document.getElementById("donutNameList");
  fetch(`https://donutshop-api.herokuapp.com/inventory?id=${shopID}`, {
      "method": "GET"
  })
.then(response => response.json())
.then(data => {
    let element;
    let option;
    for(let i = 0; i < data.donuts.length; i++)
    {
      element = data.donuts;
      option = document.createElement("option");
      option.value = element[i].type;
      option.text = element[i].type;
      if(shopDonuts.length <= data.donuts.length)
      {
        shopDonuts.add(option)
      }

    }
})
.catch(err => {
  console.error(err);
});
}
function addDonuts()
{
  let addDonutsModal = document.getElementById("addDonutsModal");
  let addDonuts = document.getElementById("addDonutsContainer");
  let submit = document.getElementById("addDonutsSubmitButton");
  let exit = document.getElementById("exitDonutsSubmitButton");

  addDonutsModal.style.visibility = "visible";


}
function addDonuts()
{
  let addDonutsModal = document.getElementById("addDonutsModal");
  let addDonuts = document.getElementById("addDonutsContainer");
  let submit = document.getElementById("addDonutsSubmitButton");
  let exit = document.getElementById("exitDonutsSubmitButton");

  addDonutsModal.style.visibility = "visible";

  fetch(`https://donutshop-api.herokuapp.com/inventory?id=${shopID}`, {
      "method": "GET"
  })
.then(response => response.json())
.then(data => {
    let element;
    for(let i = 0; i < data.donuts.length; i++)
    {
      element = data.donuts;
      let radio = document.createElement("input");
      radio.type = "radio";
      radio.id = "donut";
      radio.name = "donutText";
      radio.value = element[i].type;

      let label = document.createElement("label");
      label.htmlFor = "donut";

      let name = document.createTextNode(element[i].type);
      label.appendChild(name);

      let input = document.createElement("input");
      input.id = "donutCount";
      input.name = element[i].type;
      input.type = "number";
      input.min = 1;
      input.max = 100;

      let lineBreak = document.createElement("br");

      let donutCount = document.createTextNode(" Stock: " + element[i].count);
      donutCount.id = "donutCountText";
      donutCount.name = element[i].count;


      addDonuts.appendChild(radio);
      addDonuts.appendChild(label);
      addDonuts.appendChild(input);
      addDonuts.appendChild(donutCount);
      addDonuts.appendChild(lineBreak);
    }
})
.catch(err => {
  console.error(err);
});

submit.onclick = function() {
  let value;
  let selectedValue;
  let radioButtons = document.querySelectorAll('#donut');
  let inputs = document.querySelectorAll('#donutCount');
  let count = document.querySelectorAll('#donutCountText');
  for(let i of radioButtons)
  {
    if(i.checked)
    {
      selectedValue = i.value;
    }
  }
  for(let i of inputs)
  {
    if(selectedValue == i.name)
    {
      value = i.value;
      alert("You have added " + value + " donut(s) to: " + selectedValue);
      fetch(`https://donutshop-api.herokuapp.com/add-donuts?id=${shopID}`, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: selectedValue, //order donut type
          count: value //amount of donut type ordered
        })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(err => {
        console.error(err);
      });
    }
  }
}
exit.onclick = function() {
  let div = document.getElementById("addDonutsContainer");
  while(div.firstChild)
  {
    div.removeChild(div.firstChild);
  }

  addDonutsModal.style.visibility = "hidden";
}
}
function createDonut(){
  let newDonutModal = document.getElementById("createDonutsModal");
  let donutTypeEntry = document.getElementById("newDonutName");
  let donutPriceEntry = document.getElementById("newDonutPrice");

  let submitNewDonut = document.getElementById("submitNewDonutButton");
  let exitNewDonut = document.getElementById("exitNewDonutButton");

  newDonutModal.style.visibility = "visible";

  submitNewDonut.onclick = function() {
    let newDonut = donutTypeEntry.value;
    let newPrice = donutPriceEntry.value;
    newPrice.toFixed(2);

    if(newDonut.length < 0 || newDonut.length > 255)
    {
      alert("Please enter a valid name length");
    }
    if(!newDonut.trim())
    {
      alert("Please enter a name that does not only contain whitespace.")
    }

    if(!newPrice.trim())
    {
      alert("Please enter a valid price. You cannot leave it blank.");
    }
    if(newPrice <= 0 || newPrice > 100 )
    {
      alert("Please enter a valid price between $0-$100.")
    }
    else
    {
      alert("New donut created!");

      fetch(`https://donutshop-api.herokuapp.com/create-donut-type?id=${shopID}`, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        type: newDonut,
        price: newPrice
      })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => {
      console.error(err);
    });
    }
  }
  exitNewDonut.onclick = function(){
    newDonutModal.style.visibility = "hidden";
  }
}
function orderDonuts(){
  let donutOrderForm = document.getElementById("orderContainer");
  let donutShopMenuModal = document.getElementById("orderDonutsModal");
  let donutShopMenu = document.getElementById("menuTable");
  let donutNameInventory = document.getElementById("donutNameList");
  let addMoreDonuts = document.getElementById("addAnotherDonut");
  let exitOrderingModal = document.getElementById("exitOrderButton");
  let submitOrder = document.getElementById("submitOrderButton");

  donutShopMenuModal.style.visibility = "visible";

  addMoreDonuts.onclick = function(){
    let donutNameSelect = document.createElement("select");
    donutNameSelect.id = "donutNameList";
    for(let i=0; i < donutNameInventory.length; i++)
    {
      let donutNameOptions = document.createElement("option");
      donutNameOptions.value = donutNameInventory[i].value;
      donutNameOptions.text = donutNameInventory[i].text;
      donutNameSelect.append(donutNameOptions);
    }
    let donutAmountSelect = document.createElement("input");
    donutAmountSelect.id = "donutNum";
    donutAmountSelect.type = "number";
    donutAmountSelect.min = 0;
    donutAmountSelect.max = 100;

    donutOrderForm.append(donutNameSelect);
    donutOrderForm.append(donutAmountSelect);
  }

  submitOrder.onclick = function()
  {
    let donutInput = document.querySelectorAll('#donutNameList :checked');
    let donutAmount = document.querySelectorAll('#donutNum');
    let selectedDonut = [...donutInput].map(option => option.value);
    let selectedAmount = [...donutAmount].map(option => option.value);
   
    completeOrder(selectedDonut, selectedAmount);

  }

  exitOrderingModal.onclick = function(){
    donutShopMenuModal.style.visibility = "hidden";
    let tableRows = donutShopMenu.getElementsByTagName("tr");
    while(tableRows.length > 1){
      tableRows[1].parentNode.removeChild(tableRows[1]);
    }
  }
  /*Load the donut types and pricing into a table on the page, must have a shop selected first or error is thrown */
  fetch(`https://donutshop-api.herokuapp.com/inventory?id=${shopID}`, {
      "method": "GET"
  })
.then(response => response.json())
.then(data => { 
    let element;
    for(let i = 0; i < data.donuts.length; i++)
    {
      element = data.donuts;

      row = donutShopMenu.insertRow();
      let nameCell = row.insertCell(0);
      let priceCell = row.insertCell(1);
      nameCell.innerHTML = element[i].type;
      priceCell.innerHTML = "$" + element[i].price;

    }
})
.catch(err => {
  console.error(err);
});
}

function displayInventory()
{
  let inventoryModal = document.getElementById("inventoryDisplayModal");
  let exitInventoryModalButton = document.getElementById("exitInventoryModal");
  inventoryModal.style.visibility = "visible";

  exitInventoryModalButton.onclick = function(){
    inventoryModal.style.visibility = "hidden";
    let tableRows = inventory.getElementsByTagName("tr");
    while(tableRows.length > 1){
      tableRows[1].parentNode.removeChild(tableRows[1]);
    }
  }
  let inventory = document.getElementById("inventoryTable");

  fetch(`https://donutshop-api.herokuapp.com/inventory?id=${shopID}`, {
      "method": "GET"
  })
.then(response => response.json())
.then(data => { 
    let element;
    for(let i = 0; i < data.donuts.length; i++)
    {
      element = data.donuts;

      row = inventory.insertRow();
      let nameCell = row.insertCell(0);
      let priceCell = row.insertCell(1);
      let amountCell = row.insertCell(2);
      nameCell.innerHTML = element[i].type;
      priceCell.innerHTML = "$" + element[i].price;
      amountCell.innerHTML = element[i].count;

    }
})
.catch(err => {
  console.error(err);
});
}
function displayRevenue()
{
  let revenueModal = document.getElementById("displayRevenueModal");
  let revenueContainer = document.getElementById("revenueContainer");
  let exitRevenueModal = document.getElementById("exitRevenue");

  revenueModal.style.visibility = "visible";

  fetch(`https://donutshop-api.herokuapp.com/revenue?id=${shopID}`, {
    "method": "GET"
  })
  .then(response => response.json())
  .then(data => { 
    let revenue;
    let revenueValue;
    let dollar = "$";
    revenueValue = document.createElement('p');
    revenueValue.setAttribute('id', "revenueText");
    revenue = dollar + data.revenue;
    revenueValue.innerHTML = revenue;
    revenueContainer.appendChild(revenueValue);
})
.catch(err => {
  console.error(err);
});
  exitRevenueModal.onclick = function(){
    let revenueID = document.getElementById("revenueText")
    revenueModal.style.visibility = "hidden";
    revenueContainer.removeChild(revenueID);
  }

}
function inventoryCheck(name, num)
{
  let valid = -1;
  if(name.includes(""))
  {
    alert("Please select a donut from the drop-down.");
    valid = 0;
  }
  
  fetch(`https://donutshop-api.herokuapp.com/inventory?id=${shopID}`, {
    "method": "GET"
})
.then(response => response.json())
.then(data => {
  let element;
  for(let i = 0; i < data.donuts.length; i++)
  {
    element = data.donuts;
    
    if(name.includes(element[i].type))
    {
      let type = element[i].type;
      let total = element[i].count;
      let arrayIndex = name.findIndex(element => element == type);

      let orderCount = num.splice(arrayIndex, 1);
      if(total < orderCount)
      {
        alert("Sorry! There is not enough of " + type + " in stock for your order.");
        valid = 0;
      }
      else
      {
        valid = 1; 
      }
    }
  }
})
.catch(err => {
console.error(err);
});
}
async function completeOrder(name, num)
{
  let valid;
  if(name.includes(""))
  {
    alert("Please select a donut from the drop-down.");
    valid = 0;
  }
  
  fetch(`https://donutshop-api.herokuapp.com/inventory?id=${shopID}`, {
    "method": "GET"
})
.then(response => response.json())
.then(data => {
  let element;
  for(let i = 0; i < data.donuts.length; i++)
  {
    element = data.donuts;
    
    if(name.includes(element[i].type))
    {
      let type = element[i].type;
      let total = element[i].count;
      let arrayIndex = name.findIndex(element => element == type);
      let orderCount = num[arrayIndex];
      if(total < orderCount)
      {
        alert("Sorry! There is not enough of " + type + " in stock for your order.");
        valid = 0;
      }
      else if (total >= orderCount)
      {
        valid = 1;
      }
    }
  }
  if(valid == 1)
  {
    order(name, num);
  }
})
.catch(err => {
console.error(err);
});
}
function order(types, amounts)
{
  alert("Order Successful!");
  for(let i = 0; i < types.length; i++)
  {  
    fetch(`https://donutshop-api.herokuapp.com/place-order?id=${shopID}`, {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
    type: types[i], //order donut type
    count: amounts[i] //amount of donut type ordered
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(err => {
  console.error(err);
});
}
}