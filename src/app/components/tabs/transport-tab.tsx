import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../lib/supabase';
import { publicAnonKey } from '/utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bus, MapPin, Clock, Navigation } from 'lucide-react';

export function TransportTab({ user }: { user: any }) {
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  // Mock transport routes
  const routes = [
    {
      id: 'route1',
      name: 'North Route',
      busNumber: 'BUS-101',
      driver: 'John Smith',
      stops: ['Main Station', 'Park Avenue', 'School'],
      pickupTime: '07:30 AM',
      dropTime: '03:30 PM',
      currentLocation: 'Park Avenue',
      eta: '5 minutes',
      seatsAvailable: 8,
    },
    {
      id: 'route2',
      name: 'South Route',
      busNumber: 'BUS-102',
      driver: 'Sarah Johnson',
      stops: ['City Center', 'Market Street', 'Oak Road', 'School'],
      pickupTime: '07:45 AM',
      dropTime: '03:45 PM',
      currentLocation: 'Market Street',
      eta: '10 minutes',
      seatsAvailable: 5,
    },
    {
      id: 'route3',
      name: 'East Route',
      busNumber: 'BUS-103',
      driver: 'Michael Brown',
      stops: ['East Terminal', 'River Road', 'Pine Street', 'School'],
      pickupTime: '07:15 AM',
      dropTime: '03:15 PM',
      currentLocation: 'At School',
      eta: 'Arrived',
      seatsAvailable: 12,
    },
    {
      id: 'route4',
      name: 'West Route',
      busNumber: 'BUS-104',
      driver: 'Emily Davis',
      stops: ['West Plaza', 'Maple Avenue', 'Lake View', 'School'],
      pickupTime: '08:00 AM',
      dropTime: '04:00 PM',
      currentLocation: 'Maple Avenue',
      eta: '15 minutes',
      seatsAvailable: 3,
    },
  ];

  const handleSelectRoute = (route: any) => {
    setSelectedRoute(route);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">School Transport</h2>
      </div>

      {/* Selected Route Tracking */}
      {selectedRoute && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bus className="h-5 w-5" />
                  {selectedRoute.name} - {selectedRoute.busNumber}
                </CardTitle>
                <CardDescription className="text-gray-700">
                  Driver: {selectedRoute.driver}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedRoute(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Live Location */}
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Current Location</p>
                    <p className="text-sm text-gray-600">{selectedRoute.currentLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">Estimated Arrival</p>
                    <p className="text-sm text-gray-600">{selectedRoute.eta}</p>
                  </div>
                </div>
              </div>

              {/* Route Stops */}
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Route Stops</h4>
                <div className="space-y-3">
                  {selectedRoute.stops.map((stop: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${
                        stop === selectedRoute.currentLocation
                          ? 'bg-blue-600 animate-pulse'
                          : index < selectedRoute.stops.indexOf(selectedRoute.currentLocation)
                          ? 'bg-green-600'
                          : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <p className={`${stop === selectedRoute.currentLocation ? 'font-bold' : ''}`}>
                          {stop}
                        </p>
                      </div>
                      {stop === selectedRoute.currentLocation && (
                        <Badge className="bg-blue-600">Current</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white p-4 rounded-lg grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Morning Pickup</p>
                  <p className="font-semibold text-lg">{selectedRoute.pickupTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Afternoon Drop</p>
                  <p className="font-semibold text-lg">{selectedRoute.dropTime}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Routes */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Available Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => (
            <Card key={route.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Bus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{route.name}</CardTitle>
                      <CardDescription>{route.busNumber}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={route.seatsAvailable > 5 ? 'secondary' : 'outline'}>
                    {route.seatsAvailable} seats
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {route.stops.length} stops
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Pickup: {route.pickupTime} | Drop: {route.dropTime}
                    </span>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-1">Driver: {route.driver}</p>
                    {route.currentLocation && (
                      <p className="text-sm text-blue-600 font-medium">
                        Currently at: {route.currentLocation}
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full mt-3"
                    onClick={() => handleSelectRoute(route)}
                    variant={selectedRoute?.id === route.id ? 'secondary' : 'default'}
                  >
                    {selectedRoute?.id === route.id ? 'Tracking...' : 'Track Bus'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Transport Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Please arrive at your pickup point 5 minutes before scheduled time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Students must carry their ID cards while boarding the bus</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>For route changes or queries, contact the transport office</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Live tracking is available during school hours (7 AM - 5 PM)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
