async function handleOnSubmit(event) {
  event.preventDefault();

  const email = event.target.email.value;

  console.log("From submitted");

  const resetMsg = await fetch("http://localhost:4000/home/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await resetMsg.json();

  const msg = document.getElementById("msg");

  msg.textContent = data.message;

  if ((resetMsg.status = 200)) {
    msg.style.color = "green";
  } else {
    msg.style.color = "red";
  }
}
