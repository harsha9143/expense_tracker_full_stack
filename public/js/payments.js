const cashfree = Cashfree({
  mode: "sandbox",
});
document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:4000/payments/pay", {
      method: "POST",
    });

    const data = await response.json();

    const paymentSessionId = data.paymentSessionId;

    let checkoutOptions = {
      paymentSessionId: paymentSessionId,
      redirectTarget: "_self",
    };
    await cashfree.checkout(checkoutOptions);
  } catch (error) {
    console.log(error.message);
  }
});
