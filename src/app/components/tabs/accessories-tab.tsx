import { useState, useEffect } from 'react';
import { API_BASE_URL, supabase } from '../../lib/supabase';
import { publicAnonKey } from '/utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

export function AccessoriesTab({ user }: { user: any }) {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock accessories data
  const accessories = [
    {
      id: 'uni1',
      name: 'School Uniform (Summer)',
      description: 'Official summer uniform - shirt and pants/skirt',
      price: 45.00,
      category: 'uniform',
      inStock: true,
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 'uni2',
      name: 'School Uniform (Winter)',
      description: 'Official winter uniform - blazer and sweater',
      price: 65.00,
      category: 'uniform',
      inStock: true,
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 'lan1',
      name: 'Student ID Lanyard',
      description: 'Official school lanyard with ID holder',
      price: 8.00,
      category: 'accessories',
      inStock: true,
    },
    {
      id: 'card1',
      name: 'Student Access Card',
      description: 'RFID access card for school facilities',
      price: 12.00,
      category: 'accessories',
      inStock: true,
    },
    {
      id: 'book1',
      name: 'Mathematics Textbook',
      description: 'Grade 10 Mathematics - Latest Edition',
      price: 35.00,
      category: 'books',
      inStock: true,
    },
    {
      id: 'book2',
      name: 'Science Textbook',
      description: 'Grade 10 Science - Latest Edition',
      price: 38.00,
      category: 'books',
      inStock: true,
    },
    {
      id: 'bag1',
      name: 'School Backpack',
      description: 'Official school backpack - durable and spacious',
      price: 55.00,
      category: 'accessories',
      inStock: true,
    },
    {
      id: 'shoe1',
      name: 'School Shoes (Black)',
      description: 'Regulation black leather shoes',
      price: 48.00,
      category: 'uniform',
      inStock: true,
      sizes: ['6', '7', '8', '9', '10', '11'],
    },
  ];

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1, selectedSize: item.sizes?.[0] }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(c => c.id !== itemId));
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(cart.map(c => {
      if (c.id === itemId) {
        const newQuantity = c.quantity + change;
        return newQuantity > 0 ? { ...c, quantity: newQuantity } : c;
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to place an order');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/accessories/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          items: cart,
          totalAmount: getTotalAmount(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      toast.success('Order placed successfully!');
      setCart([]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'uniform': return '👔';
      case 'books': return '📚';
      case 'accessories': return '🎒';
      default: return '🛍️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">School Accessories Shop</h2>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          <ShoppingCart className="h-4 w-4 mr-1" />
          {cart.length} items
        </Badge>
      </div>

      {/* Shopping Cart */}
      {cart.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Your Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 flex items-center justify-between">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-bold text-blue-600">${getTotalAmount()}</span>
              </div>
              <Button className="w-full" onClick={handleCheckout} disabled={loading}>
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accessories.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                    {item.name}
                  </CardTitle>
                  <CardDescription className="mt-2">{item.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">${item.price.toFixed(2)}</span>
                  <Badge variant={item.inStock ? 'secondary' : 'destructive'}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                
                {item.sizes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Available sizes:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.sizes.map(size => (
                        <Badge key={size} variant="outline" className="text-xs">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => addToCart(item)}
                  disabled={!item.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
