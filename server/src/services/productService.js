const { db } = require("../config/firebase");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const PRODUCT_TYPES = ["product", "service"];

// Loads a business and confirms the logged-in user owns it
const getOwnedBusiness = async (businessId, userId) => {
  if (!businessId || typeof businessId !== "string") {
    throw createError("A valid businessId is required", 400);
  }
  const doc = await db.collection("businesses").doc(businessId).get();
  if (!doc.exists) throw createError("Business not found", 404);
  if (doc.data().ownerId !== userId) {
    throw createError("You do not own this business", 403);
  }
  return doc.data();
};

// Validates only the fields that were sent, and returns a clean object
const cleanProductData = (data) => {
  const clean = {};

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) {
      throw createError("Name cannot be empty", 400);
    }
    clean.name = data.name.trim();
  }

  if (data.description !== undefined) {
    clean.description = String(data.description).trim();
  }

  if (data.type !== undefined) {
    if (!PRODUCT_TYPES.includes(data.type)) {
      throw createError("Type must be 'product' or 'service'", 400);
    }
    clean.type = data.type;
  }

  if (data.price !== undefined) {
    const price = Number(data.price);
    if (data.price === "" || !Number.isFinite(price) || price < 0) {
      throw createError("Price must be a number of 0 or more", 400);
    }
    clean.price = price;
  }

  if (data.stock !== undefined) {
    if (data.stock === null || data.stock === "") {
      clean.stock = null; // null = stock is not tracked
    } else {
      const stock = Number(data.stock);
      if (!Number.isInteger(stock) || stock < 0) {
        throw createError("Stock must be a whole number of 0 or more", 400);
      }
      clean.stock = stock;
    }
  }

  if (data.isAvailable !== undefined) {
    if (typeof data.isAvailable !== "boolean") {
      throw createError("isAvailable must be true or false", 400);
    }
    clean.isAvailable = data.isAvailable;
  }

  if (data.images !== undefined) {
    if (
      !Array.isArray(data.images) ||
      data.images.length > 5 ||
      !data.images.every((url) => typeof url === "string")
    ) {
      throw createError("Images must be a list of up to 5 URLs", 400);
    }
    clean.images = data.images;
  }

  return clean;
};

exports.createProduct = async (data, userId) => {
  await getOwnedBusiness(data.businessId, userId);

  const clean = cleanProductData(data);
  if (!clean.name || clean.price === undefined) {
    throw createError("Name and price are required", 400);
  }

  const productReference = db.collection("products").doc();

  const product = {
    productId: productReference.id,
    businessId: data.businessId,
    name: clean.name,
    description: clean.description ?? "",
    type: clean.type ?? "product",
    price: clean.price,
    stock: clean.stock ?? null,
    isAvailable: clean.isAvailable ?? true,
    images: clean.images ?? [],
    createdAt: new Date(),
  };

  await productReference.set(product);
  return product;
};

exports.getProducts = async (businessId) => {
  let query = db.collection("products");
  if (businessId) query = query.where("businessId", "==", businessId);

  const snapshot = await query.get();
  const products = snapshot.docs.map((doc) => doc.data());

  // newest first (sorted here so Firestore doesn't need a custom index)
  return products.sort(
    (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
  );
};

exports.getProductById = async (productId) => {
  const doc = await db.collection("products").doc(productId).get();
  if (!doc.exists) throw createError("Product not found", 404);
  return doc.data();
};

exports.updateProduct = async (productId, updates, userId) => {
  const productReference = db.collection("products").doc(productId);
  const doc = await productReference.get();
  if (!doc.exists) throw createError("Product not found", 404);

  await getOwnedBusiness(doc.data().businessId, userId);

  const updateData = cleanProductData(updates);
  if (Object.keys(updateData).length === 0) {
    throw createError("No valid fields provided to update", 400);
  }
  updateData.updatedAt = new Date();

  await productReference.update(updateData);
  return { ...doc.data(), ...updateData };
};

exports.deleteProduct = async (productId, userId) => {
  const productReference = db.collection("products").doc(productId);
  const doc = await productReference.get();
  if (!doc.exists) throw createError("Product not found", 404);

  await getOwnedBusiness(doc.data().businessId, userId);

  await productReference.delete();
};
