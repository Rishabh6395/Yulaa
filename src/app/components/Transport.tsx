import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bus, MapPin, Clock, Navigation } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  busNumber: string;
  driver: string;
  driverPhone: string;
  stops: string[];
  departureTime: string;
  arrivalTime: string;
  fee: number;
}

const defaultRoutes: Route[] = [
  {
    id: '1',
    name: 'North Route',
    busNumber: 'BUS-001',
    driver: 'John Smith',
    driverPhone: '+1 234-567-8901',
    stops: ['Main Gate', 'Park Avenue', 'Central Square', 'North Station'],
    departureTime: '07:00 AM',
    arrivalTime: '08:00 AM',
    fee: 50,
  },
  {
    id: '2',
    name: 'South Route',
    busNumber: 'BUS-002',
    driver: 'Sarah Johnson',
    driverPhone: '+1 234-567-8902',
    stops: ['School', 'Market Street', 'Library', 'South Terminal'],
    departureTime: '07:15 AM',
    arrivalTime: '08:15 AM',
    fee: 45,
  },
  {
    id: '3',
    name: 'East Route',
    busNumber: 'BUS-003',
    driver: 'Michael Brown',
    driverPhone: '+1 234-567-8903',
    stops: ['Campus Gate', 'Tech Park', 'Shopping Mall', 'East End'],
    departureTime: '06:45 AM',
    arrivalTime: '07:45 AM',
    fee: 55,
  },
];

export const Transport: React.FC = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>(defaultRoutes);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const handleSelectRoute = (routeId: string) => {
    setSelectedRoute(routeId);
  };

  return (
    <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transport</h1>
          <p className="text-gray-600">View bus routes and track live location</p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Navigation className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Live GPS Tracking</h3>
                <p className="text-sm text-blue-700">
                  Track your bus in real-time and get estimated arrival times. Live tracking will be available when the bus is en route.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Cards */}
        <div className="space-y-4">
          {routes.map((route) => (
            <Card key={route.id} className={selectedRoute === route.id ? 'border-blue-500 border-2' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{route.busNumber}</Badge>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Bus className="w-5 h-5" />
                      {route.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Driver: {route.driver} • {route.driverPhone}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Timing */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-600">Departure</div>
                        <div className="font-semibold">{route.departureTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-600">Arrival</div>
                        <div className="font-semibold">{route.arrivalTime}</div>
                      </div>
                    </div>
                  </div>

                  {/* Stops */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Bus Stops
                    </h4>
                    <div className="space-y-2">
                      {route.stops.map((stop, index) => (
                        <div key={index} className="flex items-center gap-2 pl-6">
                          <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500' : index === route.stops.length - 1 ? 'bg-red-500' : 'bg-gray-400'}`} />
                          <span className="text-sm">{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fee and Action */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-600">Monthly Fee</div>
                      <div className="text-2xl font-bold">${route.fee}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedRoute === route.id ? 'default' : 'outline'}
                        onClick={() => handleSelectRoute(route.id)}
                      >
                        {selectedRoute === route.id ? 'Selected' : 'Select Route'}
                      </Button>
                      <Button variant="outline">
                        <Navigation className="w-4 h-4 mr-2" />
                        Track Live
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Tracking Demo */}
        {selectedRoute && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Live Bus Location</CardTitle>
              <CardDescription>
                Real-time tracking for your selected route
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Navigation className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-pulse" />
                <p className="text-gray-600 mb-2">GPS Tracking Active</p>
                <p className="text-sm text-gray-500">
                  Live location updates will appear here when the bus is en route
                </p>
                <div className="mt-4 p-3 bg-white rounded inline-block">
                  <div className="text-sm text-gray-600">Estimated Arrival</div>
                  <div className="text-2xl font-bold text-blue-600">12 minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
