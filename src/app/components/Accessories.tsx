import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { ShoppingCart, Package, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface CatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  sizes?: string[];
  stock: number;
  image?: string;
}

const defaultCatalog: CatalogItem[] = [
  { id: '1', name: 'School Uniform (Shirt)', category: 'Uniform', price: 25, sizes: ['S', 'M', 'L', 'XL'], stock: 50 },
  { id: '2', name: 'School Uniform (Pants)', category: 'Uniform', price: 30, sizes: ['S', 'M', 'L', 'XL'], stock: 45 },
  { id: '3', name: 'School Tie', category: 'Uniform', price: 10, stock: 100 },
  { id: '4', name: 'Student ID Card', category: 'Accessories', price: 5, stock: 200 },
  { id: '5', name: 'School Lanyard', category: 'Accessories', price: 3, stock: 150 },
  { id: '6', name: 'Notebook Set (5 pack)', category: 'Books', price: 15, stock: 80 },
  { id: '7', name: 'Textbook - Mathematics', category: 'Books', price: 40, stock: 60 },
  { id: '8', name: 'Textbook - Science', category: 'Books', price: 45, stock: 55 },
];

export const Accessories: React.FC = () => {
  const { user, accessToken } = useAuth();
  const [catalog, setCatalog] = useState<CatalogItem[]>(defaultCatalog);
  const [cart, setCart] = useState<Array<{ item: CatalogItem; size?: string; quantity: number }>>([]);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    deliveryAddress: '',
    phone: '',
  });

  const addToCart = (item: CatalogItem, size?: string) => {
    const existingIndex = cart.findIndex(
      (c) => c.item.id === item.id && c.size === size
    );

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { item, size, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error('Please sign in to place order');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/accessories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          items: cart,
          totalPrice: getTotalPrice(),
          ...orderDetails,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Order placed successfully!');
        setCart([]);
        setOrderDialogOpen(false);
        setOrderDetails({ deliveryAddress: '', phone: '' });
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('Failed to place order');
    }
  };

  const categories = Array.from(new Set(catalog.map((item) => item.category)));

  return (
    <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">School Accessories</h1>
            <p className="text-gray-600">Order uniforms, books, and accessories</p>
          </div>
          <div className="relative">
            <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart ({cart.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Your Cart</DialogTitle>
                </DialogHeader>
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    Your cart is empty
                  </div>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="font-medium">{item.item.name}</div>
                            {item.size && <div className="text-sm text-gray-600">Size: {item.size}</div>}
                            <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${item.item.price * item.quantity}</div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(index)}
                              className="text-red-600"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-lg">Total:</span>
                        <span className="font-bold text-xl">${getTotalPrice()}</span>
                      </div>
                      
                      <div>
                        <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                        <Input
                          id="deliveryAddress"
                          value={orderDetails.deliveryAddress}
                          onChange={(e) => setOrderDetails({ ...orderDetails, deliveryAddress: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mt-3">
                        <Label htmlFor="phone">Contact Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={orderDetails.phone}
                          onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full mt-4">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Place Order
                      </Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalog
                .filter((item) => item.category === category)
                .map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <CardDescription className="mt-1">
                            ${item.price}
                          </CardDescription>
                        </div>
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">In Stock:</span>
                          <Badge variant={item.stock > 10 ? 'default' : 'destructive'}>
                            {item.stock} units
                          </Badge>
                        </div>
                        
                        {item.sizes && item.sizes.length > 0 && (
                          <div>
                            <Label className="text-xs text-gray-600 mb-2 block">Select Size:</Label>
                            <div className="flex gap-2">
                              {item.sizes.map((size) => (
                                <Button
                                  key={size}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addToCart(item, size)}
                                  disabled={item.stock === 0}
                                >
                                  {size}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {(!item.sizes || item.sizes.length === 0) && (
                          <Button
                            className="w-full"
                            onClick={() => addToCart(item)}
                            disabled={item.stock === 0}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
