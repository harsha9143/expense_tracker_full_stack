async function handleOnSubmit(event) {
  event.preventDefault();

  const email = event.target.email.value;
  const password = event.target.password.value;

  const user = await fetch(`http://localhost:4000/home/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await user.json();

  const msg = document.getElementById("message");
  msg.textContent = data.message;

  if (user.status === 200) {
    msg.style.color = "green";
    return;
  }

  msg.style.color = "red";
}
