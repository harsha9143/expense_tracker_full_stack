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

  const table = document.getElementById("expenses-list");

  const expensesJson = await fetch(`http://localhost:4000/expenses/items`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const expenses = await expensesJson.json();

  for (let i = 0; i < expenses.length; i++) {
    console.log(expenses[i]);
    display(table, expenses[i]);
  }

  const userType = await fetch(`http://localhost:4000/expenses/user-type`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const userTypeData = await userType.json();
  const isPremiumUser = userTypeData.isPremiumUser;

  const btn = document.getElementById("leader-board");
  const link = document.querySelector("a");

  if (isPremiumUser) {
    link.style.display = "none";
    btn.style.display = "inline-block";
    btn.addEventListener("click", () => showLeaderBoard());
  } else {
    link.style.display = "inline-block";
    btn.style.display = "none";
  }
}

async function handleOnSubmit(event) {
  event.preventDefault();

  const price = event.target.price.value;
  const description = event.target.description.value;
  const token = localStorage.getItem("token");

  const categoryData = await fetch("http://localhost:4000/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ description }),
  });

  console.log("line 1");

  const categoryObj = await categoryData.json();
  const category = categoryObj.category;

  const addExpense = await fetch("http://localhost:4000/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ price, description, category }),
  });

  console.log("line 2");

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
  const tr = document.createElement("tr");

  tr.innerHTML = `
                <td>${new Date(data.createdAt).toLocaleDateString("en-IN")}</td>
                <td>${data.description}</td>
                <td>${data.price}</td>
                <td>${data.category}</td>
            `;

  const del = document.createElement("button");
  del.textContent = "Delete";
  del.style.margin = "0px 10px";

  const td = document.createElement("td");
  td.appendChild(del);

  tr.appendChild(td);

  ul.appendChild(tr);

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

async function showLeaderBoard() {
  const token = localStorage.getItem("token");

  const leaderBoard = document.getElementById("leader-board-list");
  const table = document.getElementById("leader-board-table");
  table.style.display = "inline";
  const h1 = document.getElementById("heading");
  h1.style.display = "inline";

  const userwiseExpenses = await fetch(
    "http://localhost:4000/expenses/leader-board",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await userwiseExpenses.json();

  for (let i = 0; i < data.length; i++) {
    const tr = document.createElement("tr");

    tr.innerHTML = `<td>${i + 1}</td>
    <td>${data[i].name}</td>
    <td>${data[i].totalPrice}</td>`;
    leaderBoard.appendChild(tr);
  }
}
