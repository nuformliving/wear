import { getStore } from "@netlify/blobs";

const handler = async (event, context) => {
  const { httpMethod } = event;

  try {
    const store = getStore("products");

    if (httpMethod === "GET") {
      // Fetch all products
      try {
        const data = await store.get("productsList");
        const products = data ? JSON.parse(data) : [];
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products }),
        };
      } catch (err) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: [] }),
        };
      }
    }

    if (httpMethod === "PUT") {
      // Save products
      const body = JSON.parse(event.body || "{}");
      const { products } = body;

      if (!Array.isArray(products)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Products must be an array" }),
        };
      }

      await store.set("productsList", JSON.stringify(products));

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, message: "Products saved" }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (error) {
    console.error("Products API Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Server error" }),
    };
  }
};

export default handler;
