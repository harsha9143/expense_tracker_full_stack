window.addEventListener("DOMContentLoaded", initialize);

document
  .getElementById("limit-select")
  .addEventListener("change", () =>
    initialize(1, document.getElementById("limit-select").value)
  );

async function initialize(page = 1, limit = 5) {
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

  const expensesJson = await fetch(
    `http://localhost:4000/expenses/items?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await expensesJson.json();
  const expenses = data.expenses || [];
  const paginationData = data.pagination || {};

  table.innerHTML = "";
  for (let i = 0; i < expenses.length; i++) {
    display(table, expenses[i], page, limit);
  }

  showPagination(paginationData);

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

function display(ul, data, page, limit) {
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

  del.addEventListener("click", () => deleteItem(tr, data.id, page, limit));
}

async function deleteItem(li, id, page, limit) {
  const token = localStorage.getItem("token");

  const delItem = await fetch(
    `http://localhost:4000/expenses/remove/${id}?page=${page}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  li.remove();
  initialize(page, limit);
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

function showPagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  nextPage,
  previousPage,
  lastPage,
}) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (hasPreviousPage) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.addEventListener("click", () =>
      initialize(previousPage, document.getElementById("limit-select").value)
    );
    pagination.appendChild(prevBtn);
  }

  const pageInfo = document.createElement("span");
  pageInfo.textContent = ` Page ${currentPage} of ${lastPage} `;
  pageInfo.style.margin = "0 10px";
  pagination.appendChild(pageInfo);

  if (hasNextPage) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () =>
      initialize(nextPage, document.getElementById("limit-select").value)
    );
    pagination.appendChild(nextBtn);
  }
}
