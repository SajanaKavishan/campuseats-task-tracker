import { useState } from "react";

function OrderPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    qty: 1,
  });

  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  function validate(values) {
    const newErrors = {};

    if (values.name.trim().length < 2) {
      newErrors.name = "Name too short";
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (Number(values.qty) < 1) {
      newErrors.qty = "Qty must be 1 or more";
    }

    return newErrors;
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const foundErrors = validate(form);
    setErrors(foundErrors);

    if (Object.keys(foundErrors).length === 0) {
      setDone(true);
    }
  }

  if (done) {
    return <p>Thanks, {form.name}! Order received.</p>;
  }

  return (
    <div>
      <h1>Place Order</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error"> {errors.name}</span>}
        </div>

        <br />

        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error"> {errors.email}</span>}
        </div>

        <br />

        <div>
          <label htmlFor="qty">Quantity</label>
          <br />
          <input
            id="qty"
            name="qty"
            type="number"
            value={form.qty}
            onChange={handleChange}
          />
          {errors.qty && <span className="error"> {errors.qty}</span>}
        </div>

        <br />

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default OrderPage;