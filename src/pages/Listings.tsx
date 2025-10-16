import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreVertical, Search, Eye, Edit, Trash2, CheckCircle, XCircle, TrendingUp, DollarSign, Package, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const initialListingsData = [
  { id: 1, title: "Organic Tomatoes - 5kg", seller: "John Doe", category: "Crops", price: 125, status: "active", views: 2341, sales: 156, createdAt: "2024-01-10" },
  { id: 2, title: "Tractor - John Deere 5055E", seller: "Bob Johnson", category: "Equipment", price: 25000, status: "active", views: 1876, sales: 8, createdAt: "2024-01-12" },
  { id: 3, title: "Free-range Chickens (20 birds)", seller: "Charlie Brown", category: "Livestock", price: 180, status: "pending", views: 456, sales: 45, createdAt: "2024-01-14" },
  { id: 4, title: "Dairy Cows - Holstein Breed", seller: "Alice Williams", category: "Livestock", price: 8500, status: "rejected", views: 234, sales: 3, createdAt: "2024-01-08" },
  { id: 5, title: "Wheat Seeds - Premium Quality", seller: "John Doe", category: "Seeds", price: 399, status: "active", views: 1523, sales: 89, createdAt: "2024-01-11" },
  { id: 6, title: "Irrigation System Complete", seller: "Bob Johnson", category: "Equipment", price: 4500, status: "active", views: 892, sales: 12, createdAt: "2024-01-13" },
  { id: 7, title: "Fresh Honey - 10L", seller: "Charlie Brown", category: "Produce", price: 190, status: "active", views: 678, sales: 67, createdAt: "2024-01-15" },
  { id: 8, title: "Organic Fertilizer - 50kg", seller: "Alice Williams", category: "Supplies", price: 649, status: "pending", views: 345, sales: 34, createdAt: "2024-01-14" },
  { id: 9, title: "Corn Seeds - Hybrid", seller: "John Doe", category: "Seeds", price: 299, status: "active", views: 1234, sales: 78, createdAt: "2024-01-09" },
  { id: 10, title: "Goat Milk - Fresh", seller: "Diana Prince", category: "Produce", price: 45, status: "active", views: 987, sales: 234, createdAt: "2024-01-08" },
  { id: 11, title: "Harvester Combine", seller: "Bob Johnson", category: "Equipment", price: 45000, status: "active", views: 567, sales: 2, createdAt: "2024-01-07" },
  { id: 12, title: "Rice Paddy - 100kg", seller: "Alice Williams", category: "Crops", price: 289, status: "active", views: 1890, sales: 145, createdAt: "2024-01-06" },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--info))", "hsl(var(--accent-foreground))", "hsl(142 76% 36%)"];

const Listings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [listings, setListings] = useState(initialListingsData);
  const { toast } = useToast();

  // Calculate category analytics
  const categoryStats = listings.reduce((acc, listing) => {
    if (!acc[listing.category]) {
      acc[listing.category] = { 
        name: listing.category, 
        listings: 0, 
        totalViews: 0, 
        totalSales: 0,
        revenue: 0,
        avgPrice: 0
      };
    }
    acc[listing.category].listings += 1;
    acc[listing.category].totalViews += listing.views;
    acc[listing.category].totalSales += listing.sales;
    acc[listing.category].revenue += listing.price * listing.sales;
    return acc;
  }, {} as Record<string, { name: string; listings: number; totalViews: number; totalSales: number; revenue: number; avgPrice: number }>);

  // Calculate average prices and convert to array
  const categoryPerformance = Object.values(categoryStats).map(cat => ({
    ...cat,
    avgPrice: Math.round(cat.revenue / cat.totalSales)
  })).sort((a, b) => b.revenue - a.revenue);

  // Top performing products
  const topProducts = [...listings]
    .sort((a, b) => (b.price * b.sales) - (a.price * a.sales))
    .slice(0, 5);

  // Total metrics
  const totalRevenue = listings.reduce((sum, listing) => sum + (listing.price * listing.sales), 0);
  const totalSales = listings.reduce((sum, listing) => sum + listing.sales, 0);
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  const totalViews = listings.reduce((sum, listing) => sum + listing.views, 0);
  const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;

  const handleAction = (action: string, listingId: number, listingTitle: string) => {
    if (action === "Approve") {
      setListings(listings.map(listing =>
        listing.id === listingId
          ? { ...listing, status: "active" }
          : listing
      ));
      toast({
        title: "Listing Approved",
        description: `"${listingTitle}" has been approved and is now active`,
      });
    } else if (action === "Reject") {
      setListings(listings.map(listing =>
        listing.id === listingId
          ? { ...listing, status: "rejected" }
          : listing
      ));
      toast({
        title: "Listing Rejected",
        description: `"${listingTitle}" has been rejected`,
        variant: "destructive",
      });
    } else if (action === "Delete") {
      setListings(listings.filter(listing => listing.id !== listingId));
      toast({
        title: "Listing Deleted",
        description: `"${listingTitle}" has been permanently deleted`,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Action: ${action}`,
        description: `Performed ${action} on "${listingTitle}"`,
      });
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Product Listings</h2>
        <p className="text-muted-foreground mt-1">Manage and moderate all product listings on the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${(totalRevenue / 1000).toFixed(1)}k</div>
            <p className="text-xs text-success mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalSales}</div>
            <p className="text-xs text-muted-foreground mt-1">Conversion: {conversionRate.toFixed(2)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${avgOrderValue.toFixed(0)}</div>
            <p className="text-xs text-success mt-1">+5.2% vs last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
            <Package className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{listings.filter(l => l.status === "active").length}</div>
            <p className="text-xs text-muted-foreground mt-1">{listings.filter(l => l.status === "pending").length} pending review</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Performance by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution by Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="totalSales"
                >
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Listings</TableHead>
                <TableHead className="text-right">Total Sales</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Total Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryPerformance.map((cat) => (
                <TableRow key={cat.name}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-right">{cat.listings}</TableCell>
                  <TableCell className="text-right">{cat.totalSales}</TableCell>
                  <TableCell className="text-right font-medium">${cat.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${cat.avgPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{cat.totalViews.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{product.title}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">${(product.price * product.sales).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Listings</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Crops">Crops</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Livestock">Livestock</SelectItem>
                  <SelectItem value="Seeds">Seeds</SelectItem>
                  <SelectItem value="Produce">Produce</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium max-w-xs truncate">{listing.title}</TableCell>
                  <TableCell>{listing.seller}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{listing.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">${listing.price}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{listing.views}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        listing.status === "active"
                          ? "default"
                          : listing.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{listing.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover z-50">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction("View", listing.id, listing.title)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Edit", listing.id, listing.title)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Listing
                        </DropdownMenuItem>
                        {listing.status === "pending" && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleAction("Approve", listing.id, listing.title)}
                              className="text-success"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction("Reject", listing.id, listing.title)}
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleAction("Delete", listing.id, listing.title)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Listings;
