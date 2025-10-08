document.addEventListener("DOMContentLoaded", initialize());

async function initialize() {
  const ul = document.getElementById("expenses-list");

  const expensesJson = await fetch(`http://localhost:4000/expenses/items`);
  const expenses = await expensesJson.json();

  for (let i = 0; i < expenses.length; i++) {
    display(ul, expenses[i]);
  }
}

async function handleOnSubmit(event) {
  event.preventDefault();

  const price = event.target.price.value;
  const description = event.target.description.value;
  const category = event.target.category.value;

  const addExpense = await fetch("http://localhost:4000/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ price, description, category }),
  });

  const data = await addExpense.json();

  const msg = document.getElementById("message");

  msg.textContent = data.message;

  if (addExpense.status === 201) {
    msg.style.color = "green";
  } else {
    msg.style.color = "red";
  }

  location.reload();
}

function display(ul, data) {
  const li = document.createElement("li");

  li.textContent = `${data.price} - ${data.description} - ${data.category} - `;

  const del = document.createElement("button");
  del.textContent = "Delete";

  li.appendChild(del);

  li.style.display = "flex";

  ul.appendChild(li);

  del.addEventListener("click", () => deleteItem(li, data.id));
}

async function deleteItem(li, id) {
  li.remove();
  const delItem = await fetch(`http://localhost:4000/expenses/remove/${id}`, {
    method: "DELETE",
  });
  const delmsg = await delItem.json();

  const msg = document.getElementById("del-msg");
  msg.textContent = delmsg.message;

  if (delItem.status === 200) {
    msg.style.color = "green";
  } else {
    msg.style.color = "red";
  }
}
