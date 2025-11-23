"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminPage() {
  const products = useQuery(api.products.get);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<Id<"products"> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    flavor: "",
    originalPrice: "",
    offerText: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      flavor: "",
      originalPrice: "",
      offerText: "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setIsEditing(false);
    setCurrentId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (product: NonNullable<typeof products>[number]) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      flavor: product.flavor,
      originalPrice: product.originalPrice?.toString() || "",
      offerText: product.offerText || "",
    });
    setExistingImageUrl(product.image);
    setImagePreview(null);
    setSelectedImage(null);
    setCurrentId(product._id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: Id<"products">) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct({ id });
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
        console.error(error);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageStorageId = existingImageUrl;

      // Upload image if selected
      if (selectedImage) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        const { storageId } = await result.json();
        imageStorageId = storageId;
      }

      if (!imageStorageId) {
        toast.error("Please upload an image");
        setIsLoading(false);
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        flavor: formData.flavor,
        image: imageStorageId,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        offerText: formData.offerText || undefined,
      };

      if (isEditing && currentId) {
        await updateProduct({
          id: currentId,
          ...productData,
        });
        toast.success("Product updated successfully");
      } else {
        await createProduct(productData);
        toast.success("Product created successfully");
      }

      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <Button onClick={resetForm} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> New Product
          </Button>
        </div>

        {/* Product Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Classic New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flavor">Flavor Profile</Label>
                  <Input
                    id="flavor"
                    value={formData.flavor}
                    onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                    required
                    placeholder="e.g. Classic"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="450"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹) (Optional)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="550"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offerText">Offer Text (Optional)</Label>
                  <Input
                    id="offerText"
                    value={formData.offerText}
                    onChange={(e) => setFormData({ ...formData, offerText: e.target.value })}
                    placeholder="e.g. Best Seller"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="cursor-pointer"
                    />
                  </div>
                  {(imagePreview || existingImageUrl) && (
                    <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border">
                      <Image
                        src={imagePreview || existingImageUrl || ""}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Detailed description of the cheesecake..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-4">
                {isEditing && (
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {isEditing ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Card key={product._id} className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative h-48 w-full bg-secondary/20">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.flavor}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl font-bold">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                {product.offerText && (
                  <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    {product.offerText}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
          {products?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No products found. Add your first product above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
