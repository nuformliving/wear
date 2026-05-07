import { getStore } from "@netlify/blobs";

const handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = event.body;
    const isBase64 = event.isBase64Encoded;
    const contentType = event.headers["content-type"] || "";

    // Handle FormData with boundary parsing
    let imageBuffer;
    let mimeType = "image/jpeg";

    if (contentType.includes("multipart/form-data")) {
      // Extract boundary from content-type
      const boundaryMatch = contentType.match(/boundary=([^;]+)/);
      const boundary = boundaryMatch ? boundaryMatch[1] : "";

      // Decode body if base64
      const fullBody = isBase64
        ? Buffer.from(body, "base64").toString("binary")
        : body;

      // Parse multipart form data
      const parts = fullBody.split(`--${boundary}`);

      // Find the image part
      for (const part of parts) {
        if (part.includes("filename=")) {
          // Extract MIME type from headers
          const mimeMatch = part.match(/Content-Type:\s*([^\r\n]+)/);
          if (mimeMatch) {
            mimeType = mimeMatch[1];
          }

          // Extract binary image data
          const dataStart = part.indexOf("\r\n\r\n");
          if (dataStart !== -1) {
            const dataEnd = part.lastIndexOf("\r\n");
            imageBuffer = Buffer.from(
              part.slice(dataStart + 4, dataEnd),
              "binary"
            );
            break;
          }
        }
      }
    } else {
      // Direct binary upload
      imageBuffer = isBase64
        ? Buffer.from(body, "base64")
        : Buffer.from(body, "utf-8");
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No image data received" }),
      };
    }

    // Generate unique filename
    const ext = mimeType.split("/")[1] || "jpg";
    const filename = `img-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Store in Netlify Blobs
    const store = getStore("images");
    await store.set(filename, imageBuffer, {
      contentType: mimeType,
    });

    // Return public URL for the uploaded image
    const url = `/.netlify/blobs/images/${filename}`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        filename,
        message: "Image uploaded successfully",
      }),
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Upload failed" }),
    };
  }
};

export default handler;
