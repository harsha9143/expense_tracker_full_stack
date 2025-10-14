async function handleOnSubmit(event) {
  event.preventDefault();

  const password = event.target.password.value;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uuid = urlParams.get("uuid");

  const setPassword = await fetch("http://localhost:4000/home/password-reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, uuid }),
  });

  const data = await setPassword.json();

  const msg = document.getElementById("msg");
  msg.textContent = data.message;

  if (setPassword.status === 200) {
    msg.style.color = "green";
  } else {
    msg.style.color = "red";
  }
}
