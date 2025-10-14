import React, { useState } from "react";
import "../../css/adminsidebar.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    size: "",
    category: "",
    status: "",
    description: "",
  });

  const [images, setImages] = useState([null, null, null, null]);

  // Handle image upload
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImages = [...images];
    newImages[index] = URL.createObjectURL(file);
    setImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.name || !product.price) {
      alert("Please fill required fields");
      return;
    }

    console.log("Product Added:", product, images);
    alert("Product added successfully!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Info */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Product Information</h2>

          <label className="block text-sm text-gray-500 mb-1">Product Name</label>
          <input
            className="w-full border rounded-lg p-2 mb-3"
            placeholder="Input product name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Price</label>
              <input
                className="w-full border rounded-lg p-2"
                placeholder="Input price"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Size</label>
              <input
                className="w-full border rounded-lg p-2"
                placeholder="Input size"
                value={product.size}
                onChange={(e) => setProduct({ ...product, size: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Category</label>
              <select
                className="w-full border rounded-lg p-2"
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
              >
                <option value="">Select category</option>
                <option value="Clothes">Clothes</option>
                <option value="Shoes">Shoes</option>
                <option value="Bags">Bags</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Status</label>
              <select
                className="w-full border rounded-lg p-2"
                value={product.status}
                onChange={(e) => setProduct({ ...product, status: e.target.value })}
              >
                <option value="">Select status</option>
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <label className="block text-sm text-gray-500 mt-3 mb-1">
            Product Description
          </label>
          <textarea
            className="w-full border rounded-lg p-2 min-h-[120px]"
            placeholder="Input product description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
        </div>

        {/* Upload Images */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Upload Images</h2>
          <p className="text-sm text-gray-500 mb-3">
            Note: Upload PNG or JPG only
          </p>

          <div className="grid grid-cols-2 gap-4">
            {images.map((img, i) => (
              <label
                key={i}
                className="h-28 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer text-gray-400 hover:border-gray-500"
              >
                {img ? (
                  <img
                    src={img}
                    alt={`Upload ${i}`}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <span>Photo</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, i)}
                />
              </label>
            ))}
          </div>
        </div>
      </form>

      {/* Buttons */}
      <div className="flex gap-4 justify-end mt-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;