async function handleOnSubmit(event) {
  event.preventDefault();

  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  const user = await fetch(`http://localhost:4000/home/user/${email}`);

  const data = await user.json();

  if (user.status === 403) {
    const msg = document.getElementById("error-message");

    msg.textContent = data.message;
    msg.style.color = "red";
    return;
  }

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
  msg.style.color = "green";
}
