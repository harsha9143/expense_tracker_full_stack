document.addEventListener("DOMContentLoaded", initialize);

async function initialize() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("please login first");
    window.location.href = "http://localhost:4000/home/login";
    return;
  }

  const res = await fetch("http://localhost:4000/verify-token", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (res.status !== 200) {
    alert("session expired");
    localStorage.removeItem("token");
    window.location.href = "http://localhost:4000/home/login";
    return;
  }

  const ul = document.getElementById("expenses-list");

  const expensesJson = await fetch(`http://localhost:4000/expenses/items`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
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
  const token = localStorage.getItem("token");

  const addExpense = await fetch("http://localhost:4000/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
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
  del.style.margin = "0px 10px";

  li.appendChild(del);

  li.style.display = "flex";
  li.style.margin = "10px 0px";

  ul.appendChild(li);

  del.addEventListener("click", () => deleteItem(li, data.id));
}

async function deleteItem(li, id) {
  li.remove();

  const token = localStorage.getItem("token");

  const delItem = await fetch(`http://localhost:4000/expenses/remove/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
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
