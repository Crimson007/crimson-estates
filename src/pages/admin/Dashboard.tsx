import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Home, Eye, Plus } from 'lucide-react';

interface Stats {
  totalProperties: number;
  longTermRentals: number;
  shortStays: number;
  availableProperties: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    longTermRentals: 0,
    shortStays: 0,
    availableProperties: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data: properties } = await supabase
        .from('properties')
        .select('property_type, is_available');

      if (properties) {
        setStats({
          totalProperties: properties.length,
          longTermRentals: properties.filter(p => p.property_type === 'long-term').length,
          shortStays: properties.filter(p => p.property_type === 'short-stay').length,
          availableProperties: properties.filter(p => p.is_available).length
        });
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Properties', value: stats.totalProperties, icon: Building2, color: 'text-primary' },
    { label: 'Long-Term Rentals', value: stats.longTermRentals, icon: Home, color: 'text-blue-500' },
    { label: 'Short Stays', value: stats.shortStays, icon: Eye, color: 'text-amber-500' },
    { label: 'Available', value: stats.availableProperties, icon: Eye, color: 'text-green-500' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your properties</p>
          </div>
          <Link to="/admin/properties/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-24" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/admin/properties/new" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Property
                </Button>
              </Link>
              <Link to="/admin/properties" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Properties
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  View Public Site
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
