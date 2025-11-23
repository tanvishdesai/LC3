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
import { Loader2, Pencil, Trash2, Plus, Upload, Star } from "lucide-react";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  // Products Data
  const products = useQuery(api.products.get);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);
  const generateProductUploadUrl = useMutation(api.products.generateUploadUrl);

  // Testimonials Data
  const testimonials = useQuery(api.testimonials.get);
  const createTestimonial = useMutation(api.testimonials.create);
  const updateTestimonial = useMutation(api.testimonials.update);
  const deleteTestimonial = useMutation(api.testimonials.remove);
  const generateTestimonialUploadUrl = useMutation(api.testimonials.generateUploadUrl);

  const [activeTab, setActiveTab] = useState("products");
  
  // Product State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<Id<"products"> | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    price: "",
    flavor: "",
    originalPrice: "",
    offerText: "",
  });
  const [selectedProductImage, setSelectedProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [existingProductImageUrl, setExistingProductImageUrl] = useState<string | null>(null);

  // Testimonial State
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [currentTestimonialId, setCurrentTestimonialId] = useState<Id<"testimonials"> | null>(null);
  const [isTestimonialLoading, setIsTestimonialLoading] = useState(false);
  const testimonialFileInputRef = useRef<HTMLInputElement>(null);

  const [testimonialFormData, setTestimonialFormData] = useState({
    name: "",
    content: "",
    rating: "5",
  });
  const [selectedTestimonialImage, setSelectedTestimonialImage] = useState<File | null>(null);
  const [testimonialImagePreview, setTestimonialImagePreview] = useState<string | null>(null);
  const [existingTestimonialImageUrl, setExistingTestimonialImageUrl] = useState<string | null>(null);

  // --- Product Handlers ---

  const resetProductForm = () => {
    setProductFormData({
      name: "",
      description: "",
      price: "",
      flavor: "",
      originalPrice: "",
      offerText: "",
    });
    setSelectedProductImage(null);
    setProductImagePreview(null);
    setExistingProductImageUrl(null);
    setIsEditingProduct(false);
    setCurrentProductId(null);
    if (productFileInputRef.current) productFileInputRef.current.value = "";
  };

  const handleEditProduct = (product: NonNullable<typeof products>[number]) => {
    setProductFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      flavor: product.flavor,
      originalPrice: product.originalPrice?.toString() || "",
      offerText: product.offerText || "",
    });
    setExistingProductImageUrl(product.image);
    setProductImagePreview(null);
    setSelectedProductImage(null);
    setCurrentProductId(product._id);
    setIsEditingProduct(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id: Id<"products">) => {
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

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProductLoading(true);

    try {
      let imageStorageId = existingProductImageUrl;

      if (selectedProductImage) {
        const postUrl = await generateProductUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedProductImage.type },
          body: selectedProductImage,
        });
        const { storageId } = await result.json();
        imageStorageId = storageId;
      }

      if (!imageStorageId) {
        toast.error("Please upload an image");
        setIsProductLoading(false);
        return;
      }

      const productData = {
        name: productFormData.name,
        description: productFormData.description,
        price: parseFloat(productFormData.price),
        flavor: productFormData.flavor,
        image: imageStorageId,
        originalPrice: productFormData.originalPrice ? parseFloat(productFormData.originalPrice) : undefined,
        offerText: productFormData.offerText || undefined,
      };

      if (isEditingProduct && currentProductId) {
        await updateProduct({
          id: currentProductId,
          ...productData,
        });
        toast.success("Product updated successfully");
      } else {
        await createProduct(productData);
        toast.success("Product created successfully");
      }

      resetProductForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    } finally {
      setIsProductLoading(false);
    }
  };

  // --- Testimonial Handlers ---

  const resetTestimonialForm = () => {
    setTestimonialFormData({
      name: "",
      content: "",
      rating: "5",
    });
    setSelectedTestimonialImage(null);
    setTestimonialImagePreview(null);
    setExistingTestimonialImageUrl(null);
    setIsEditingTestimonial(false);
    setCurrentTestimonialId(null);
    if (testimonialFileInputRef.current) testimonialFileInputRef.current.value = "";
  };

  const handleEditTestimonial = (testimonial: NonNullable<typeof testimonials>[number]) => {
    setTestimonialFormData({
      name: testimonial.name,
      content: testimonial.content,
      rating: testimonial.rating.toString(),
    });
    setExistingTestimonialImageUrl(testimonial.image);
    setTestimonialImagePreview(null);
    setSelectedTestimonialImage(null);
    setCurrentTestimonialId(testimonial._id);
    setIsEditingTestimonial(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteTestimonial = async (id: Id<"testimonials">) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial({ id });
        toast.success("Testimonial deleted successfully");
      } catch (error) {
        toast.error("Failed to delete testimonial");
        console.error(error);
      }
    }
  };

  const handleTestimonialImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedTestimonialImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTestimonialImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestimonialLoading(true);

    try {
      let imageStorageId = existingTestimonialImageUrl;

      if (selectedTestimonialImage) {
        const postUrl = await generateTestimonialUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedTestimonialImage.type },
          body: selectedTestimonialImage,
        });
        const { storageId } = await result.json();
        imageStorageId = storageId;
      }

      if (!imageStorageId) {
        toast.error("Please upload an image");
        setIsTestimonialLoading(false);
        return;
      }

      const testimonialData = {
        name: testimonialFormData.name,
        content: testimonialFormData.content,
        rating: parseFloat(testimonialFormData.rating),
        image: imageStorageId,
      };

      if (isEditingTestimonial && currentTestimonialId) {
        await updateTestimonial({
          id: currentTestimonialId,
          ...testimonialData,
        });
        toast.success("Testimonial updated successfully");
      } else {
        await createTestimonial(testimonialData);
        toast.success("Testimonial created successfully");
      }

      resetTestimonialForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save testimonial");
    } finally {
      setIsTestimonialLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={resetProductForm} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> New Product
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{isEditingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                        required
                        placeholder="e.g. Classic New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flavor">Flavor Profile</Label>
                      <Input
                        id="flavor"
                        value={productFormData.flavor}
                        onChange={(e) => setProductFormData({ ...productFormData, flavor: e.target.value })}
                        required
                        placeholder="e.g. Classic"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productFormData.price}
                        onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                        required
                        placeholder="450"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (₹) (Optional)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={productFormData.originalPrice}
                        onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                        placeholder="550"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offerText">Offer Text (Optional)</Label>
                      <Input
                        id="offerText"
                        value={productFormData.offerText}
                        onChange={(e) => setProductFormData({ ...productFormData, offerText: e.target.value })}
                        placeholder="e.g. Best Seller"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productImage">Product Image</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="productImage"
                          type="file"
                          ref={productFileInputRef}
                          onChange={handleProductImageChange}
                          accept="image/*"
                          className="cursor-pointer"
                        />
                      </div>
                      {(productImagePreview || existingProductImageUrl) && (
                        <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border">
                          <Image
                            src={productImagePreview || existingProductImageUrl || ""}
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
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                      required
                      placeholder="Detailed description of the cheesecake..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    {isEditingProduct && (
                      <Button type="button" variant="ghost" onClick={resetProductForm}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={isProductLoading} className="min-w-[120px]">
                      {isProductLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {isEditingProduct ? "Update Product" : "Create Product"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

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
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteProduct(product._id)}
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
          </TabsContent>

          {/* TESTIMONIALS TAB */}
          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={resetTestimonialForm} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> New Testimonial
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{isEditingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTestimonialSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="testimonialName">Customer Name</Label>
                      <Input
                        id="testimonialName"
                        value={testimonialFormData.name}
                        onChange={(e) => setTestimonialFormData({ ...testimonialFormData, name: e.target.value })}
                        required
                        placeholder="e.g. Sarah Johnson"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (1-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={testimonialFormData.rating}
                        onChange={(e) => setTestimonialFormData({ ...testimonialFormData, rating: e.target.value })}
                        required
                        placeholder="5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testimonialImage">Customer Photo</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="testimonialImage"
                          type="file"
                          ref={testimonialFileInputRef}
                          onChange={handleTestimonialImageChange}
                          accept="image/*"
                          className="cursor-pointer"
                        />
                      </div>
                      {(testimonialImagePreview || existingTestimonialImageUrl) && (
                        <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border">
                          <Image
                            src={testimonialImagePreview || existingTestimonialImageUrl || ""}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Testimonial Content</Label>
                    <Textarea
                      id="content"
                      value={testimonialFormData.content}
                      onChange={(e) => setTestimonialFormData({ ...testimonialFormData, content: e.target.value })}
                      required
                      placeholder="What did they say about the cheesecake?"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    {isEditingTestimonial && (
                      <Button type="button" variant="ghost" onClick={resetTestimonialForm}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={isTestimonialLoading} className="min-w-[120px]">
                      {isTestimonialLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {isEditingTestimonial ? "Update Testimonial" : "Create Testimonial"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials?.map((testimonial) => (
                <Card key={testimonial._id} className="overflow-hidden group hover:shadow-lg transition-all">
                  <div className="flex p-4 gap-4 items-start">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border">
                      {testimonial.image && (
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{testimonial.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleEditTestimonial(testimonial)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteTestimonial(testimonial._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="px-4 pb-4 pt-0">
                    <p className="text-muted-foreground text-sm italic">&quot;{testimonial.content}&quot;</p>
                  </CardContent>
                </Card>
              ))}
              {testimonials?.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No testimonials found. Add your first testimonial above!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
