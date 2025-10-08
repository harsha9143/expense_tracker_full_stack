async function handleOnSubmit(event) {
  event.preventDefault();

  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  const newUser = await fetch(`http://localhost:4000/home/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data2 = await newUser.json();

  const msg = document.getElementById("error-message");
  msg.textContent = data2.message;

  if (newUser.status === 201) {
    msg.style.color = "green";
    return;
  }

  msg.style.color = "red";
}
